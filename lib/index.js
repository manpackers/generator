const merge = require('webpack-merge')

const Commander = require('./commander')
const file = require('../utils/file')
const { createCssLoader, createURILoader, generator, createEslintLoader } = require('./kernel')

const { manpacker = {} } = file.parse('package.json')
const icNormal = merge.smart(require('./config/ic'), manpacker)

const compile = ({ env = 'development', ic = {}, config = () => {} }) => {
  let icFinal = merge.smart(icNormal, { ext: 'html' }, ic)
  let configFinal
  let type = 'server'

  if (env.toLowerCase() === 'production') {
    icFinal = merge.smart(icNormal, ic)
    type = 'build'
  }
  configFinal = config(icFinal) || {}
  return require(`./${type}`)(
    icFinal, merge.smart(generator(env, icFinal, configFinal), configFinal)
  )
}

module.exports = {
  Commander,
  createCssLoader,
  createURILoader,
  compile,
  createEslintLoader
}
