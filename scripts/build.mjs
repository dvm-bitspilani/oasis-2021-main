import { readdir, readFile, writeFile, mkdir, rm, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
async function copyTree(source, destination) {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const src = path.join(source, entry.name), dest = path.join(destination, entry.name);
    if (entry.isDirectory()) await copyTree(src, dest);
    else if (/\.(?:css|svg|webp|ttf|otf|woff2?|txt)$/i.test(entry.name)) await copyFile(src, dest);
  }
}
for (const name of await readdir(root)) if (name.endsWith('.html')) await copyFile(name, path.join(out, name));
for (const dir of ['assets', 'fonts', 'stylesheets']) await copyTree(dir, path.join(out, dir));
await mkdir(path.join(out, 'scripts'));
for (const file of ['index.js', 'videos.js', 'registration.js', 'demo-validation.js']) await copyFile(path.join('scripts', file), path.join(out, 'scripts', file));
await mkdir(path.join(out, 'fonts', 'montserrat'), { recursive: true });
await copyFile('node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2', path.join(out, 'fonts/montserrat/montserrat-latin-500-normal.woff2'));
await copyFile('node_modules/@fontsource/montserrat/LICENSE', path.join(out, 'fonts/montserrat/LICENSE.txt'));
await writeFile(path.join(out, '_headers'), `/*
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
/assets/*
  Cache-Control: public, max-age=86400
/fonts/*
  Cache-Control: public, max-age=604800
`);
// Fail the build if a deployable page references a missing local asset or room.
let bytes = 0, files = 0;
async function verify(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await verify(file); continue; }
    bytes += (await stat(file)).size; files++;
    if (!/\.(html|css)$/.test(file)) continue;
    const content = await readFile(file, 'utf8');
    const refs = file.endsWith('.html') ? [...content.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]) : [...content.matchAll(/url\(\s*["']?([^\)"']+)["']?\s*\)/g)].map(m => m[1].trim().replace(/\\ /g, ' '));
    for (const ref of refs) {
      if (/^(?:https?:|data:|mailto:|tel:|#)/.test(ref)) continue;
      const dest = path.resolve(ref.startsWith('/') ? out : path.dirname(file), ref.replace(/^\//, '').split(/[?#]/)[0]);
      if (!dest.startsWith(out + path.sep) && dest !== out) throw new Error(`Reference escapes dist: ${ref}`);
      try { await stat(dest); } catch { throw new Error(`Missing ${ref} referenced by ${path.relative(out, file)}`); }
    }
  }
}
await verify(out);
console.log(`Static Pages build: ${files} files, ${bytes.toLocaleString('en-US')} bytes. Local page and asset references verified.`);
