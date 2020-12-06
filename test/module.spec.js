const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const {
  getAllDisplays,
  getPrimaryDisplay,
  getDisplayFromID,
  mirror,
  screenshot,
} = require('../index')

describe('node-mac-displays', () => {
  describe('getAllDisplays', () => {
    it('returns an array of Display objects', () => {
      const displays = getAllDisplays()
      expect(displays).to.be.an('array')

      const display = displays[0]

      expect(display).to.have.property('id').that.is.a('number')
      expect(display).to.have.property('name').that.is.a('string')
      expect(display).to.have.property('supportedWindowDepths').that.is.an('array')
      expect(display).to.have.property('rotation').that.is.a('number')
      expect(display).to.have.property('scaleFactor').that.is.a('number')
      expect(display).to.have.property('isMonochrome').that.is.a('boolean')
      expect(display).to.have.property('depth').that.is.a('number')
      expect(display).to.have.property('internal').that.is.a('boolean')
      expect(display).to.have.property('isAsleep').that.is.a('boolean')
      expect(display).to.have.property('refreshRate').that.is.a('number')

      expect(display).to.have.property('colorSpace').that.is.an('object')
      const { name, componentCount } = display.colorSpace
      expect(name).to.be.a('string')
      expect(componentCount).to.be.a('number')

      expect(display).to.have.property('bounds').that.is.an('object')
      const bounds = display.bounds
      expect(bounds.x).to.be.a('number')
      expect(bounds.y).to.be.a('number')
      expect(bounds.width).to.be.a('number')
      expect(bounds.height).to.be.a('number')

      expect(display).to.have.property('workArea').that.is.an('object')
      const workArea = display.bounds
      expect(workArea.x).to.be.a('number')
      expect(workArea.y).to.be.a('number')
      expect(workArea.width).to.be.a('number')
      expect(workArea.height).to.be.a('number')
    })
  })

  describe('getPrimaryDisplay', () => {
    it('returns the primary display', () => {
      const display = getPrimaryDisplay()

      expect(display).to.have.property('id').that.is.a('number')
      expect(display).to.have.property('name').that.is.a('string')
      expect(display).to.have.property('supportedWindowDepths').that.is.an('array')
      expect(display).to.have.property('rotation').that.is.a('number')
      expect(display).to.have.property('scaleFactor').that.is.a('number')
      expect(display).to.have.property('isMonochrome').that.is.a('boolean')
      expect(display).to.have.property('depth').that.is.a('number')
      expect(display).to.have.property('internal').that.is.a('boolean')

      expect(display).to.have.property('colorSpace').that.is.an('object')
      const { name, componentCount } = display.colorSpace
      expect(name).to.be.a('string')
      expect(componentCount).to.be.a('number')

      expect(display).to.have.property('bounds').that.is.an('object')
      const bounds = display.bounds
      expect(bounds.x).to.be.a('number')
      expect(bounds.y).to.be.a('number')
      expect(bounds.width).to.be.a('number')
      expect(bounds.height).to.be.a('number')

      expect(display).to.have.property('workArea').that.is.an('object')
      const workArea = display.bounds
      expect(workArea.x).to.be.a('number')
      expect(workArea.y).to.be.a('number')
      expect(workArea.width).to.be.a('number')
      expect(workArea.height).to.be.a('number')
    })
  })

  describe('getDisplayFromID', () => {
    it('throws an error if id is not a number', () => {
      expect(() => {
        getDisplayFromID('im a string!!')
      }).to.throw(`'id' must be a number`)
    })

    it('returns a valid display given an ID', () => {
      const { id } = getPrimaryDisplay()

      const display = getDisplayFromID(id)

      expect(display).to.have.property('id').that.is.a('number')
      expect(display).to.have.property('name').that.is.a('string')
      expect(display).to.have.property('supportedWindowDepths').that.is.an('array')
      expect(display).to.have.property('rotation').that.is.a('number')
      expect(display).to.have.property('scaleFactor').that.is.a('number')
      expect(display).to.have.property('isMonochrome').that.is.a('boolean')
      expect(display).to.have.property('depth').that.is.a('number')
      expect(display).to.have.property('internal').that.is.a('boolean')

      expect(display).to.have.property('colorSpace').that.is.an('object')
      const { name, componentCount } = display.colorSpace
      expect(name).to.be.a('string')
      expect(componentCount).to.be.a('number')

      expect(display).to.have.property('bounds').that.is.an('object')
      const bounds = display.bounds
      expect(bounds.x).to.be.a('number')
      expect(bounds.y).to.be.a('number')
      expect(bounds.width).to.be.a('number')
      expect(bounds.height).to.be.a('number')

      expect(display).to.have.property('workArea').that.is.an('object')
      const workArea = display.bounds
      expect(workArea.x).to.be.a('number')
      expect(workArea.y).to.be.a('number')
      expect(workArea.width).to.be.a('number')
      expect(workArea.height).to.be.a('number')
    })
  })

  describe('mirror', () => {
    it('throws an error if enable is not a boolean', () => {
      expect(() => {
        mirror('im a string!!')
      }).to.throw(`'enable' must be a boolean`)
    })

    it('throws an error if firstID is not valid', () => {
      expect(() => {
        mirror(true, 'bad-type')
      }).to.throw(`'firstID' must be a number`)
    })

    it('throws an error if options.type is not valid', () => {
      expect(() => {
        const { id } = getPrimaryDisplay()
        mirror(true, id, 'bad-type')
      }).to.throw(`'secondID' must be a number`)
    })
  })

  describe('screenshot', () => {
    it('throws an error if id is not a number', () => {
      expect(() => {
        screenshot('im a string!!')
      }).to.throw(`'id' must be a number`)
    })

    it('throws an error if options.type is not valid', () => {
      expect(() => {
        const { id } = getPrimaryDisplay()
        screenshot(id, { type: 'bad-type' })
      }).to.throw(`'type' must be one of jpeg, tiff, png`)
    })

    it('throws an error if options.bounds are not valid', () => {
      const { id } = getPrimaryDisplay()

      expect(() => {
        screenshot(id, { bounds: 'oh no' })
      }).to.throw(`'bounds' must be a number`)

      expect(() => {
        screenshot(id, { bounds: { x: 'bad', y: 1, width: 10, height: 10 } })
      }).to.throw(`'bounds.x' must be a number`)

      expect(() => {
        screenshot(id, { bounds: { x: 1, y: 'bad', width: 10, height: 10 } })
      }).to.throw(`'bounds.y' must be a number`)

      expect(() => {
        screenshot(id, { bounds: { x: 1, y: 1, width: 'bad', height: 10 } })
      }).to.throw(`'bounds.width' must be a number`)

      expect(() => {
        screenshot(id, { bounds: { x: 1, y: 1, width: 10, height: 'bad' } })
      }).to.throw(`'bounds.height' must be a number`)
    })

    it('can write out a screenshot to the current directory', () => {
      const { id } = getPrimaryDisplay()

      const ssPath = path.resolve(__dirname, 'screenshot.jpg')
      const screenshotData = screenshot(id)

      fs.writeFileSync(ssPath, screenshotData)
      expect(fs.existsSync(ssPath)).to.be.true

      fs.unlinkSync(ssPath)
      expect(fs.existsSync(ssPath)).to.be.false
    })
  })
})
