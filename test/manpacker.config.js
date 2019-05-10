module.exports = () => ({
  output: {
    library: 'TestArticle'
  },

  module: {
    rules: [{
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: { loader: 'ts-loader' }
    }]
  }
})
