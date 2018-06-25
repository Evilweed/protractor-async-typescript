export class HostName {
    host: string;

    constructor(host) {
        this.host = host;
    }

    join(relativePath) {
        return [this.host.replace(/\/^/, ''), relativePath.replace(/$\//, '')].join('/');
    }

    toString() {
        return this.host;
    }
}