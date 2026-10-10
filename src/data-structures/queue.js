/** FIFO queue. ops: enqueue / dequeue / front. */
export function runQueue(ops) {
  const items = [], steps = [];
  const labels = () => (items.length === 1 ? { 0: 'front/rear' } : items.length ? { 0: 'front', [items.length - 1]: 'rear' } : {});
  const snap = (type, index, message) => steps.push({ type, items: [...items], index, labels: labels(), message });
  snap('start', -1, 'Empty queue');
  for (const { op, arg } of ops) {
    if (op === 'enqueue') { items.push(arg); snap('add', items.length - 1, `enqueue(${arg})`); }
    else if (!items.length) snap('error', -1, `${op}() on an empty queue (underflow)`);
    else if (op === 'dequeue') { const v = items.shift(); snap('remove', -1, `dequeue() returned ${v}`); }
    else snap('peek', 0, `front() returned ${items[0]}`);
  }
  return steps;
}
