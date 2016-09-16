// Karma configuration
// Generated on Sat Sep 10 2016 22:27:19 GMT-0700 (Pacific Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
     files: [
      '../www/lib/ionic/js/ionic.bundle.js',
      '../www/lib/angular-animate/angular-animate.js',
      '../www/lib/angular-mocks/angular-mocks.js',     
      '../www/js/jquery-2.2.2.js',
      '../www/js/app.js',
      '../www/js/controller.login.js',
      '../www/js/**/*.module.js',
      '../www/js/*.js', 
      '../www/js/**/*.js',      
      'unit-tests/**/*.js'
    ],

// 'unit-tests/login.controller.tests.js.js'
// 'unit-tests/**/*.js'

    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../www/js/controller.*.js': ['coverage'],
      '../www/js/services.*.js': ['coverage']
    },

 
    // plugins: ['karma-spec-reporter'],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

     coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}