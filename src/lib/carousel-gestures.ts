/** One slide per horizontal gesture, including a touchpad's momentum tail. */
export function initCarouselGestures(
  element: HTMLElement,
  navigate: (direction: number) => void,
  setBusy: (busy: boolean) => void,
) {
  let wheelDistance = 0;
  let wheelLatched = false;
  let wheelTimer: ReturnType<typeof setTimeout> | undefined;
  let wheelBusy = false;
  let touch:
    { id: number; x: number; y: number; horizontal: boolean } | undefined;
  let suppressClickUntil = 0;
  const updateBusy = () => setBusy(wheelBusy || Boolean(touch));

  element.addEventListener(
    'wheel',
    (event) => {
      const mode = event.deltaMode;
      // Pinch-to-zoom emits wheel events with ctrlKey in desktop browsers.
      if (
        event.ctrlKey ||
        Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.25
      )
        return;
      if (event.cancelable) event.preventDefault();
      const unit = mode === 1 ? 16 : mode === 2 ? element.clientWidth : 1;
      wheelBusy = true;
      updateBusy();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelDistance = 0;
        wheelLatched = false;
        wheelBusy = false;
        updateBusy();
      }, 240);
      if (wheelLatched) return;
      wheelDistance += event.deltaX * unit;
      if (Math.abs(wheelDistance) >= 60) {
        wheelLatched = true;
        navigate(Math.sign(wheelDistance));
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
      // A second finger belongs to the browser's pinch gesture.
      finishTouch();
      return;
    }
    if ((event.target as Element).closest('button')) return;
    touch = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      horizontal: false,
    };
    updateBusy();
  });
  element.addEventListener(
    'pointermove',
    (event) => {
      if (!touch || touch.id !== event.pointerId) return;
      const x = Math.abs(event.clientX - touch.x);
      const y = Math.abs(event.clientY - touch.y);
      if (!touch.horizontal && y > 12 && y >= x) {
        finishTouch();
        return;
      }
      if (x > 12 && x > y * 1.25) touch.horizontal = true;
    },
    { passive: true },
  );
  element.addEventListener('pointerup', (event) => {
    if (!touch || touch.id !== event.pointerId) return;
    const x = event.clientX - touch.x;
    const y = event.clientY - touch.y;
    if (touch.horizontal) {
      // A drag starting on the article link must not also open a new tab.
      suppressClickUntil = Date.now() + 450;
      const threshold = Math.max(40, Math.min(80, element.clientWidth * 0.08));
      if (Math.abs(x) >= threshold && Math.abs(x) > Math.abs(y) * 1.25)
        navigate(-Math.sign(x));
    }
    finishTouch();
  });
  element.addEventListener('pointercancel', finishTouch);
  element.addEventListener(
    'click',
    (event) => {
      // Keyboard activation (detail === 0) remains available immediately.
      if (event.detail !== 0 && Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    { capture: true },
  );
}
