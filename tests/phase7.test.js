import test from 'node:test';
import assert from 'node:assert/strict';

const mk = (tag) => ({
  tag, children: [], style: {}, attrs: {}, value: '', textContent: '', className: '',
  append(...a) { this.children.push(...a.map((x) => (typeof x === 'string' ? { text: x } : x))); },
  replaceChildren(...a) { this.children = a.map((x) => (typeof x === 'string' ? { text: x } : x)); },
  setAttribute(k, v) { this.attrs[k] = v; }, addEventListener() {}, querySelectorAll() { return []; },
});
globalThis.document = { createElement: mk, createElementNS: (_, t) => mk(t) };
const { dataStructures } = await import('../src/data-structures/index.js');
const { parseOpsSpec } = await import('../src/utils/parseSpec.js');

const ds = (id) => dataStructures.find((d) => d.id === id);
const run = (id, ops, init) => ds(id).run(parseOpsSpec(ops, ds(id).spec).value, init);
const last = (s) => s.at(-1);
const walk = (n, out = []) => { out.push(n); (n.children || []).forEach((c) => walk(c, out)); return out; };
const extracted = (steps) => steps.filter((s) => s.type === 'remove' && /^Extract root/.test(s.message)).map((s) => Number(s.message.match(/root (-?[\d.]+)/)[1]));
const isHeap = (a, better) => a.every((v, i) => i === 0 || !better(Number(v), Number(a[(i - 1) >> 1])));

test('min-heap and max-heap extract in sorted order and keep the heap property', () => {
  for (let t = 0; t < 20; t++) {
    const init = Array.from({ length: 1 + (t % 9) }, () => Math.floor(Math.random() * 20) - 5);
    const ex = 'extract, '.repeat(init.length).slice(0, -2);
    const mn = run('min-heap', ex, init), mx = run('max-heap', ex, init);
    assert.deepEqual(extracted(mn), [...init].sort((a, b) => a - b));
    assert.deepEqual(extracted(mx), [...init].sort((a, b) => b - a));
    const built = run('min-heap', 'insert 7, insert -1', init);
    assert.ok(isHeap(last(built).items, (x, y) => x < y));
  }
});
test('heap edge cases: empty extract, peek, duplicates', () => {
  assert.equal(last(run('min-heap', 'extract', [])).type, 'error');
  assert.match(last(run('min-heap', 'peek', [4, 2])).message, /root is 2/);
  assert.match(last(run('max-heap', 'peek', [4, 2])).message, /root is 4/);
  assert.deepEqual(extracted(run('min-heap', 'extract, extract, extract', [3, 3, 3])), [3, 3, 3]);
  assert.match(last(run('min-heap', 'extract', [5])).message, /empty/);
});
test('priority queue serves the lowest priority number first', () => {
  const s = run('priority-queue', 'enqueue a 3, enqueue b 1, enqueue c 2, dequeue, dequeue, dequeue, dequeue');
  const out = s.filter((x) => x.type === 'remove' && /^Extract/.test(x.message)).map((x) => x.message.match(/root (\w+):/)[1]);
  assert.deepEqual(out, ['b', 'c', 'a']);
  assert.equal(last(s).type, 'error');
});
test('trie insert, search, prefix', () => {
  const t = (o) => last(run('trie', o)).type;
  assert.equal(t('insert cat, search cat'), 'found');
  assert.equal(t('insert cat, search ca'), 'error');
  assert.equal(t('insert cat, prefix ca'), 'found');
  assert.equal(t('insert cat, prefix dog'), 'error');
  assert.equal(t('insert cat, insert cat'), 'error');
  assert.equal(t('insert Cat, search CAT'), 'found');
  assert.equal(t('search a'), 'error');
});
test('disjoint set unions, compresses paths and rejects bad elements', () => {
  assert.equal(last(run('disjoint-set', 'union 0 1, union 1 2, connected 0 2', 4)).type, 'found');
  assert.equal(last(run('disjoint-set', 'union 0 1, connected 0 2', 4)).type, 'error');
  const chain = run('disjoint-set', 'union 0 1, union 2 3, union 0 2, find 3', 4);
  assert.ok(chain.some((s) => /Path compression: 3 now points directly to 0/.test(s.message)));
  assert.deepEqual(last(chain).items, [0, 0, 0, 0]);
  assert.equal(last(run('disjoint-set', 'find 9', 4)).type, 'error');
  assert.match(last(run('disjoint-set', 'union 0 1, union 0 1', 4)).message, /already in the same set/);
  const f = last(run('disjoint-set', 'union 0 1, union 2 3, union 1 3', 4));
  assert.equal(f.tree.length, 1);
});
test('every new structure renders every step without errors and draws the right node count', () => {
  for (const id of ['min-heap', 'max-heap', 'priority-queue', 'trie', 'disjoint-set']) {
    const d = ds(id);
    assert.ok(d.render, id);
    const init = d.parseInitial ? d.parseInitial(d.initialDefault).value : undefined;
    const steps = d.run(parseOpsSpec(d.defaultOps, d.spec).value, init);
    assert.ok(steps.length > 3, id);
    for (const step of steps) {
      const box = mk('div'); d.render(box, step);
      const circles = walk(box).filter((n) => n.tag === 'circle').length;
      const count = (t) => (Array.isArray(t) ? t.reduce((a, x) => a + count(x), 0) : t ? 1 + (t.children ? t.children.reduce((a, x) => a + count(x), 0) : count(t.l) + count(t.r)) : 0);
      assert.equal(circles, count(step.tree), `${id}: ${step.message}`);
    }
    assert.ok(d.complexity.length && d.code.python && d.pseudocode, id);
  }
});
