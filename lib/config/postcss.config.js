const path = require('path')
const merge = require('webpack-merge')
const file = require('../../utils/file')
const isProduction = process.env.NODE_ENV === 'production'
var config = {}

try {
  config = file.parse(path.join(process.cwd(), 'postcss.config.js'))
} catch (err) { /** TODO */ }

module.exports = merge.smart({
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'last 10 Chrome versions', 'last 5 Firefox versions',
        'Safari >= 6', 'Android >=5', 'ie >= 8'
      ],
      grid: true
    },
    'postcss-import': {},
    'postcss-url': {}
  }
}, isProduction ? { plugins: { 'cssnano': {} } } : { }, config)
