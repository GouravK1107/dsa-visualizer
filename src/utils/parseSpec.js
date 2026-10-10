/** Parsers for data-structure operations that take typed arguments. */
const TYPES = {
  int: (t) => (/^\d+$/.test(t) ? Number(t) : null),
  num: (t) => (t !== '' && Number.isFinite(Number(t)) ? Number(t) : null),
  str: (t) => t,
};

/**
 * spec example: { insert: ['int', 'num'], delete: ['int'], reverse: [] }
 * Returns {ok:true, value:[{op, args}]} or {ok:false, error}.
 */
export function parseOpsSpec(text, spec) {
  const items = String(text).split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
  if (!items.length) return { ok: false, error: 'Enter at least one operation.' };
  if (items.length > 40) return { ok: false, error: 'Use at most 40 operations.' };
  const ops = [];
  for (const it of items) {
    const [raw, ...rest] = it.split(/\s+/);
    const op = raw.toLowerCase(), types = spec[op];
    if (!types) return { ok: false, error: `Unknown operation "${raw}". Allowed: ${Object.keys(spec).join(', ')}.` };
    if (rest.length !== types.length) return { ok: false, error: `"${op}" expects ${types.length} value(s): ${op} ${types.join(' ') || '(none)'}.` };
    const args = [];
    for (let i = 0; i < types.length; i++) {
      const v = TYPES[types[i]](rest[i]);
      if (v === null) return { ok: false, error: `"${rest[i]}" is not valid for ${op} (${types[i] === 'int' ? 'a whole number ≥ 0' : 'a number'} expected).` };
      args.push(v);
    }
    ops.push({ op, args });
  }
  return { ok: true, value: ops };
}

/** Initial string: 1..max characters. */
export function parseText(text, max = 30) {
  const s = String(text).trim();
  if (!s) return { ok: false, error: 'Enter at least one character.' };
  if ([...s].length > max) return { ok: false, error: `Use at most ${max} characters.` };
  return { ok: true, value: s };
}
