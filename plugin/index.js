import pathUtils from 'path'
import unixSlash from 'slash'


const babelRoot = process.cwd()


export default function() {
  const defaultOptions = {
    root  : '',
    prefix: '~',
  }

  const visitor = {
    ImportDeclaration(path, state = {}) {
      const originalPath = path.node.source.value;
      const options = Object.assign({}, defaultOptions, state.opts)

      validateOptions(options)

      if (hasPrefix(originalPath, options.prefix)) {
        path.node.source.value = pathUtils.join(
          babelRoot,
          options.root,
          originalPath.slice(options.prefix.length)
        )
      }
    }
  }

  return { visitor }
}


function validateOptions(options) {
  ensureString(options, 'root')
  ensureString(options, 'prefix')
}


function ensureString(object, key) {
  if (typeof object[key] !== 'string')
    throw new Error(`Expected ${key} to be a String, found ${object[key]}`)
}


function hasPrefix(path, prefix) {
  return unixSlash(path).startsWith(prefix + '/')
}