class AsyncEvents<E extends Record<string, unknown>> {
  #events = new Map<keyof E, (...payload: any[]) => Promise<void>>();

  /**
   * Create event listener
   *
   * @param name A String that specifies the name of the event.
   * @param handler A function to invoke when the event is invoked.
   *
   * @returns {Function} A function to unsubscribe the listener
   */
  on = <K extends keyof E>(name: K, handler: (...payload: E[K][]) => Promise<void>): (() => void) => {
    if (this.#events.has(name)) {
      throw new Error(`Handler already exists for event: ${String(name)}`);
    }

    if (typeof handler !== 'function') {
      throw new TypeError(`Expected handler to be a function, but got: ${typeof handler}`);
    }

    this.#events.set(name, handler);

    return () => this.#events.delete(name);
  };

  /**
   * Invokes the handler function asynchronously
   *
   * @param name Name of the event
   * @param payload Payload for the handler
   *
   * @returns {Promise<void>} A promise that resolves when the handler completes
   */
  call = <K extends keyof E>(name: K, ...payload: E[K][]): Promise<void> => {
    const handler = this.#events.get(name);

    if (!handler) {
      throw new Error(`No handler registered for event: ${String(name)}`);
    }

    return handler(...payload);
  };

  /**
   * Unbind all event listeners
   *
   * @param name A String that specifies the name of the event. If not specified, it will clear all events
   */
  unbindAll = <K extends keyof E>(name?: K): void => {
    if (typeof name !== 'undefined') {
      this.#events.delete(name);
    } else {
      this.#events.clear();
    }
  };
}

export default AsyncEvents;
