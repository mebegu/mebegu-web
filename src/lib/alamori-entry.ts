const DURATION = 4400;
const smooth = (a: number, b: number, value: number) => {
  const p = Math.min(1, Math.max(0, (value - a) / (b - a)));
  return p * p * (3 - 2 * p);
};

/** The environment collapses around a stationary viewer, then resolves elsewhere. */
export function initMirrorArrival(overlay: HTMLElement) {
  const canvas = overlay.querySelector<HTMLCanvasElement>(
    '[data-arrival-canvas]',
  )!;
  const context = canvas.getContext('2d', { alpha: false });
  const skip = overlay.querySelector<HTMLButtonElement>('[data-arrival-skip]')!;
  const place = overlay.querySelector<HTMLElement>('[data-arrival-place]')!;
  const replay = document.querySelector<HTMLButtonElement>(
    '[data-alamori-entry-replay]',
  );
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = false;
  let frame = 0;
  let guard = 0;
  let generation = 0;
  let width = 0;
  let height = 0;
  let scale = 1;
  let focusBefore: HTMLElement | null = null;
  let replaying = false;
  let overflowBefore = '';
  let blocked: { element: HTMLElement; inert: boolean }[] = [];
  let images: Promise<[HTMLImageElement, HTMLImageElement]> | undefined;

  const finish = (focus = true) => {
    generation++;
    cancelAnimationFrame(frame);
    clearTimeout(guard);
    delete document.documentElement.dataset.alamoriEntry;
    if (!active) return;
    active = false;
    overlay.hidden = true;
    overlay.style.opacity = '';
    overlay.style.removeProperty('--entry-ink-opacity');
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

  const loadImages = () =>
    (images ??= Promise.all(
      [overlay.dataset.earth!, overlay.dataset.atlantis!].map(
        (src) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
              if (image.naturalWidth) resolve(image);
              else reject(Error('Empty scene'));
            };
            image.onerror = () => reject(Error('Scene unavailable'));
            image.src = src;
          }),
      ),
    ) as Promise<[HTMLImageElement, HTMLImageElement]>);

  function paint(image: HTMLImageElement, p: number, destination: boolean) {
    const ctx = context!;
    const fit = Math.max(
      width / image.naturalWidth,
      height / image.naturalHeight,
    );
    const imageWidth = image.naturalWidth * fit;
    const imageHeight = image.naturalHeight * fit;
    const x = (width - imageWidth) / 2;
    const y = (height - imageHeight) / 2;
    const collapse = destination ? 0 : smooth(0.43, 0.565, p);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    // No forward camera travel: the whole room loses its vertical dimension.
    ctx.scale(1 + collapse * 0.07, Math.max(0.001, 1 - collapse));
    ctx.translate(-width / 2, -height / 2);
    ctx.globalAlpha = destination
      ? smooth(0.61, 0.71, p)
      : 1 - smooth(0.555, 0.585, p);
    ctx.drawImage(image, x, y, imageWidth, imageHeight);

    if (!destination) {
      const light = smooth(0.02, 0.26, p) * (1 - collapse);
      const glow = ctx.createRadialGradient(
        width * 0.48,
        height * 0.44,
        0,
        width * 0.48,
        height * 0.44,
        width * 0.46,
      );
      glow.addColorStop(0, `rgba(215,164,75,${light * 0.075})`);
      glow.addColorStop(1, 'rgba(180,130,46,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);
      const align = smooth(0.13, 0.38, p);
      const mirrorX = x + imageWidth * 0.502;
      const mirrorY = y + imageHeight * 0.385;
      const spacing = imageWidth * 0.019;
      ctx.strokeStyle = '#e4c277';
      ctx.lineWidth = Math.max(0.9, fit * 1.15);
      ctx.lineCap = 'round';
      ctx.shadowColor = '#d1a44b';
      ctx.shadowBlur = 10 * align;
      for (let row = 0; row < 3; row++)
        for (let column = 0; column < 7; column++) {
          const index = row * 7 + column;
          const opacity =
            smooth(0.1 + index * 0.005, 0.25 + index * 0.005, p) *
            (1 - collapse) *
            0.85;
          ctx.globalAlpha = opacity;
          const gx = mirrorX + (column - 3) * spacing;
          const gy =
            mirrorY +
            (row - 1) * spacing * 1.45 +
            (1 - align) * Math.sin(index * 2.1) * spacing * 0.6;
          const size = spacing * 0.24;
          ctx.beginPath();
          const strokes = [
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
          ][(index * 5 + row) % 6];
          strokes.forEach(([px, py], i) => {
            if (i === 0) ctx.moveTo(gx + px * size, gy + py * size);
            else ctx.lineTo(gx + px * size, gy + py * size);
          });
          ctx.stroke();
        }
      ctx.globalAlpha = align * (1 - collapse) * 0.45;
      ctx.fillStyle = '#020605';
      ctx.beginPath();
      ctx.ellipse(
        mirrorX,
        mirrorY + spacing * 2.8,
        spacing * 0.7,
        spacing * 0.7,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  }

  const start = async (manual = false) => {
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
    const current = ++generation;
    resize();
    context.setTransform(scale, 0, 0, scale, 0, 0);
    context.fillStyle = '#080c0d';
    context.fillRect(0, 0, width, height);
    overlay.hidden = false;
    overlay.dataset.phase = 'loading';
    overlay.style.opacity = '1';
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
    guard = window.setTimeout(() => finish(), 6400);
    try {
      const scenes = await Promise.race([
        loadImages(),
        new Promise<never>((_, reject) =>
          window.setTimeout(() => reject(Error('Scene timeout')), 1500),
        ),
      ]);
      if (!active || current !== generation) return;
      const began = performance.now();
      const tick = (now: number) => {
        if (!active) return;
        const p = Math.min(1, (now - began) / DURATION);
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.globalAlpha = 1;
        context.filter = 'none';
        context.fillStyle = '#05090a';
        context.fillRect(0, 0, width, height);
        if (p < 0.6) paint(scenes[0], p, false);
        if (p >= 0.61) paint(scenes[1], p, true);
        // One muted seam, followed by a quiet dark interval; no bright strobe.
        if (p > 0.545 && p < 0.605) {
          const opacity = (1 - smooth(0.555, 0.605, p)) * 0.45;
          context.fillStyle = `rgba(220,191,132,${opacity})`;
          context.fillRect(0, height / 2, width, Math.max(1, height * 0.001));
        }
        overlay.dataset.phase =
          p < 0.13
            ? 'earth'
            : p < 0.43
              ? 'alignment'
              : p < 0.585
                ? 'collapse'
                : p < 0.61
                  ? 'threshold'
                  : p < 0.84
                    ? 'atlantis'
                    : 'reveal';
        place.textContent =
          p < 0.6
            ? overlay.dataset.earthLabel!
            : overlay.dataset.atlantisLabel!;
        const ink = 1 - smooth(0.39, 0.47, p) + smooth(0.69, 0.8, p);
        overlay.style.setProperty('--entry-ink-opacity', String(ink));
        overlay.style.opacity = String(1 - smooth(0.84, 1, p));
        if (p >= 1) finish();
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } catch {
      images = undefined;
      if (current === generation) finish();
    }
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
  replay?.addEventListener('click', () => {
    void start(true);
  });
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
  if (document.documentElement.dataset.alamoriEntry === 'pending') void start();
}
