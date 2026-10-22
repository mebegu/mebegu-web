const TRANSITION_MS = 850;

/** Swipe, buttons and autoplay all select a slide through the same CSS transition. */
export function initBlogBanner(
  element: HTMLElement,
  count: number,
  onChange: (index: number, manual: boolean) => void,
  setBusy: (busy: boolean) => void,
  reducedMotion: () => boolean,
) {
  let index = 0;
  let animating = false;
  let wheelBusy = false;
  let wheelLatched = false;
  let wheelDistance = 0;
  let wheelTimer: ReturnType<typeof setTimeout> | undefined;
  let touch: { id: number; x: number; y: number } | undefined;
  let suppressClickUntil = 0;
  const updateBusy = () => setBusy(animating || wheelBusy || Boolean(touch));
  element.style.setProperty(
    '--banner-transition-duration',
    `${TRANSITION_MS}ms`,
  );
  element.dataset.bannerReady = '';

  function show(next: number, manual = false) {
    if (animating || count < 2) return;
    const target = ((next % count) + count) % count;
    if (target === index) return;
    index = target;
    animating = !reducedMotion();
    element.dataset.bannerAnimated = '';
    updateBusy();
    onChange(index, manual);
    if (animating)
      setTimeout(() => {
        animating = false;
        updateBusy();
      }, TRANSITION_MS);
  }

  element.addEventListener(
    'wheel',
    (event) => {
      const mode = event.deltaMode;
      if (event.ctrlKey) return;
      const x = event.deltaX || (event.shiftKey ? event.deltaY : 0);
      const y = event.shiftKey ? 0 : event.deltaY;
      if (!x || Math.abs(x) < Math.abs(y)) return;
      if (event.cancelable) event.preventDefault();
      wheelBusy = true;
      updateBusy();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelBusy = false;
        wheelLatched = false;
        wheelDistance = 0;
        updateBusy();
      }, 240);
      if (wheelLatched) return;
      wheelDistance +=
        x * (mode === 1 ? 16 : mode === 2 ? element.clientWidth : 1);
      if (Math.abs(wheelDistance) >= 8) {
        wheelLatched = true;
        show(index + Math.sign(wheelDistance), true);
      }
    },
    { passive: false },
  );

  const finishTouch = () => {
    touch = undefined;
    updateBusy();
  };
  element.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return;
    if (!event.isPrimary) {
      finishTouch();
      return;
    }
    if ((event.target as Element).closest('button')) return;
    touch = { id: event.pointerId, x: event.clientX, y: event.clientY };
    updateBusy();
  });
  element.addEventListener(
    'pointermove',
    (event) => {
      if (!touch || touch.id !== event.pointerId) return;
      const x = Math.abs(event.clientX - touch.x);
      const y = Math.abs(event.clientY - touch.y);
      if (y > 12 && y > x) finishTouch();
    },
    { passive: true },
  );
  element.addEventListener('pointerup', (event) => {
    if (!touch || touch.id !== event.pointerId) return;
    const x = event.clientX - touch.x;
    const y = event.clientY - touch.y;
    if (Math.abs(x) > 12 && Math.abs(x) > Math.abs(y)) {
      suppressClickUntil = Date.now() + 450;
      if (Math.abs(x) >= 32) show(index - Math.sign(x), true);
    }
    finishTouch();
  });
  element.addEventListener('pointercancel', finishTouch);
  element.addEventListener(
    'click',
    (event) => {
      if (event.detail !== 0 && Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { capture: true },
  );
  return { show };
}
