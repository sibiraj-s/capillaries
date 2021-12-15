class AsyncEvents {
  #events = new Map();

  on = (name, handler) => {
    if (this.#events.has(name)) {
      throw new Error(`Handler already exists for: ${name}`);
    }

    if (typeof handler !== 'function') {
      throw new Error(`Expected handler to be a function. But got: ${typeof handler}`);
    }

    this.#events.set(name, handler);

    return () => this.#events.delete(name);
  };

  call = (name, payload) => {
    const handler = this.#events.get(name);

    if (!handler) {
      throw new Error(`No handler registered for event: ${name}`);
    }

    return handler(payload);
  };

  unbindAll = () => {
    this.#events.clear();
  };
}

export default AsyncEvents;
