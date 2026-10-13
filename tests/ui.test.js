import test from 'node:test';
import assert from 'node:assert/strict';

// Minimal fake DOM so UI logic can be tested without a browser.
const mk = (tag) => ({
  tag, children: [], style: {}, attrs: {}, handlers: {}, value: '', textContent: '', className: '',
  append(...a) { this.children.push(...a.map((x) => (typeof x === 'string' ? { text: x } : x))); },
  replaceChildren(...a) { this.children = a.map((x) => (typeof x === 'string' ? { text: x } : x)); },
  setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(e, f) { this.handlers[e] = f; },
  focus() {}, querySelectorAll() { return []; },
});
globalThis.document = { createElement: mk };
const { OperationBuilder } = await import('../src/components/operationBuilder.js');
const { renderList } = await import('../src/visualizers/listRenderer.js');
const { dataStructures } = await import('../src/data-structures/index.js');
const { parseOpsSpec } = await import('../src/utils/parseSpec.js');

const walk = (n, out = []) => { out.push(n); (n.children || []).forEach((c) => walk(c, out)); return out; };
const hasClass = (n, c) => (n.className || '').split(' ').includes(c);

function setup(initial = []) {
  const b = OperationBuilder({ spec: { insert: ['int', 'num'], delete_head: [], append: ['str'] }, initial });
  const all = () => walk(b.el);
  return {
    b,
    select: all().find((n) => n.tag === 'select'),
    add: all().find((n) => n.tag === 'button' && n.children[0]?.text === '+ Add'),
    clear: all().find((n) => n.tag === 'button' && n.children[0]?.text === 'Clear all'),
    error: () => all().find((n) => n.tag === 'p' && hasClass(n, 'error')).textContent,
    inputs: () => all().filter((n) => n.tag === 'input'),
    pick(op) { this.select.value = op; this.select.handlers.change(); },
  };
}

test('builder adds a valid operation and clears the boxes', () => {
  const s = setup();
  s.pick('insert');
  const [i, v] = s.inputs(); i.value = '2'; v.value = '10';
  s.add.handlers.click();
  assert.equal(s.b.getText(), 'insert 2 10');
  assert.equal(s.error(), '');
  assert.equal(s.inputs()[0].value, '');
});
test('builder rejects empty boxes, bad index and text with spaces', () => {
  const s = setup();
  s.pick('insert');
  s.add.handlers.click();
  assert.match(s.error(), /Fill in all the boxes/);
  const [i, v] = s.inputs(); i.value = '-1'; v.value = '5';
  s.add.handlers.click();
  assert.notEqual(s.error(), '');
  assert.deepEqual(s.b.getOps(), []);
  s.pick('append');
  s.inputs()[0].value = 'a b';
  s.add.handlers.click();
  assert.match(s.error(), /spaces/);
});
test('builder handles no-argument operations, removal and clear', () => {
  const s = setup();
  s.pick('delete_head');
  assert.equal(s.inputs().length, 0);
  s.add.handlers.click(); s.add.handlers.click();
  assert.equal(s.b.getText(), 'delete_head, delete_head');
  walk(s.b.el).find((n) => n.attrs?.['aria-label'] === 'Remove operation 1').handlers.click();
  assert.deepEqual(s.b.getOps(), ['delete_head']);
  s.clear.handlers.click();
  assert.deepEqual(s.b.getOps(), []);
});
test('builder starts from saved operations', () => {
  assert.equal(setup(['insert 0 5']).b.getText(), 'insert 0 5');
});
test('list renderer draws one node per item for singly, doubly and circular lists', () => {
  for (const id of ['linked-list', 'doubly-linked-list', 'circular-linked-list']) {
    const d = dataStructures.find((x) => x.id === id);
    assert.equal(d.render, renderList, id);
    const steps = d.run(parseOpsSpec(d.defaultOps, d.spec).value, [3, 7, 9]);
    for (const step of steps) {
      const box = mk('div');
      renderList(box, step);
      const nodes = walk(box).filter((n) => hasClass(n, 'll-node'));
      assert.equal(nodes.length, step.items.length, `${id}: ${step.message}`);
    }
    const first = mk('div'); renderList(first, steps[0]);
    const classes = walk(first).map((n) => n.className || '');
    assert.equal(classes.some((c) => c.includes('ll-loop')), id === 'circular-linked-list');
    assert.equal(classes.some((c) => c.includes('both')), id === 'doubly-linked-list');
  }
});
