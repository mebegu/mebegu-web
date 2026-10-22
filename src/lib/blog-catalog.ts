import { initBlogBanner } from './blog-banner';

/** Lightweight carousel and native shelf scrolling; cards themselves are CSS + links. */
export function initBlogCatalog(catalog: HTMLElement) {
  const featured = catalog.querySelector<HTMLElement>('.catalog-featured')!;
  const slides = [...featured.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [
    ...featured.querySelectorAll<HTMLButtonElement>('[data-slide-to]'),
  ];
  const pause =
    featured.querySelector<HTMLButtonElement>('[data-slide-pause]')!;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = motion.matches;
  let gestureBusy = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const banner = initBlogBanner(
    featured,
    slides.length,
    updateActive,
    (busy) => {
      gestureBusy = busy;
      schedule();
    },
    () => motion.matches,
  );

  function schedule() {
    clearTimeout(timer);
    if (
      paused ||
      gestureBusy ||
      document.hidden ||
      slides.length < 2 ||
      featured.querySelector('[data-feature-copy]:hover') ||
      featured.contains(document.activeElement)
    )
      return;
    timer = setTimeout(() => show(current + 1), 6500);
  }
  function show(index: number, manual = false) {
    banner.show(index, manual);
  }
  function updateActive(index: number, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
      slide.inert = i !== current;
    });
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (manual)
      featured.querySelector('[data-slide-status]')!.textContent =
        `${current + 1} / ${slides.length}: ${slides[current].querySelector('h2')!.textContent}`;
    schedule();
  }
  function updatePause() {
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute(
      'aria-label',
      (paused ? pause.dataset.playLabel : pause.dataset.pauseLabel)!,
    );
    schedule();
  }
  featured.querySelector<HTMLElement>('[data-feature-controls]')!.hidden =
    false;
  featured
    .querySelector('[data-slide-prev]')!
    .addEventListener('click', () => show(current - 1, true));
  featured
    .querySelector('[data-slide-next]')!
    .addEventListener('click', () => show(current + 1, true));
  dots.forEach((dot, index) =>
    dot.addEventListener('click', () => show(index, true)),
  );
  pause.addEventListener('click', () => {
    paused = !paused;
    updatePause();
  });
  featured.querySelectorAll('[data-feature-copy]').forEach((copy) => {
    copy.addEventListener('mouseenter', schedule);
    copy.addEventListener('mouseleave', schedule);
  });
  featured.addEventListener('focusin', schedule);
  featured.addEventListener('focusout', () => queueMicrotask(schedule));
  updateActive(0);
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => {
    if (motion.matches) {
      paused = true;
      updatePause();
    }
  });
  catalog.querySelectorAll<HTMLElement>('[data-shelf]').forEach((shelf) => {
    const track = shelf.querySelector<HTMLElement>('[data-shelf-track]')!;
    const previous =
      shelf.querySelector<HTMLButtonElement>('[data-shelf-prev]')!;
    const next = shelf.querySelector<HTMLButtonElement>('[data-shelf-next]')!;
    shelf.querySelector<HTMLElement>('[data-shelf-controls]')!.hidden = false;
    const update = () => {
      previous.disabled = track.scrollLeft <= 2;
      next.disabled =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const scroll = (direction: number) =>
      track.scrollBy({
        left: direction * track.clientWidth * 0.85,
        behavior: motion.matches ? 'instant' : 'smooth',
      });
    previous.addEventListener('click', () => scroll(-1));
    next.addEventListener('click', () => scroll(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
  updatePause();
}
