/** Double-ended queue. ops: push_front, push_back, pop_front, pop_back, peek_front, peek_back. */
export function runDeque(ops) {
  const d = [], steps = [];
  const labels = () => (d.length === 1 ? { 0: 'front/back' } : d.length ? { 0: 'front', [d.length - 1]: 'back' } : {});
  const snap = (type, index, message) => steps.push({ type, items: [...d], index, labels: labels(), message });
  snap('start', -1, 'Empty deque');
  for (const { op, args } of ops) {
    const [x] = args;
    if (op === 'push_front') { d.unshift(x); snap('add', 0, `push_front(${x})`); }
    else if (op === 'push_back') { d.push(x); snap('add', d.length - 1, `push_back(${x})`); }
    else if (!d.length) snap('error', -1, `${op}() on an empty deque (underflow)`);
    else if (op === 'pop_front') { const v = d.shift(); snap('remove', -1, `pop_front() returned ${v}`); }
    else if (op === 'pop_back') { const v = d.pop(); snap('remove', -1, `pop_back() returned ${v}`); }
    else if (op === 'peek_front') snap('peek', 0, `peek_front() returned ${d[0]}`);
    else snap('peek', d.length - 1, `peek_back() returned ${d.at(-1)}`);
  }
  return steps;
}
