const path = require('path')

module.exports = () => ({
  // output: {
  // library: 'Test'
  // path: path.join(__dirname, './view/test1')
  // },

  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: { loader: 'ts-loader' }
    }]
  }
})
