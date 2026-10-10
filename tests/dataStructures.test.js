import test from 'node:test';
import assert from 'node:assert/strict';
import { runArray } from '../src/data-structures/array.js';
import { runString } from '../src/data-structures/string.js';
import { runLinkedList } from '../src/data-structures/linkedList.js';
import { dataStructures } from '../src/data-structures/index.js';
import { parseOpsSpec, parseText } from '../src/utils/parseSpec.js';

const spec = (id) => dataStructures.find((d) => d.id === id).spec;
const ops = (id, text) => parseOpsSpec(text, spec(id)).value;
const last = (s) => s.at(-1);

test('array insert/delete shift correctly and bounds are reported', () => {
  assert.deepEqual(last(runArray(ops('array', 'insert 1 99'), [1, 2, 3])).items, [1, 99, 2, 3]);
  assert.deepEqual(last(runArray(ops('array', 'delete 0'), [1, 2, 3])).items, [2, 3]);
  assert.deepEqual(last(runArray(ops('array', 'append 4, update 0 9'), [1, 2, 3])).items, [9, 2, 3, 4]);
  assert.equal(last(runArray(ops('array', 'access 5'), [1])).type, 'error');
  assert.equal(last(runArray(ops('array', 'insert 5 1'), [1])).type, 'error');
  assert.equal(last(runArray(ops('array', 'search 7'), [1, 2])).type, 'error');
  assert.equal(last(runArray(ops('array', 'search 2'), [1, 2])).type, 'found');
  assert.deepEqual(last(runArray(ops('array', 'delete 0'), [1])).items, []);
});
test('string operations', () => {
  const join = (id, o, init) => last(runString(ops(id, o), init)).items.join('');
  assert.equal(join('string', 'append _x, insert 0 >>', 'ab'), '>>ab_x');
  assert.equal(join('string', 'reverse', 'abc'), 'cba');
  assert.equal(join('string', 'upper', 'abc'), 'ABC');
  assert.equal(join('string', 'delete 1', 'abc'), 'ac');
  const f = last(runString(ops('string', 'find wor'), 'hello_world'));
  assert.equal(f.type, 'found'); assert.deepEqual(f.span, [6, 3]);
  assert.equal(last(runString(ops('string', 'find zz'), 'abc')).type, 'error');
  assert.equal(last(runString(ops('string', 'charat 9'), 'abc')).type, 'error');
});
test('linked list operations', () => {
  const run = (o, init) => last(runLinkedList(ops('linked-list', o), init)).items;
  assert.deepEqual(run('insert_head 1, insert_tail 9, insert_at 1 5', [2, 3]), [1, 5, 2, 3, 9]);
  assert.deepEqual(run('delete_head, delete_tail, delete_value 3', [1, 2, 3, 4]), [2]);
  assert.deepEqual(run('reverse', [1, 2, 3]), [3, 2, 1]);
  assert.deepEqual(run('reverse', [1]), [1]);
  assert.equal(last(runLinkedList(ops('linked-list', 'delete_head'), [1])).items.length, 0);
  assert.equal(last(runLinkedList(ops('linked-list', 'delete_head, delete_head'), [1])).type, 'error');
  assert.equal(last(runLinkedList(ops('linked-list', 'reverse'), [])).type, 'error');
  assert.equal(last(runLinkedList(ops('linked-list', 'insert_at 9 1'), [1])).type, 'error');
  assert.equal(last(runLinkedList(ops('linked-list', 'delete_value 99'), [1])).type, 'error');
});
test('parseOpsSpec / parseText validation', () => {
  const s = spec('array');
  assert.equal(parseOpsSpec('insert 1', s).ok, false);
  assert.equal(parseOpsSpec('insert -1 5', s).ok, false);
  assert.equal(parseOpsSpec('insert x 5', s).ok, false);
  assert.equal(parseOpsSpec('fly 1', s).ok, false);
  assert.equal(parseOpsSpec('', s).ok, false);
  assert.equal(parseText('').ok, false);
  assert.equal(parseText('x'.repeat(31)).ok, false);
  assert.equal(parseText('hi').value, 'hi');
});
test('every spec-based structure has complexity, code and defaults that run cleanly', () => {
  for (const d of dataStructures.filter((x) => x.spec)) {
    const r = parseOpsSpec(d.defaultOps, d.spec);
    assert.ok(r.ok, `${d.id}: ${r.error}`);
    const init = d.parseInitial ? d.parseInitial(d.initialDefault) : { ok: true, value: undefined };
    assert.ok(init.ok);
    assert.ok(d.run(r.value, init.value).length > 1);
    assert.ok(d.complexity.length && d.code.python && d.pseudocode);
  }
});
