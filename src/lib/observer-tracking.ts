const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/** Nine opaque poses; a small dead band prevents flickering at frame boundaries. */
export function observerHeadFrame(horizontal: number, previous = 4): number {
  const x = Number.isFinite(horizontal) ? clamp(horizontal) : 0;
  const position = (x + 1) * 4;
  const frame =
    Number.isInteger(previous) && previous >= 0 && previous <= 8 ? previous : 4;
  if (Math.abs(position - frame) <= 0.58) return frame;
  return Math.max(0, Math.min(8, Math.round(position)));
}

/** Directional head images handle the visible turn; torso motion stays restrained. */
export function observerPose(horizontal: number, bodyHorizontal = horizontal) {
  const x = Number.isFinite(horizontal) ? clamp(horizontal) : 0;
  const body = Number.isFinite(bodyHorizontal) ? clamp(bodyHorizontal) : 0;
  return {
    bodyLean: body * 1.8,
    bodyYaw: body * 8,
    headLean: x * 2,
    headYaw: x * 4,
    headShift: x * 0.45,
  };
}

export interface ObserverLookState {
  head: number;
  headVelocity: number;
  body: number;
  bodyVelocity: number;
}
export const neutralObserverLook = (): ObserverLookState => ({
  head: 0,
  headVelocity: 0,
  body: 0,
  bodyVelocity: 0,
});

/** Critically damped, speed-limited springs: head aims first, torso follows it. */
export function advanceObserverLook(
  previous: ObserverLookState,
  target: number,
  seconds: number,
): ObserverLookState {
  const state = { ...previous };
  const goal = Number.isFinite(target) ? clamp(target) : 0;
  const elapsed = Math.max(
    0,
    Math.min(Number.isFinite(seconds) ? seconds : 0, 0.064),
  );
  const steps = Math.max(1, Math.ceil(elapsed * 120));
  const dt = elapsed / steps;
  const limit = (n: number, max: number) => Math.max(-max, Math.min(max, n));
  for (let i = 0; i < steps; i++) {
    state.headVelocity = limit(
      state.headVelocity +
        (81 * (goal - state.head) - 18 * state.headVelocity) * dt,
      2,
    );
    state.head = clamp(state.head + state.headVelocity * dt);
    state.bodyVelocity = limit(
      state.bodyVelocity +
        (36 * (state.head - state.body) - 12 * state.bodyVelocity) * dt,
      1.1,
    );
    state.body = clamp(state.body + state.bodyVelocity * dt);
  }
  if (
    Math.abs(goal - state.head) < 0.001 &&
    Math.abs(goal - state.body) < 0.001 &&
    Math.abs(state.headVelocity) < 0.004 &&
    Math.abs(state.bodyVelocity) < 0.004
  ) {
    return { head: goal, body: goal, headVelocity: 0, bodyVelocity: 0 };
  }
  return state;
}

export function initObserverTracking(home: HTMLElement) {
  const observer = home.querySelector<HTMLElement>('.night-observer');
  if (!observer) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let scene = home.getBoundingClientRect();
  let origin = observer.getBoundingClientRect();
  let target = 0;
  let state = neutralObserverLook();
  let headFrame = 4;
  let frame = 0;
  let last = 0;

  const measure = () => {
    scene = home.getBoundingClientRect();
    origin = observer.getBoundingClientRect();
  };
  const apply = () => {
    const pose = observerPose(state.head, state.body);
    observer.style.setProperty('--body-lean', `${pose.bodyLean.toFixed(3)}deg`);
    observer.style.setProperty('--body-yaw', `${pose.bodyYaw.toFixed(3)}deg`);
    observer.style.setProperty('--head-lean', `${pose.headLean.toFixed(3)}deg`);
    observer.style.setProperty('--head-yaw', `${pose.headYaw.toFixed(3)}deg`);
    observer.style.setProperty(
      '--head-shift',
      `${pose.headShift.toFixed(3)}px`,
    );
    headFrame = observerHeadFrame(state.head, headFrame);
    observer.style.setProperty('--head-column', String(headFrame % 3));
    observer.style.setProperty('--head-row', String(Math.floor(headFrame / 3)));
  };
  const tick = (now: number) => {
    const delta = (now - last) / 1000;
    last = now;
    state = advanceObserverLook(state, target, delta);
    apply();
    frame =
      state.head === target &&
      state.body === target &&
      state.headVelocity === 0 &&
      state.bodyVelocity === 0
        ? 0
        : requestAnimationFrame(tick);
  };
  const aim = (value: number) => {
    target = value;
    if (!frame && (state.head !== target || state.body !== target)) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };
  const reset = () => {
    target = 0;
    state = neutralObserverLook();
    headFrame = 4;
    cancelAnimationFrame(frame);
    frame = 0;
    apply();
  };
  home.addEventListener('pointerenter', measure);
  home.addEventListener(
    'pointermove',
    (event) => {
      if (
        event.pointerType === 'touch' ||
        reduced.matches ||
        !finePointer.matches
      )
        return;
      aim(
        clamp(
          (event.clientX - (origin.left + origin.width / 2)) /
            (scene.width * 0.45),
        ),
      );
    },
    { passive: true },
  );
  home.addEventListener('pointerleave', () => aim(0));
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('scroll', measure, { passive: true });
  window.addEventListener('blur', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  reduced.addEventListener('change', reset);
  finePointer.addEventListener('change', reset);
}
