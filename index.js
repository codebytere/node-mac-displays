const displays = require('bindings')('displays.node')

function getDisplayFromID(id) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  return displays.getDisplayFromID.call(this, id)
}

function mirror(enable, firstID, secondID) {
  if (typeof enable !== 'boolean') {
    throw new TypeError(`'enable' must be a boolean`)
  }

  if (typeof firstID !== 'number') {
    throw new TypeError(`'firstID' must be a number`)
  }

  if (secondID !== undefined && typeof secondID !== 'number') {
    throw new TypeError(`'secondID' must be a number`)
  }

  displays.mirror.call(this, enable, firstID, secondID)
}

function screenshot(id, options = {}) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  const validTypes = ['jpeg', 'tiff', 'png']
  if (options.type) {
    if (typeof options.type !== 'string') {
      throw new TypeError(`'type' must be a string`)
    } else if (!validTypes.includes(options.type)) {
      throw new TypeError(`'type' must be one of ${validTypes.join(', ')}`)
    }
  }

  if (options.bounds) {
    if (typeof options.bounds !== 'object') {
      throw new TypeError(`'bounds' must be a object`)
    } else if (typeof options.bounds.x !== 'number') {
      throw new TypeError(`'bounds.x' must be a number`)
    } else if (typeof options.bounds.y !== 'number') {
      throw new TypeError(`'bounds.y' must be a number`)
    } else if (typeof options.bounds.width !== 'number') {
      throw new TypeError(`'bounds.width' must be a number`)
    } else if (typeof options.bounds.height !== 'number') {
      throw new TypeError(`'bounds.height' must be a number`)
    }
  }

  return displays.screenshot.call(this, id, options)
}

module.exports = {
  getAllDisplays: displays.getAllDisplays,
  getPrimaryDisplay: displays.getPrimaryDisplay,
  getDisplayFromID,
  mirror,
  screenshot,
}
