export class Events<E extends Record<string | symbol | '*', unknown>> {
  /**
   * Create event listener
   *
   * @param type A String that specifies the name of the event.
   * @param listener A function to invoke when the event occurs.
   * @param context Context to bind to the event handler
   *
   * @returns {Function} A function to unsubscribe the listener
   */
  on<K extends keyof E>(type: K, listener: (...payload: E[K][]) => void, context?: unknown): () => void;

  /**
   * Create a wildcard listener to listen to all events
   *
   * @param type A String that specifies the name of the event.
   * @param listener A function to invoke when the event occurs.
   * @param context Context to bind to the event handler
   *
   * @returns {Function} A function to unsubscribe the listener
   */
  on<K extends keyof E>(type: '*', listener: (type: K, ...payload: E[K][]) => void, context?: unknown): () => void;

  /**
   * Emit Events
   * @param type A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  emit<K extends keyof E>(type: K, ...payload: E[K][]): void;

  /**
   * Unbind all events listeners
   *
   * @param type A String that specifies the name of the event. If not specified it will clear all events
   */
  unbindAll<K extends keyof E>(type?: K): void;
}

export class AsyncEvents<E extends Record<string, unknown>> {
  /**
   * Create event listener
   *
   * @param type A String that specifies the name of the event.
   * @param handler A function to invoke when the event is invoked.
   *
   * @returns {Function} A functionn to unsubscribe the listener
   */
  on<K extends keyof E>(name: K, handler: (...payload: E[K][]) => void): () => void;

  /**
   * Invokes all tapped functions synchronously
   *
   * @param name Name of the hook
   * @param payload Payload for the tap
   *
   */
  call<K extends keyof E>(name: K, ...payload: E[K][]): Promise<void>;

  /**
   * Unbind all events listeners
   *
   * @param type A String that specifies the name of the event. If not specified it will clear all events
   */
  unbindAll<K extends keyof E>(type?: K): void;
}

export class Hooks<H extends Record<string, unknown>> {
  /**
   * Create a tap
   *
   * @param type Name of the hook
   * @param cb A callback function to invoke when the tap is called
   * @param context Context to bind to the callback function
   *
   * @returns {Function} A function to remove the tap
   */
  tap<K extends keyof H>(name: K, cb: (payload: H[K]) => void, context?: unknown): () => void;

  /**
   * Invokes all tapped functions synchronously
   *
   * @param name Name of the hook
   * @param payload Payload for the tap
   */
  call<K extends keyof H>(name: K, payload?: H[K]): void;

  /**
   * Invokes all tapped functions synchronously
   * The result from one tap is passed over to the other in series and
   * will return the response from last tap as result
   *
   * @param name A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  callWaterFall<K extends keyof H>(name: K, payload?: H[K]): unknown;

  /**
   * Invokes and awaits on all tapped functions
   *
   * @param name A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  callAsync<K extends keyof H>(name: K, payload?: H[K]): Promise<void>;

  /**
   * Invokes all tapped functions and awaits them
   * the result from one tap is passed over to the other in series and
   * will return the response from last tap as result
   *
   * @param name Name of the hook to invoke.
   * @param payload Optional payload for hooks
   */
  callAsyncWaterFall<K extends keyof H>(name: K, payload?: H[K]): Promise<unknown>;

  /**
   * Remove all hooks
   * @param name Name of the hook to remove.
   */
  clear<K extends keyof H>(name?: K): void;
}

export default Events;
