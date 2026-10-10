/** LIFO stack. ops: [{op:'push'|'pop'|'peek', arg?}] -> recorded steps. */
export function runStack(ops) {
  const items = [], steps = [];
  const snap = (type, index, message) => steps.push({ type, items: [...items], index, labels: items.length ? { [items.length - 1]: 'top' } : {}, message });
  snap('start', -1, 'Empty stack');
  for (const { op, arg } of ops) {
    if (op === 'push') { items.push(arg); snap('add', items.length - 1, `push(${arg})`); }
    else if (!items.length) snap('error', -1, `${op}() on an empty stack (underflow)`);
    else if (op === 'pop') { const v = items.pop(); snap('remove', -1, `pop() returned ${v}`); }
    else snap('peek', items.length - 1, `peek() returned ${items.at(-1)}`);
  }
  return steps;
}
