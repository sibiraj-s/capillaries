type Listener<E, K extends keyof E> = (...payload: E[K][]) => void;
type WildcardListener<E> = <K extends keyof E>(type: K, ...payload: E[K][]) => void;

class Events<E extends Record<string | symbol | '*', unknown>> {
  #events = new Map<keyof E | '*', [Function, unknown][]>();

  constructor() {
    Object.freeze(this);
  }

  /**
   * Create event listener
   *
   * @param type A String that specifies the name of the event.
   * @param listener A function to invoke when the event occurs.
   * @param context Context to bind to the event handler
   *
   * @returns {Function} A function to unsubscribe the listener
   */
  on: {
    (type: '*', listener: WildcardListener<E>, context?: unknown): () => void;
    <K extends keyof E>(type: K, listener: Listener<E, K>, context?: unknown): () => void;
  } = <K extends keyof E>(type: K | '*', listener: Function, context: unknown = null): (() => void) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Event Listener must be a function');
    }

    const event = this.#events.get(type) ?? [];
    event.push([listener, context]);
    this.#events.set(type, event);

    return () => {
      const events = this.#events.get(type) ?? [];
      this.#events.set(
        type,
        events.filter((e) => e[0] !== listener),
      );
    };
  };

  /**
   * Emit Events
   * @param type A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  emit = <K extends keyof E>(type: K, ...args: E[K][]): void => {
    const events = this.#events.get(type) ?? [];

    events.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, args);
    });

    if (type === '*') {
      return;
    }

    const wildcardEvents = this.#events.get('*') ?? [];
    wildcardEvents.forEach((event) => {
      const [listenerFn, ctx] = event;
      listenerFn.apply(ctx, [type, ...args]);
    });
  };

  /**
   * Unbind all events listeners
   *
   * @param type A String that specifies the name of the event. If not specified it will clear all events
   */
  unbindAll = <K extends keyof E>(type?: K): void => {
    if (type !== undefined) {
      this.#events.delete(type);
      return;
    }

    this.#events.clear();
  };
}

export default Events;
