module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],

        autoWatch: false,
        singleRun: true,

        browsers: ['Firefox'],

        files: [
            'dist/browser/router5.min.js',
            'tests/*.js'
        ],

        preprocessors: {
          'dist/test/router5.js': ['coverage']
        },

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-mocha-reporter',
            'karma-coverage',
            'karma-coveralls'
        ],

        reporters: ['mocha', 'coverage', 'coveralls'],

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'lcov'}
            ],
        },
    });
};
