class Events extends Map {
  constructor() {
    super();
    Object.freeze(this);
  }

  on = (type, listener, ctx = null) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = this.get(type) || [];
    event.push([listener, ctx]);
    this.set(type, event);

    return () => {
      const events = this.get(type) || [];
      this.set(type, events.filter((e) => e[0] !== listener));
    };
  }

  emit = (type, ...args) => {
    const starEvents = type === '*' ? [] : this.get('*') || [];
    const eventList = (this.get(type) || []).concat(starEvents);

    eventList.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, args);
    });
  }

  unbindAll = (type) => {
    if (type) {
      this.delete(type);
      return;
    }

    this.clear();
  }
}

export default Events;
