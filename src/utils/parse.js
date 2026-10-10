export const MAX_ITEMS = 30;
/** Parse "5, 3 8" into numbers. Returns {ok:true,value} or {ok:false,error}. */
export function parseArray(text) {
  const parts = String(text).split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) return { ok: false, error: 'Enter at least one number.' };
  if (parts.length > MAX_ITEMS) return { ok: false, error: `Use at most ${MAX_ITEMS} numbers.` };
  const value = parts.map(Number);
  if (value.some((n) => !Number.isFinite(n))) return { ok: false, error: 'Only numbers separated by commas or spaces are allowed.' };
  return { ok: true, value };
}
export function parseNumber(text) {
  const t = String(text).trim();
  if (t === '' || !Number.isFinite(Number(t))) return { ok: false, error: 'Target must be a number.' };
  return { ok: true, value: Number(t) };
}
export const isSorted = (a) => a.every((v, i) => i === 0 || a[i - 1] <= v);

/** Parse "A-B, B-C, D" into {nodes, adj} (undirected, unweighted). */
export function parseGraph(text) {
  const adj = {}, nodes = [];
  const add = (n) => { if (!adj[n]) { adj[n] = []; nodes.push(n); } };
  const items = String(text).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  if (!items.length) return { ok: false, error: 'Enter at least one edge like A-B.' };
  for (const it of items) {
    const parts = it.split('-').map((s) => s.trim());
    if (parts.length > 2 || parts.some((p) => !/^[A-Za-z0-9]{1,4}$/.test(p))) {
      return { ok: false, error: `Invalid edge "${it}". Use names (letters/digits, max 4) like A-B.` };
    }
    parts.forEach(add);
    if (parts.length === 2 && parts[0] !== parts[1] && !adj[parts[0]].includes(parts[1])) {
      adj[parts[0]].push(parts[1]); adj[parts[1]].push(parts[0]);
    }
  }
  if (nodes.length > 12) return { ok: false, error: 'Use at most 12 nodes.' };
  return { ok: true, value: { nodes, adj } };
}

/** Parse "push 5, pop" into [{op, arg?}] validating against allowed ops. */
export function parseOps(text, allowed, needsArg) {
  const items = String(text).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  if (!items.length) return { ok: false, error: 'Enter at least one operation.' };
  if (items.length > 40) return { ok: false, error: 'Use at most 40 operations.' };
  const ops = [];
  for (const it of items) {
    const [op, arg, ...rest] = it.split(/\s+/);
    const name = op.toLowerCase();
    if (!allowed.includes(name) || rest.length) return { ok: false, error: `Unknown or malformed operation "${it}". Allowed: ${allowed.join(', ')}.` };
    if (needsArg.includes(name)) {
      const n = Number(arg);
      if (arg === undefined || !Number.isFinite(n)) return { ok: false, error: `"${name}" needs a numeric value, e.g. ${name} 5.` };
      ops.push({ op: name, arg: n });
    } else if (arg !== undefined) return { ok: false, error: `"${name}" takes no value.` };
    else ops.push({ op: name });
  }
  return { ok: true, value: ops };
}
