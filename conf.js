"use strict";
exports.config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  seleniumAddress: 'http://localhost:4444/wd/hub',
  noGlobals: true,
  specs: [
    'spec.ts'
  ],
  SELENIUM_PROMISE_MANAGER: false,
  beforeLaunch: function() {
    require('ts-node').register({
      project: '.'
    });
  }
};