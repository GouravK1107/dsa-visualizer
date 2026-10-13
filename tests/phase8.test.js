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
const { parseGraphInput } = await import('../src/utils/parseGraph.js');

const ds = (id) => dataStructures.find((d) => d.id === id);
const run = (id, ops, init) => ds(id).run(parseOpsSpec(ops, ds(id).spec).value, init);
const last = (s) => s.at(-1);
const walk = (n, out = []) => { out.push(n); (n.children || []).forEach((c) => walk(c, out)); return out; };
const gi = (text, o) => parseGraphInput(text, o).value;

test('binary tree: level-order insert, delete, search, traversals, height', () => {
  assert.deepEqual(last(run('binary-tree', 'insert 4', [1, 2, 3])).items, [1, 2, 3, 4]);
  assert.deepEqual(last(run('binary-tree', 'delete 2', [1, 2, 3, 4])).items, [1, 4, 3]);
  assert.deepEqual(last(run('binary-tree', 'delete 4', [1, 2, 3, 4])).items, [1, 2, 3]);
  assert.deepEqual(last(run('binary-tree', 'delete 1', [1])).items, []);
  assert.equal(last(run('binary-tree', 'delete 9', [1])).type, 'error');
  assert.equal(last(run('binary-tree', 'search 3', [1, 2, 3])).type, 'found');
  const t = (op) => last(run('binary-tree', op, [1, 2, 3, 4, 5])).message;
  assert.match(t('inorder'), /4, 2, 5, 1, 3/);
  assert.match(t('preorder'), /1, 2, 4, 5, 3/);
  assert.match(t('postorder'), /4, 5, 2, 3, 1/);
  assert.match(t('levelorder'), /1, 2, 3, 4, 5/);
  assert.match(t('height'), /Height = 3/);
  assert.equal(last(run('binary-tree', 'inorder', [])).type, 'error');
  assert.match(last(run('binary-tree', 'height', [])).message, /Height = 0/);
});

const height = (n) => (n ? 1 + Math.max(height(n.l), height(n.r)) : 0);
const inorder = (n) => (n ? [...inorder(n.l), n.v, ...inorder(n.r)] : []);
const balanced = (n) => !n || (Math.abs(height(n.l) - height(n.r)) <= 1 && balanced(n.l) && balanced(n.r));

test('AVL stays balanced and sorted through random inserts and deletes', () => {
  for (let t = 0; t < 40; t++) {
    const vals = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30));
    const ops = vals.map((v, i) => (i % 3 === 2 ? `delete ${vals[i - 1]}` : `insert ${v}`)).join(', ');
    const f = last(run('avl-tree', ops, [15, 7]));
    assert.ok(balanced(f.tree), ops);
    const seq = inorder(f.tree);
    assert.deepEqual(seq, [...new Set(seq)].sort((a, b) => a - b), ops);
  }
});
test('AVL performs the four rotation cases', () => {
  const msgs = (init, ops) => run('avl-tree', ops, init).map((s) => s.message).join('|');
  assert.match(msgs([30, 20], 'insert 10'), /Left-Left/);
  assert.match(msgs([10, 20], 'insert 30'), /Right-Right/);
  assert.match(msgs([30, 10], 'insert 20'), /Left-Right/);
  assert.match(msgs([10, 30], 'insert 20'), /Right-Left/);
  assert.equal(last(run('avl-tree', 'insert 10, insert 20, insert 30', [])).tree.v, 20);
  assert.equal(last(run('avl-tree', 'insert 5', [5])).type, 'error');
  assert.equal(last(run('avl-tree', 'search 99', [5])).type, 'error');
  assert.equal(last(run('avl-tree', 'delete 99', [5])).type, 'error');
  assert.equal(last(run('avl-tree', 'inorder', [3, 1, 2])).message.includes('1, 2, 3'), true);
  assert.equal(last(run('avl-tree', 'delete 5', [5])).tree, null);
});

