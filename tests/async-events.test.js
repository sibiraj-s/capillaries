import { AsyncEvents } from '../capillaries';

const events = new AsyncEvents();

afterEach(() => events.unbindAll());

it('should initiate correctly', () => {
  expect(events).toBeInstanceOf(AsyncEvents);
  expect(events.on).toBeInstanceOf(Function);
  expect(events.call).toBeInstanceOf(Function);
  expect(events.unbindAll).toBeInstanceOf(Function);
});

it('should bind to events and invoke events when emitted', async () => {
  const callbackFnQ = jest.fn().mockImplementation((x) => {
    return new Promise((r) => {
      setTimeout(() => r(x + 30), 100);
    });
  });

  const callbackFnR = jest.fn();

  events.on('q', callbackFnQ);
  events.on('r', callbackFnR);

  const qResp = await events.call('q', 1);
  const rResp = await events.call('r', 1);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnQ).toHaveBeenCalledTimes(1);
  expect(qResp).toBe(31);

  expect(callbackFnR).toBeCalled();
  expect(callbackFnR).toHaveBeenCalledTimes(1);
  expect(rResp).toBe(undefined);
});

it('should throw error when registered twice', () => {
  const callbackFn = jest.fn();

  events.on('q', callbackFn);

  expect(() => { events.on('q', callbackFn); }).toThrow();
});

it('should throw if handler is not a function', () => {
  const callbackFn = jest.fn();

  events.on('q', callbackFn);
  events.unbindAll();

  expect(() => { events.on('q', 'callbackFn'); }).toThrow();
});

it('should throw if no handler is registered', () => {
  expect(() => { events.call('r', 'Payload'); }).toThrow();
});

it('should not emit any events after unbindAll', () => {
  const callbackFn = jest.fn();

  events.on('q', callbackFn);
  events.unbindAll();

  expect(() => { events.call('q', 'Payload'); }).toThrow();
  expect(callbackFn).not.toHaveBeenCalled();
});
