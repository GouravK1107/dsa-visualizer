/**
 * Singly linked list (head pointer only, so tail operations traverse).
 * ops: insert_head, insert_tail, insert_at, delete_head, delete_tail, delete_value, search, traverse, reverse.
 */
export function runLinkedList(ops, initial = [], opts = {}) {
  const a = [...initial], steps = [];
  const tags = () => (a.length === 1 ? { 0: 'head/tail' } : a.length ? { 0: 'head', [a.length - 1]: 'tail' } : {});
  const snap = (type, index, message, extra = {}) => steps.push({ type, index, items: [...a], linked: true, labels: tags(), message, gap: opts.gap, startMark: opts.startMark, endMark: opts.endMark, ...extra });
  const walk = (upto) => { for (let k = 0; k <= upto && k < a.length; k++) snap('peek', k, `Visit node ${a[k]} (position ${k})`); };
  const empty = (name) => snap('error', -1, `${name}() on an empty list`);
  snap('start', -1, 'Initial list');
  for (const { op, args } of ops) {
    const [x, y] = args;
    if (op === 'insert_head') { a.unshift(x); snap('add', 0, `New node ${x} becomes the head`); }
    else if (op === 'insert_tail') { if (!opts.tail) walk(a.length - 1); a.push(x); snap('add', a.length - 1, `Linked new node ${x} after the last node`); }
    else if (op === 'insert_at') {
      if (x > a.length) { snap('error', -1, `Position ${x} is out of range (length is ${a.length})`); continue; }
      walk(x - 1); a.splice(x, 0, y); snap('add', x, `Inserted ${y} at position ${x}`);
    } else if (op === 'delete_head') {
      if (!a.length) { empty(op); continue; }
      const v = a.shift(); snap('remove', -1, `Head ${v} removed; head moves to the next node`);
    } else if (op === 'delete_tail') {
      if (!a.length) { empty(op); continue; }
      if (!opts.tail) walk(a.length - 1); const v = a.pop(); snap('remove', -1, `Tail ${v} removed; previous node now points to null`);
    } else if (op === 'delete_value') {
      const at = a.indexOf(x);
      if (at < 0) { walk(a.length - 1); snap('error', -1, `${x} not found, nothing deleted`); continue; }
      walk(at); a.splice(at, 1); snap('remove', -1, `Deleted node ${x}; previous node now skips it`);
    } else if (op === 'search') {
      const at = a.indexOf(x);
      if (at < 0) { walk(a.length - 1); snap('error', -1, `${x} is not in the list`); } else { walk(at - 1); snap('found', at, `Found ${x} at position ${at}`); }
    } else if (op === 'traverse') {
      if (!a.length) empty(op); else walk(a.length - 1);
    } else if (op === 'reverse') {
      if (!a.length) { empty(op); continue; }
      const n = a.length;
      for (let k = 0; k < n; k++) {
        const gaps = a.slice(0, -1).map((_, j) => (j + 1 <= k ? '←' : j === k ? '' : '→'));
        snap('peek', k, `Flip node ${a[k]} to point to ${k ? a[k - 1] : 'null'}`, {
          gaps, noNull: k === n - 1,
          labels: { ...(k > 0 ? { [k - 1]: 'prev' } : {}), [k]: 'curr', ...(k + 1 < n ? { [k + 1]: 'next' } : {}) },
        });
      }
      a.reverse(); snap('found', 0, `Reversed. New head is ${a[0]}`);
    }
  }
  return steps;
}
