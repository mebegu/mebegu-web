/** Progressive enhancement: without JS every project and section stays readable. */
export function initWorkshop(page: HTMLElement) {
  const entries = [
    ...page.querySelectorAll<HTMLElement>('[data-project-entry]'),
  ];
  const panels = [
    ...page.querySelectorAll<HTMLElement>('[data-project-panel]'),
  ];
  if (!entries.length) return;
  const detailArea = page.querySelector<HTMLElement>(
    '[data-project-detail-area]',
  )!;
  const kindButtons = [
    ...page.querySelectorAll<HTMLButtonElement>('[data-kind]'),
  ];
  const search = page.querySelector<HTMLInputElement>(
    '[data-workshop-search]',
  )!;
  const status = page.querySelector<HTMLSelectElement>(
    '[data-workshop-status]',
  )!;
  const count = page.querySelector<HTMLElement>('[data-workshop-count]')!;
  const announcement = page.querySelector<HTMLElement>(
    '[data-workshop-announcement]',
  )!;
  const more = page.querySelector<HTMLButtonElement>('[data-workshop-more]')!;
  const empty = page.querySelector<HTMLElement>('[data-workshop-empty]')!;
  const narrow = window.matchMedia('(max-width: 760px)');
  const locale = page.dataset.lang === 'tr' ? 'tr' : 'en';
  let kind = 'all';
  let limit = 8;
  // Keep the initial mobile catalog scannable; an explicit choice opens it.
  let expanded = !narrow.matches;
  let selected: string | undefined = entries[0].dataset.projectEntry;
  const fold = (text: string) => text.toLocaleLowerCase(locale).trim();

  function stopMedia(container: HTMLElement) {
    container
      .querySelectorAll<HTMLVideoElement>('video')
      .forEach((video) => video.pause());
    container
      .querySelectorAll<HTMLImageElement>('[data-gif-poster]')
      .forEach((image) => {
        image.src = image.dataset.gifPoster!;
      });
    container
      .querySelectorAll<HTMLButtonElement>('[data-gif-toggle]')
      .forEach((button) => {
        button.setAttribute('aria-pressed', 'false');
        button.textContent = button.dataset.play!;
      });
  }

  function showSelection(announce = false) {
    for (const panel of panels) {
      const active = panel.dataset.projectPanel === selected;
      if (!active || (narrow.matches && !expanded)) stopMedia(panel);
      panel.hidden = !active || (narrow.matches && !expanded);
      if (panel.parentElement !== detailArea) detailArea.append(panel);
    }
    const entry = entries.find(
      (entry) => entry.dataset.projectEntry === selected,
    );
    const panel = panels.find(
      (panel) => panel.dataset.projectPanel === selected,
    );
    if (narrow.matches && entry && panel) entry.append(panel);
    detailArea.hidden = narrow.matches || !panel;
    for (const item of entries) {
      const anchor = item.querySelector<HTMLAnchorElement>(
        '[data-project-select]',
      )!;
      const active = item === entry;
      if (active) anchor.setAttribute('aria-current', 'true');
      else anchor.removeAttribute('aria-current');
      if (narrow.matches)
        anchor.setAttribute('aria-expanded', String(active && expanded));
      else anchor.removeAttribute('aria-expanded');
      anchor.querySelector<HTMLElement>('.project-index-arrow')!.textContent =
        narrow.matches ? (active && expanded ? '−' : '+') : active ? '→' : '';
    }
    if (announce && panel)
      announcement.textContent = panel.querySelector('h2')!.textContent;
  }

  function rememberSelection() {
    const url = new URL(window.location.href);
    url.hash = selected ? `project-${selected}` : '';
    window.history.replaceState(null, '', url);
  }

  function filterProjects() {
    const query = fold(search.value);
    const matches = entries.filter(
      (entry) =>
        (kind === 'all' || entry.dataset.projectKind === kind) &&
        (status.value === 'all' ||
          entry.dataset.projectState === status.value) &&
        (!query || fold(entry.dataset.search || '').includes(query)),
    );
    if (!matches.some((entry) => entry.dataset.projectEntry === selected)) {
      selected = matches[0]?.dataset.projectEntry;
      expanded = !narrow.matches;
    }
    // A selected deep link should never sit behind the "show more" control.
    const selectedIndex = matches.findIndex(
      (entry) => entry.dataset.projectEntry === selected,
    );
    limit = Math.max(limit, selectedIndex + 1);
    const visible = matches.slice(0, limit);
    entries.forEach((entry) => {
      entry.hidden = !visible.includes(entry);
    });
    kindButtons.forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.kind === kind)),
    );
    more.hidden = visible.length >= matches.length;
    empty.hidden = matches.length !== 0;
    const countLabel =
      matches.length === 1
        ? count.dataset.countLabelSingular
        : count.dataset.countLabel;
    count.textContent = `${matches.length} ${countLabel}`;
    showSelection();
  }

  for (const panel of panels) {
    const tabs = [
      ...panel.querySelectorAll<HTMLButtonElement>('[data-project-tab]'),
    ];
    const sections = [
      ...panel.querySelectorAll<HTMLElement>('[data-project-section]'),
    ];
    const selectTab = (tab: HTMLButtonElement) => {
      tabs.forEach((button) => {
        button.setAttribute('aria-selected', String(button === tab));
        button.tabIndex = button === tab ? 0 : -1;
      });
      sections.forEach((section) => {
        section.hidden =
          section.dataset.projectSection !== tab.dataset.projectTab;
      });
    };
    sections.forEach((section) => {
      section.setAttribute('role', 'tabpanel');
      section.setAttribute(
        'aria-labelledby',
        `${panel.dataset.projectPanel}-tab-${section.dataset.projectSection}`,
      );
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(tab));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft')
          next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(tabs[next]);
        tabs[next].focus();
      });
    });
    if (tabs.length) selectTab(tabs[0]);
    const tabList = panel.querySelector<HTMLElement>('[data-project-tabs]');
    if (tabList) tabList.hidden = tabs.length < 2;

    const gallery = panel.querySelector<HTMLElement>('[data-project-gallery]')!;
    const media = [
      ...gallery.querySelectorAll<HTMLElement>('[data-media-item]'),
    ];
    const mediaButtons = [
      ...gallery.querySelectorAll<HTMLButtonElement>('[data-media-to]'),
    ];
    const selectMedia = (index: number) => {
      stopMedia(gallery);
      media.forEach((item, current) => {
        item.hidden = current !== index;
      });
      mediaButtons.forEach((button, current) =>
        button.setAttribute('aria-pressed', String(current === index)),
      );
    };
    if (media.length) selectMedia(0);
    mediaButtons.forEach((button) =>
      button.addEventListener('click', () =>
        selectMedia(Number(button.dataset.mediaTo)),
      ),
    );
    const mediaControls = gallery.querySelector<HTMLElement>(
      '[data-media-controls]',
    );
    if (mediaControls) mediaControls.hidden = false;
    gallery
      .querySelectorAll<HTMLButtonElement>('[data-gif-toggle]')
      .forEach((button) => {
        button.hidden = false;
        button.addEventListener('click', () => {
          const image =
            button.parentElement!.querySelector<HTMLImageElement>(
              '[data-gif-src]',
            )!;
          const playing = button.getAttribute('aria-pressed') !== 'true';
          image.src = playing
            ? image.dataset.gifSrc!
            : image.dataset.gifPoster!;
          button.setAttribute('aria-pressed', String(playing));
          button.textContent = (
            playing ? button.dataset.pause : button.dataset.play
          )!;
        });
      });
  }

  for (const entry of entries) {
    const anchor = entry.querySelector<HTMLAnchorElement>(
      '[data-project-select]',
    )!;
    anchor.addEventListener('click', (event) => {
      // Preserve ordinary open-in-new-tab/window and modified link behavior.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      expanded =
        narrow.matches && selected === anchor.dataset.projectSelect
          ? !expanded
          : true;
      selected = anchor.dataset.projectSelect;
      showSelection(true);
      rememberSelection();
      if (narrow.matches)
        anchor.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
  }
  kindButtons.forEach((button) =>
    button.addEventListener('click', () => {
      kind = button.dataset.kind!;
      limit = 8;
      filterProjects();
      rememberSelection();
    }),
  );
  search.addEventListener('input', () => {
    limit = 8;
    filterProjects();
  });
  status.addEventListener('change', () => {
    limit = 8;
    filterProjects();
    rememberSelection();
  });
  more.addEventListener('click', () => {
    limit += 8;
    filterProjects();
  });
  page
    .querySelector<HTMLButtonElement>('[data-workshop-reset]')!
    .addEventListener('click', () => {
      kind = 'all';
      search.value = '';
      status.value = 'all';
      limit = 8;
      filterProjects();
      rememberSelection();
    });
  function restoreHash() {
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1)).replace(
        /^project-/,
        '',
      );
    } catch {
      return;
    }
    if (!entries.some((entry) => entry.dataset.projectEntry === id)) return;
    kind = 'all';
    search.value = '';
    status.value = 'all';
    selected = id;
    expanded = true;
    filterProjects();
  }
  narrow.addEventListener('change', () => {
    expanded = true;
    showSelection();
  });
  window.addEventListener('hashchange', restoreHash);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) panels.forEach(stopMedia);
  });
  page.classList.add('is-enhanced');
  page.querySelector<HTMLElement>('[data-workshop-controls]')!.hidden = false;
  filterProjects();
  restoreHash();
}
