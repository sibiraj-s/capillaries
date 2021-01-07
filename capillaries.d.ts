export class Events {
  /**
   * Create event listener
   *
   * @param type A String that specifies the name of the event.
   * @param listener A function to invoke when the event occurs.
   * @param context Context to bind to the event handler
   * 
   * @returns {Function} A functin to unsubscribe the listener
   */
  on(type: string, listener: Function, context?: object): () => void

  /**
   * Emit Events
   * @param type A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  emit(type: string, payload?: any): void

  /**
   * Unbind all events listeners
   *
   * @param type A String that specifies the name of the event. If not specified it will clear all events
   */
  unbindAll(type?: string): void
}

export class Hooks {
  /**
   * Create a tap
   *
   * @param type Name of the hook
   * @param cb A callback function to invoke when the tap is called
   * @param context Context to bind to the callback function
   * 
   * @returns {Function} A function to remove the tap
   */
  tap(name: string, cb: Function, context?: object): () => void

  /**
   * Invokes all tapped functions synchronously
   *
   * @param name Name of the hook
   * @param payload Payload for the tap
   * 
   */
  call(name: string, payload?: any): void

  /**
  * Invokes all tapped functions synchronously
  * The result from one tap is passed over to the other in series and
  * will return the response from last tap as result
  * 
  * @param name A String that specifies the name of the event.
  * @param payload Optional payload for event handlers
  */
  callWaterFall(name: string, payload?: any): unknown

  /**
   * Invokes and awaits on all tapped functions
   *
   * @param name A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  callAsync(name: string, payload?: any): Promise<void>

  /**
  * Invokes all tapped functions and awaits them
  * the result from one tap is passed over to the other in series and
  * will return the response from last tap as result
  * 
  * @param name Name of the hook to invoke.
  * @param payload Optional payload for hooks
  */
  callAsyncWaterFall(type: string, payload?: any): Promise<unknown>

  /**
   * Remove all hooks
   */
  clear(): void
}

export default Events
