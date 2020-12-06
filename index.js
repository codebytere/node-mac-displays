const displays = require('bindings')('displays.node')

function getDisplayFromID(id) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  return displays.getDisplayFromID.call(this, id)
}

function screenshot(id, options = {}) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  const validTypes = ['jpeg', 'tiff', 'png']
  if (options.type) {
    if (typeof options.type !== 'string') {
      throw new Error(`'type' must be a string`)
    } else if (!validTypes.includes(options.type)) {
      throw new Error(`'type' must be one of ${validTypes.join(', ')}`)
    }
  }

  if (options.bounds) {
    if (typeof options.bounds !== 'object') {
      throw new Error(`'bounds' must be a number`)
    } else if (!options.bounds.x || typeof options.bounds.x !== 'number') {
      throw new Error(`'bounds.x' must be a number`)
    } else if (!options.bounds.y || typeof options.bounds.y !== 'number') {
      throw new Error(`'bounds.y' must be a number`)
    } else if (!options.bounds.width || typeof options.bounds.width !== 'number') {
      throw new Error(`'bounds.width' must be a number`)
    } else if (!options.bounds.height || typeof options.bounds.height !== 'number') {
      throw new Error(`'bounds.height' must be a number`)
    }
  }

  return displays.screenshot.call(this, id, options)
}

module.exports = {
  getAllDisplays: displays.getAllDisplays,
  getPrimaryDisplay: displays.getPrimaryDisplay,
  getDisplayFromID,
  screenshot,
}
