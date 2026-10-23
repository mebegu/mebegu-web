const DURATION = 4400;
const smooth = (a: number, b: number, value: number) => {
  const p = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return p * p * (3 - 2 * p);
};
const STROKES = [
  [
    [-0.8, 0.7],
    [0.1, -0.8],
    [0.6, -0.2],
    [-0.4, 0.2],
    [0.7, 0.8],
  ],
  [
    [-0.7, -0.7],
    [0.5, -0.4],
    [-0.2, 0.1],
    [0.6, 0.7],
    [-0.5, 0.7],
  ],
  [
    [-0.6, 0.8],
    [-0.6, -0.6],
    [0.6, 0],
    [-0.1, 0.4],
    [0.5, 0.8],
  ],
  [
    [-0.7, -0.6],
    [0.7, -0.1],
    [-0.6, 0.5],
    [0.2, 0.9],
    [0.2, -0.7],
  ],
  [
    [-0.6, 0.5],
    [0.1, 0.8],
    [0.6, -0.4],
    [-0.4, -0.8],
    [0.1, 0.1],
  ],
  [
    [-0.7, -0.5],
    [-0.1, 0.1],
    [0.5, -0.7],
    [0.3, 0.8],
    [-0.5, 0.4],
  ],
];

/** A fabricated mirror over the real page; no camera or scene media. */
export function initMirrorArrival(overlay: HTMLElement) {
  const canvas = overlay.querySelector<HTMLCanvasElement>(
    '[data-arrival-canvas]',
  )!;
  const context = canvas.getContext('2d');
  const skip = overlay.querySelector<HTMLButtonElement>('[data-arrival-skip]')!;
  const replay = document.querySelector<HTMLButtonElement>(
    '[data-alamori-entry-replay]',
  );
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let frame = 0;
  let guard = 0;
  let width = 0;
  let height = 0;
  let scale = 1;
  let focusBefore: HTMLElement | null = null;
  let replaying = false;
  let overflowBefore = '';
  let blocked: { element: HTMLElement; inert: boolean }[] = [];

  const finish = (focus = true) => {
    cancelAnimationFrame(frame);
    clearTimeout(guard);
    delete document.documentElement.dataset.alamoriEntry;
    if (!active) return;
    active = false;
    overlay.hidden = true;
    overlay.removeAttribute('style');
    overlay.dataset.phase = 'finished';
    document.documentElement.style.overflow = overflowBefore;
    blocked.forEach(({ element, inert }) => {
      element.inert = inert;
    });
    blocked = [];
    canvas.width = canvas.height = 1;
    if (focus) {
      if (replaying && focusBefore?.isConnected)
        focusBefore.focus({ preventScroll: true });
      else {
        const heading = document.querySelector<HTMLElement>(
          '.alamori-heading h1',
        );
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }
    }
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    scale = Math.min(
      devicePixelRatio || 1,
      1.5,
      Math.sqrt(1_600_000 / (width * height)),
    );
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
  };

  function paint(p: number, collapse: number) {
    const ctx = context!;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const spacing = Math.min(width * 0.084, height * 0.065, 54);
    const align = smooth(0.18, 0.4, p);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(1 + collapse * 0.035, Math.max(0.001, 1 - collapse));
    ctx.strokeStyle = '#f1d39b';
    ctx.lineWidth = Math.max(1, spacing * 0.026);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#e7b963';
    ctx.shadowBlur = 12;
    // Three rows settle around a central opening, rather than orbiting as text.
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (row === 1 && col >= 3 && col <= 5) continue;
        const index = row * 9 + col;
        const appear = smooth(0.045 + index * 0.003, 0.18 + index * 0.003, p);
        ctx.globalAlpha = appear * (1 - smooth(0.69, 0.76, p)) * 0.88;
        const x =
          (col - 4) * spacing +
          (1 - align) * Math.sin(index * 2.1) * spacing * 0.6;
        const y =
          (row - 1) * spacing * 1.45 +
          (1 - align) * Math.cos(index * 1.7) * spacing * 0.8;
        const size = spacing * 0.22;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((1 - align) * Math.sin(index) * 0.45);
        ctx.beginPath();
        STROKES[(index * 5 + row) % STROKES.length].forEach(([sx, sy], i) => {
          if (i === 0) ctx.moveTo(sx * size, sy * size);
          else ctx.lineTo(sx * size, sy * size);
        });
        ctx.stroke();
        ctx.restore();
      }
    }
    // A small golden curl completes in the centre. It never becomes a tunnel.
    const curl = smooth(0.29, 0.54, p);
    const radius = spacing * 0.55;
    ctx.globalAlpha = smooth(0.28, 0.36, p) * (1 - smooth(0.68, 0.76, p));
    ctx.lineWidth = Math.max(1, spacing * 0.022);
    ctx.beginPath();
    const end = Math.PI * 2.6 * curl;
    for (let step = 0; step <= 100; step++) {
      const angle = (end * step) / 100;
      const r = radius * (0.2 + (0.8 * angle) / (Math.PI * 2.6));
      const x = Math.cos(angle - Math.PI / 2) * r;
      const y = Math.sin(angle - Math.PI / 2) * r;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    if (p > 0.715 && p < 0.84) {
      const opacity = smooth(0.715, 0.755, p) * (1 - smooth(0.78, 0.84, p));
      ctx.globalAlpha = opacity * 0.65;
      ctx.strokeStyle = '#e5c48b';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#e7b963';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      const gap = smooth(0.775, 0.83, p) * width * 0.18;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width / 2 - gap, height / 2);
      ctx.moveTo(width / 2 + gap, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  const start = (manual = false) => {
    if (active || !context || motion.matches || document.hidden) {
      if (!active) finish(false);
      return;
    }
    active = true;
    replaying = manual;
    focusBefore = manual
      ? (replay ?? null)
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    resize();
    overlay.hidden = false;
    overlay.dataset.phase = 'glass';
    overlay.style.setProperty('--entry-collapse', '1');
    overlay.style.setProperty('--entry-glass-opacity', '1');
    overlay.style.setProperty('--entry-ink-opacity', '1');
    document.documentElement.dataset.alamoriEntry = 'running';
    overflowBefore = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    blocked = [...document.body.children]
      .filter(
        (element): element is HTMLElement =>
          element instanceof HTMLElement &&
          element !== overlay &&
          !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName),
      )
      .map((element) => ({ element, inert: element.inert }));
    blocked.forEach(({ element }) => {
      element.inert = true;
    });
    skip.focus({ preventScroll: true });
    guard = window.setTimeout(() => finish(), 6000);
    const began = performance.now();
    const tick = (now: number) => {
      if (!active) return;
      try {
        const p = Math.min(1, (now - began) / DURATION);
        const collapse = smooth(0.59, 0.76, p);
        paint(p, collapse);
        overlay.style.setProperty(
          '--entry-collapse',
          String(Math.max(0.001, 1 - collapse)),
        );
        overlay.style.setProperty(
          '--entry-glass-opacity',
          String(1 - smooth(0.75, 0.82, p)),
        );
        overlay.style.setProperty(
          '--entry-ink-opacity',
          String(1 - smooth(0.51, 0.59, p)),
        );
        overlay.style.opacity = String(1 - smooth(0.84, 1, p));
        overlay.dataset.phase =
          p < 0.18
            ? 'glass'
            : p < 0.4
              ? 'alignment'
              : p < 0.59
                ? 'spiral'
                : p < 0.76
                  ? 'collapse'
                  : p < 0.84
                    ? 'threshold'
                    : 'reveal';
        if (p >= 1) finish();
        else frame = requestAnimationFrame(tick);
      } catch {
        finish();
      }
    };
    frame = requestAnimationFrame(tick);
  };

  skip.addEventListener('click', () => finish());
  overlay.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      finish();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      skip.focus();
    }
  });
  replay?.addEventListener('click', () => start(true));
  const updateMotion = () => {
    if (replay) replay.hidden = motion.matches || !context;
    if (motion.matches) finish(false);
  };
  motion.addEventListener('change', updateMotion);
  window.addEventListener('resize', () => {
    if (active) resize();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) finish(false);
  });
  window.addEventListener('pagehide', () => finish(false));
  window.addEventListener('hashchange', () => finish(false));
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) finish(false);
  });
  updateMotion();
  if (document.documentElement.dataset.alamoriEntry === 'pending') start();
}
