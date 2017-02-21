const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const alias = require('rollup-plugin-alias')
const version = process.env.VERSION || require('../package.json').version

const banner =
  '/*!\n' +
  ' * antbridge.js v' + version + '\n' +
  ' * (c) 2017-' + new Date().getFullYear() + ' huihui\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const builds = {
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: path.resolve(__dirname, '../src/index.js'),
    dest: path.resolve(__dirname, '../dist/antbridge.js'),
    format: 'umd',
    env: 'development',
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: path.resolve(__dirname, '../src/index.js'),
    dest: path.resolve(__dirname, '../dist/antbridge.min.js'),
    format: 'umd',
    env: 'production',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: path.resolve(__dirname, '../src/index.js'),
    dest: path.resolve(__dirname, '../dist/antbridge.common.js'),
    format: 'cjs',
    banner
  }
}

function genConfig (opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    format: opts.format,
    banner: opts.banner,
    moduleName: 'ant',
    plugins: [
      replace({
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, require('./alias'), opts.alias))
    ].concat(opts.plugins || [])
  }

  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(builds[process.env.TARGET])
} else {
  exports.getBuild = name => genConfig(builds[name])
  exports.getAllBuilds = () => Object.keys(builds).map(name => genConfig(builds[name]))
}
