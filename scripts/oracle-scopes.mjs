/** Browser-serializable: required selectors must exist exactly once. */
export function inspectScopes(selectors) {
  return selectors.map((selector) => ({
    selector,
    count: document.querySelectorAll(selector).length,
  }));
}

export function requireScopes(results) {
  if (!results.length)
    throw new Error('No required oracle scopes were checked');
  const invalid = results.filter((result) => result.count !== 1);
  if (invalid.length)
    throw new Error(
      `Required oracle scopes must match exactly once: ${invalid.map((r) => `${r.selector} (${r.count})`).join(', ')}`,
    );
}
