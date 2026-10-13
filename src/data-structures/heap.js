const toTree = (a, i = 0) => (i < a.length ? { id: i, v: a[i].k, label: a[i].label, l: toTree(a, 2 * i + 1), r: toTree(a, 2 * i + 2) } : null);

/**
 * Shared binary-heap engine (array-backed). Elements are {k: sortKey, label: shown in node, text?: shown in array}.
 * ops: [{op:'insert', elem} | {op:'extract'} | {op:'peek'}]. better(x, y) = x belongs above y.
 */
function runCore(ops, initial, better, noun) {
  const a = [], steps = [];
  const swap = (i, j) => { [a[i], a[j]] = [a[j], a[i]]; };
  const show = (e) => e.text ?? e.label;
  const snap = (type, message, marks = []) => steps.push({
    type, message, marks, visited: [], index: -1, tree: toTree(a), items: a.map(show),
    labels: Object.fromEntries(a.map((_, i) => [i, String(i)])),
  });
  for (const e of initial) { a.push(e); for (let i = a.length - 1; i > 0;) { const p = (i - 1) >> 1; if (!better(a[i].k, a[p].k)) break; swap(i, p); i = p; } }
  snap('start', `Initial ${noun} (initial values inserted one by one)`);
  for (const { op, elem } of ops) {
    if (op === 'insert') {
      a.push(elem); let i = a.length - 1;
      snap('add', `Insert ${show(elem)} at the end (index ${i})`, [i]);
      let settled = false;
      while (i > 0 && !settled) {
        const p = (i - 1) >> 1;
        snap('peek', `Compare ${show(a[i])} with its parent ${show(a[p])}`, [i, p]);
        if (better(a[i].k, a[p].k)) { swap(i, p); snap('swap', `Swap: ${show(a[p])} moves up`, [p, i]); i = p; }
        else { snap('found', 'Parent is fine: heap property holds', [i]); settled = true; }
      }
      if (!settled) snap('found', i === 0 && a.length > 1 ? 'Reached the root: heap property holds' : 'First element is the root', [0]);
    } else if (!a.length) snap('error', `${op}() on an empty ${noun}`);
    else if (op === 'peek') snap('found', `Peek: root is ${show(a[0])}`, [0]);
    else {
      const top = a[0];
      snap('remove', `Extract root ${show(top)}`, [0]);
      const last = a.pop();
      if (a.length) {
        a[0] = last; snap('add', `Move last element ${show(last)} to the root`, [0]);
        for (let i = 0; ;) {
          const l = 2 * i + 1, r = l + 1; let best = i;
          snap('peek', `Compare ${show(a[i])} with its children`, [i, l, r].filter((x) => x < a.length));
          if (l < a.length && better(a[l].k, a[best].k)) best = l;
          if (r < a.length && better(a[r].k, a[best].k)) best = r;
          if (best === i) { snap('found', 'Heap property restored', [i]); break; }
          swap(i, best); snap('swap', `Swap down: ${show(a[i])} moves up`, [i, best]); i = best;
        }
      } else snap('found', `${noun} is now empty`);
    }
  }
  return steps;
}

const num = (k) => ({ k, label: String(k) });
const heapRunner = (better, noun) => (ops, initial = []) => runCore(ops.map(({ op, args }) => ({ op, elem: op === 'insert' ? num(args[0]) : null })), initial.map(num), better, noun);
export const runMinHeap = heapRunner((x, y) => x < y, 'min-heap');
export const runMaxHeap = heapRunner((x, y) => x > y, 'max-heap');

/** Priority queue: smaller priority number = served first. ops: enqueue value priority, dequeue, peek. */
export function runPriorityQueue(ops) {
  const el = (v, p) => ({ k: p, label: v.length > 4 ? `${v.slice(0, 3)}…` : v, text: `${v}:${p}` });
  const mapped = ops.map(({ op, args }) => ({ op: op === 'enqueue' ? 'insert' : op === 'dequeue' ? 'extract' : 'peek', elem: op === 'enqueue' ? el(args[0], args[1]) : null }));
  return runCore(mapped, [], (x, y) => x < y, 'priority queue');
}
