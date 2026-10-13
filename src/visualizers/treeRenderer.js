import { h } from '../utils/dom.js';
const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
const keyOf = (n) => n.id ?? n.v;                 // identity used by marks / visited
const labelOf = (n) => String(n.label ?? n.v);    // text shown in the node
const kidsOf = (n) => n.children ?? [n.l, n.r].filter(Boolean);

/**
 * Tree / forest renderer.
 * step.tree: a node, an array of nodes (forest) or null. Binary nodes: {v|id, l, r}. N-ary nodes: {id, label, children}.
 * step.marks / step.visited: node keys (id, or value when there is no id). step.type colours the marked nodes.
 */
export function renderTree(container, step) {
  container.replaceChildren();
  if (!step) return;
  const roots = Array.isArray(step.tree) ? step.tree : step.tree ? [step.tree] : [];
  if (!roots.length) { container.append(h('span', { class: 'empty' }, '(empty tree)')); return; }
  const pos = new Map(), nary = roots.some((r) => r.children);
  let n = 0, maxD = 0;
  const place = (node, d) => {
    maxD = Math.max(maxD, d);
    if (nary) {
      const ks = node.children ?? [];
      if (!ks.length) pos.set(node, { x: n++ * 50 + 30, y: d * 60 + 30 });
      else { ks.forEach((c) => place(c, d + 1)); pos.set(node, { x: (pos.get(ks[0]).x + pos.get(ks.at(-1)).x) / 2, y: d * 60 + 30 }); }
    } else {
      if (node.l) place(node.l, d + 1);
      pos.set(node, { x: n++ * 50 + 30, y: d * 60 + 30 });
      if (node.r) place(node.r, d + 1);
    }
  };
  roots.forEach((r) => place(r, 0));
  const svg = s('svg', { viewBox: `0 0 ${n * 50 + 10} ${maxD * 60 + 75}` });
  const edges = (node) => {
    for (const c of kidsOf(node)) { svg.append(s('line', { x1: pos.get(node).x, y1: pos.get(node).y, x2: pos.get(c).x, y2: pos.get(c).y, class: 'edge' })); edges(c); }
  };
  roots.forEach(edges);
  for (const [node, p] of pos) {
    const cls = ['node'];
    if (step.visited?.includes(keyOf(node))) cls.push('seen');
    if (step.marks?.includes(keyOf(node))) cls.push(step.type === 'found' ? 'ok' : step.type === 'remove' || step.type === 'error' ? 'bad' : 'cur');
    svg.append(s('circle', { cx: p.x, cy: p.y, r: 20, class: cls.join(' ') }), s('text', { x: p.x, y: p.y + 5, 'text-anchor': 'middle', class: 'node-label' }, labelOf(node)));
    if (node.sub != null) svg.append(s('text', { x: p.x, y: p.y + 36, 'text-anchor': 'middle', class: 'node-sub' }, String(node.sub)));
  }
  container.append(svg);
}
