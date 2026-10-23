interface ReadingItem {
  id: string;
  title: string;
  url: string;
  note: string;
  tags: string;
  read: boolean;
}

export function initPocketArchive(page: HTMLElement) {
  const tr = page.dataset.lang === 'tr';
  const locale = tr ? 'tr' : 'en';
  const storageKey = 'mebegu-pocket-archive-v1';
  const form = page.querySelector<HTMLFormElement>('[data-archive-form]')!;
  const cards = page.querySelector<HTMLElement>('[data-archive-cards]')!;
  const search = page.querySelector<HTMLInputElement>('[data-archive-search]')!;
  const message = page.querySelector<HTMLElement>('[data-archive-message]')!;
  const filters = [
    ...page.querySelectorAll<HTMLButtonElement>('[data-archive-filter]'),
  ];
  let filter = 'all';
  const safeUrl = (value: string) => {
    try {
      const url = new URL(value, window.location.href);
      return ['https:', 'http:'].includes(url.protocol) &&
        !url.username &&
        !url.password
        ? url.href
        : null;
    } catch {
      return null;
    }
  };
  const validItem = (item: unknown): item is ReadingItem => {
    if (!item || typeof item !== 'object') return false;
    const value = item as ReadingItem;
    return (
      ['id', 'title', 'url', 'note', 'tags'].every(
        (key) => typeof value[key as keyof ReadingItem] === 'string',
      ) &&
      value.id.length > 0 &&
      value.id.length <= 100 &&
      value.title.trim().length > 0 &&
      value.title.length <= 160 &&
      value.note.length <= 1000 &&
      value.tags.length <= 160 &&
      value.url.length <= 2000 &&
      typeof value.read === 'boolean' &&
      !!safeUrl(value.url)
    );
  };
  let items: ReadingItem[] = JSON.parse(page.dataset.seeds || '[]').filter(
    validItem,
  );
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      const parsed: unknown = JSON.parse(stored);
      if (
        !Array.isArray(parsed) ||
        parsed.length > 1000 ||
        !parsed.every(validItem) ||
        new Set(parsed.map((item) => item.id)).size !== parsed.length
      )
        throw Error('Invalid archive');
      items = parsed;
    }
  } catch {
    message.textContent = tr
      ? 'Kayıtlı arşiv okunamadı. Bu oturumda başlayabilir, çıkmadan JSON indirebilirsin.'
      : 'The saved archive could not be read. You can use this session and export JSON before leaving.';
  }
  function persist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
      return true;
    } catch {
      message.textContent = tr
        ? 'Tarayıcı kaydı kullanılamıyor. Çıkmadan arşivini JSON olarak indir.'
        : 'Browser storage is unavailable. Export your archive as JSON before leaving.';
      return false;
    }
  }
  function render() {
    const query = search.value.trim().toLocaleLowerCase(locale);
    const visible = items.filter(
      (item) =>
        (filter === 'all' || (filter === 'read' ? item.read : !item.read)) &&
        `${item.title} ${item.note} ${item.tags}`
          .toLocaleLowerCase(locale)
          .includes(query),
    );
    cards.replaceChildren();
    page.querySelector<HTMLElement>('[data-archive-count]')!.textContent =
      `${visible.length} ${tr ? 'kayıt' : visible.length === 1 ? 'link' : 'links'}`;
    page.querySelector<HTMLElement>('[data-archive-empty]')!.hidden =
      visible.length !== 0;
    for (const item of visible) {
      const card = document.createElement('article');
      card.className = 'archive-card';
      const topline = document.createElement('div');
      topline.className = 'archive-card-topline';
      const domain = document.createElement('span');
      domain.textContent = new URL(safeUrl(item.url)!).hostname;
      const state = document.createElement('span');
      state.className = item.read ? 'archive-card-read' : '';
      state.textContent = item.read
        ? tr
          ? 'Okundu'
          : 'Read'
        : tr
          ? 'Sırada'
          : 'To read';
      topline.append(domain, state);
      const heading = document.createElement('h3');
      const anchor = document.createElement('a');
      anchor.textContent = item.title;
      anchor.href = safeUrl(item.url)!;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      heading.append(anchor);
      const note = document.createElement('p');
      note.textContent = item.note;
      const tags = document.createElement('div');
      tags.className = 'archive-card-tags';
      for (const tag of item.tags
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean)) {
        const chip = document.createElement('span');
        chip.textContent = tag;
        tags.append(chip);
      }
      const actions = document.createElement('div');
      actions.className = 'archive-card-actions';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.textContent = item.read
        ? tr
          ? 'Sıraya geri koy'
          : 'Put back in queue'
        : tr
          ? 'Okundu işaretle'
          : 'Mark as read';
      toggle.setAttribute('aria-label', `${toggle.textContent}: ${item.title}`);
      toggle.addEventListener('click', () => {
        item.read = !item.read;
        const saved = persist();
        render();
        if (saved)
          message.textContent = tr
            ? 'Okuma durumu kaydedildi.'
            : 'Reading status saved.';
        cards.querySelector<HTMLButtonElement>('button')?.focus();
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = tr ? 'Kaldır' : 'Remove';
      remove.setAttribute('aria-label', `${remove.textContent}: ${item.title}`);
      remove.addEventListener('click', () => {
        items = items.filter((entry) => entry.id !== item.id);
        const saved = persist();
        render();
        if (saved)
          message.textContent = tr ? 'Bağlantı kaldırıldı.' : 'Link removed.';
        (cards.querySelector<HTMLButtonElement>('button') || search).focus();
      });
      actions.append(toggle, remove);
      card.append(topline, heading, note, tags, actions);
      cards.append(card);
    }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const url = safeUrl(String(data.get('url') || ''));
    const title = String(data.get('title') || '').trim();
    if (!url || !title) {
      message.textContent = tr
        ? 'Bir başlık ve geçerli bir web bağlantısı gir.'
        : 'Enter a title and a valid web link.';
      return;
    }
    if (items.length >= 1000) {
      message.textContent = tr
        ? 'Arşiv doldu. Bazı kayıtları dışa aktarıp kaldırabilirsin.'
        : 'The archive is full. Export and remove some entries first.';
      return;
    }
    const item = {
      id: crypto.randomUUID(),
      title,
      url,
      note: String(data.get('note') || '').trim(),
      tags: String(data.get('tags') || '').trim(),
      read: false,
    };
    if (!validItem(item)) {
      message.textContent = tr
        ? 'Girdi uzunluklarını ve bağlantıyı kontrol et.'
        : 'Check the field lengths and link.';
      return;
    }
    items.unshift(item);
    const saved = persist();
    form.reset();
    search.value = '';
    filter = 'all';
    updateFilters();
    render();
    if (saved)
      message.textContent = tr
        ? 'Bağlantı arşivine eklendi.'
        : 'Link saved to your archive.';
  });
  function updateFilters() {
    filters.forEach((button) =>
      button.setAttribute(
        'aria-pressed',
        String(button.dataset.archiveFilter === filter),
      ),
    );
  }
  filters.forEach((button) =>
    button.addEventListener('click', () => {
      filter = button.dataset.archiveFilter!;
      updateFilters();
      render();
    }),
  );
  search.addEventListener('input', render);
  page
    .querySelector<HTMLButtonElement>('[data-archive-export]')!
    .addEventListener('click', () => {
      const url = URL.createObjectURL(
        new Blob(
          [JSON.stringify({ schemaVersion: 1, items }, null, 2) + '\n'],
          { type: 'application/json' },
        ),
      );
      const download = document.createElement('a');
      download.href = url;
      download.download = 'pocket-archive.json';
      document.body.append(download);
      download.click();
      download.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      message.textContent = tr
        ? 'Arşiv JSON dosyası olarak indirildi.'
        : 'Your archive was exported as JSON.';
    });
  render();
}
