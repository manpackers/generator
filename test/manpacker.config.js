module.exports = () => ({
  output: {
    // library: 'Test'
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: { loader: 'ts-loader' }
    }]
  }
})
