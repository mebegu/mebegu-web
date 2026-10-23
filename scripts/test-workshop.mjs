import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mkdtemp,
  mkdir,
  writeFile,
  readFile,
  rm,
  symlink,
  open,
} from 'node:fs/promises';
import path from 'node:path';
import {
  preparePublication,
  importPublication,
  checkStoredPublication,
  MAX_ASSET_BYTES,
} from './lib/workshop-bundle.mjs';
import { validatePublication } from './lib/workshop-schema.mjs';
import { publishPublication } from './publish-workshop.mjs';

const text = { tr: 'Herkese açık tanıtım', en: 'A public introduction' };
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aBp8AAAAASUVORK5CYII=',
  'base64',
);
function manifest() {
  return structuredClone({
    schemaVersion: 1,
    publish: true,
    revision: 1,
    project: {
      id: 'public-tool',
      kind: 'tools',
      status: 'in-progress',
      title: text,
      hook: text,
      description: text,
      media: [
        {
          type: 'screenshot',
          src: 'media/screen.png',
          width: 1,
          height: 1,
          alt: text,
        },
      ],
      links: [{ label: text, url: 'https://example.org/tool', primary: true }],
    },
  });
}
async function fixture(t) {
  const base = path.resolve('.local');
  await mkdir(base, { recursive: true });
  const root = await mkdtemp(path.join(base, 'workshop-test-'));
  t.after(async () => {
    assert.equal(path.dirname(root), base);
    assert.ok(path.basename(root).startsWith('workshop-test-'));
    await rm(root, { recursive: true, force: true });
  });
  const source = path.join(root, 'private-source', '.workshop', 'public');
  const site = path.join(root, 'site');
  await mkdir(path.join(source, 'media'), { recursive: true });
  await mkdir(site);
  await writeFile(
    path.join(root, 'private-source', 'README.md'),
    'PRIVATE_REPO_MARKER',
  );
  await writeFile(
    path.join(source, 'media', 'unused.txt'),
    'PRIVATE_UNUSED_FILE',
  );
  await writeFile(path.join(source, 'media', 'screen.png'), png);
  const input = manifest();
  const save = () =>
    writeFile(path.join(source, 'project.json'), JSON.stringify(input));
  await save();
  return { root, source, site, input, save };
}

test('only referenced public files are exported, with stable hash paths and no private source identifiers', async (t) => {
  const f = await fixture(t);
  const bundle = await preparePublication(f.source, 'public-tool');
  assert.equal(bundle.assets.size, 1);
  assert.match(
    bundle.record.project.media[0].src,
    /^media\/projects\/public-tool\/[a-f\d]{64}\.png$/,
  );
  assert.equal(bundle.record.project.placeholder, false);
  assert.deepEqual(bundle.record.project.technologies, []);
  assert.doesNotMatch(bundle.json, /PRIVATE_|private-source|screen\.png/);
  assert.equal(
    (await preparePublication(f.source, 'public-tool')).json,
    bundle.json,
  );
});

test('publish false performs no writes and does not need target credentials', async (t) => {
  const f = await fixture(t);
  f.input.publish = false;
  await f.save();
  const bundle = await preparePublication(f.source, 'public-tool');
  assert.deepEqual(await publishPublication(bundle), {
    changed: false,
    reason: 'disabled',
    id: 'public-tool',
  });
  assert.equal((await importPublication(bundle, f.site)).changed, false);
  await assert.rejects(
    readFile(path.join(f.site, 'src/data/projects/public-tool.json')),
    { code: 'ENOENT' },
  );
});

test('schema rejects unknown fields, malformed locales, invalid dates, unsafe URLs and id mismatch', async (t) => {
  const f = await fixture(t);
  const cases = [
    (value) => {
      value.privateRepo = 'PRIVATE_VALUE';
    },
    (value) => {
      value.project.internalNotes = 'PRIVATE_VALUE';
    },
    (value) => {
      delete value.project.title.en;
    },
    (value) => {
      value.project.updatedAt = '2026-02-30';
    },
    (value) => {
      value.project.status = [];
    },
    (value) => {
      value.project.links[0].url = 'javascript:alert(1)';
    },
    (value) => {
      value.project.links[0].url = 'https://user:secret@example.org';
    },
    (value) => {
      value.project.id = '../escape';
    },
  ];
  for (const mutate of cases) {
    const value = manifest();
    mutate(value);
    assert.throws(() => validatePublication(value));
  }
  await assert.rejects(
    preparePublication(f.source, 'another-project'),
    /id does not match/,
  );
});

