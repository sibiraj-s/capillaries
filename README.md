# Capillaries [![Tests](https://github.com/sibiraj-s/capillaries/workflows/Tests/badge.svg)](https://github.com/sibiraj-s/capillaries/actions)

> Javascript Events

## Getting Started

### Installation

Installation can be done via package managers such as [npm] or [yarn]

```bash
% npm install capillaries

# or

% yarn add capillaries
```

or use cdn

#### Minified:

```bash
//cdn.jsdelivr.net/npm/capillaries@latest/capillaries.umd.min.js
```

#### Pretty Printed:

```bash
//cdn.jsdelivr.net/npm/capillaries@latest/capillaries.umd.js
```

### Events

```js
import { Events } from 'capillaries';

const event = new Events();

const listener = function (payload) {
  console.log('Event Received:', payload);
};

const anotherListener = function (payload) {
  console.log('Event Received:', payload);
};

// create a event listeners
event.on('connecting', listener);
event.on('connected', anotherListener, this); // optionally bind context to the listener when invoked

// dispatch events
event.emit('connected', 'paylod');

// remove a event listener
const unsubscribe = event.off('connected', listener);
unsubscribe();

// remove all listeners for an event
event.off('connected');

// unbind all event listeners
event.unbindAll();
```

### Hooks

```js
import { Hooks } from 'capillaries';

const hooks = new Hooks();

// create a tap
hooks.tap('HookName', () => {
  return 'Hello World';
});

// Calling the taps
hooks.call('HookName', payload); //-> returns undefined
hooks.callWaterFall('HookName', payload); //-> returns 'Hello world'
hooks.callAsync('HookName', payload); // awaits on taps, returns undefined
hooks.callAsyncWaterFall('HookName', payload); // awaits on taps, returns 'Hello world'
```

Hooks are executed in order. The waterfall passes a return value from each function to the next function and returns final retuned data

### Browser compatibility

- Internet Explorer 9+
- Chrome 6+
- Edge 12+
- Firefox 4+
- Opera 12+
- Safari 5.1+

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/
[umd]: https://github.com/umdjs/umd
