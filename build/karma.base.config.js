// Karma configuration
// Generated on Wed Feb 22 2017 19:06:15 GMT+0800 (CST)
var alias = require('./alias')
var webpackConfig = {
  resolve: {
    alias: alias
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: '#inline-source-map'
}

// shared config for all unit tests
module.exports = {
  frameworks: ['jasmine'],
  files: [
    '../test/unit/index.js'
  ],
  preprocessors: {
    '../test/unit/index.js': ['webpack', 'sourcemap']
  },
  webpack: webpackConfig,
  plugins: [
    'karma-jasmine',
    'karma-mocha-reporter',
    'karma-sourcemap-loader',
    'karma-webpack'
  ]
}
