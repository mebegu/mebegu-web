#!/usr/bin/env node
// Oyun yayın hattı: build al, release'e yükle, Atölye manifestini güncelle.
//
//   node scripts/release-game.mjs --source /PATH/TO/GAME [--tag <tag>] [--dry-run]
//
// Sürüm git tag'inden türetilir. Tag biçimi: <slug>-v<sürüm>, örn. bagatelle-v0.3.0
// --tag verilmezse kaynak repodaki en son eşleşen tag kullanılır.
//
// --dry-run hiçbir şey yazmaz, ağ isteği yapmaz, token istemez. Ne yapacağını yazar.
//
// Tasarım: docs/GAMES-PIPELINE.md

import { execFileSync, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, writeFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const execFileAsync = promisify(execFile);

const UNITY =
  process.env.UNITY_PATH ||
  'C:\\Program Files\\Unity\\Hub\\Editor\\6000.3.25f1\\Editor\\Unity.exe';
const RELEASES_REPO = 'mebegu/game-releases';

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const out = { dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    else if (a === '--source') out.source = argv[++i];
    else if (a === '--tag') out.tag = argv[++i];
    else if (a === '--help' || a === '-h') out.help = true;
    else throw new Error(`Bilinmeyen argüman: ${a}`);
  }
  return out;
}

const USAGE = `
Kullanım:
  node scripts/release-game.mjs --source <oyun dizini> [--tag <tag>] [--dry-run]

  --source    Oyun reposunun kökü (.games/publish.json burada aranır)
  --tag       Kullanılacak git tag'i. Verilmezse en son <slug>-v* tag'i alınır.
  --dry-run   Hiçbir şey yazmaz, yapacaklarını listeler.

Ortam değişkenleri:
  UNITY_PATH              Unity.exe yolu (varsayılan: 6000.3.25f1)
  GH_TOKEN / GITHUB_TOKEN gh CLI tarafından kullanılır (release yüklemek için)
`.trim();

// ---------------------------------------------------------------- helpers

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

function log(step, message) {
  console.log(`${step.padEnd(10)} ${message}`);
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// Tag'den sürümü çıkarır: "bagatelle-v0.3.0" → "0.3.0"
function versionFromTag(tag, slug) {
  const prefix = `${slug}-v`;
  if (!tag.startsWith(prefix)) {
    throw new Error(
      `Tag "${tag}" beklenen biçimde değil. Beklenen: ${prefix}<sürüm>, örn. ${prefix}0.3.0`,
    );
  }
  const version = tag.slice(prefix.length);
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`Sürüm "${version}" semver değil.`);
  }
  return version;
}

function latestTag(source, slug) {
  const tags = git(source, [
    'tag',
    '--list',
    `${slug}-v*`,
    '--sort=-version:refname',
  ])
    .split('\n')
    .filter(Boolean);
  if (tags.length === 0) {
    throw new Error(
      `${slug} için tag bulunamadı. Önce etiketleyin: git tag ${slug}-v0.1.0`,
    );
  }
  return tags[0];
}

// ---------------------------------------------------------------- build

async function buildTarget(source, projectPath, name, target, version, dryRun) {
  const method = { android: 'GameBuild.Android', windows: 'GameBuild.Windows' }[name];
  if (!method) throw new Error(`Bilinmeyen hedef: ${name}`);

  const project = path.resolve(source, projectPath);
  const output = path.resolve(source, target.output);

  if (dryRun) {
    log('build', `${name}: ${method} → ${path.relative(source, output)} (atlandı)`);
    return output;
  }

  log('build', `${name}: Unity batchmode başlıyor, birkaç dakika sürebilir`);
  const logFile = path.join(project, `.games-build-${name}.log`);

  try {
    await execFileAsync(
      UNITY,
      [
        '-batchmode',
        '-quit',
        '-projectPath', project,
        '-executeMethod', method,
        '-gameBuildOutput', output,
        '-gameBuildVersion', version,
        '-logFile', logFile,
      ],
      { maxBuffer: 64 * 1024 * 1024 },
    );
  } catch (err) {
    throw new Error(
      `${name} build başarısız (çıkış ${err.code}). Günlük: ${logFile}`,
    );
  }

  if (!(await exists(output))) {
    throw new Error(`${name} build çıktısı bulunamadı: ${output}`);
  }

  log('build', `${name}: tamam`);
  return output;
}

// ---------------------------------------------------------------- release

async function uploadRelease(slug, tag, version, assets, dryRun) {
  const title = `${slug} ${version}`;

  if (dryRun) {
    log('release', `${RELEASES_REPO} → ${tag}`);
    for (const a of assets) log('', `  asset: ${path.basename(a)}`);
    return assets.map(
      (a) =>
        `https://github.com/${RELEASES_REPO}/releases/download/${tag}/${path.basename(a)}`,
    );
  }

  const existing = execFileSync(
    'gh',
    ['release', 'list', '--repo', RELEASES_REPO, '--json', 'tagName'],
    { encoding: 'utf8' },
  );
  const already = JSON.parse(existing).some((r) => r.tagName === tag);

  if (already) {
    log('release', `${tag} zaten var, asset'ler güncelleniyor`);
    execFileSync('gh', [
      'release', 'upload', tag, ...assets,
      '--repo', RELEASES_REPO, '--clobber',
    ]);
  } else {
    log('release', `${tag} oluşturuluyor`);
    execFileSync('gh', [
      'release', 'create', tag, ...assets,
      '--repo', RELEASES_REPO,
      '--title', title,
      '--notes', `${slug} ${version}`,
    ]);
  }

  return assets.map(
    (a) =>
      `https://github.com/${RELEASES_REPO}/releases/download/${tag}/${path.basename(a)}`,
  );
}

