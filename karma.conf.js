// Karma configuration
// Generated on Tue Aug 16 2022 16:04:39 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'dist/*.js',
      'node_modules/@petamoriken/float16/browser/float16.js',
	  'node_modules/@amandaghassaei/type-checks/dist/type-checks.js',
	  'node_modules/three/build/three.js',
      'tests/common/*.js',
	  {pattern: "tests/common/*.png", watched: false, included: false, served: true},
	  {pattern: "tests/common/*.jpg", watched: false, included: false, served: true},
      'tests/mocha/*.js',
    ],


    // list of files / patterns to exclude
    exclude: [
      'dist/*.min.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browserConsoleLogOptions: {
        level: 'warn',
        format: '%b %T: %m',
        terminal: false
    },

    // reporter options
    mochaReporter: {
      showDiff: 'true',
    },

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: Infinity
  })
}
