# node-system-displays

This native Node.js module allows you to enumerate over system display information.

## API

### `Display` Object

The `Display` object represents a physical display connected to the system. A
fake `Display` may exist on a headless system, or a `Display` may correspond to
a remote, virtual display.

Display objects take the following format:

* `id` Number - The display's unique identifier.
* `name` String - The human-readable name of the display.
* `supportedWindowDepths` Number[] - The window depths supported by the display.
* `rotation` Number - The screen rotation in clockwise degrees.
* `scaleFactor` Number - Output device's pixel scale factor.
* `isMonochrome` Boolean - Whether or not the display is a monochrome display.
* `colorSpace` Object - Representation of a custom color space.
  * `name` String - The localized name of the color space.
  * `componentCount` Number - The number of components, excluding alpha, the color space supports.
* `depth` Number - The number of bits per pixel.
* `bounds` Object
  * `x` Number - The x coordinate of the origin of the rectangle.
  * `y` Number - The y coordinate of the origin of the rectangle.
  * `width` Number - The width of the rectangle.
  * `height` Number - The height of the rectangle.
* `workArea` Object
  * `x` Number - The x coordinate of the origin of the rectangle.
  * `y` Number - The y coordinate of the origin of the rectangle.
  * `width` Number - The width of the rectangle.
  * `height` Number - The height of the rectangle.
* `internal` Boolean - `true` for an internal display and `false` for an external display.
* `isAsleep` Boolean -  Whether or not the display is sleeping.
* `refreshRate` Number - Returns the refresh rate of the specified display.

### `displays.getAllDisplays()`

Returns `Array<Object>` - Returns an array of display objects.

Example usage:
```js
const displays = require('node-system-displays')

const allDisplays = displays.getAllDisplays()

console.log(allDisplays[0])
/* Prints:
[
  {
    id: 69734406,
    name: 'Built-in Retina Display',
    refreshRate: 0,
    supportedWindowDepths: [
      264, 516, 520, 528,
      544,   0,   0,   0
    ],
    isAsleep: false,
    isMonochrome: false,
    colorSpace: { name: 'Color LCD', componentCount: 3 },
    depth: 520,
    scaleFactor: 2,
    bounds: { x: 0, y: 0, width: 1680, height: 1050 },
    workArea: { x: 0, y: 23, width: 1680, height: 932 },
    rotation: 0,
    internal: true
  }
]
*/
```

### `displays.getPrimaryDisplay()`

Returns `Object` - the display containing the window with the keyboard focus.

Example Usage:
```js
const displays = require('node-system-displays')

const primary = displays.getPrimaryDisplay()

console.log(primary)
/* Prints:
{
  id: 69734406,
  name: 'Built-in Retina Display',
  refreshRate: 0,
  supportedWindowDepths: [
    264, 516, 520, 528,
    544,   0,   0,   0
  ],
  isAsleep: false,
  isMonochrome: false,
  colorSpace: { name: 'Color LCD', componentCount: 3 },
  depth: 520,
  scaleFactor: 2,
  bounds: { x: 0, y: 0, width: 1680, height: 1050 },
  workArea: { x: 0, y: 23, width: 1680, height: 932 },
  rotation: 0,
  internal: true
}
*/
```

### `displays.getDisplayByID(id)`

* `id` Number - The device ID for the display.

Returns `Object` - the display with the specified device ID.

Example Usage:
```js
const displays = require('node-system-displays')

const display = displays.getDisplayByID(2077749241)

console.log(display)
/* Prints:
{
  id: 69734406,
  name: 'Built-in Retina Display',
  refreshRate: 0,
  supportedWindowDepths: [
    264, 516, 520, 528,
    544,   0,   0,   0
  ],
  isAsleep: false,
  isMonochrome: false,
  colorSpace: { name: 'Color LCD', componentCount: 3 },
  depth: 520,
  scaleFactor: 2,
  bounds: { x: 0, y: 0, width: 1680, height: 1050 },
  workArea: { x: 0, y: 23, width: 1680, height: 932 },
  rotation: 0,
  internal: true
}
*/
```

### `displays.screenshot(id)`

* `id` Number - The device ID for the display.

Takes a screenshot of the display with the specified id.

Example Usage:
```js
const displays = require('node-system-displays')
const fs = require('fs')
const path = require('path')

const { id } = displays.getPrimaryDisplay()

const ssPath = path.resolve(__dirname, 'screenshot.jpg')
const screenshotData = display.screenshot(id)

// Write out JPEG image as screenshot.jpg in the current directory.
fs.writeFileSync(ssPath, screenshotData)
```
