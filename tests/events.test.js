import { afterEach, expect, it, vi } from 'vitest';

import Capillaries from '../capillaries';

const event = new Capillaries();
const payload = 'Test Payload';
const payload2 = 'Test Payload 2';

afterEach(() => event.unbindAll());

it('should initiate correctly', () => {
  expect(event).toBeInstanceOf(Capillaries);
  expect(event.on).toBeInstanceOf(Function);
  expect(event.emit).toBeInstanceOf(Function);
  expect(event.unbindAll).toBeInstanceOf(Function);
});

it('should bind to events and invoke events when emitted', () => {
  const callbackFnQ = vi.fn();
  const callbackFnR = vi.fn();
  const callbackFnT = vi.fn();

  event.on('q', callbackFnQ);
  event.on('r', callbackFnR);
  event.on('t', callbackFnT);

  event.emit('q', payload);
  event.emit('r', payload);
  event.emit('t', payload);
  event.emit('t', payload);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnQ).toHaveBeenCalledTimes(1);

  expect(callbackFnR).toBeCalled();
  expect(callbackFnR).toHaveBeenCalledTimes(1);

  expect(callbackFnT).toBeCalled();
  expect(callbackFnT).toHaveBeenCalledTimes(2);
});

it('should invoke wildcard `*` event listener for all events', () => {
  const callbackFn = vi.fn();

  event.on('*', callbackFn);

  event.emit('t', payload);
  expect(callbackFn).toHaveBeenCalledWith('t', payload);

  event.emit('s', payload2);
  expect(callbackFn).toHaveBeenCalledWith('s', payload2);

  expect(callbackFn).toBeCalledTimes(2);
});

it('should not call other functions for wildcard event `*`', () => {
  const callbackFn = vi.fn();
  const callbackFnT = vi.fn();

  event.on('*', callbackFn);
  event.on('t', callbackFnT);
  event.emit('*', payload);

  expect(callbackFn).toBeCalled();
  expect(callbackFnT).not.toBeCalled();
});

it('should invoke event listeners with given arguments', () => {
  const callbackFn = vi.fn();

  event.on('t', callbackFn);
  event.emit('t', payload);

  expect(callbackFn).toHaveBeenCalledWith(payload);

  event.emit('t', payload, payload);
  expect(callbackFn).toHaveBeenCalledWith(payload, payload);

  expect(callbackFn).not.toHaveBeenCalledWith('payload');
});

it('should throw error when event listerner is not a function', () => {
  expect(() => event.on('q')).toThrow(TypeError);
});

it('should not throw error when event is unsbscribed already', () => {
  const callbackFnQ = vi.fn();

  const unsbscribe = event.on('q', callbackFnQ);

  event.unbindAll('q');
  event.emit('q', payload);

  expect(() => { unsbscribe(); }).not.toThrow();
  expect(callbackFnQ).not.toBeCalled();
});

it('should unbind all events for a specified type', () => {
  const callbackFnQ = vi.fn();
  const callbackFnQ2 = vi.fn();

  event.on('q', callbackFnQ);
  event.on('q', callbackFnQ2);

  event.unbindAll('q');

  event.emit('q', payload);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnQ2).not.toBeCalled();
});

it('should unbind correct events', () => {
  const callbackFnQ = vi.fn();
  const callbackFnR = vi.fn();

  const unsubscribe = event.on('q', callbackFnQ);
  event.on('r', callbackFnR);

  unsubscribe();

  event.emit('q', payload);
  event.emit('r', payload);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnR).toBeCalled();
});

it('should unbind all when `unbindAll` is invoked', () => {
  const evt = new Capillaries();

  const callbackFnQ = vi.fn();
  const callbackFnR = vi.fn();
  const callbackFnS = vi.fn();
  const callbackFnT = vi.fn();

  evt.on('q', callbackFnQ);
  evt.on('r', callbackFnR);
  evt.on('s', callbackFnS);
  evt.on('t', callbackFnT);

  evt.unbindAll();

  evt.emit('q', payload);
  evt.emit('r', payload);
  evt.emit('t', payload);
  evt.emit('t', payload);

  evt.emit('q', payload);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnR).not.toBeCalled();
  expect(callbackFnS).not.toBeCalled();
  expect(callbackFnT).not.toBeCalled();
});

it('should be immutable', () => {
  const func = vi.fn();
  const callbackFnQ = vi.fn();

  expect(() => { event.on = func; }).toThrow(TypeError);
  expect(() => { event.emit = func; }).toThrow(TypeError);
  expect(() => { event.unbindAll = func; }).toThrow(TypeError);
  expect(() => { event.newFunc = func; }).toThrow(TypeError);

  event.on('q', callbackFnQ);
  event.emit('q', payload);

  expect(func).not.toBeCalled();
  expect(typeof event.newFunc).toBe('undefined');
  expect(callbackFnQ).toBeCalled();
});
