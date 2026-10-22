import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initBlogBanner } from '../src/lib/blog-banner.ts';

class Banner extends EventTarget {
  clientWidth = 1000;
  dataset = {};
  style = { setProperty() {} };
  closest() {
    return null;
  }
}
function setup(t, reducedMotion = false) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 1000 });
  const element = new Banner();
  const changes = [];
  let busy = false;
  const controller = initBlogBanner(
    element,
    4,
    (index, manual) => changes.push({ index, manual }),
    (value) => {
      busy = value;
    },
    () => reducedMotion,
  );
  const emit = (type, properties = {}) => {
    const event = new Event(type, { cancelable: true });
    for (const [key, value] of Object.entries(properties))
      Object.defineProperty(event, key, { value });
    element.dispatchEvent(event);
    return event;
  };
  const wheel = (x, y = 0, extra = {}) =>
    emit('wheel', {
      deltaX: x,
      deltaY: y,
      deltaMode: 0,
      ctrlKey: false,
      shiftKey: false,
      ...extra,
    });
  const pointer = (type, x, y = 0, extra = {}) =>
    emit(type, {
      pointerType: 'touch',
      pointerId: 1,
      isPrimary: true,
      clientX: x,
      clientY: y,
      ...extra,
    });
  return { changes, controller, emit, wheel, pointer, busy: () => busy };
}

test('a fast wheel gesture changes one slide and waits for the normal animation', (t) => {
  const g = setup(t);
  assert.equal(g.wheel(500).defaultPrevented, true);
  assert.deepEqual(g.changes, [{ index: 1, manual: true }]);
  t.mock.timers.tick(300);
  g.controller.show(2, true);
  assert.equal(g.changes.length, 1);
  assert.equal(g.busy(), true);
  t.mock.timers.tick(549);
  assert.equal(g.busy(), true);
  t.mock.timers.tick(1);
  assert.equal(g.busy(), false);
  g.wheel(-100);
  assert.deepEqual(g.changes.at(-1), { index: 0, manual: true });
});

test('momentum cannot trigger another slide even after the animation completes', (t) => {
  const g = setup(t);
  g.wheel(100);
  for (let i = 0; i < 30; i++) {
    t.mock.timers.tick(40);
    g.wheel(10);
  }
  assert.equal(g.changes.length, 1);
  t.mock.timers.tick(241);
  g.wheel(100);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 2],
  );
});

test('continued acceleration of one long swipe does not queue an extra transition', (t) => {
  const g = setup(t);
  g.wheel(10);
  t.mock.timers.tick(200);
  g.wheel(30);
  t.mock.timers.tick(200);
  g.wheel(80);
  t.mock.timers.tick(200);
  g.wheel(160);
  t.mock.timers.tick(1100);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1],
  );
  assert.equal(g.busy(), false);
});

test('a second touchpad gesture during the transition is played after it finishes', (t) => {
  const g = setup(t);
  g.wheel(100);
  t.mock.timers.tick(300);
  g.wheel(100);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1],
  );
  t.mock.timers.tick(550);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 2],
  );
  t.mock.timers.tick(850);
  assert.equal(g.busy(), false);
  g.wheel(-100);
  assert.deepEqual(g.changes.at(-1), { index: 1, manual: true });
});

test('a fresh same-direction impulse is recognized without waiting for the momentum tail to stop', (t) => {
  const g = setup(t);
  g.wheel(100);
  for (let i = 0; i < 10; i++) {
    t.mock.timers.tick(40);
    g.wheel(5);
  }
  g.wheel(100);
  t.mock.timers.tick(450);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 2],
  );
});

test('reversing direction after a transition works while old momentum is still arriving', (t) => {
  const g = setup(t);
  g.wheel(100);
  for (let i = 0; i < 23; i++) {
    t.mock.timers.tick(40);
    g.wheel(5);
  }
  g.wheel(-100);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 0],
  );
});

