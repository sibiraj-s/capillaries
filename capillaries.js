class Capillaries {
  events = {};

  constructor() {
    Object.seal(this);
  }

  on = (type, listener, ctx = null) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = this.events[type] || [];
    event.push([listener, ctx]);
    this.events[type] = event;
  }

  off = (type, listener) => {
    if (typeof listener !== 'function') {
      delete this.events[type];
      return;
    }

    this.events[type] = (this.events[type] || []).filter((e) => e[0] !== listener);
  }

  emit = (type, ...args) => {
    const starEvents = type === '*' ? [] : this.events['*'] || [];
    const eventList = (this.events[type] || []).concat(starEvents);

    eventList.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, args);
    });
  }

  unbindAll = () => {
    this.events = {};
  }
}

export default Capillaries;
