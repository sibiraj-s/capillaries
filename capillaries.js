export class Events {
  #events = {};

  constructor() {
    Object.freeze(this);
  }

  on = (type, listener, ctx = null) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = this.#events[type] || [];
    event.push([listener, ctx]);
    this.#events[type] = event;

    return () => {
      this.#events[type] = (this.#events[type] || []).filter((e) => e[0] !== listener);
    };
  }

  emit = (type, ...args) => {
    const starEvents = type === '*' ? [] : this.#events['*'] || [];
    const eventList = (this.#events[type] || []).concat(starEvents);

    eventList.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, args);
    });
  }

  unbindAll = (type) => {
    if (type) {
      delete this.#events[type];
      return;
    }

    this.#events = {};
  }
}

export class Hooks extends Map {
  tap = (name, cb, ctx = null) => {
    if (typeof cb !== 'function') {
      throw new TypeError('Callback must be a function');
    }

    const hook = this.get(name) || [];
    hook.push([cb, ctx]);
    this.set(name, hook);

    return () => {
      const hooks = this.get(name);
      this.set(name, hooks.filter((e) => e[0] !== cb));
    };
  }

  callAsync = async (name, ...args) => {
    const hooks = this.get(name);
    if (!hooks) {
      return;
    }

    for (const [hook, ctx] of hooks) {
      await hook.apply(ctx, args);
    }
  }

  callAsyncWaterFall = async (name, arg) => {
    let data = arg;

    const hooks = this.get(name);
    if (!hooks) {
      return data;
    }

    for (const [hook, ctx] of hooks) {
      data = await hook.call(ctx, data);
    }

    return data;
  }

  call = (name, arg) => {
    const hooks = this.get(name);
    if (!hooks) {
      return;
    }

    for (const [hook, ctx] of hooks) {
      hook.call(arg, ctx);
    }
  }

  callWaterFall = (name, arg) => {
    let data = arg;

    const hooks = this.get(name);
    if (!hooks) {
      return data;
    }

    for (const [hook, ctx] of hooks) {
      data = hook.call(ctx, data);
    }

    return data;
  }
}

export default Events;
