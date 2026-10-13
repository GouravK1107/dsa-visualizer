import { runMinHeap, runMaxHeap, runPriorityQueue } from './heap.js';
import { runTrie } from './trie.js';
import { runDSU } from './dsu.js';
import { parseArray } from '../utils/parse.js';
import { renderTree } from '../visualizers/treeRenderer.js';
import { renderHeap } from '../visualizers/heapRenderer.js';

const typed = (o) => ({ category: 'Data Structures', ...o, allowed: Object.keys(o.spec) });
const parseCount = (t) => { const n = Number(String(t).trim()); return Number.isInteger(n) && n >= 1 && n <= 12 ? { ok: true, value: n } : { ok: false, error: 'Use a whole number from 1 to 12.' }; };
const HEAP_SPEC = { insert: ['num'], extract: [], peek: [] };
const HEAP_OPS = 'insert 2, extract, peek, insert 9, insert 4, extract, extract';
const heapDoc = (name, top, which) => ({
  render: renderHeap, canvasClass: 'heapview', parseInitial: parseArray, initialLabel: 'Initial values', initialDefault: '5, 3, 8, 1, 9', spec: HEAP_SPEC, defaultOps: HEAP_OPS,
  description: `${name}: a complete binary tree stored in an array where every parent is ${which} its children, so the ${top} is always at the root (index 0). Shown as a tree and as the array.`,
  complexity: [['insert', 'O(log n)'], ['extract', 'O(log n)'], ['peek', 'O(1)'], ['build from n values', 'O(n) with heapify, O(n log n) by repeated insert'], ['Space', 'O(n)']],
  useCases: 'Priority queues, heap sort, top-k problems, Dijkstra and Prim, scheduling.',
  pseudocode: 'insert(x): append x; while x better than parent: swap with parent\nextract(): save root; move last element to root; while it is worse than a child: swap with the better child',
});

export const advancedStructures = [
  typed({ id: 'min-heap', name: 'Min Heap', run: runMinHeap, ...heapDoc('Min Heap', 'smallest value', 'smaller than'),
    code: { python: 'import heapq\n\nh = []\nfor x in [5, 3, 8, 1, 9]:\n    heapq.heappush(h, x)   # insert\nsmallest = h[0]            # peek\nheapq.heappop(h)           # extract min' } }),
  typed({ id: 'max-heap', name: 'Max Heap', run: runMaxHeap, ...heapDoc('Max Heap', 'largest value', 'larger than'),
    code: { python: 'import heapq\n\nh = []\nfor x in [5, 3, 8, 1, 9]:\n    heapq.heappush(h, -x)  # store negatives to simulate a max-heap\nlargest = -h[0]            # peek\n-heapq.heappop(h)          # extract max' } }),
  typed({
    id: 'priority-queue', name: 'Priority Queue', run: runPriorityQueue, render: renderHeap, canvasClass: 'heapview',
    spec: { enqueue: ['str', 'num'], dequeue: [], peek: [] }, defaultOps: 'enqueue email 3, enqueue backup 5, enqueue alert 1, peek, dequeue, enqueue sms 2, dequeue, dequeue',
    description: 'Serves the item with the smallest priority number first (1 = most urgent). Implemented on a min-heap; each item is shown as value:priority. Values cannot contain spaces.',
    complexity: [['enqueue', 'O(log n)'], ['dequeue (extract highest priority)', 'O(log n)'], ['peek', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Task schedulers, event simulation, Dijkstra, merging sorted lists, bandwidth management.',
    pseudocode: 'enqueue(v, p): heap.insert((p, v))\ndequeue(): return heap.extractMin()\npeek(): return heap.root',
    code: { python: 'import heapq\n\npq = []\nheapq.heappush(pq, (3, "email"))\nheapq.heappush(pq, (1, "alert"))\npriority, task = heapq.heappop(pq)   # (1, "alert")' },
  }),
  typed({
    id: 'trie', name: 'Trie (Prefix Tree)', run: runTrie, render: renderTree, canvasClass: 'tree',
    spec: { insert: ['str'], search: ['str'], prefix: ['str'] }, defaultOps: 'insert cat, insert car, insert dog, search car, search ca, prefix ca, prefix do, search cow',
    description: 'Tree where each edge is a character and each path from the root spells a prefix. Filled nodes mark the end of a stored word. Words are lower-cased and cannot contain spaces.',
    complexity: [['insert / search / prefix', 'O(L) for a word of length L'], ['Space', 'O(total characters)']],
    useCases: 'Autocomplete, spell checkers, dictionary lookups, IP routing, word games.',
    pseudocode: 'insert(w): node = root; for ch in w: create child ch if missing; move to it; mark node as end\nsearch(w): follow each ch; return node exists and node.end\nprefix(p): follow each ch; return true if the path exists',
    code: { python: 'class Trie:\n    def __init__(self):\n        self.kids, self.end = {}, False\n    def insert(self, w):\n        n = self\n        for ch in w:\n            n = n.kids.setdefault(ch, Trie())\n        n.end = True\n    def _walk(self, s):\n        n = self\n        for ch in s:\n            n = n.kids.get(ch)\n            if n is None:\n                return None\n        return n\n    def search(self, w):\n        n = self._walk(w)\n        return bool(n and n.end)\n    def prefix(self, p):\n        return self._walk(p) is not None' },
  }),
  typed({
    id: 'disjoint-set', name: 'Disjoint Set (Union-Find)', run: runDSU, render: renderHeap, canvasClass: 'heapview', parseInitial: parseCount, initialLabel: 'Elements (1-12)', initialDefault: '8',
    spec: { find: ['int'], union: ['int', 'int'], connected: ['int', 'int'] }, defaultOps: 'union 0 1, union 2 3, union 1 3, find 3, union 4 5, union 0 5, connected 2 4, connected 2 6',
    description: 'Tracks which elements belong to the same group. Uses path compression and union by size. The forest shows the sets; the array below is parent[].',
    complexity: [['find / union', 'O(α(n)), effectively constant'], ['Space', 'O(n)']],
    useCases: "Kruskal's MST, connected components, cycle detection, grouping problems.",
    pseudocode: 'find(x): follow parent until a root; point every node on the path to the root (path compression)\nunion(a, b): ra = find(a); rb = find(b); if ra != rb: attach the smaller set under the larger',
    code: { python: 'class DSU:\n    def __init__(self, n):\n        self.p = list(range(n))\n        self.size = [1] * n\n    def find(self, x):\n        if self.p[x] != x:\n            self.p[x] = self.find(self.p[x])  # path compression\n        return self.p[x]\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra == rb:\n            return False\n        if self.size[ra] < self.size[rb]:\n            ra, rb = rb, ra\n        self.p[rb] = ra\n        self.size[ra] += self.size[rb]\n        return True' },
  }),
];
