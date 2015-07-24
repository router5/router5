var argv = require('yargs').argv;

// var credentials = require('./saucelabs');
// process.env.SAUCE_USERNAME = credentials.SAUCE_USERNAME;
// process.env.SAUCE_ACCESS_KEY = credentials.SAUCE_ACCESS_KEY;

var customLaunchers = {
    sl_firefox_10: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '10'
    },
    sl_firefox_24: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '24'
    },
    sl_firefox_31: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '31'
    },
    sl_chrome_26: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '26'
    },
    sl_chrome_33: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '33'
    },
    sl_chrome_40: {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '40'
    },
    sl_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'chrome'
    },
    sl_firefox_latest: {
        base: 'SauceLabs',
        browserName: 'firefox'
    },
    sl_safari_7: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: '7'
    },
    sl_safari_8: {
        base: 'SauceLabs',
        browserName: 'safari',
        version: '8'
    },
    sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
    },
    sl_ie_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '10'
    },
    sl_opera_latest: {
        base: 'SauceLabs',
        browserName: 'opera'
    },
    sl_opera_12: {
        base: 'SauceLabs',
        browserName: 'opera',
        version: '12'
    }
};

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        autoWatch: false,
        singleRun: true,

        // browsers: ['Firefox'],
        browsers: argv.sauce ? Object.keys(customLaunchers) : ['Firefox'],

        files: [
            'node_modules/bluebird/js/browser/bluebird.js',
            'node_modules/route-node/node_modules/path-parser/dist/umd/path-parser.js',
            'node_modules/route-node/dist/umd/route-node.js',
            'dist/test/constants.js',
            'dist/test/async.js',
            'dist/test/transition.js',
            'dist/test/router5.js',
            'tests/*.js'
        ],

        preprocessors: {
          'dist/test/*.js': ['coverage']
        },

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-coveralls',
            'karma-sauce-launcher'
        ],

        reporters: ['mocha', 'coverage', 'coveralls', 'saucelabs'],

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'lcov'}
            ],
        },

        sauceLabs: {
            testName: 'router5 Unit Tests',
            // startConnect: false
        },

        customLaunchers: customLaunchers
    });
};
