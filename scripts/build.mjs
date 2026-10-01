import { readdir, readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'assets'), { recursive: true });
const assets = new Map();
const pages = new Map();
const fontSource = 'fonts/montserrat/montserrat-latin-500-normal.woff2';
const isExternal = ref => /^(?:[a-z]+:|\/\/|#)/i.test(ref);
const localPath = (ref, from) => {
  const plain = decodeURI(ref.replace(/\\ /g, ' ').split(/[?#]/)[0]);
  const resolved = path.resolve(plain.startsWith('/') ? root : path.dirname(path.join(root, from)), plain.replace(/^\//, ''));
  if (!resolved.startsWith(root + path.sep)) throw new Error(`Reference escapes source: ${ref}`);
  return path.relative(root, resolved);
};
const cssRefs = /url\(\s*(["']?)([^\)"']+)\1\s*\)/g;
const htmlRefs = /\b(src|href|srcset)="([^"]+)"/g;
const stripComments = source => source.replace(/\/\*[\s\S]*?\*\//g, '');

async function replaceAsync(source, expression, replacer) {
  const matches = [...source.matchAll(expression)];
  for (const match of matches.reverse()) {
    const replacement = await replacer(match);
    source = source.slice(0, match.index) + replacement + source.slice(match.index + match[0].length);
  }
  return source;
}

// Only referenced assets ship. Their URLs change whenever their content changes.
async function emitAsset(source) {
  if (assets.has(source)) return assets.get(source);
  const actual = source === fontSource ? 'node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2' : source;
  let content = await readFile(path.join(root, actual));
  if (source.endsWith('.css')) {
    content = Buffer.from(await replaceAsync(stripComments(content.toString()), cssRefs, async match => {
      const ref = match[2].trim();
      return isExternal(ref) ? match[0] : `url('${await emitAsset(localPath(ref, source))}')`;
    }));
  }
  const extension = path.extname(source);
  const name = path.basename(source, extension).replace(/[^a-zA-Z0-9_-]+/g, '-');
  const digest = createHash('sha256').update(content).digest('hex').slice(0, 12);
  const url = `/assets/${name}.${digest}${extension}`;
  await writeFile(path.join(out, url.slice(1)), content);
  assets.set(source, url);
  return url;
}

for (const file of await readdir(root)) {
  if (!file.endsWith('.html')) continue;
  let html = (await readFile(path.join(root, file), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
  // Commented historical navigation remains in source, and never becomes live.
  html = await replaceAsync(html, htmlRefs, async match => {
    const ref = match[2];
    if (isExternal(ref)) return match[0];
    const source = localPath(ref, file);
    if (source.endsWith('.html')) { await stat(path.join(root, source)); return match[0]; }
    return `${match[1]}="${await emitAsset(source)}"`;
  });
  pages.set(file, html);
}

// Intent prefetch warms the destination and its stylesheet/script, never a timer.
for (const [file, source] of pages) {
  const html = source.replace(/<a\b[^>]*href="([^"#]+\.html)"[^>]*>/g, (tag, ref) => {
    if (isExternal(ref)) return tag;
    const destination = pages.get(localPath(ref, file));
    if (!destination) return tag;
    const warm = [...destination.matchAll(/<(?:link\b[^>]*rel="stylesheet"[^>]*href|script\b[^>]*src)="([^"]+)"/g)].map(match => match[1]);
    // Shared room art and type are small enough to warm with a navigation intent.
    for (const shared of ['assets/longwall.webp', fontSource, 'fonts/blackchancery/BLKCHCRY.woff2']) {
      if (assets.has(shared)) warm.push(assets.get(shared));
    }
    return tag.replace(/>$/, ` data-prefetch-assets="${[...new Set(warm)].join(' ')}">`);
  });
  await writeFile(path.join(out, file), html);
}
await writeFile(path.join(out, 'asset-manifest.json'), JSON.stringify(Object.fromEntries(assets), null, 2) + '\n');
await writeFile(path.join(out, 'FONT-LICENSE.txt'), await readFile(path.join(root, 'node_modules/@fontsource/montserrat/LICENSE')));
const htmlHeaders = ['/', ...[...pages.keys()].flatMap(file => [`/${file}`, `/${file.slice(0, -5)}`]), '/asset-manifest.json']
  .map(route => `${route}\n  Cache-Control: public, max-age=0, must-revalidate`).join('\n');
await writeFile(path.join(out, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
/assets/*
  Cache-Control: public, max-age=31536000, immutable
${htmlHeaders}
`);

// Verify all output references after rewriting, including responsive sources.
let bytes = 0, files = 0;
async function verify(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await verify(file); continue; }
    bytes += (await stat(file)).size; files++;
    if (!/\.(html|css)$/.test(file)) continue;
    const content = await readFile(file, 'utf8');
    const refs = file.endsWith('.html') ? [...content.matchAll(htmlRefs)].map(match => match[2]) : [...content.matchAll(cssRefs)].map(match => match[2].trim());
    for (const ref of refs) {
      if (isExternal(ref)) continue;
      const dest = path.resolve(ref.startsWith('/') ? out : path.dirname(file), ref.replace(/^\//, '').split(/[?#]/)[0]);
      if (!dest.startsWith(out + path.sep)) throw new Error(`Reference escapes dist: ${ref}`);
      try { await stat(dest); } catch { throw new Error(`Missing ${ref} referenced by ${path.relative(out, file)}`); }
    }
  }
}
await verify(out);
console.log(`Static Pages build: ${files} files, ${bytes.toLocaleString('en-US')} bytes. Local page, responsive image and asset references verified.`);
