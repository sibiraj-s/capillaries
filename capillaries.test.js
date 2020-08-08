import Capillaries from './capillaries';

const event = new Capillaries();
const payload = 'Test Payload';

afterAll(() => event.unbindAll());

it('should initiate correctly', () => {
  expect(event).toBeInstanceOf(Capillaries);
  expect(event.on).toBeInstanceOf(Function);
  expect(event.off).toBeInstanceOf(Function);
  expect(event.emit).toBeInstanceOf(Function);
  expect(event.unbindAll).toBeInstanceOf(Function);
});

it('should bind to events and invoke events when emitted', () => {
  const callbackFnQ = jest.fn();
  const callbackFnR = jest.fn();
  const callbackFnT = jest.fn();

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

it('should invoke event listeners with given arguments', () => {
  const callbackFn = jest.fn();

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

it('should unbind all events when listerner reference is not passed', () => {
  const callbackFnQ = jest.fn();
  const callbackFnQ2 = jest.fn();

  event.on('q', callbackFnQ);
  event.on('q', callbackFnQ2);

  event.off('q');

  event.emit('q', payload);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnQ2).not.toBeCalled();
});

it('should unbind correct events', () => {
  const callbackFnQ = jest.fn();
  const callbackFnR = jest.fn();

  event.on('q', callbackFnQ);
  event.on('r', callbackFnR);

  event.off('q', callbackFnQ);

  event.emit('q', payload);
  event.emit('r', payload);

  expect(callbackFnQ).not.toBeCalled();
  expect(callbackFnR).toBeCalled();
});

it('should not unbind events when `off` method is invoked with invalid type', () => {
  const callbackFnQ = jest.fn();
  const callbackFnR = jest.fn();

  event.on('q', callbackFnQ);
  event.on('r', callbackFnR);

  event.off('t');
  event.off('s', callbackFnQ);

  event.emit('q', payload);
  event.emit('r', payload);

  expect(callbackFnQ).toBeCalled();
  expect(callbackFnR).toBeCalled();
});

it('should unbind all when `unbindAll` is invoked', () => {
  const evt = new Capillaries();

  const callbackFnQ = jest.fn();
  const callbackFnR = jest.fn();
  const callbackFnS = jest.fn();
  const callbackFnT = jest.fn();

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
  const func = jest.fn();
  const callbackFnQ = jest.fn();

  expect(() => { event.on = func; }).toThrow(TypeError);
  expect(() => { event.off = func; }).toThrow(TypeError);
  expect(() => { event.emit = func; }).toThrow(TypeError);
  expect(() => { event.unbindAll = func; }).toThrow(TypeError);
  expect(() => { event.newFunc = func; }).toThrow(TypeError);

  event.on('q', callbackFnQ);
  event.emit('q', payload);

  expect(func).not.toBeCalled();
  expect(event.newFunc).toBe(undefined);
  expect(callbackFnQ).toBeCalled();
});

it('should not be able to access internal events propery', () => {
  expect(event.events).toBe(undefined);
});
