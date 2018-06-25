import { Config, browser } from 'protractor';

let chromeOptions = {
    ci: ['disable-infobars=true', '--enable-precise-memory-info', '--headless', '--disable-gpu', '--no-sandbox'],
    local: ['disable-infobars=true']
};

let chromePreferences = {
    'args': chromeOptions.local,
    'prefs': {
        'credentials_enable_service': false, // Disable password manager popup
        'download': {
            'prompt_for_download': false,
            'directory_upgrade': true,
            'default_directory': './../log/e2e/downloads',
        }
    }
};

export let config: Config = {

    noGlobals: true,
    SELENIUM_PROMISE_MANAGER: false,
    framework: 'jasmine',

    capabilities: {
        browserName: 'firefox',
        logName: 'Firefox - English',
        version: '',
        platform: 'ANY',
        shardTestFiles: false,
        maxInstances: 3,
        'screen-resolution': '1050x1050',
        chromeOptions: chromePreferences,
    },

    // seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'https://packhelp.com',
    specs: ['./**/*_spec.js'],

    directConnect: true,
    chromeDriver: './../node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.21.0',

    onPrepare() {
        browser.waitForAngularEnabled(false);
        // browser.manage().window().setSize(1680, 1050);
        // browser.manage().timeouts().implicitlyWait(15000);
        //
        // var SpecReporter = require('jasmine-spec-reporter');
        // jasmine.getEnv().addReporter(new SpecReporter({
        //     displayStacktrace: true
        // }));

        //var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
        //jasmine.getEnv().addReporter( new Jasmine2HtmlReporter({
        //	takeScreenshots: true,
        //	takeScreenshotsOnlyOnFailures: false
        //}));
    },

};