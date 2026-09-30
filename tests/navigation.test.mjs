import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
const script = await readFile(new URL('../scripts/index.js', import.meta.url), 'utf8');
test('shared room script is safe on a page without menu or loader', () => {
  assert.doesNotThrow(() => vm.runInNewContext(script, { document: { querySelectorAll: () => [], querySelector: () => null, getElementById: () => null } }));
});
test('menu opens and Escape restores original room visibility', () => {
  const events = {}, keys = {}, attrs = {};
  const menu = { classList: { toggle() {} }, setAttribute: (key, value) => attrs[key] = value, addEventListener: (name, fn) => events[name] = fn };
  const nav = { style: {} }, room = { style: {} }, icons = { style: {} };
  vm.runInNewContext(script, { window: { innerWidth: 1200 }, document: { querySelectorAll: () => [], querySelector: (selector) => ({ '.menu-btn': menu, '.main-div': room, '.icon-desk': icons })[selector], getElementById: () => nav, addEventListener: (name, fn) => keys[name] = fn } });
  events.click();
  assert.equal(nav.style.width, '500px');
  assert.equal(attrs['aria-expanded'], 'true');
  keys.keydown({ key: 'Escape' });
  assert.equal(nav.style.width, '0');
  assert.equal(room.style.opacity, '1');
  assert.equal(icons.style.display, 'flex');
});
