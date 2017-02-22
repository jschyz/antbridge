var base = require('./karma.base.config.js')

module.exports = function(config) {
  var options = Object.assign(base, {
    reporters: ['mocha', 'coverage'],
    coverageReporter:{
      dir: '../coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary', subdir: '.' }
      ]
    },
    browsers: ['PhantomJS'],
    singleRun: true,
    plugins: base.plugins.concat([
      'karma-coverage',
      'karma-phantomjs-launcher'
    ])
  })
  
  config.set(options)
}
