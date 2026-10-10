import test from 'node:test';
import assert from 'node:assert/strict';
import { algorithms } from '../src/algorithms/index.js';
import { parseArray, parseNumber, isSorted } from '../src/utils/parse.js';
import { Player } from '../src/engine/player.js';

const inputs = [[], [1], [3, 1, 2], [5, 5, 1, 1], [9, 8, 7, 6, 5], [-3, 0, 4, -3, 10], [1, 2, 3, 4]];
for (const a of algorithms.filter((x) => x.kind === 'sort')) {
  test(`${a.id} sorts correctly and never mutates input`, () => {
    for (const inp of inputs) {
      const copy = [...inp];
      const steps = a.run(inp);
      assert.deepEqual(inp, copy);
      assert.deepEqual(steps.at(-1).array, [...inp].sort((x, y) => x - y));
    }
  });
}
for (const a of algorithms.filter((x) => x.kind === 'search')) {
  test(`${a.id} finds present and absent targets`, () => {
    const arr = [1, 3, 5, 7, 9, 11];
    for (const t of arr) assert.equal(a.run(arr, t).at(-1).found, arr.indexOf(t));
    assert.equal(a.run(arr, 4).at(-1).type, 'notfound');
    assert.equal(a.run([], 4).at(-1).type, 'notfound');
  });
}
test('parse validation', () => {
  assert.equal(parseArray('').ok, false);
  assert.equal(parseArray('1, x').ok, false);
  assert.deepEqual(parseArray('3 1,2').value, [3, 1, 2]);
  assert.equal(parseArray(Array(31).fill(1).join(',')).ok, false);
  assert.equal(parseNumber('abc').ok, false);
  assert.equal(isSorted([1, 2, 2, 3]), true);
  assert.equal(isSorted([2, 1]), false);
});
test('player steps forward, back and resets', () => {
  const seen = [];
  const p = new Player((s, i) => seen.push(i));
  p.load([{}, {}, {}]);
  p.next(); p.next(); p.next(); assert.equal(p.index, 2);
  p.prev(); assert.equal(p.index, 1);
  p.reset(); assert.equal(p.index, 0);
});