// ---------------------------------------------------------------- manifest

const LABELS = {
  android: { tr: 'APK indir (Android)', en: 'Download APK (Android)' },
  windows: { tr: 'Windows sürümünü indir', en: 'Download for Windows' },
};

async function updateManifest(source, slug, version, downloads, dryRun) {
  const file = path.join(source, '.workshop', 'public', 'project.json');
  if (!(await exists(file))) {
    throw new Error(`Manifest yok: ${file}`);
  }

  const doc = JSON.parse(await readFile(file, 'utf8'));
  const project = doc.project;

  project.version = version;

  // İndirme bağlantıları her sürümde değişir; etiketlerine göre değiştirilir,
  // diğer bağlantılar (oynama, kaynak, geri bildirim) olduğu gibi korunur.
  const keep = (project.links ?? []).filter(
    (l) => !Object.values(LABELS).some((lab) => lab.en === l.label?.en),
  );
  const added = Object.entries(downloads).map(([target, url]) => ({
    label: LABELS[target],
    url,
  }));
  project.links = [...keep, ...added];

  doc.revision = (doc.revision ?? 0) + 1;

  if (dryRun) {
    log('manifest', `revision → ${doc.revision}, version → ${version}`);
    for (const l of added) log('', `  bağlantı: ${l.label.tr}`);
    return doc;
  }

  await writeFile(file, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
  log('manifest', `revision → ${doc.revision}, version → ${version}`);
  return doc;
}

// ---------------------------------------------------------------- main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.source) {
    console.log(USAGE);
    process.exit(args.help ? 0 : 1);
  }

  const source = path.resolve(args.source);
  const configFile = path.join(source, '.games', 'publish.json');
  if (!(await exists(configFile))) {
    throw new Error(`Yapılandırma yok: ${configFile}`);
  }
  const config = JSON.parse(await readFile(configFile, 'utf8'));
  const { slug, projectPath = '.', targets } = config;

  if (!slug) throw new Error('publish.json içinde "slug" yok.');
  if (!targets || Object.keys(targets).length === 0) {
    throw new Error('publish.json içinde "targets" yok.');
  }

  const tag = args.tag ?? latestTag(source, slug);
  const version = versionFromTag(tag, slug);

  // Tag'in işaret ettiği commit ile çalışma ağacı aynı mı?
  const dirty = git(source, ['status', '--porcelain']).length > 0;
  const head = git(source, ['rev-parse', 'HEAD']);
  const tagged = git(source, ['rev-list', '-n', '1', tag]);
  if (head !== tagged) {
    throw new Error(
      `HEAD (${head.slice(0, 7)}) tag'in commit'i (${tagged.slice(0, 7)}) değil. ` +
        `Yayımlanan şey etiketlenen şey olmalı.`,
    );
  }
  if (dirty) {
    console.warn(
      'UYARI: çalışma ağacı temiz değil. Build, commit edilmemiş değişiklikleri içerecek.',
    );
  }

  console.log(`\n${slug} ${version}  (tag ${tag})${args.dryRun ? '  [dry-run]' : ''}\n`);

  const downloads = {};
  const assets = [];

  for (const [name, target] of Object.entries(targets)) {
    const output = await buildTarget(
      source, projectPath, name, target, version, args.dryRun,
    );
    const asset =
      target.archive === 'zip'
        ? await archive(output, source, slug, version, name, args.dryRun)
        : output;
    assets.push(asset);
    downloads[name] = null; // uploadRelease sonrası doldurulur
  }

  const urls = await uploadRelease(slug, tag, version, assets, args.dryRun);
  Object.keys(downloads).forEach((k, i) => (downloads[k] = urls[i]));

  await updateManifest(source, slug, version, downloads, args.dryRun);

  console.log(`\nSonraki adım: manifesti siteye gönderin.`);
  console.log(
    `  node scripts/publish-workshop.mjs --source ${path.join(source, '.workshop', 'public')} --id ${slug}${args.dryRun ? ' --dry-run' : ''}\n`,
  );
}

// Masaüstü build'i bir klasördür; Unity'ye verilen yol .exe olduğu için
// arşivlenecek olan onu içeren klasördür. Klasörün tamamı birlikte kalmalı.
async function archive(output, source, slug, version, name, dryRun) {
  const dir = path.extname(output) ? path.dirname(output) : output;
  const suffix = name === 'windows' ? 'win64' : name;
  const out = path.join(path.dirname(dir), `${slug}-${version}-${suffix}.zip`);

  if (dryRun) {
    log('archive', `${path.basename(dir)}/ → ${path.basename(out)} (atlandı)`);
    return out;
  }

  log('archive', path.basename(out));
  execFileSync('powershell', [
    '-NoProfile', '-Command',
    `Compress-Archive -Path '${dir}\\*' -DestinationPath '${out}' -Force`,
  ]);
  return out;
}

main().catch((err) => {
  console.error(`\nHATA: ${err.message}\n`);
  process.exit(1);
});
