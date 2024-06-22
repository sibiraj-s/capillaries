class Hooks<H extends Record<string, unknown>> {
  #hooks = new Map<keyof H | '*', [Function, unknown][]>();

  constructor() {
    Object.freeze(this);
  }

  /**
   * Create a tap
   *
   * @param name Name of the hook
   * @param cb A callback function to invoke when the hook is called
   * @param ctx Context to bind to the callback function
   *
   * @returns {Function} A function to remove the tap
   */
  tap = <K extends keyof H>(name: K, cb: (payload: H[K]) => void, ctx: unknown = null): (() => void) => {
    if (typeof cb !== 'function') {
      throw new TypeError('Callback must be a function');
    }

    const hooks = this.#hooks.get(name) ?? [];
    hooks.push([cb, ctx]);
    this.#hooks.set(name, hooks);

    return () => {
      const currentHooks = this.#hooks.get(name) ?? [];
      this.#hooks.set(
        name,
        currentHooks.filter(([hook]) => hook !== cb),
      );
    };
  };

  /**
   * Invokes and awaits on all tapped functions asynchronously
   *
   * @param name Name of the hook
   * @param args Payload for the hook
   */
  callAsync = async <K extends keyof H>(name: K, ...args: H[K][]): Promise<void> => {
    const hooks = this.#hooks.get(name);
    if (!hooks) {
      return;
    }

    for (const [hook, ctx] of hooks) {
      await hook.apply(ctx, args);
    }
  };

  /**
   * Invokes all tapped functions asynchronously in series
   * The result from one tap is passed to the next, returning the result from the last tap
   *
   * @param name Name of the hook
   * @param arg Initial payload for the hooks
   * @returns {Promise<unknown>} Result from the last hook
   */
  callAsyncWaterFall = async <K extends keyof H>(name: K, arg?: H[K]): Promise<unknown> => {
    let data = arg;

    const hooks = this.#hooks.get(name);
    if (!hooks) {
      return data;
    }

    for (const [hook, ctx] of hooks) {
      data = await hook.call(ctx, data);
    }

    return data;
  };

  /**
   * Invokes all tapped functions synchronously
   *
   * @param name Name of the hook
   * @param arg Payload for the hook
   */
  call = <K extends keyof H>(name: K, arg?: H[K]): void => {
    const hooks = this.#hooks.get(name);
    if (!hooks) {
      return;
    }

    for (const [hook, ctx] of hooks) {
      hook.call(ctx, arg);
    }
  };

  /**
   * Invokes all tapped functions synchronously in series
   * The result from one tap is passed to the next, returning the result from the last tap
   *
   * @param name Name of the hook
   * @param arg Initial payload for the hooks
   * @returns {unknown} Result from the last hook
   */
  callWaterFall = <K extends keyof H>(name: K, arg?: H[K]): unknown => {
    let data = arg;

    const hooks = this.#hooks.get(name);
    if (!hooks) {
      return data;
    }

    for (const [hook, ctx] of hooks) {
      data = hook.call(ctx, data);
    }

    return data;
  };

  /**
   * Remove all hooks or hooks for a specific name
   *
   * @param name Optional name of the hook to remove. If not specified, all hooks are cleared
   */
  clear = <K extends keyof H>(name?: K): void => {
    if (typeof name !== 'undefined') {
      this.#hooks.delete(name);
    } else {
      this.#hooks.clear();
    }
  };
}

export default Hooks;