test('graph input parsing', () => {
  assert.equal(parseGraphInput('A-B, B-C, D').ok, true);
  assert.equal(parseGraphInput('').value.nodes.length, 0);
  assert.equal(parseGraphInput('A-B:3').ok, false);
  assert.equal(parseGraphInput('A-B', { weighted: true }).ok, false);
  assert.equal(parseGraphInput('A-A').ok, false);
  assert.equal(parseGraphInput('A-B, B-A').ok, false);
  assert.equal(parseGraphInput('A-B, B-A', { directed: true }).ok, true);
  assert.equal(parseGraphInput('A--B').ok, false);
  assert.equal(parseGraphInput(Array.from({ length: 13 }, (_, i) => `N${i}`).join(',')).ok, false);
});
test('undirected graph is symmetric, directed is not', () => {
  const u = last(run('graph-undirected', 'add_edge A B, has_edge B A', gi('', {})));
  assert.equal(u.type, 'found');
  const d = last(run('graph-directed', 'add_edge A B, has_edge B A', gi('', { directed: true })));
  assert.equal(d.type, 'error');
  assert.equal(last(run('graph-undirected', 'add_edge A B, add_edge B A', gi('', {}))).type, 'error');
  assert.equal(last(run('graph-directed', 'add_edge A B, add_edge B A', gi('', { directed: true }))).type, 'add');
});
test('weighted graph updates weights; vertex removal removes its edges', () => {
  const w = last(run('graph-weighted', 'add_edge A B 4, add_edge B A 9', gi('', { weighted: true })));
  assert.match(w.message, /weight 4 → 9/); assert.equal(w.edges[0].w, 9);
  const r = last(run('graph-undirected', 'remove_vertex B', gi('A-B, B-C, C-D', {})));
  assert.deepEqual(r.nodes, ['A', 'C', 'D']); assert.equal(r.edges.length, 1);
  assert.equal(last(run('graph-undirected', 'remove_edge A C', gi('A-B', {}))).type, 'error');
  assert.equal(last(run('graph-undirected', 'remove_vertex Z', gi('A-B', {}))).type, 'error');
  assert.equal(last(run('graph-undirected', 'add_vertex A', gi('A-B', {}))).type, 'error');
  assert.match(last(run('graph-directed', 'neighbors A', gi('A-B, A-C, D-A', { directed: true }))).message, /out-degree 2, in-degree 1/);
  assert.equal(last(run('graph-undirected', 'add_vertex a$', gi('', {}))).type, 'error');
  const full = gi(Array.from({ length: 12 }, (_, i) => `N${i}`).join(','), {});
  assert.equal(last(run('graph-undirected', 'add_vertex X', full)).type, 'error');
  assert.equal(last(run('graph-undirected', 'add_edge A A', gi('', {}))).type, 'error');
});

test('every new structure renders every step and draws the right number of nodes', () => {
  const ids = ['binary-tree', 'avl-tree', 'graph-undirected', 'graph-directed', 'graph-weighted', 'graph-directed-weighted'];
  for (const id of ids) {
    const d = ds(id);
    const parsed = d.parseInitial(d.initialDefault); assert.ok(parsed.ok, `${id}: ${parsed.error}`);
    const r = parseOpsSpec(d.defaultOps, d.spec); assert.ok(r.ok, `${id}: ${r.error}`);
    const steps = d.run(r.value, parsed.value);
    assert.ok(steps.length > 5, id);
    const count = (t) => (t ? 1 + count(t.l) + count(t.r) : 0);
    for (const step of steps) {
      const box = mk('div'); d.render(box, step);
      const circles = walk(box).filter((n) => n.tag === 'circle').length;
      assert.equal(circles, step.nodes ? step.nodes.length : count(step.tree), `${id}: ${step.message}`);
    }
    assert.ok(d.complexity.length && d.code.python && d.pseudocode, id);
  }
  assert.equal(new Set(dataStructures.map((x) => x.id)).size, dataStructures.length);
});
