import { afterEach, expect, it, vi } from 'vitest';

import { Hooks } from '../capillaries';

const hooks = new Hooks();

afterEach(() => hooks.clear());

it('should initiate correctly', () => {
  expect(hooks).toBeInstanceOf(Hooks);
  expect(hooks.tap).toBeInstanceOf(Function);
  expect(hooks.call).toBeInstanceOf(Function);
  expect(hooks.callWaterFall).toBeInstanceOf(Function);
  expect(hooks.callAsync).toBeInstanceOf(Function);
  expect(hooks.callAsyncWaterFall).toBeInstanceOf(Function);
  expect(hooks.clear).toBeInstanceOf(Function);
});

it('should invoke callAsyncWaterFall hook correctly', async () => {
  const callbackFnQ = vi.fn((x) => x + 2);

  hooks.tap('q', (x: any) => {
    return new Promise((r) => {
      setTimeout(() => r((x as number) + 30));
    });
  });

  hooks.tap('q', callbackFnQ);

  const value = await hooks.callAsyncWaterFall('q', 1);

  expect(callbackFnQ).toBeCalled();
  expect(value).toBe(33);
});

it('should invoke callWaterFall hook correctly', async () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);
  const callbackFnQ2 = vi.fn().mockReturnValue(3);

  hooks.tap('q', callbackFnQ);
  hooks.tap('q', callbackFnQ2);

  const value = await hooks.callWaterFall('q', 1);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnQ2).toBeCalled();
  expect(value).toBe(3);
});

it('should invoke call hook correctly', () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);
  const callbackFnQ2 = vi.fn().mockReturnValue(3);

  hooks.tap('q', callbackFnQ);
  hooks.tap('q', callbackFnQ2);

  const value = hooks.call('q', 1);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnQ2).toBeCalled();
  expect(value).toBe(undefined);
});

it('should invoke callAsync hook correctly', async () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);
  const callbackFnQ2 = vi.fn().mockReturnValue(3);

  hooks.tap('q', callbackFnQ);
  hooks.tap('q', callbackFnQ2);

  const value = await hooks.callAsync('q', 1);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnQ2).toBeCalled();
  expect(value).toBe(undefined);
});

it('should return given payload when there are no hooks in callAsyncWaterFall', async () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);
  const callbackFnQ2 = vi.fn().mockReturnValue(3);

  hooks.tap('q', callbackFnQ);
  hooks.tap('q', callbackFnQ2);

  const value = await hooks.callAsyncWaterFall('r', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnQ2).not.toBeCalled();
  expect(value).toBe(1);
});

it('should return given payload when there are no hooks in callWaterFall', () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);
  const callbackFnQ2 = vi.fn().mockReturnValue(3);

  hooks.tap('q', callbackFnQ);
  hooks.tap('q', callbackFnQ2);

  const value = hooks.callWaterFall('r', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnQ2).not.toBeCalled();
  expect(value).toBe(1);
});

it('should be able to untap a tap', () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);

  const untap = hooks.tap('q', callbackFnQ);
  untap();

  const value = hooks.call('q', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(value).toBe(undefined);
});

it('should not throw error if untap called twice', () => {
  const callbackFnQ = vi.fn().mockReturnValue(2);

  const untap = hooks.tap('q', callbackFnQ);
  hooks.clear();

  expect(() => {
    untap();
  }).not.toThrow();
  const value = hooks.call('q', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(value).toBe(undefined);
});

it('should throw error when callback is not a function', () => {
  expect(() => hooks.tap('q', undefined as any)).toThrow(TypeError);
});

it('should go nothing when taps does not exist', async () => {
  const callbackFnQ = vi.fn();
  hooks.tap('q', callbackFnQ);

  const value = hooks.call('r', 1);
  const value2 = await hooks.callAsync('s', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(value).toBe(undefined);
  expect(value2).toBe(undefined);
});

it('should clear the hooks correctly', () => {
  const callbackFnQ = vi.fn();
  const callbackFnR = vi.fn();
  const callbackFnT = vi.fn();

  hooks.tap('q', callbackFnQ);
  hooks.tap('r', callbackFnR);

  hooks.clear('q');
  hooks.call('q', 1);
  hooks.call('r', 1);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnR).toBeCalled();

  hooks.tap('t', callbackFnT);
  hooks.clear();
  hooks.call('t', 1);
  expect(callbackFnT).not.toBeCalled();
});
