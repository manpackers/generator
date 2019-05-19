const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const zipper = require('zip-local')

/**
 * Parse file's content for object.
 * @param {String} name
 * @returns {Object}
 */
function parse(name) {
  let target = {}

  if (!name) { return target }
  try {
    target = require(path.resolve(name))
    if (target && (typeof target !== 'object')) { return target }
  } catch (err) { /** TODO */ }
  return target
}

// Exec file.
function exec(name) {
  let target = () => {}

  if (!name) { return target }
  try {
    target = require(path.resolve(name))
    if (target && (typeof target !== 'function')) { return target }
  } catch (err) { /** TODO */ }
  return target
}

/**
 * Retrieve the corresponding extension file in the directory
 * @param {String} catalog Must be a directory path
 * @param {RegExp} ext     Retrieve file extensions
 * @returns {Array}
 */
function search(catalog, ext) {
  let catalogAndFiles = fs.readdirSync(catalog)
  let files = []
  let extFiles = []

  catalogAndFiles.map(value => {
    return (
      fs.statSync(path.resolve(catalog, value)).isFile()
    ) ? files.push(value) : ''
  })

  // Ext name for file.
  if (!ext) { return files }
  files.map(value => {
    return (ext.test(value)) ? extFiles.push(value) : ''
  })
  return extFiles
}

/**
 * Remove dir
 */
async function remove(rf) {
  return await new Promise((resolve, reject) => rf ? rimraf(rf, () => resolve()) : reject(rf))
}

// Zip
async function zip(source, name = 'native') {
  let zipped = await new Promise((resolve, reject) => (
    zipper.zip(path.join(source), (err, zipped) => err ? reject(err) : resolve(zipped))
  ))

  await remove(source)
  await fs.mkdirSync(source)
  zipped.compress().save(path.join(source, `${name}.zip`))
  return source
}

module.exports = { parse, exec, search, remove, zip }
