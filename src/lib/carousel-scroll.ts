/** Keep controls and autoplay in sync with the browser's native horizontal scroll. */
export function initCarouselScroll(
  track: HTMLElement,
  count: number,
  onChange: (index: number, manual: boolean) => void,
  setBusy: (busy: boolean) => void,
  reducedMotion: () => boolean,
) {
  let index = 0;
  let programmatic = false;
  let announce = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  function sync() {
    if (!track.clientWidth) return;
    const next = Math.max(
      0,
      Math.min(count - 1, Math.round(track.scrollLeft / track.clientWidth)),
    );
    if (next !== index) {
      index = next;
      onChange(index, announce);
    }
  }
  function settle() {
    clearTimeout(timer);
    sync();
    programmatic = false;
    announce = true;
    setBusy(false);
  }
  function waitForScroll() {
    setBusy(true);
    clearTimeout(timer);
    // scrollend is not available in every browser; the quiet timeout is a fallback.
    timer = setTimeout(settle, 200);
  }
  track.addEventListener(
    'scroll',
    () => {
      waitForScroll();
      if (!programmatic) sync();
    },
    { passive: true },
  );
  track.addEventListener('scrollend', settle);
  track.addEventListener(
    'wheel',
    (event) => {
      if (event.ctrlKey || (!event.deltaX && !event.shiftKey)) return;
      programmatic = false;
      announce = true;
      waitForScroll();
    },
    { passive: true },
  );
  track.addEventListener(
    'pointerdown',
    () => {
      programmatic = false;
      announce = true;
      waitForScroll();
    },
    { passive: true },
  );
  return {
    show(next: number, manual = false, instant = false) {
      index = ((next % count) + count) % count;
      programmatic = true;
      announce = manual;
      waitForScroll();
      onChange(index, manual);
      track.scrollTo({
        left: index * track.clientWidth,
        behavior: instant || reducedMotion() ? 'instant' : 'smooth',
      });
    },
  };
}