test('only the latest deliberate swipe is retained while a transition is running', (t) => {
  const g = setup(t);
  g.wheel(100);
  t.mock.timers.tick(300);
  g.wheel(100);
  t.mock.timers.tick(300);
  g.wheel(-100);
  t.mock.timers.tick(250);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 0],
  );
  t.mock.timers.tick(850);
  assert.equal(g.changes.length, 2);
  assert.equal(g.busy(), false);
});

test('small deltas, shift-wheel and non-pixel wheel units work in both directions', (t) => {
  const g = setup(t, true);
  g.wheel(4);
  g.wheel(4);
  assert.deepEqual(g.changes.at(-1), { index: 1, manual: true });
  t.mock.timers.tick(241);
  g.wheel(0, -12, { shiftKey: true });
  assert.deepEqual(g.changes.at(-1), { index: 0, manual: true });
  t.mock.timers.tick(241);
  g.wheel(1, 0, { deltaMode: 1 });
  assert.deepEqual(g.changes.at(-1), { index: 1, manual: true });
  t.mock.timers.tick(241);
  g.wheel(-1, 0, { deltaMode: 2 });
  assert.deepEqual(g.changes.at(-1), { index: 0, manual: true });
});

test('vertical scrolling and pinch zoom remain available', (t) => {
  const g = setup(t);
  assert.equal(g.wheel(0, 120).defaultPrevented, false);
  assert.equal(g.wheel(20, 100).defaultPrevented, false);
  assert.equal(g.wheel(100, 0, { ctrlKey: true }).defaultPrevented, false);
  assert.deepEqual(g.changes, []);
  assert.equal(g.busy(), false);
});

test('touch swipes in either direction select one slide on release and suppress link clicks', (t) => {
  const g = setup(t);
  g.pointer('pointerdown', 300);
  g.pointer('pointermove', 100);
  assert.deepEqual(g.changes, []);
  g.pointer('pointerup', 80);
  assert.deepEqual(g.changes, [{ index: 1, manual: true }]);
  assert.equal(g.emit('click', { detail: 1 }).defaultPrevented, true);
  assert.equal(g.emit('click', { detail: 0 }).defaultPrevented, false);
  assert.equal(g.busy(), true);
  t.mock.timers.tick(850);
  assert.equal(g.busy(), false);
  // Pointer events can be coalesced; movement need not have a separate move event.
  g.pointer('pointerdown', 80);
  g.pointer('pointerup', 250);
  assert.deepEqual(g.changes.at(-1), { index: 0, manual: true });
});

test('taps, vertical touch scroll, cancelled gestures and a second finger do not navigate', (t) => {
  const g = setup(t);
  g.pointer('pointerdown', 100);
  g.pointer('pointerup', 102);
  assert.equal(g.emit('click', { detail: 1 }).defaultPrevented, false);
  g.pointer('pointerdown', 100);
  g.pointer('pointermove', 110, 50);
  g.pointer('pointerup', 0, 150);
  g.pointer('pointerdown', 100);
  g.pointer('pointercancel', 300);
  g.pointer('pointerup', 300);
  g.pointer('pointerdown', 100);
  g.pointer('pointerdown', 200, 0, { pointerId: 2, isPrimary: false });
  g.pointer('pointerup', 300);
  assert.deepEqual(g.changes, []);
  assert.equal(g.busy(), false);
});

test('autoplay and controls use the same animation lock', (t) => {
  const g = setup(t);
  g.controller.show(1);
  g.controller.show(2, true);
  assert.deepEqual(g.changes, [{ index: 1, manual: false }]);
  t.mock.timers.tick(850);
  g.controller.show(2, true);
  assert.deepEqual(g.changes.at(-1), { index: 2, manual: true });
});

test('reduced motion does not lock navigation and selecting the current slide does nothing', (t) => {
  const g = setup(t, true);
  g.controller.show(0);
  assert.deepEqual(g.changes, []);
  g.controller.show(-1, true);
  g.controller.show(4);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [3, 0],
  );
  assert.equal(g.busy(), false);
});
