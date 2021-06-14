# Capillaries [![Tests](https://github.com/sibiraj-s/capillaries/workflows/Tests/badge.svg)](https://github.com/sibiraj-s/capillaries/actions)

> Javascript Events and Hooks

## Getting Started

### Installation

Installation can be done via package managers such as [npm] or [yarn]

```bash
% npm install capillaries

# or

% yarn add capillaries
```

### Events

```js
import { Events } from 'capillaries';

const event = new Events();

const listener = function (payload) {
  console.log('Event Received:', payload);
};

// create a event listeners
event.on('connecting', listener);
event.on('connected', listener, this); // optionally bind context to the listener when invoked

// dispatch events
event.emit('connected', 'paylod');

// remove a event listener
const unsubscribe = event.on('connected', listener);
unsubscribe();

// remove all listeners for given event
event.unbindAll('connected');

// unbind all event listeners
event.unbindAll();
```

### AsyncEvents

```js
import { AsyncEvents } from 'capillaries';

const event = new AsyncEvents();

const handler = async function (payload) {
  console.log('Event Received:', payload);
};

// create a event handler
// only one event can be attached, attaching more than one event will throw error
event.on('connected', handler);

// call the event
// can be awaited
event.call('connected', 'paylod');

// remove a event listener
const unsubscribe = event.on('connected', handler);
unsubscribe();

// unbind/remove all events
event.unbindAll();
```

### Hooks

```js
import { Hooks } from 'capillaries';

const hooks = new Hooks();

// create a tap
hooks.tap('Hook', () => {
  return 'Hello World!';
});

hooks.tap('AsyncHook', async () => {
  return 'Hello World!';
});

// Call the taps
hooks.call('Hook', payload); //-> returns undefined
hooks.callWaterFall('Hook', payload); //-> returns 'Hello World!'
hooks.callAsync('AsyncHook', payload); // awaits on taps, returns undefined
hooks.callAsyncWaterFall('AsyncHook', payload); // awaits on taps, returns 'Hello World!'

// remove all hooks
hooks.clear()
```

Hooks are executed in order. The calling waterfall hook passes a return value from each function to the next function and returns data from the last tap

### Browser compatibility

- Chrome 38+
- Edge 12+
- Firefox 13+
- Opera 25+
- Safari 8+
- Internet Explorer 11

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/
[umd]: https://github.com/umdjs/umd
