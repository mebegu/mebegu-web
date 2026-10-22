import assert from 'node:assert/strict';
import { test } from 'node:test';
import { initCarouselScroll } from '../src/lib/carousel-scroll.ts';

class Track extends EventTarget {
  clientWidth = 1000;
  scrollLeft = 0;
  requests = [];
  scrollTo(options) {
    this.requests.push(options);
  }
}
function setup(t, reducedMotion = false) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const track = new Track();
  const changes = [];
  let busy = false;
  const controller = initCarouselScroll(
    track,
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
    track.dispatchEvent(event);
    return event;
  };
  const scroll = (left) => {
    track.scrollLeft = left;
    emit('scroll');
  };
  return { track, changes, controller, emit, scroll, busy: () => busy };
}

test('native horizontal scrolling updates the active slide in both directions', (t) => {
  const g = setup(t);
  g.scroll(1000);
  g.scroll(2000);
  g.scroll(1000);
  g.scroll(0);
  assert.deepEqual(
    g.changes.map((change) => change.index),
    [1, 2, 1, 0],
  );
  assert.ok(g.changes.every((change) => change.manual));
});

test('autoplay waits for scrolling to settle with a fallback for older browsers', (t) => {
  const g = setup(t);
  g.scroll(100);
  t.mock.timers.tick(180);
  g.scroll(400);
  t.mock.timers.tick(180);
  assert.equal(g.busy(), true);
  g.scroll(1000);
  t.mock.timers.tick(201);
  assert.equal(g.busy(), false);
  assert.deepEqual(g.changes, [{ index: 1, manual: true }]);
});

test('scrollend finalizes snap position and releases autoplay immediately', (t) => {
  const g = setup(t);
  g.scroll(1000);
  g.emit('scrollend');
  assert.equal(g.busy(), false);
});

test('buttons and autoplay scroll the actual banner and wrap at the ends', (t) => {
  const g = setup(t);
  g.controller.show(-1, true);
  assert.deepEqual(g.track.requests.at(-1), { left: 3000, behavior: 'smooth' });
  assert.deepEqual(g.changes.at(-1), { index: 3, manual: true });
  g.controller.show(4);
  assert.deepEqual(g.track.requests.at(-1), { left: 0, behavior: 'smooth' });
  assert.deepEqual(g.changes.at(-1), { index: 0, manual: false });
});

test('programmatic scroll does not announce intermediate slides, but touch can interrupt it', (t) => {
  const g = setup(t);
  g.controller.show(3);
  g.scroll(1000);
  assert.deepEqual(g.changes, [{ index: 3, manual: false }]);
  g.emit('pointerdown');
  g.scroll(2000);
  assert.deepEqual(g.changes.at(-1), { index: 2, manual: true });
});

test('wheel events remain native; vertical scrolling, zoom and taps are never cancelled', (t) => {
  const g = setup(t);
  for (const properties of [
    { deltaX: 100, deltaY: 0 },
    { deltaX: -100, deltaY: 0 },
    { deltaX: 0, deltaY: 100 },
    { deltaX: 0, deltaY: 100, shiftKey: true },
    { deltaX: 100, ctrlKey: true },
  ])
    assert.equal(g.emit('wheel', properties).defaultPrevented, false);
  assert.equal(g.emit('click').defaultPrevented, false);
  assert.deepEqual(g.changes, []);
});

test('reduced motion and resizing use instant scrolling with the current width', (t) => {
  const g = setup(t, true);
  g.controller.show(2);
  assert.deepEqual(g.track.requests.at(-1), {
    left: 2000,
    behavior: 'instant',
  });
  g.track.clientWidth = 400;
  g.controller.show(2, false, true);
  assert.deepEqual(g.track.requests.at(-1), { left: 800, behavior: 'instant' });
});

test('overscroll is clamped and hidden tracks do not produce invalid slide numbers', (t) => {
  const g = setup(t);
  g.scroll(-1000);
  assert.deepEqual(g.changes, []);
  g.scroll(5000);
  assert.deepEqual(g.changes.at(-1), { index: 3, manual: true });
  g.track.clientWidth = 0;
  g.scroll(1000);
  assert.equal(g.changes.length, 1);
});
