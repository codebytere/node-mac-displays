const { expect } = require('chai')
const { getAllDisplays, getPrimaryDisplay, getDisplayFromID } = require('../index')

describe('electron-displays', () => {
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
      const id = getPrimaryDisplay().id

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
})
