const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs, ...kids) => {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};

/** Draws nodes on a circle; highlights visited nodes, the current node and active edge. */
export function renderGraph(container, step) {
  container.replaceChildren();
  if (!step) return;
  const { nodes, adj } = step.graph, W = 600, H = 300, r = Math.min(W, H) / 2 - 40;
  const pos = {};
  nodes.forEach((n, i) => {
    const t = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    pos[n] = { x: W / 2 + r * Math.cos(t), y: H / 2 + r * Math.sin(t) };
  });
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'graph' });
  const key = (a, b) => [a, b].sort().join('|'), drawn = new Set();
  const active = step.edge && key(...step.edge);
  for (const u of nodes) for (const v of adj[u]) {
    if (drawn.has(key(u, v))) continue;
    drawn.add(key(u, v));
    svg.append(s('line', { x1: pos[u].x, y1: pos[u].y, x2: pos[v].x, y2: pos[v].y, class: key(u, v) === active ? 'edge on' : 'edge' }));
  }
  for (const n of nodes) {
    const cls = ['node']; if (step.visited.includes(n)) cls.push('seen'); if (step.current === n) cls.push('cur');
    svg.append(s('circle', { cx: pos[n].x, cy: pos[n].y, r: 20, class: cls.join(' ') }),
      s('text', { x: pos[n].x, y: pos[n].y + 5, 'text-anchor': 'middle', class: 'node-label' }, n));
  }
  container.append(svg);
}
