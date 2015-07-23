var credentials = require('./saucelabs');
process.env.SAUCE_USERNAME = credentials.SAUCE_USERNAME;
process.env.SAUCE_ACCESS_KEY = credentials.SAUCE_ACCESS_KEY;

var customLaunchers = {
    sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 7',
        version: '35'
    },
    sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '30'
    },
    sl_ios_safari: {
        base: 'SauceLabs',
        browserName: 'iphone',
        platform: 'OS X 10.9',
        version: '7.1'
    },
    sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
    }
};

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        autoWatch: false,
        singleRun: true,

        browsers: ['Firefox'],
        // browsers: Object.keys(customLaunchers),

        files: [
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
            testName: 'router5 Unit Tests'
        }
    });
};
