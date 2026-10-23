import { createHash, randomUUID } from 'node:crypto';
import { lstat, readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  comparePublication,
  stableJson,
  validatePublication,
} from './workshop-schema.mjs';

export const MAX_MANIFEST_BYTES = 256 * 1024;
export const MAX_ASSET_BYTES = 20 * 1024 * 1024;
export const MAX_BUNDLE_BYTES = 50 * 1024 * 1024;
const extensions = {
  screenshot: ['.png', '.jpg', '.jpeg', '.webp', '.avif'],
  gif: ['.gif'],
  video: ['.mp4', '.webm'],
  caption: ['.vtt'],
};
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function safeFile(root, relative, maxBytes) {
  if (
    !relative ||
    relative.includes('\\') ||
    relative
      .split('/')
      .some((part) => !part || part === '.' || part === '..') ||
    path.isAbsolute(relative)
  )
    throw Error('Invalid public file path');
  let current = path.resolve(root);
  const parts = relative.split('/');
  for (const part of ['', ...parts]) {
    if (part) current = path.join(current, part);
    const info = await lstat(current);
    if (info.isSymbolicLink())
      throw Error('Symlinks are not allowed in public publications');
    if (
      current !== path.join(path.resolve(root), ...parts) &&
      !info.isDirectory()
    )
      throw Error('Invalid public directory');
  }
  const info = await lstat(current);
  if (!info.isFile() || info.size > maxBytes)
    throw Error('Public file is missing, unsupported or too large');
  return readFile(current);
}

export function normalizeProject(project) {
  return {
    technologies: [],
    media: [],
    links: [],
    visual:
      project.kind === 'games'
        ? 'world'
        : project.kind === 'experiments'
          ? 'shader'
          : project.kind === 'apps'
            ? 'app'
            : 'tool',
    ...project,
    placeholder: false,
  };
}

/** Reads only the explicit public manifest and its referenced media. No repo scan. */
export async function preparePublication(sourceDirectory, expectedId) {
  const bytes = await safeFile(
    sourceDirectory,
    'project.json',
    MAX_MANIFEST_BYTES,
  );
  let input;
  try {
    input = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw Error('Public project.json is not valid JSON');
  }
  validatePublication(input);
  if (input.project.id !== expectedId)
    throw Error('Public project id does not match the configured project-id');
  if (!input.publish)
    return { skipped: true, reason: 'disabled', id: expectedId };
  const project = normalizeProject(structuredClone(input.project));
  const assets = new Map();
  let totalBytes = 0;
  async function asset(value, role) {
    if (/^https:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.username || url.password)
        throw Error('Media URL credentials are not allowed');
      return value;
    }
    if (!/^media\/(?:[a-z\d_-]+\/)*[a-z\d][a-z\d._-]*$/i.test(value))
      throw Error('Local media must be inside the public media/ directory');
    const extension = path.extname(value).toLowerCase();
    if (!extensions[role].includes(extension))
      throw Error(`Unsupported ${role} file extension`);
    const content = await safeFile(sourceDirectory, value, MAX_ASSET_BYTES);
    const destination = `media/projects/${expectedId}/${digest(content)}${extension}`;
    if (!assets.has(destination)) {
      totalBytes += content.length;
      if (totalBytes > MAX_BUNDLE_BYTES)
        throw Error(
          'Public media bundle is too large; use durable external video URLs',
        );
      assets.set(destination, content);
    }
    return destination;
  }
  for (const media of project.media) {
    media.src = await asset(media.src, media.type);
    if (media.poster) media.poster = await asset(media.poster, 'screenshot');
    for (const caption of media.captions || [])
      caption.src = await asset(caption.src, 'caption');
  }
  const record = {
    $schema: '../../../schemas/workshop-publication.schema.json',
    schemaVersion: 1,
    publish: true,
    revision: input.revision,
    project,
  };
  validatePublication(record);
  const json = stableJson(record);
  if (Buffer.byteLength(json) > MAX_MANIFEST_BYTES)
    throw Error('Normalized public manifest is too large');
  return { skipped: false, id: expectedId, record, assets, json };
}

/** Also checks generated asset boundaries and content hashes during site CI. */
export async function checkStoredPublication(record, siteDirectory, fileId) {
  validatePublication(record);
  if (!record.publish || record.project.id !== fileId)
    throw Error('Stored publication id or publish flag is invalid');
  const project = normalizeProject(record.project);
  for (const media of project.media) {
    for (const value of [
      media.src,
      media.poster,
      ...(media.captions || []).map((item) => item.src),
    ].filter(Boolean)) {
      if (/^https:\/\//i.test(value)) {
        const url = new URL(value);
        if (url.username || url.password)
          throw Error('Media URL credentials are not allowed');
        continue;
      }
      const prefix = `media/projects/${fileId}/`;
      if (
        !value.startsWith(prefix) ||
        !/^[a-f\d]{64}\.[a-z\d]+$/.test(value.slice(prefix.length))
      )
        throw Error('Stored media escapes its project directory');
      const bytes = await safeFile(
        path.join(siteDirectory, 'public'),
        value,
        MAX_ASSET_BYTES,
      );
      if (digest(bytes) !== path.basename(value).split('.')[0])
        throw Error('Stored media content hash does not match');
    }
  }
}

async function ensureDirectory(root, relative) {
  let current = path.resolve(root);
  for (const part of ['', ...relative.split('/')]) {
    if (part) current = path.join(current, part);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink() || !info.isDirectory())
        throw Error('Destination must contain only real directories');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await mkdir(current);
    }
  }
}

export async function importPublication(bundle, siteDirectory, dryRun = false) {
  if (bundle.skipped)
    return { changed: false, reason: bundle.reason, id: bundle.id };
  const relative = `src/data/projects/${bundle.id}.json`;
  let existing;
  try {
    existing = JSON.parse(
      (await safeFile(siteDirectory, relative, MAX_MANIFEST_BYTES)).toString(
        'utf8',
      ),
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const action = comparePublication(bundle.record, existing);
  if (action !== 'update')
    return { changed: false, reason: action, id: bundle.id };
  if (dryRun)
    return {
      changed: true,
      reason: 'dry-run',
      id: bundle.id,
      assets: bundle.assets.size,
    };
  // Validate all input before creating destinations; publish JSON last.
  await ensureDirectory(siteDirectory, 'src/data/projects');
  if (bundle.assets.size)
    await ensureDirectory(siteDirectory, `public/media/projects/${bundle.id}`);
  for (const [asset, bytes] of bundle.assets) {
    const destination = path.join(siteDirectory, 'public', asset);
    try {
      await writeFile(destination, bytes, { flag: 'wx' });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const existingBytes = await safeFile(
        path.join(siteDirectory, 'public'),
        asset,
        MAX_ASSET_BYTES,
      );
      if (digest(existingBytes) !== digest(bytes))
        throw Error('Existing public asset is corrupt');
    }
  }
  const target = path.join(siteDirectory, relative);
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, bundle.json, { flag: 'wx' });
  await rename(temporary, target);
  return {
    changed: true,
    reason: 'updated',
    id: bundle.id,
    assets: bundle.assets.size,
  };
}
