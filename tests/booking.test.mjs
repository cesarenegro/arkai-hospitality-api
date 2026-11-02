import test from 'node:test';
import assert from 'node:assert/strict';

test('date arithmetic is based on UTC calendar days', () => {
  const nights = (Date.parse('2027-01-04T00:00:00Z') - Date.parse('2027-01-01T00:00:00Z')) / 86400000;
  assert.equal(nights, 3);
});

test('sample pricing arithmetic', () => {
  assert.equal(21000 * 3 * 2, 126000);
});
