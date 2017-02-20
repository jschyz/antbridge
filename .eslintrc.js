module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  env: {
    'browser': true
  },
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0
  }
}
