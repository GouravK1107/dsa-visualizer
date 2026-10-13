import { h } from '../utils/dom.js';
const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

/** Graph drawing (arrows when directed, weights when weighted) plus adjacency list and matrix. */
export function renderGraphStructure(container, step) {
  container.replaceChildren();
  if (!step) return;
  const { nodes, edges, directed, weighted } = step, W = 520, H = 260, r = Math.min(W, H) / 2 - 36;
  const pos = {};
  nodes.forEach((n, i) => { const t = (2 * Math.PI * i) / nodes.length - Math.PI / 2; pos[n] = { x: W / 2 + r * Math.cos(t), y: H / 2 + r * Math.sin(t) }; });
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}` });
  if (directed) svg.append(s('defs', {}, s('marker', { id: 'arrowhead', viewBox: '0 0 10 10', refX: '9', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto' }, s('path', { d: 'M0 0L10 5L0 10z', class: 'arrowhead' }))));
  const active = (e) => step.edge && ((e.u === step.edge[0] && e.v === step.edge[1]) || (!directed && e.u === step.edge[1] && e.v === step.edge[0]));
  for (const e of edges) {
    const a = pos[e.u], b = pos[e.v], dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    const ox = directed ? -uy * 5 : 0, oy = directed ? ux * 5 : 0, pad = directed ? 22 : 20;
    svg.append(s('line', { x1: a.x + ux * 20 + ox, y1: a.y + uy * 20 + oy, x2: b.x - ux * pad + ox, y2: b.y - uy * pad + oy, class: `edge${active(e) ? ' on' : ''}`, ...(directed ? { 'marker-end': 'url(#arrowhead)' } : {}) }));
    if (weighted) svg.append(s('text', { x: (a.x + b.x) / 2 + ox * 2.5, y: (a.y + b.y) / 2 + oy * 2.5 - 4, 'text-anchor': 'middle', class: 'edge-w' }, String(e.w)));
  }
  const mark = step.type === 'found' ? 'ok' : step.type === 'remove' || step.type === 'error' ? 'bad' : 'cur';
  for (const n of nodes) {
    svg.append(s('circle', { cx: pos[n].x, cy: pos[n].y, r: 20, class: `node${step.marks.includes(n) ? ` ${mark}` : ''}` }), s('text', { x: pos[n].x, y: pos[n].y + 5, 'text-anchor': 'middle', class: 'node-label' }, n));
  }
  const out = (n) => edges.filter((e) => e.u === n || (!directed && e.v === n)).map((e) => ({ to: e.u === n ? e.v : e.u, w: e.w }));
  const list = nodes.map((n) => `${n} → ${out(n).map((x) => (weighted ? `${x.to}(${x.w})` : x.to)).join(', ') || '—'}`).join('\n');
  const cell = (a, b) => { const e = edges.find((q) => (q.u === a && q.v === b) || (!directed && q.u === b && q.v === a)); return e ? (weighted ? String(e.w) : '1') : '·'; };
  const matrix = h('table', { class: 'matrix' }, h('tr', {}, h('th', {}), ...nodes.map((n) => h('th', {}, n))),
    ...nodes.map((a) => h('tr', {}, h('th', {}, a), ...nodes.map((b) => h('td', {}, cell(a, b))))));
  container.append(h('div', { class: 'heap-tree' }, nodes.length ? svg : h('span', { class: 'empty' }, '(no vertices)')),
    h('div', { class: 'adj-wrap' }, h('pre', { class: 'adj' }, nodes.length ? `Adjacency list\n${list}` : 'Adjacency list\n(empty)'), matrix));
}
