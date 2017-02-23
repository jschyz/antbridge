var base = require('./karma.base.config')

module.exports = function(config) {
  var options = Object.assign(base, {
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: '../coverage', subdir: '.' },
        { type: 'text-summary', dir: '../coverage', subdir: '.' }
      ]
    },
    browsers: ['PhantomJS'],
    singleRun: true,
    plugins: base.plugins.concat([
      'karma-coverage',
      'karma-phantomjs-launcher'
    ])
  })

  options.webpack.module.rules[0].options = {
    plugins: ['istanbul']
  }

  config.set(options)
}
