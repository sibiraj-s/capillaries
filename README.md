# Capillaries [![Build Status](https://travis-ci.com/sibiraj-s/capillaries.svg?branch=master)](https://travis-ci.com/sibiraj-s/capillaries)

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

### Usage

```js
import Capillaries from 'capillaries';

const event = new Capillaries();

const listener = function(payload) {
  console.log('Event Received:', payload);
};

const anotherListener = function(payload) {
  console.log('Event Received:', payload);
};

// create a event listeners
event.on('connecting', listener);
event.on('connected', listener);
event.on('connecting', anotherListener);
event.on('connected', anotherListener, this); // optionally bind context to the listener when invoked

// dispatch events
event.emit('connected', 'paylod');

// remvoe a particular event listener
event.off('connected', listener);

// remove all listeners for an event
event.off('connected');

// detach multiple event listeners
event.detachEvents(['connecting', 'connected']);

// detach all event listeners
event.detachAll();
```

### API

```js
import Capillaries from 'capillaries';

const event = new Capillaries();
```

- event.on
- event.off
- event.emit
- event.detachEvents
- event.detachAll

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/
[umd]: https://github.com/umdjs/umd
