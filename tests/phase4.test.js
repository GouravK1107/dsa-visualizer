import test from 'node:test';
import assert from 'node:assert/strict';
import { dataStructures } from '../src/data-structures/index.js';
import { parseOpsSpec } from '../src/utils/parseSpec.js';

const ds = (id) => dataStructures.find((d) => d.id === id);
const run = (id, ops, init) => ds(id).run(parseOpsSpec(ops, ds(id).spec).value, init);
const last = (s) => s.at(-1);
const flat = (t) => (t ? [...flat(t.l), t.v, ...flat(t.r)] : []);

test('hash table chains collisions, searches and deletes', () => {
  const s = run('hash-table', 'insert 7, insert 12, insert 2', 5);
  assert.deepEqual(last(s).buckets[2], [7, 12, 2]);
  assert.match(s.at(-1).message, /Collision/);
  assert.equal(last(run('hash-table', 'insert 7, search 7', 5)).type, 'found');
  assert.equal(last(run('hash-table', 'search 8', 5)).type, 'error');
  assert.deepEqual(last(run('hash-table', 'insert 7, delete 7', 5)).buckets[2], []);
  assert.equal(last(run('hash-table', 'insert 7, insert 7', 5)).type, 'error');
  assert.equal(last(run('hash-table', 'insert -3', 1)).buckets[0][0], -3);
});
test('deque works at both ends and reports underflow', () => {
  assert.deepEqual(last(run('deque', 'push_back 1, push_front 2, push_back 3')).items, [2, 1, 3]);
  assert.deepEqual(last(run('deque', 'push_back 1, push_back 2, pop_front, pop_back')).items, []);
  assert.equal(last(run('deque', 'pop_back')).type, 'error');
});
test('BST insert, search, traversals', () => {
  const t = last(run('bst', 'insert 4', [5, 3, 8]));
  assert.deepEqual(flat(t.tree), [3, 4, 5, 8]);
  assert.deepEqual(last(run('bst', 'inorder', [5, 3, 8])).visited, [3, 5, 8]);
  assert.deepEqual(last(run('bst', 'preorder', [5, 3, 8])).visited, [5, 3, 8]);
  assert.deepEqual(last(run('bst', 'postorder', [5, 3, 8])).visited, [3, 8, 5]);
  assert.deepEqual(last(run('bst', 'levelorder', [5, 3, 8, 1])).visited, [5, 3, 8, 1]);
  assert.equal(last(run('bst', 'search 9', [5])).type, 'error');
  assert.equal(last(run('bst', 'insert 5', [5])).type, 'error');
  assert.match(last(run('bst', 'min, max', [5, 3, 8])).message, /Maximum is 8/);
});
test('BST delete: leaf, one child, two children, root, missing', () => {
  assert.deepEqual(flat(last(run('bst', 'delete 3', [5, 3, 8])).tree), [5, 8]);
  assert.deepEqual(flat(last(run('bst', 'delete 3', [5, 3, 8, 2])).tree), [2, 5, 8]);
  const two = last(run('bst', 'delete 5', [5, 3, 8, 7, 9]));
  assert.equal(two.tree.v, 7); assert.deepEqual(flat(two.tree), [3, 7, 8, 9]);
  assert.equal(last(run('bst', 'delete 5', [5])).tree, null);
  assert.equal(last(run('bst', 'delete 1', [5])).type, 'error');
  assert.equal(last(run('bst', 'inorder', [])).type, 'error');
});
test('doubly and circular lists skip tail walks and use their own markers', () => {
  const d = run('doubly-linked-list', 'insert_tail 5', [1, 2]);
  assert.equal(d.length, 2); assert.equal(last(d).gap, '⇄');
  const c = run('circular-linked-list', 'delete_tail', [1, 2]);
  assert.equal(last(c).endMark, '↩ back to head'); assert.deepEqual(last(c).items, [1]);
  assert.equal(ds('doubly-linked-list').spec.reverse, undefined);
});
test('all structures: defaults run, have docs, ids unique', () => {
  const ids = dataStructures.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const d of dataStructures.filter((x) => x.spec)) {
    const r = parseOpsSpec(d.defaultOps, d.spec); assert.ok(r.ok, `${d.id}: ${r.error}`);
    const init = d.parseInitial ? d.parseInitial(d.initialDefault).value : undefined;
    assert.ok(d.run(r.value, init).length > 1, d.id);
    assert.ok(d.complexity.length && d.code.python && d.pseudocode, d.id);
  }
});
