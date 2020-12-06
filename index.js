const displays = require('bindings')('displays.node')

function getDisplayFromID(id) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  return displays.getDisplayFromID.call(this, id)
}

function screenshot(id) {
  if (typeof id !== 'number') {
    throw new TypeError(`'id' must be a number`)
  }

  return displays.screenshot.call(this, id)
}

module.exports = {
  getAllDisplays: displays.getAllDisplays,
  getPrimaryDisplay: displays.getPrimaryDisplay,
  getDisplayFromID,
  screenshot,
}
