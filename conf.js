"use strict";

var chromeOptions = {
    ci: ['disable-infobars=true', "--enable-precise-memory-info", "--headless", "--disable-gpu", "--no-sandbox"],
    local: ['disable-infobars=true']
};

var chromePreferences = {
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

exports.config = {
    framework: 'jasmine',
    // capabilities: {
    //     browserName: 'chrome'
    // },

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

    seleniumAddress: 'http://localhost:4444/wd/hub',
    noGlobals: true,
    baseUrl: 'https://packhelp.com',
    specs: ['./specs/**/*_spec.ts'],
    SELENIUM_PROMISE_MANAGER: false,

    directConnect: true,
    chromeDriver: "./node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.21.0",
    // chromeDriver: "./node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.38",

    beforeLaunch: function () {
        require('ts-node').register({
            project: '.'
        });
    }
};