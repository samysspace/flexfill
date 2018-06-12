# flexfill
> 💽 Flexible browser-independent event handling

Have you ever had trouble adding event handlers for antiquated browsers? Confused about what functions to call to establish polyfill functionality? Well, look no further than flexfill! Flexfill is a want-all catch-all event handler mechanism which does the grunt work for you so you don't need to worry about adding specialized functionality for those dang users who are still using IE6.

# Install

Using `npm`

```shell
npm install -S flexfill
```

Or you can use it directly from your HTML files: 
`<script src="flexfill.min.js"></script>`

# API

The API exposes a couple of methods that will enable you to deal with event handling in a uniform manner without checking for browser-related constraints.

### `flexfill.add(node, type, listener, useCapture?)`

Adds an event listener `listener` of type `type` to DOM node `node`. (Straightforward, I know!)
```js
flexfill.add(document.body, 'click', function (e) {
  console.log('The document body has indeed been clicked!');
});
```
### `flexfill.remove(node, type, listener, useCapture?)`

Removes an event listener `listener` of type `type` from DOM node `node`. (Once again, ease of experience is a top priority.)

```js
flexfill.add(document.body, 'click', clicked);
flexfill.remove(document.body, 'click', clicked);

function clicked(e) {
  console.log('The document body has indeed been clicked!');
}
```
### `flexfill.create(node, type, details?)`

Creates an artificial custom event of type `type` and applies it to the DOM `node`. You can provide custom `details` which will be set to `e.detail` which you can subsequently access through this field.

```js
flexfill.add(document.body, 'dogs', bahamen);
flexfill.create(document.body, 'dogs', { dogsOut: true });

function bahamen (e) {
  console.log('Who let the dogs out? ' + e.detail.dogsOut ? ' Who? Who? Who?' : 'They\'re still in the yard.');
}
```

### License

Graciously licensed with ❤️ by MIT.


