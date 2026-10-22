import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initCarouselGestures } from '../src/lib/carousel-gestures.ts';

class Banner extends EventTarget {
  clientWidth = 1000;
  closest() {
    return null;
  }
}

function setup(t) {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 1000 });
  const banner = new Banner();
  const steps = [];
  let busy = false;
  initCarouselGestures(
    banner,
    (direction) => steps.push(direction),
    (value) => {
      busy = value;
    },
  );
  const emit = (type, properties = {}) => {
    const event = new Event(type, { cancelable: true });
    Object.defineProperties(
      event,
      Object.fromEntries(
        Object.entries(properties).map(([key, value]) => [key, { value }]),
      ),
    );
    banner.dispatchEvent(event);
    return event;
  };
  const wheel = (x, y = 0, extra = {}) =>
    emit('wheel', {
      deltaX: x,
      deltaY: y,
      deltaMode: 0,
      ctrlKey: false,
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
  return { steps, wheel, pointer, emit, busy: () => busy };
}

test('touchpad accumulates small deltas and absorbs the momentum tail', (t) => {
  const g = setup(t);
  g.wheel(25);
  assert.equal(g.busy(), true);
  g.wheel(40);
  for (let i = 0; i < 10; i++) {
    t.mock.timers.tick(40);
    g.wheel(15);
  }
  assert.deepEqual(g.steps, [1]);
  t.mock.timers.tick(241);
  assert.equal(g.busy(), false);
  g.wheel(-65);
  assert.deepEqual(g.steps, [1, -1]);
});

test('vertical scrolling, diagonal scrolling and pinch zoom pass through', (t) => {
  const g = setup(t);
  assert.equal(g.wheel(0, 120).defaultPrevented, false);
  assert.equal(g.wheel(100, 100).defaultPrevented, false);
  assert.equal(g.wheel(120, 0, { ctrlKey: true }).defaultPrevented, false);
  assert.deepEqual(g.steps, []);
  assert.equal(g.busy(), false);
});

test('wheel line and page units work in either direction', (t) => {
  const g = setup(t);
  assert.equal(g.wheel(4, 0, { deltaMode: 1 }).defaultPrevented, true);
  t.mock.timers.tick(241);
  g.wheel(-1, 0, { deltaMode: 2 });
  assert.deepEqual(g.steps, [1, -1]);
});

test('touch swipes navigate once and suppress the associated link click', (t) => {
  const g = setup(t);
  g.pointer('pointerdown', 300);
  assert.equal(g.busy(), true);
  g.pointer('pointermove', 180, 8);
  g.pointer('pointerup', 150, 10);
  assert.deepEqual(g.steps, [1]);
  assert.equal(g.busy(), false);
  assert.equal(g.emit('click', { detail: 1 }).defaultPrevented, true);
  assert.equal(g.emit('click', { detail: 0 }).defaultPrevented, false);
  t.mock.timers.tick(451);
  assert.equal(g.emit('click', { detail: 1 }).defaultPrevented, false);
  g.pointer('pointerdown', 100);
  g.pointer('pointermove', 220);
  g.pointer('pointerup', 250);
  assert.deepEqual(g.steps, [1, -1]);
});

test('taps and vertical scrolling do not navigate or swallow links', (t) => {
  const g = setup(t);
  g.pointer('pointerdown', 200);
  g.pointer('pointerup', 202, 2);
  assert.equal(g.emit('click', { detail: 1 }).defaultPrevented, false);
  g.pointer('pointerdown', 200);
  g.pointer('pointermove', 204, 50);
  assert.equal(g.busy(), false);
  g.pointer('pointerup', 100, 150);
  assert.deepEqual(g.steps, []);
});

test('short drags do not change slides; cancellation and pinch release autoplay', (t) => {
  const g = setup(t);
  g.pointer('pointerdown', 100);
  g.pointer('pointermove', 120);
  g.pointer('pointerup', 130);
  assert.deepEqual(g.steps, []);
  g.pointer('pointerdown', 100);
  g.pointer('pointermove', 250);
  g.pointer('pointercancel', 250);
  assert.equal(g.busy(), false);
  g.pointer('pointerup', 250);
  g.pointer('pointerdown', 100);
  g.pointer('pointerdown', 200, 0, { pointerId: 2, isPrimary: false });
  assert.equal(g.busy(), false);
  g.pointer('pointermove', 300);
  g.pointer('pointerup', 300);
  assert.deepEqual(g.steps, []);
});

test('mouse dragging does not become a touch gesture', (t) => {
  const g = setup(t);
  for (const [type, x] of [
    ['pointerdown', 100],
    ['pointermove', 300],
    ['pointerup', 300],
  ])
    g.pointer(type, x, 0, { pointerType: 'mouse' });
  assert.deepEqual(g.steps, []);
  assert.equal(g.busy(), false);
});
