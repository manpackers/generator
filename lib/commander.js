const commander = require('commander')
const merge = require('webpack-merge')

const file = require('../utils/file')
const ic = require('./config/ic')

const inital = version => commander.version(version)
  .usage('<command> [option]')
  .option(
    '--ic, [file:string]',
    'Initialize config item at compile time.',
    '.manpackeric'
  )
  .option(
    '-c, --config [file:string]',
    'The root (current project) settings config file.',
    './manpacker.webpack.js'
  )
  .option(
    '-r, --root [file:string]',
    'Construction engineering project root directory.'
  )

module.exports = class {
  constructor({ version }) { inital(version) }

  async build() {
    return await new Promise(resolve => commander.command('build')
      .option('--ext, [string]', 'Out template file\'s extension')
      .option('-o, --output [path:String]', 'Specify output results directory')
      .action(options => {
        let { ext, output } = options
        resolve({
          ic: merge(file.parse(commander.ic), { ext, output, root: commander.root }),
          config: file.exec(commander.config)
        })
      }))
  }

  async server() {
    return await new Promise(resolve => commander.command('server')
      .option('-p, --port [Number]', 'If you start a server, the server port.')
      .action(options => {
        let { port } = options
        resolve({
          ic: merge(file.parse(commander.ic), { port, root: commander.root }),
          config: file.exec(commander.config)
        })
      }))
  }

  parse() {
    commander.parse(process.argv)
    return this
  }
}
