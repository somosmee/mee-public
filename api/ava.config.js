export default {
  files: ['**/*.spec.js'],
  require: ['@babel/register', '@babel/polyfill'],
  babel: {
    testOptions: {
      babelrc: true
    }
  }
}
