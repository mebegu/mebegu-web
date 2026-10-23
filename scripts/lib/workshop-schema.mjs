import schema from '../../schemas/workshop-publication.schema.json' with { type: 'json' };

// Only the keywords used by our versioned, local schema are interpreted.
function inspect(value, rule, at) {
  if (rule.$ref)
    return inspect(value, schema.$defs[rule.$ref.split('/').at(-1)], at);
  if (rule.anyOf) {
    if (!rule.anyOf.some((option) => inspect(value, option, at).length === 0))
      return [`${at}: invalid shape`];
    return [];
  }
  const errors = [];
  if (Object.hasOwn(rule, 'const') && value !== rule.const)
    errors.push(`${at}: unexpected constant`);
  if (rule.enum && !rule.enum.includes(value))
    errors.push(`${at}: unsupported value`);
  if (rule.type) {
    const valid =
      rule.type === 'object'
        ? value !== null && typeof value === 'object' && !Array.isArray(value)
        : rule.type === 'array'
          ? Array.isArray(value)
          : rule.type === 'integer'
            ? Number.isSafeInteger(value)
            : rule.type === 'null'
              ? value === null
              : typeof value === rule.type;
    if (!valid) return [`${at}: expected ${rule.type}`];
  }
  if (rule.type === 'object') {
    for (const key of rule.required || [])
      if (!Object.hasOwn(value, key)) errors.push(`${at}.${key}: required`);
    for (const [key, item] of Object.entries(value)) {
      if (!Object.hasOwn(rule.properties || {}, key))
        errors.push(`${at}: unknown field`);
      else errors.push(...inspect(item, rule.properties[key], `${at}.${key}`));
    }
  }
  if (Array.isArray(value) && rule.items) {
    if (rule.maxItems !== undefined && value.length > rule.maxItems)
      errors.push(`${at}: too many items`);
    value.forEach((item, index) =>
      errors.push(...inspect(item, rule.items, `${at}[${index}]`)),
    );
  }
  if (typeof value === 'string') {
    if (rule.minLength !== undefined && value.trim().length < rule.minLength)
      errors.push(`${at}: empty text`);
    if (rule.maxLength !== undefined && value.length > rule.maxLength)
      errors.push(`${at}: text too long`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value))
      errors.push(`${at}: invalid format`);
    if (
      rule.format === 'date' &&
      (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !Number.isFinite(Date.parse(value)) ||
        new Date(value).toISOString().slice(0, 10) !== value)
    )
      errors.push(`${at}: invalid date`);
  }
  if (
    typeof value === 'number' &&
    (value < rule.minimum || value > rule.maximum)
  )
    errors.push(`${at}: out of range`);
  return errors;
}

function publicLink(value, at) {
  if (value === null) return;
  if (typeof value === 'object') {
    publicLink(value.tr, `${at}.tr`);
    publicLink(value.en, `${at}.en`);
    return;
  }
  if (value !== value.trim() || /[\s\\\x00-\x1f]/.test(value))
    throw Error(`${at}: invalid URL`);
  if (/^https?:\/\//i.test(value)) {
    let url;
    try {
      url = new URL(value);
    } catch {
      throw Error(`${at}: invalid URL`);
    }
    if (url.username || url.password)
      throw Error(`${at}: URL credentials are not allowed`);
    return;
  }
  if (/^mailto:[^?]+(?:\?.*)?$/i.test(value)) return;
  if (
    /^[a-z\d][a-z\d._~!$&'()*+,;=@%/#?-]*$/i.test(value) &&
    !value.split(/[/?#]/).includes('..') &&
    !/^[a-z][a-z\d+.-]*:/i.test(value)
  )
    return;
  throw Error(`${at}: use a public HTTP(S), mailto or site-relative URL`);
}

export function validatePublication(value) {
  const errors = inspect(value, schema, 'publication');
  if (errors.length) throw Error(errors.slice(0, 8).join('\n'));
  const project = value.project;
  for (const [field, items] of [
    ['links', project.links],
    ['articles', project.articles],
    ['participation', project.participation],
  ]) {
    (items || []).forEach((item, index) =>
      publicLink(item.url, `project.${field}[${index}].url`),
    );
  }
  return value;
}

export function stableJson(value) {
  const sorted = (item) =>
    Array.isArray(item)
      ? item.map(sorted)
      : item !== null && typeof item === 'object'
        ? Object.fromEntries(
            Object.keys(item)
              .sort()
              .map((key) => [key, sorted(item[key])]),
          )
        : item;
  return JSON.stringify(sorted(value), null, 2) + '\n';
}

export function comparePublication(incoming, existing) {
  if (!existing) return 'update';
  validatePublication(existing);
  if (existing.project.id !== incoming.project.id)
    throw Error('Stored project identity does not match');
  if (incoming.revision < existing.revision) return 'stale';
  if (incoming.revision === existing.revision) {
    if (stableJson(incoming) !== stableJson(existing))
      throw Error(
        'Public content changed: increment revision before publishing',
      );
    return 'unchanged';
  }
  return 'update';
}
