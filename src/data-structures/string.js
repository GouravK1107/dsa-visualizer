/** String operations. ops: append, insert, delete, charat, find, reverse, upper, lower. */
export function runString(ops, initial = '') {
  let s = [...initial];
  const steps = [];
  const snap = (type, index, message, extra = {}) => steps.push({
    type, index, items: s.map((c) => (c === ' ' ? '␣' : c)),
    labels: Object.fromEntries(s.map((_, i) => [i, String(i)])), message: `${message}   →  "${s.join('')}"`, ...extra,
  });
  const oob = (i) => snap('error', -1, `Index ${i} is out of range (length is ${s.length})`);
  snap('start', -1, 'Initial string');
  for (const { op, args } of ops) {
    const [x, y] = args;
    if (op === 'append') { const at = s.length; s.push(...x); snap('add', -1, `Appended "${x}"`, { span: [at, [...x].length] }); }
    else if (op === 'insert') {
      if (x > s.length) { oob(x); continue; }
      s.splice(x, 0, ...y); snap('add', -1, `Inserted "${y}" at index ${x}`, { span: [x, [...y].length] });
    } else if (op === 'delete') {
      if (x >= s.length) { oob(x); continue; }
      const c = s.splice(x, 1)[0]; snap('remove', -1, `Deleted "${c}" at index ${x}`);
    } else if (op === 'charat') {
      if (x >= s.length) oob(x); else snap('found', x, `s[${x}] = "${s[x]}"`);
    } else if (op === 'reverse') {
      for (let l = 0, r = s.length - 1; l < r; l++, r--) { [s[l], s[r]] = [s[r], s[l]]; snap('swap', -1, `Swap index ${l} and ${r}`, { marks: [l, r] }); }
      snap('found', -1, 'Reversed');
    } else if (op === 'upper' || op === 'lower') {
      s = [...(op === 'upper' ? s.join('').toUpperCase() : s.join('').toLowerCase())];
      snap('add', -1, op === 'upper' ? 'Converted to upper case' : 'Converted to lower case');
    } else if (op === 'find') {
      const sub = [...x], m = sub.length;
      let at = -1;
      for (let i = 0; i + m <= s.length && at < 0; i++) {
        const hit = sub.every((c, k) => s[i + k] === c);
        snap(hit ? 'found' : 'peek', -1, hit ? `Match: "${x}" starts at index ${i}` : `Window at index ${i} does not match "${x}"`, { span: [i, m] });
        if (hit) at = i;
      }
      if (at < 0) snap('error', -1, `"${x}" not found`);
    }
  }
  return steps;
}
