const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const file = require('../utils/file')
const createURILoader = (dir = 'uri') => ({
  loader: 'url-loader',
  options: { limit: 10240, name: `${dir}/[name].[hash:7].[ext]` }
})

const createEslintLoader = rgx => ({
  test: rgx,
  enforce: 'pre',
  use: [{
    loader: 'eslint-loader',
    options: { formatter: require('eslint-friendly-formatter') }
  }]
})

// Css loader generator.
const createCssLoader = (options = {}, ...loaders) => [
  options.isCssExtract ? {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: '../',
      hmr: process.env.NODE_ENV === 'development'
    }
  } : 'style-loader', {
    loader: 'css-loader',
    options: {
      modules: options.isCssModule,
      localIdentName: '[name]__[local]--[hash:base64:5]'
    }
  }
].concat([{
  loader: 'postcss-loader',
  options: {
    config: { path: path.resolve(__dirname, './config/') }
  }
}], options.isPx2rem ? [{
  loader: 'px2rem-loader',
  options: { remUnit: options.remUnit }
}] : [], loaders, [{
  loader: 'style-resources-loader',
  options: {
    patterns: options.injectStyle.map(
      value => path.join(process.cwd(), options.root, value)
    )
  }
}])

// Webpack config
const generator = (env = 'development', ic, config) => {
  let resolveRoot = path.resolve(ic.root)
  let isLibrary = config.output && config.output.library
  let NODE_ENV = process.env.NODE_ENV = env.toLowerCase()
  let entry = (() => {
    let rgx = /(\.[jt]sx?)$/
    let files = file.search(resolveRoot, rgx)
    let clone = {}

    // Push entry's name
    files.map(value => {
      let basename = path.basename(value, value.match(rgx)[1])
      return clone[basename] = path.join(resolveRoot, value)
    })
    return clone
  })()

  return {
    entry,

    mode: env,

    resolve: {
      extensions: [
        '.js', '.json', '.hbs', '.ts', '.tsx', '.vue', '.jsx', '.ejs', '.jade'
      ],
      alias: { '@': resolveRoot }
    },

    node: {
      setImmediate: false,
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      path: 'empty',
      child_process: 'empty'
    },

    optimization: (NODE_ENV === 'production') && isLibrary ? {} : {
      runtimeChunk: { name: 'manifest' },

      splitChunks: {
        cacheGroups: {
          // default: false, // Disable default optimization
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: -20,
            chunks: 'all'
          },

          common: ic.isMergeCommon && {
            name: 'common',
            minChunks: ic.minChunks,
            test: new RegExp(resolveRoot),
            chunks: 'all',
            minSize: 0
          }
        }
      }
    },

    module: {
      rules: [{
        test: /\.css$/,
        use: createCssLoader(ic)
      }, {
        test: /\.less$/,
        use: createCssLoader(ic, {
          loader: 'less-loader',
          options: { javascriptEnabled: true }
        })
      }, {
        test: /\.(scss|sass)$/,
        use: createCssLoader(ic, 'resolve-url-loader', 'sass-loader')
      }, {
        test: /\.(stylus|styl)$/,
        use: createCssLoader(ic, 'stylus-loader')
      }, {
        test: /\.(png|jpe?g|gif|svg|bmp)$/,
        use: createURILoader('img')
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        use: createURILoader('media')
      }, {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: createURILoader('fonts')
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [resolveRoot],
        use: {
          loader: 'babel-loader?cacheDirectory=true'
        }
      }].concat(ic.isEslint ? [createEslintLoader(/\.js$/)] : [])
    },

    plugins: [
      ...(names => names.map((value, idx) => {
        let clone = names.slice()

        clone.splice(idx, 1)
        return new HtmlWebpackPlugin({
          title: ic.pages[value],
          filename: `${value}.${ic.ext}`,
          chunksSortMode: 'manual',
          excludeChunks: clone,
          minify: ic.isMiniHTML,
          template: path.resolve(ic.template)
        })
      }))(Object.keys(entry)),

      new webpack.ProgressPlugin(),

      // Define var
      new webpack.DefinePlugin((define => {
        Object.keys(define).forEach(
          value => define[value] = JSON.stringify(define[value])
        )
        return define
      })(merge(ic.define, { NODE_ENV })))

    ].concat(ic.isCssExtract ? [
      new MiniCssExtractPlugin({ filename: 'css/[name].[hash:13].css' })
    ] : [])
  }
}

process.noDeprecation = true
module.exports = {
  createCssLoader,
  generator,
  createURILoader,
  createEslintLoader
}
