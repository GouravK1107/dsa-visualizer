import { h } from '../utils/dom.js';

const KIND = { '→': 'fwd', '←': 'back', '⇄': 'both', '': 'none' };

/**
 * Linked-list renderer: each node is a box with a data part and pointer part(s),
 * joined by arrows. Singly: [data|•]  Doubly: [•|data|•]  Circular: loop arrow back to head.
 * Uses the same step shape as cellsRenderer (items, index, marks, labels, gaps, gap, noNull, endMark, type).
 */
export function renderList(container, step) {
  container.replaceChildren();
  if (!step) return;
  const doubly = step.gap === '⇄', circular = !!step.endMark?.startsWith('↩');
  const n = step.items.length;
  const row = h('div', { class: `ll-row${circular ? ' circ' : ''}` });
  if (!n) { row.append(h('span', { class: 'empty' }, 'head → null')); container.append(row); return; }

  const hot = (i) => i === step.index || step.marks?.includes(i);
  const link = (kind) => h('div', { class: 'll-col' }, h('span', { class: 'cell-tag ll-tag' }, ''), h('div', { class: 'll-linkbox' }, h('span', { class: `ll-link ${kind}` })));
  const nullBox = () => h('div', { class: 'll-col' }, h('span', { class: 'cell-tag ll-tag' }, ''), h('div', { class: 'll-null' }, 'null'));
  const ptr = () => h('span', { class: 'll-ptr' }, h('i', { class: 'dot' }));

  if (doubly) row.append(nullBox(), link('back'));
  step.items.forEach((v, i) => {
    row.append(h('div', { class: 'll-col' },
      h('span', { class: 'cell-tag ll-tag' }, step.labels?.[i] || ''),
      h('div', { class: `ll-node ${hot(i) ? step.type : ''}` }, doubly ? ptr() : null, h('span', { class: 'll-data' }, String(v)), ptr())));
    if (i < n - 1) row.append(link(doubly ? 'both' : KIND[step.gaps?.[i] ?? '→'] ?? 'fwd'));
    else if (!circular && !step.noNull) row.append(link('fwd'), nullBox());
  });
  const loop = circular ? h('span', { class: 'll-loop', title: 'The last node points back to the head' }) : null;
  if (loop) row.append(loop);
  container.append(row);

  if (loop) { // stretch the loop arrow from the last node's centre back to the first node's centre
    const nodes = row.querySelectorAll('.ll-node');
    if (nodes.length) {
      const first = nodes[0], last = nodes[nodes.length - 1];
      loop.style.left = `${first.offsetLeft + first.offsetWidth / 2}px`;
      loop.style.right = `${row.offsetWidth - (last.offsetLeft + last.offsetWidth / 2)}px`;
    }
  }
}