test('media traversal, executable files and oversized referenced assets are rejected before publication', async (t) => {
  const f = await fixture(t);
  for (const src of [
    'media/../../README.md',
    '/etc/passwd',
    'media/script.svg',
    'media\\screen.png',
  ]) {
    f.input.project.media[0].src = src;
    await f.save();
    await assert.rejects(preparePublication(f.source, 'public-tool'));
  }
  const big = await open(path.join(f.source, 'media', 'large.png'), 'w');
  await big.truncate(MAX_ASSET_BYTES + 1);
  await big.close();
  f.input.project.media[0].src = 'media/large.png';
  await f.save();
  await assert.rejects(
    preparePublication(f.source, 'public-tool'),
    /too large/,
  );
});

test('symlinks cannot export a file outside the explicit public directory', async (t) => {
  const f = await fixture(t);
  const privateAssets = path.join(f.root, 'private-assets');
  await mkdir(privateAssets);
  await writeFile(path.join(privateAssets, 'secret.png'), 'PRIVATE_ASSET');
  try {
    await symlink(
      privateAssets,
      path.join(f.source, 'media', 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
  } catch (error) {
    if (['EPERM', 'EACCES'].includes(error.code)) {
      t.skip('This host does not permit creating symlinks');
      return;
    }
    throw error;
  }
  f.input.project.media[0].src = 'media/linked/secret.png';
  await f.save();
  await assert.rejects(preparePublication(f.source, 'public-tool'), /Symlinks/);
});

test('local import supports dry run, idempotency, newer revisions and stale/conflicting revisions', async (t) => {
  const f = await fixture(t);
  const first = await preparePublication(f.source, 'public-tool');
  assert.equal(
    (await importPublication(first, f.site, true)).reason,
    'dry-run',
  );
  await assert.rejects(
    readFile(path.join(f.site, 'src/data/projects/public-tool.json')),
    { code: 'ENOENT' },
  );
  assert.equal((await importPublication(first, f.site)).changed, true);
  assert.equal((await importPublication(first, f.site)).reason, 'unchanged');
  f.input.project.title = { tr: 'Yeni başlık', en: 'New title' };
  await f.save();
  await assert.rejects(
    importPublication(
      await preparePublication(f.source, 'public-tool'),
      f.site,
    ),
    /increment revision/,
  );
  f.input.revision = 2;
  await f.save();
  const second = await preparePublication(f.source, 'public-tool');
  assert.equal((await importPublication(second, f.site)).changed, true);
  assert.equal((await importPublication(first, f.site)).reason, 'stale');
  const stored = JSON.parse(
    await readFile(
      path.join(f.site, 'src/data/projects/public-tool.json'),
      'utf8',
    ),
  );
  assert.equal(stored.revision, 2);
  await checkStoredPublication(stored, f.site, 'public-tool');
});

test('failed bundle preparation leaves the existing project intact; stored media hashes are checked', async (t) => {
  const f = await fixture(t);
  const bundle = await preparePublication(f.source, 'public-tool');
  await importPublication(bundle, f.site);
  const file = path.join(f.site, 'src/data/projects/public-tool.json');
  const before = await readFile(file, 'utf8');
  f.input.revision = 2;
  f.input.project.media[0].src = 'media/missing.png';
  await f.save();
  await assert.rejects(preparePublication(f.source, 'public-tool'));
  assert.equal(await readFile(file, 'utf8'), before);
  await writeFile(
    path.join(f.site, 'public', bundle.record.project.media[0].src),
    'corrupt',
  );
  await assert.rejects(
    checkStoredPublication(bundle.record, f.site, 'public-tool'),
    /hash/,
  );
});

function fakeGit({ existing, race = false, newerOnRace } = {}) {
  const requests = [],
    blobs = new Map(),
    commits = new Map(),
    trees = new Map();
  let head = 'initial',
    current = existing,
    tree = 'initial-tree',
    serial = 0;
  const response = (status, data) => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => data,
  });
  const fetchImpl = async (url, options) => {
    const endpoint = new URL(url).pathname.replace(
      '/repos/mebegu/mebegu.github.io',
      '',
    );
    const body = options.body ? JSON.parse(options.body) : undefined;
    requests.push({ endpoint, method: options.method, body });
    if (endpoint === '/git/ref/heads/main')
      return response(200, { object: { sha: head } });
    if (endpoint.startsWith('/contents/'))
      return current
        ? response(200, {
            encoding: 'base64',
            content: Buffer.from(JSON.stringify(current)).toString('base64'),
          })
        : response(404, {});
    if (endpoint.startsWith('/git/commits/'))
      return response(200, { tree: { sha: tree } });
    if (endpoint === '/git/blobs') {
      const sha = `blob-${++serial}`;
      blobs.set(sha, Buffer.from(body.content, 'base64'));
      return response(201, { sha });
    }
    if (endpoint === '/git/trees') {
      const sha = `tree-${++serial}`;
      trees.set(sha, body);
      return response(201, { sha });
    }
    if (endpoint === '/git/commits') {
      const sha = `commit-${++serial}`;
      commits.set(sha, body);
      return response(201, { sha });
    }
    if (endpoint === '/git/refs/heads/main') {
      assert.equal(body.force, false);
      if (race) {
        race = false;
        head = 'other-publication';
        tree = 'other-tree';
        if (newerOnRace) current = newerOnRace;
        return response(422, {});
      }
      const commit = commits.get(body.sha);
      assert.deepEqual(commit.parents, [head]);
      const updatedTree = trees.get(commit.tree);
      assert.equal(updatedTree.base_tree, tree);
      current = JSON.parse(
        blobs.get(
          updatedTree.tree.find((item) => item.path.endsWith('.json')).sha,
        ),
      );
      head = body.sha;
      tree = commit.tree;
      return response(200, { object: { sha: head } });
    }
    throw Error('Unexpected API call');
  };
  return {
    fetchImpl,
    requests,
    blobs,
    get current() {
      return current;
    },
  };
}

