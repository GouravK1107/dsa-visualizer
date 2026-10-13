import { validName, MAX_VERTICES } from '../utils/parseGraph.js';

/**
 * Graph data structure runner for the four variants (directed / undirected, weighted / unweighted).
 * ops: add_vertex, add_edge, remove_edge, remove_vertex, has_edge, neighbors.
 */
export function makeGraphRunner({ directed, weighted }) {
  return (ops, init = { nodes: [], edges: [] }) => {
    const nodes = [...init.nodes], edges = init.edges.map((e) => ({ ...e })), steps = [];
    const find = (u, v) => edges.findIndex((e) => (e.u === u && e.v === v) || (!directed && e.u === v && e.v === u));
    const snap = (type, message, marks = [], edge = null) => steps.push({ type, message, marks, edge, directed, weighted, nodes: [...nodes], edges: edges.map((e) => ({ ...e })) });
    const bad = (...names) => names.find((n) => !validName(n));
    const arrow = directed ? '→' : '—';
    snap('start', 'Initial graph (see the adjacency list and matrix below)');
    for (const { op, args } of ops) {
      const names = op === 'add_edge' ? args.slice(0, 2) : args;
      const wrong = names.length && names.every((x) => typeof x === 'string') ? bad(...names) : null;
      if (wrong !== null && wrong !== undefined) { snap('error', `"${wrong}" is not a valid vertex name (1-4 letters or digits)`); continue; }
      const [u, v, w] = args;
      if (op === 'add_vertex') {
        if (nodes.includes(u)) snap('error', `Vertex ${u} already exists`, [u]);
        else if (nodes.length >= MAX_VERTICES) snap('error', `At most ${MAX_VERTICES} vertices are supported`);
        else { nodes.push(u); snap('add', `Added vertex ${u}`, [u]); }
      } else if (op === 'add_edge') {
        const fresh = [u, v].filter((x, i, arr) => !nodes.includes(x) && arr.indexOf(x) === i);
        if (u === v) { snap('error', 'Self-loops are not supported'); continue; }
        if (nodes.length + fresh.length > MAX_VERTICES) { snap('error', `At most ${MAX_VERTICES} vertices are supported`); continue; }
        nodes.push(...fresh);
        const at = find(u, v);
        if (at >= 0) {
          if (weighted) { const old = edges[at].w; edges[at].w = w; snap('add', `Edge ${u} ${arrow} ${v} already existed: weight ${old} → ${w}`, [u, v], [u, v]); }
          else snap('error', `Edge ${u} ${arrow} ${v} already exists`, [u, v], [u, v]);
        } else {
          edges.push(weighted ? { u, v, w } : { u, v });
          snap('add', `Added edge ${u} ${arrow} ${v}${weighted ? ` with weight ${w}` : ''}${fresh.length ? ` (created vertex ${fresh.join(', ')})` : ''}`, [u, v], [u, v]);
        }
      } else if (op === 'remove_edge') {
        const at = find(u, v);
        if (at < 0) snap('error', `No edge ${u} ${arrow} ${v}`, [u, v]);
        else { edges.splice(at, 1); snap('remove', `Removed edge ${u} ${arrow} ${v}`, [u, v]); }
      } else if (op === 'remove_vertex') {
        if (!nodes.includes(u)) { snap('error', `No vertex ${u}`); continue; }
        const before = edges.length;
        for (let i = edges.length - 1; i >= 0; i--) if (edges[i].u === u || edges[i].v === u) edges.splice(i, 1);
        nodes.splice(nodes.indexOf(u), 1);
        snap('remove', `Removed vertex ${u} and its ${before - edges.length} edge(s)`);
      } else if (op === 'has_edge') {
        const at = find(u, v);
        if (at < 0) snap('error', `No edge ${u} ${arrow} ${v}`, [u, v]);
        else snap('found', `Edge ${u} ${arrow} ${v} exists${weighted ? ` (weight ${edges[at].w})` : ''}`, [u, v], [u, v]);
      } else if (op === 'neighbors') {
        if (!nodes.includes(u)) { snap('error', `No vertex ${u}`); continue; }
        const out = edges.filter((e) => e.u === u || (!directed && e.v === u)).map((e) => (e.u === u ? e.v : e.u));
        const inn = directed ? edges.filter((e) => e.v === u).length : 0;
        snap('peek', `Neighbors of ${u}: ${out.length ? out.join(', ') : 'none'} (${directed ? `out-degree ${out.length}, in-degree ${inn}` : `degree ${out.length}`})`, [u, ...out]);
      }
    }
    return steps;
  };
}
