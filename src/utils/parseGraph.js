const NAME = /^[A-Za-z0-9]{1,4}$/;
export const MAX_VERTICES = 12;
export const validName = (s) => NAME.test(s);

/**
 * Parse "A-B, B-C, D" (unweighted) or "A-B:4, B-C:2, D" (weighted) into {nodes, edges:[{u,v,w}]}.
 * Empty text gives an empty graph. For undirected graphs A-B and B-A are the same edge.
 */
export function parseGraphInput(text, { weighted = false, directed = false } = {}) {
  const items = String(text).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  const nodes = [], edges = [];
  const add = (n) => { if (!nodes.includes(n)) nodes.push(n); };
  for (const it of items) {
    if (NAME.test(it)) { add(it); continue; }
    const m = it.match(/^([A-Za-z0-9]{1,4})-([A-Za-z0-9]{1,4})(?::(-?\d+(?:\.\d+)?))?$/);
    if (!m) return { ok: false, error: `Invalid item "${it}". Use ${weighted ? 'A-B:4' : 'A-B'} for an edge or a single name like E for a lone vertex (names: 1-4 letters/digits).` };
    const [, u, v, w] = m;
    if (weighted && w === undefined) return { ok: false, error: `Edge "${it}" needs a weight, like ${it}:4.` };
    if (!weighted && w !== undefined) return { ok: false, error: `Edge "${it}": this graph is unweighted, remove the weight.` };
    if (u === v) return { ok: false, error: `Self-loop "${it}" is not supported.` };
    if (edges.some((e) => (e.u === u && e.v === v) || (!directed && e.u === v && e.v === u))) return { ok: false, error: `Edge ${u}-${v} is listed twice.` };
    add(u); add(v);
    edges.push(weighted ? { u, v, w: Number(w) } : { u, v });
  }
  if (nodes.length > MAX_VERTICES) return { ok: false, error: `Use at most ${MAX_VERTICES} vertices.` };
  return { ok: true, value: { nodes, edges } };
}
