# electron-displays

This native Node.js module allows you to enumerate over system display information.

## API

### `Display` Object

Display objects take the following format:

* `id` Number - The display's unique identifier.
* `name` String - The human-readable name of the display.
* `supportedWindowDepths` Number[] - The window depths supported by the display.
* `rotation` Number - The screen rotation in clockwise degrees.
* `scaleFactor` Number - Output device's pixel scale factor.
* `isMonochrome` Boolean - Whether or not the display is a monochrome display.
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

### `displays.getAllDisplays()`

Returns `Array<Object>` - Returns an array of display objects.

Example usage:
```js
const allDisplays = contacts.getAllDisplays()

console.log(allDisplays[0])
/* Prints:
[
  {
    id: 2077749241,
    name: 'Built-in Retina Display',
    isMonochrome: false,
    supportedWindowDepths: [
      264, 516, 520, 528,
      544,   0,   0,   0
    ],
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
const primary = contacts.getPrimaryDisplay()

console.log(primary)
/* Prints:
{
  id: 2077749241,
  name: 'Built-in Retina Display',
  isMonochrome: false,
  supportedWindowDepths: [
    264, 516, 520, 528,
    544,   0,   0,   0
  ],
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

* `id` - The device ID for the display.

Returns `Object` - the display with the specified device ID.

Example Usage:
```js
const display = contacts.getDisplayByID(2077749241)

console.log(display)
/* Prints:
{
  id: 2077749241,
  name: 'Built-in Retina Display',
  isMonochrome: false,
  supportedWindowDepths: [
    264, 516, 520, 528,
    544,   0,   0,   0
  ],
  depth: 520,
  scaleFactor: 2,
  bounds: { x: 0, y: 0, width: 1680, height: 1050 },
  workArea: { x: 0, y: 23, width: 1680, height: 932 },
  rotation: 0,
  internal: true
}
*/
```