test('API publisher creates one atomic commit containing only public data, then skips an identical replay', async (t) => {
  const f = await fixture(t),
    bundle = await preparePublication(f.source, 'public-tool'),
    api = fakeGit();
  const options = {
    token: 'TEST_TOKEN_DO_NOT_PUBLISH',
    fetchImpl: api.fetchImpl,
  };
  assert.equal((await publishPublication(bundle, options)).changed, true);
  assert.equal((await publishPublication(bundle, options)).reason, 'unchanged');
  assert.equal(api.requests.filter((r) => r.method === 'PATCH').length, 1);
  const tree = api.requests.find((r) => r.endpoint === '/git/trees').body;
  assert.equal(tree.tree.length, 2);
  assert.ok(
    tree.tree.every(
      (item) =>
        item.path.startsWith('src/data/projects/public-tool.') ||
        item.path.startsWith('public/media/projects/public-tool/'),
    ),
  );
  assert.doesNotMatch(
    [...api.blobs.values()].map((b) => b.toString()).join(''),
    /PRIVATE_|TEST_TOKEN|private-source/,
  );
});

test('concurrent project publication retries on the latest tree without force-pushing', async (t) => {
  const f = await fixture(t),
    bundle = await preparePublication(f.source, 'public-tool'),
    api = fakeGit({ race: true });
  assert.equal(
    (
      await publishPublication(bundle, {
        token: 'test',
        fetchImpl: api.fetchImpl,
      })
    ).changed,
    true,
  );
  const trees = api.requests.filter((r) => r.endpoint === '/git/trees');
  assert.equal(trees.length, 2);
  assert.equal(trees[1].body.base_tree, 'other-tree');
});

test('a newer revision arriving during an API retry is preserved', async (t) => {
  const f = await fixture(t),
    bundle = await preparePublication(f.source, 'public-tool');
  const newer = structuredClone(bundle.record);
  newer.revision = 2;
  const api = fakeGit({ race: true, newerOnRace: newer });
  assert.equal(
    (
      await publishPublication(bundle, {
        token: 'test',
        fetchImpl: api.fetchImpl,
      })
    ).reason,
    'stale',
  );
  assert.equal(api.current.revision, 2);
  assert.equal(api.requests.filter((r) => r.method === 'PATCH').length, 1);
});

test('missing credentials and protected-branch failures are explicit and never report a successful publish', async (t) => {
  const f = await fixture(t),
    bundle = await preparePublication(f.source, 'public-tool');
  await assert.rejects(publishPublication(bundle), /WORKSHOP_PUBLISH_TOKEN/);
  await assert.rejects(
    publishPublication(bundle, {
      token: 'DO_NOT_LOG',
      fetchImpl: async () => ({ status: 403, ok: false }),
    }),
    (error) =>
      error.message.includes('403') && !error.message.includes('DO_NOT_LOG'),
  );
});
