module.exports = function() {
  return {
    basePath: '../',
    frameworks: ['mocha'],
    reporters: ['progress', 'dots', 'junit'],
    browsers: ['Chrome'],
    autoWatch: true,

    // these are default values anyway
    singleRun: false,
    colors: true,
    
    files : [
      //3rd Party Code
      'app/bower_components/angular/angular.js',

      //App-specific Code
      'app/scripts/**/*.js',

      //Test-Specific Code
      'node_modules/chai/chai.js',
      'test/lib/chai-should.js',
      'test/lib/chai-expect.js'
    ],
    junitReporter: {
      outputFile: 'test-results.xml'
    }
  }
};
