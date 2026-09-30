import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE_REGISTRATION, validateRegistration } from '../scripts/demo-validation.js';
test('fictional registration validates without a service or storage', () => {
  assert.deepEqual(validateRegistration(SAMPLE_REGISTRATION), []);
});
test('missing or malformed details are rejected', () => {
  assert.equal(validateRegistration({}).length, 9);
  assert.ok(validateRegistration({ ...SAMPLE_REGISTRATION, email: 'invalid', phone: 'real?', year: '5th', mentor: 'unknown' }).length === 4);
  assert.ok(validateRegistration({ ...SAMPLE_REGISTRATION, name: '   ' }).length === 1);
});
test('head and mentor choices validate independently', () => {
  assert.deepEqual(validateRegistration({ ...SAMPLE_REGISTRATION, head: 'true', mentor: 'false' }), []);
  assert.equal(validateRegistration({ ...SAMPLE_REGISTRATION, mentor: '' }).length, 1);
});
