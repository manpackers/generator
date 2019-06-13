const path = require('path')
const chalk = require('chalk')
const ora = require('ora')
const webpack = require('webpack')
const merge = require('webpack-merge')

const dater = require('../utils/dater')
const file = require('../utils/file')
const packageConfig = file.parse('package.json')
class Builder {
  constructor(ic, config) {
    this.webpackConfig = merge.smart({
      output: {
        publicPath: ic.cdn,
        filename: 'js/[name].[chunkhash:13].js',
        chunkFilename: 'js/[name].[chunkhash:13].js',
        path: path.resolve(ic.output)
      },

      plugins: [
        new webpack.BannerPlugin({
          banner: [
            `(c): ${packageConfig.version}`,
            `@license Author: ${(
              typeof (packageConfig.author || '') === 'object'
            ) ? packageConfig.author.name : packageConfig.author}`,
            `(t) ${dater.format()}`
          ].join('\n')
        }),

        new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',

          // remove domain and CDN_PATH
          publicPath: ic.map,
          moduleFilenameTemplate: 'source-map'
        }),

        new webpack.HashedModuleIdsPlugin()
      ]
    }, config)
  }
}

module.exports = async(ic, config) => {
  let builder = new Builder(ic, config)
  let complie = webpack(builder.webpackConfig)
  let spinner = ora('  Project version start to build……\n\n').start()
  let stats
  let output = builder.webpackConfig.output.path

  await file.remove(output)
  stats = await new Promise(
    (resolve, reject) => complie.run((err, stats) => err ? reject(err) : resolve(stats))
  )
  spinner.stop()
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n\n')

  if (stats.hasErrors()) {
    console.log(chalk.red('  Build failed with errors.\n'))
    process.exit(1)
  }

  ic.isZip && (
    await file.zip(output, `v${packageConfig.version}`)
  )
  console.log(chalk.yellow(`${packageConfig.name} [${path.basename(output)}] dir project build success.\n`))
  return complie
}
