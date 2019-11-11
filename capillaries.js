function Capillaries() {
  let events = {};

  this.on = function on(type, listener, ctx = null) {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = events[type] || [];
    event.push([listener, ctx]);
    events[type] = event;
  };

  this.off = function off(type, listener) {
    if (typeof listener !== 'function') {
      delete events[type];
      return;
    }

    events[type] = (events[type] || []).filter((e) => e[0] !== listener);
  };

  this.emit = function emit(type, ...args) {
    const eventList = events[type] || [];

    eventList.forEach((event) => {
      const listenerFn = event[0];
      const ctx = event[1];
      listenerFn.apply(ctx, args);
    });
  };

  this.unbindAll = function unbindAll() {
    events = {};
  };

  Object.freeze(this);
}

export default Capillaries;
