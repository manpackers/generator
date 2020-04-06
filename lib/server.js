const chalk = require('chalk')
const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackDevServer = require('webpack-dev-server')
const { ip } = require('../utils/system')

module.exports = async(ic, config) => {
  let { devRouter, proxy, port, ext } = ic
  let webpackConfig = merge.smart({
    output: {
      filename: 'js/[name].[hash:13].js',
      chunkFilename: 'js/[name].[chunkhash:13].js',
      publicPath: devRouter ? (
        devRouter === '/' ? devRouter : `${devRouter}/`
      ) : '/'
    },

    devtool: 'cheap-module-eval-source-map',

    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }, config)
  let host = '0.0.0.0'
  let devServerOptions = {
    clientLogLevel: 'warning',
    historyApiFallback: devRouter ? {
      index: devRouter
    } : true,
    hot: true,
    contentBase: false,
    compress: false,
    host: host,
    port: port,
    open: true,
    overlay: { warnings: false, errors: true },
    publicPath: devRouter || '/',
    proxy: proxy,
    quiet: false,
    watchOptions: { poll: false },
    stats: { chunks: false, children: false, colors: true },
    inline: true,
    disableHostCheck: true
  }

  if (devRouter) {
    console.log(chalk.yellow([
      `  Access url: http://${ip}:${port}${devRouter}`
    ].join('\n') + '\n'))
  } else {
    Object.keys(webpackConfig.entry).map(value => {
      console.log(chalk.yellow([
        `  Access url: http://${ip}:${port}/${value}.${ext}`
      ].join('\n') + '\n'))
    })
  }

  WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions)

  return await new WebpackDevServer((() => webpack(webpackConfig))(), devServerOptions)
    .listen(ic.port, host)
}
