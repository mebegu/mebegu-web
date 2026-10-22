import { fanSector, fanTears } from './sky-layout';
import { initObserverTracking } from './observer-tracking';

/** One geometry update keeps the paint, torn paper and hit areas together. */
export function initNightInteractions(home: HTMLElement) {
  initObserverTracking(home);
  const links = [
    ...home.querySelectorAll<HTMLAnchorElement>('[data-sector-index]'),
  ];
  const panels = [
    ...home.querySelectorAll<SVGPolygonElement>('[data-sky-panel]'),
  ];
  const tears = [...home.querySelectorAll<SVGGElement>('[data-sky-tear]')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let weights = links.map(() => 1);
  let selected = -1;
  let frame = 0;

  const render = (values: number[]) => {
    links.forEach((link, index) => {
      const sector = fanSector(index, links.length, values);
      link.style.setProperty('--sector-clip', sector.clip);
      link.style.setProperty('--content-clip', sector.contentClip);
      panels[index]?.setAttribute('points', sector.points);
    });
    fanTears(links.length, values).forEach((tear, index) => {
      const group = tears[index];
      group
        ?.querySelector('[data-tear-paper]')
        ?.setAttribute('points', tear.paper);
      group
        ?.querySelectorAll('[data-tear-fiber]')
        .forEach((fiber, i) => fiber.setAttribute('d', tear.fibers[i]));
    });
  };

  const select = (index: number) => {
    if (index === selected) return;
    selected = index;
    panels.forEach((panel, i) =>
      panel.classList.toggle('is-active', i === index),
    );
    cancelAnimationFrame(frame);
    const from = [...weights];
    const target = links.map((_, i) => (i === index ? 1.18 : 1));
    if (motion.matches) {
      weights = target;
      render(weights);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / 520, 1);
      const ease = 1 - (1 - elapsed) ** 3;
      weights = target.map((value, i) => from[i] + (value - from[i]) * ease);
      render(weights);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
  };

  links.forEach((link, index) => {
    link.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') select(index);
    });
    link.addEventListener('pointerleave', () => {
      const focused = links.indexOf(
        document.activeElement as HTMLAnchorElement,
      );
      select(focused);
    });
    link.addEventListener('focus', () => select(index));
    link.addEventListener('blur', () => {
      const hovered = links.findIndex((item) => item.matches(':hover'));
      select(hovered);
    });
  });
  motion.addEventListener('change', () => {
    cancelAnimationFrame(frame);
    weights = links.map((_, i) => (i === selected ? 1.18 : 1));
    render(weights);
  });
}
