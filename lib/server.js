const chalk = require('chalk')
const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackDevServer = require('webpack-dev-server')
const system = require('../utils/system')

module.exports = async(ic, config) => {
  let webpackConfig = merge.smart({
    output: {
      filename: 'js/[name].[hash:13].js',
      chunkFilename: 'js/[name].[chunkhash:13].js'
    },

    devtool: 'cheap-module-eval-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }, config)
  let host = '0.0.0.0'
  let devServerOptions = {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    contentBase: false,
    compress: false,
    host: host,
    port: ic.port,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: '/',
    proxy: ic.proxy,
    quiet: false,
    watchOptions: { poll: false },
    stats: { chunks: false, children: false, colors: true },
    inline: true,
    disableHostCheck: true
  }

  Object.keys(webpackConfig.entry).map(value => {
    console.log(chalk.yellow([
      `  Access url: http://${system.ip}:${ic.port}/${value}.${ic.ext}`
    ].join('\n') + '\n'))
  })
  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)

  return await new WebpackDevServer((() => webpack(webpackConfig))(), devServerOptions)
    .listen(ic.port, host)
}
