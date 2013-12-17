var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    'app/bower_components/angular-mocks/angular-mocks.js',

    //mocha stuff
    'test/mocha.conf.js',

    //test files
    './test/unit/**/*.js'
  ]);

  conf.plugins ; [
          'karma-junit-reporter',
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine'
          ];

  conf.junitReporter = {
    outputFile: 'test_out/unit.xml',
    suite: 'unit'
  };

  config.set(conf);
};
