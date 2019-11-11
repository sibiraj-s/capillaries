declare class Capillaries {
  /**
   * Create event listener
   *
   * @param type A String that specifies the name of the event.
   * @param listener A function to invoke when the event occurs.
   * @param context Context to bind to the event handler
   */
  on(type: string, listener: Function, context?: object): void

  /**
   * Removes an event handler that has been attached to the event
   *
   * @param type A String that specifies the name of the event.
   * @param listener Specify a handler remove a specific event
   */
  off(type: string, listener?: Function): void

  /**
   * Emit Events
   * @param type A String that specifies the name of the event.
   * @param payload Optional payload for event handlers
   */
  emit(type: string, payload?: any): void

  /**
   * Unbind all events listeners
   */
  unbindAll(): void
}

export = Capillaries
