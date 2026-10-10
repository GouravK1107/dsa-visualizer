/** Array operations with visible shifting. ops: access, update, insert, delete, append, search. */
export function runArray(ops, initial = []) {
  const a = [...initial], steps = [];
  const labels = () => Object.fromEntries(a.map((_, i) => [i, String(i)]));
  const snap = (type, index, message) => steps.push({ type, items: [...a], index, labels: labels(), message });
  const oob = (i) => snap('error', -1, `Index ${i} is out of range (length is ${a.length})`);
  snap('start', -1, 'Initial array');
  for (const { op, args } of ops) {
    const [x, y] = args;
    if (op === 'access') {
      if (x >= a.length) oob(x); else snap('found', x, `a[${x}] = ${a[x]}  (direct index, O(1))`);
    } else if (op === 'update') {
      if (x >= a.length) oob(x); else { const old = a[x]; a[x] = y; snap('add', x, `a[${x}]: ${old} → ${y}`); }
    } else if (op === 'append') {
      a.push(x); snap('add', a.length - 1, `Appended ${x} at the end`);
    } else if (op === 'insert') {
      if (x > a.length) { oob(x); continue; }
      a.push(null);
      for (let k = a.length - 1; k > x; k--) { a[k] = a[k - 1]; a[k - 1] = null; snap('peek', k, `Shift ${a[k]} right to index ${k}`); }
      a[x] = y; snap('add', x, `Inserted ${y} at index ${x}`);
    } else if (op === 'delete') {
      if (x >= a.length) { oob(x); continue; }
      snap('remove', x, `Deleting ${a[x]} at index ${x}`);
      for (let k = x; k < a.length - 1; k++) { a[k] = a[k + 1]; snap('peek', k, `Shift ${a[k]} left to index ${k}`); }
      a.pop(); snap('remove', -1, `Done. Length is now ${a.length}`);
    } else if (op === 'search') {
      let at = -1;
      for (let i = 0; i < a.length && at < 0; i++) {
        snap('peek', i, `Is a[${i}] = ${a[i]} equal to ${x}?`);
        if (a[i] === x) { at = i; snap('found', i, `Found ${x} at index ${i}`); }
      }
      if (at < 0) snap('error', -1, `${x} is not in the array`);
    }
  }
  return steps;
}
