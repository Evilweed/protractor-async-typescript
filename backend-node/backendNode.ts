import * as requestPromise from 'request-promise-native';
import { OptionsWithUrl } from 'request-promise-native';
// import { protractor, browser } from 'protractor';
import { ChildProcess , spawn } from 'child_process';
import { TaggedLogger } from './utils/taggedLogger';
import { HostName } from './utils/hostName';
import { buildErrorLog } from './utils/buildErrorLog';
import * as http from 'http';

const performFetch = (url, method, formData) => {
    let options: OptionsWithUrl = {
        url: url,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: formData,
        json: true // Automatically parses the JSON string in the response
    };

    return requestPromise(options);
};

let databaseDumps = {};
let defaultTimeout = 3 * 60000;
const DOCKER_COMPOSE_FAIL_MESSAGE = 'connect to Docker daemon';

export class SimpleProcess {
    public command: string;
    public commandParams: string[];
    public process: ChildProcess;
    public output;
    public logger;
    public loggingEnabled;
    public env;
    public retries: number = 5;

    constructor(command, commandParams, env, logger) {
        this.command = command;
        this.commandParams = commandParams;
        this.env = env;
        this.logger = logger;
        this.output = [];
        this.loggingEnabled = true;
        this.retries = 5;
    }

    create(): Promise<any> {
        return this.run()
            .catch((err) => err);
    }

    run(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.log(`Running: ${this.command} with ${ this.commandParams}`);
            const spawnParams = {
                env: Object.assign({}, global.process.env, this.env),
                cwd: global.process.cwd()
            };

            this.process = spawn(this.command, this.commandParams, spawnParams);
            // Uncomment for more logs
            // this.process.stdout.on('data', (d) => this.log(d.toString()));
            this.process.stdout.on('data', (d) => this.output.push(`[SimpleProcess]stdout: ${d.toString()}`));
            this.process.stderr.on('data', (d) => {
                if (d.toString().indexOf('WEBrick::HTTPServer#start:') > 1) {
                    this.log('HTTPServer started');
                    resolve();
                }
            });
            this.process.on('exit', (exitCode) => {
                if (`${exitCode}` === '0') {
                    resolve();
                } else {
                    this.log(`[SimpleProcess] [exitCode: ${exitCode}] ${this.command} with ${ this.commandParams}`);
                    this.output.forEach(e => this.log(`[SimpleProcess] stderr(e): ${e}`));
                    reject();
                }
                this.process = undefined;
            });
            return process;
        });
    }

    kill() {
        return this.process.kill();
    }

    log(message) {
        if (this.loggingEnabled) { this.logger.log(message); }
    }
}

class ConnectionChecker {
    private ip;
    private port;
    private path;
    private logger: TaggedLogger;

    constructor(ip, path, port, logger) {
        this.ip = ip;
        this.port = port;
        this.path = path;
        this.logger = logger;
    }

    waitForResponse(): Promise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(), 30000);

            this.wait(
                () => {
                    this.logger.log('Rails server ready for http requests');
                    resolve();
                }, () => {
                    this.logger.log('Waiting');
                });
        });
    }

    wait(onReady, onRetry) {
        setTimeout(() => this.makeRequest(onReady, onRetry), 1000);
    }

    makeRequest(onReady, onRetry) {
        http.get({
            hostname: this.ip,
            port: this.port,
            path: this.path,
            agent: false  // create a new agent just for this one request
        }, () => onReady())
            .on('error', () => {
                setTimeout(() => this.makeRequest(onReady, onRetry), 1000);
            });
    }
}

export class RailsServer {
    private railsProcess: SimpleProcess;
    public command: string;
    public commandParams: string[];
    public env;
    public connectionChecker: ConnectionChecker;

    constructor(env, ip, port, logger) {
        this.env = env;
        this.command = 'rails';
        this.commandParams = ['s', '-p', port, '--pid', `./tmp/railsServer-${Math.random()*10}`];
        this.railsProcess = new SimpleProcess(this.command, this.commandParams, env, logger);
        this.connectionChecker = new ConnectionChecker(ip, '/', port, logger);
    }


    run(): Promise<any> {
        return this.railsProcess.run()
            .then(() => this.connectionChecker.waitForResponse())
            .catch(err => err);
    }
}

class DatabaseManager {
    private logger: TaggedLogger;
    private drop;
    private create;
    private migrate;
    private seed;
    private env;

    constructor(env, logger) {
        this.logger = logger;
        this.env = env;
    }

    prepare() {
        this.drop = new SimpleProcess('rake', ['db:drop'], this.env, this.logger);
        this.create = new SimpleProcess('rake', ['db:create'], this.env, this.logger);
        this.migrate = new SimpleProcess('rake', ['db:migrate'], this.env, this.logger);
        this.seed = new SimpleProcess('rake', ['db:seed'], this.env, this.logger);

        return new Promise((resolve, reject) => {
            this.drop.run()
                .then(() => this.create.run())
                .then(() => this.migrate.run())
                .then(() => this.seed.run())
                .then(() => this.emptyVars())
                .then(() => resolve())
                .catch((err) => {
                    this.logger.log('Error at: databaseManager.prepare()');
                    reject(err);
                });
        });
    }

    emptyVars() {
        this.drop = null;
        this.create = null;
        this.migrate = null;
    }
}

class Backend {
    private logger: TaggedLogger;
    private ip;
    private port;
    private env;
    private host;
    private railsServer: RailsServer;
    private databaseManager: DatabaseManager;

    constructor() {
        this.ip = '0.0.0.0';
        this.port = '5001';
        this.logger = new TaggedLogger(this.port);
        this.env = {
            RAILS_HOST: `http://${this.ip}:${this.port}/`,
            RAILS_ENV: 'integration',
            DATABASE_NAME: `db_${this.port}`,
            DATABASE_USERNAME: 'topsteptrader_2',
            DATABASE_PASSWORD: 'topsteptrader_2'
        };
        this.railsServer = new RailsServer(this.env, this.ip, this.port, this.logger);
        this.databaseManager = new DatabaseManager(this.env, this.logger);
        this.host = new HostName(this.env.RAILS_HOST);
    }

    prepare() {
        return new Promise((resolve, reject) => {
            this.databaseManager.prepare()
                .then(() => this.railsServer.run())
                .then(() => resolve())
                .catch((err) => {
                    this.logger.log('Error at: backend.prepare()');
                    reject(err);
                });
        });
    }

    evaluateBackendCode(code) {
        return performFetch(this.host.join('/api/evaluate_code.json'), 'POST', {code})
            .then(response => response.result)
            .catch(err => {
                // return protractor.promise.rejected(buildErrorLog(err));
                return console.log(err);
            });
    }
}

// let backendNode: BackendNode = new BackendNode();
let backend: Backend = new Backend();
backend.prepare();

// backendNode.create().then(() => backendNode.evaluateBackendCode(`
// Db::Truncator.truncate
// Db::Seeder.seed
// `));

// require 'rake'
// Rails::application.load_tasks
// Rake::Task['rake db:migrate'].invoke