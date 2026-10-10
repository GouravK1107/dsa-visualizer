import { h } from '../utils/dom.js';
const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

/** Binary-tree renderer. step: {tree:{v,l,r}|null, marks:[values], visited:[values], type}. */
export function renderTree(container, step) {
  container.replaceChildren();
  if (!step) return;
  if (!step.tree) { container.append(h('span', { class: 'empty' }, '(empty tree)')); return; }
  const pos = new Map();
  let n = 0, maxD = 0;
  const place = (node, d) => { if (!node) return; place(node.l, d + 1); pos.set(node, { x: n++ * 50 + 30, y: d * 60 + 30 }); maxD = Math.max(maxD, d); place(node.r, d + 1); };
  place(step.tree, 0);
  const svg = s('svg', { viewBox: `0 0 ${n * 50 + 10} ${maxD * 60 + 60}` });
  const edges = (node) => {
    if (!node) return;
    for (const c of [node.l, node.r]) if (c) { svg.append(s('line', { x1: pos.get(node).x, y1: pos.get(node).y, x2: pos.get(c).x, y2: pos.get(c).y, class: 'edge' })); edges(c); }
  };
  edges(step.tree);
  for (const [node, p] of pos) {
    const cls = ['node'];
    if (step.visited.includes(node.v)) cls.push('seen');
    if (step.marks.includes(node.v)) cls.push(step.type === 'found' ? 'ok' : step.type === 'remove' ? 'bad' : 'cur');
    svg.append(s('circle', { cx: p.x, cy: p.y, r: 20, class: cls.join(' ') }), s('text', { x: p.x, y: p.y + 5, 'text-anchor': 'middle', class: 'node-label' }, String(node.v)));
  }
  container.append(svg);
}
