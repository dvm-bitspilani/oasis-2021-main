import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, readdir } from 'node:fs/promises';

const script = await readFile(new URL('../scripts/registration.js', import.meta.url), 'utf8');
test('direct registration opens a modal and restores focus after closing', () => {
  const handlers = {}, calls = [];
  const notice = { removeAttribute: value => calls.push(['remove', value]), showModal: () => calls.push(['modal']), close: () => handlers.close(), addEventListener: (name, handler) => handlers[name] = handler };
  const button = { addEventListener: (name, handler) => handlers[name] = handler };
  const back = { focus: () => calls.push(['focus']) };
  vm.runInNewContext(script, { document: { getElementById: id => id === 'registration-closed' ? notice : button, querySelector: () => back } });
  assert.deepEqual(calls, [['remove', 'open'], ['modal']]);
  handlers.click();
  assert.deepEqual(calls.at(-1), ['focus']);
});
test('closed notice has a readable no-script fallback and no signup fields', async () => {
  const page = await readFile(new URL('../registration.html', import.meta.url), 'utf8');
  assert.match(page, /<dialog[^>]*\bopen\b[^>]*aria-labelledby="registration-title"[^>]*aria-describedby="registration-message"/);
  assert.match(page, /Registration is closed for this edition/);
  assert.doesNotMatch(page, /<(?:form|input|select)\b|sample|demo|portfolio|archive/i);
});
test('entrance registration stays commented; added labels and loaders are absent', async () => {
  const entrance = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(entrance, /<!--[\s\S]*?<div class="reg-button">[\s\S]*?registration\.html[\s\S]*?-->/);
  for (const file of await readdir(new URL('../', import.meta.url))) {
    if (!file.endsWith('.html')) continue;
    const page = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(page, /archive-notice|DVM portfolio|Portfolio demo|class="loader"/, file);
  }
});
