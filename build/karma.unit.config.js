var base = require('./karma.base.config')

module.exports = function (config) {
  config.set(Object.assign(base, {
    reporters: ['progress'],
    browsers: ['Chrome', 'Firefox', 'Safari'],
    singleRun: true,
    plugins: base.plugins.concat([
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-safari-launcher'
    ])
  }))
}
