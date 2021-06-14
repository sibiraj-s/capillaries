class Events {
  #events = new Map()

  constructor() {
    Object.freeze(this);
  }

  on = (type, listener, ctx = null) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = this.#events.get(type) || [];
    event.push([listener, ctx]);
    this.#events.set(type, event);

    return () => {
      const events = this.#events.get(type) || [];
      this.#events.set(type, events.filter((e) => e[0] !== listener));
    };
  }

  emit = (type, ...args) => {
    const starEvents = type === '*' ? [] : this.#events.get('*') || [];
    const eventList = (this.#events.get(type) || []).concat(starEvents);

    eventList.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, args);
    });
  }

  unbindAll = (type) => {
    if (type) {
      this.#events.delete(type);
      return;
    }

    this.#events.clear();
  }
}

export default Events;
