import { appendFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { preparePublication } from './lib/workshop-bundle.mjs';
import { comparePublication } from './lib/workshop-schema.mjs';

/** Atomic Git tree update. The target never needs access to the private repo. */
export async function publishPublication(
  bundle,
  { token, repository = 'mebegu/mebegu.github.io', fetchImpl = fetch } = {},
) {
  if (bundle.skipped)
    return { changed: false, reason: bundle.reason, id: bundle.id };
  if (!token)
    throw Error(
      'Set WORKSHOP_PUBLISH_TOKEN with Contents: write on the site repository',
    );
  if (!/^[a-z\d][a-z\d_.-]{0,99}\/[a-z\d][a-z\d_.-]{0,99}$/i.test(repository))
    throw Error('Invalid site repository');
  const root = `https://api.github.com/repos/${repository}`;
  async function request(method, endpoint, body, allowMissing = false) {
    const response = await fetchImpl(root + endpoint, {
      method,
      redirect: 'error',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2026-03-10',
        'Content-Type': 'application/json',
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    if (allowMissing && response.status === 404) return null;
    if (!response.ok) {
      const error = Error(
        `GitHub ${method} ${endpoint} failed (${response.status}); check the target token and branch rules`,
      );
      error.status = response.status;
      throw error;
    }
    return response.status === 204 ? null : response.json();
  }
  const projectFile = `src/data/projects/${bundle.id}.json`;
  const blobs = new Map();
  async function blob(bytes) {
    const content = Buffer.from(bytes).toString('base64');
    if (!blobs.has(content))
      blobs.set(
        content,
        (await request('POST', '/git/blobs', { content, encoding: 'base64' }))
          .sha,
      );
    return blobs.get(content);
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const head = (await request('GET', '/git/ref/heads/main')).object.sha;
    const current = await request(
      'GET',
      `/contents/${projectFile}?ref=${head}`,
      undefined,
      true,
    );
    let existing;
    if (current) {
      if (current.encoding !== 'base64' || typeof current.content !== 'string')
        throw Error('Unexpected stored publication response');
      try {
        existing = JSON.parse(
          Buffer.from(current.content, 'base64').toString('utf8'),
        );
      } catch {
        throw Error('Stored publication is not valid JSON');
      }
    }
    const action = comparePublication(bundle.record, existing);
    if (action !== 'update')
      return { changed: false, reason: action, id: bundle.id };
    const parent = await request('GET', `/git/commits/${head}`);
    const tree = [
      {
        path: projectFile,
        mode: '100644',
        type: 'blob',
        sha: await blob(bundle.json),
      },
    ];
    for (const [file, bytes] of bundle.assets)
      tree.push({
        path: `public/${file}`,
        mode: '100644',
        type: 'blob',
        sha: await blob(bytes),
      });
    const newTree = await request('POST', '/git/trees', {
      base_tree: parent.tree.sha,
      tree,
    });
    const commit = await request('POST', '/git/commits', {
      message: `chore(workshop): publish ${bundle.id} revision ${bundle.record.revision}`,
      tree: newTree.sha,
      parents: [head],
    });
    try {
      await request('PATCH', '/git/refs/heads/main', {
        sha: commit.sha,
        force: false,
      });
      return {
        changed: true,
        reason: 'published',
        id: bundle.id,
        revision: bundle.record.revision,
        commit: commit.sha,
      };
    } catch (error) {
      if (![409, 422].includes(error.status) || attempt === 3) throw error;
      // Another project may have published meanwhile. Re-read main, compare its
      // revision, and rebuild on the new tree; never force-push or overwrite it.
    }
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  try {
    const { values } = parseArgs({
      options: {
        source: { type: 'string' },
        id: { type: 'string' },
        repository: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
      },
    });
    if (!values.source || !values.id)
      throw Error('Use --source PUBLIC_DIRECTORY --id PUBLIC_ID [--dry-run]');
    const bundle = await preparePublication(
      path.resolve(values.source),
      values.id,
    );
    const result =
      values['dry-run'] && !bundle.skipped
        ? {
            changed: false,
            reason: 'dry-run',
            id: bundle.id,
            revision: bundle.record.revision,
            assets: bundle.assets.size,
          }
        : await publishPublication(bundle, {
            token: process.env.WORKSHOP_PUBLISH_TOKEN,
            repository: values.repository,
          });
    console.log(JSON.stringify(result));
    if (process.env.GITHUB_OUTPUT)
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `changed=${result.changed}\nproject-id=${result.id}\nreason=${result.reason}\n`,
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
