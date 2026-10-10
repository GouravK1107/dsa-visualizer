import { runLinkedList } from './linkedList.js';
import { runDeque } from './deque.js';
import { runHashTable } from './hashTable.js';
import { runBST } from './bst.js';
import { parseArray } from '../utils/parse.js';
import { renderBuckets } from '../visualizers/bucketsRenderer.js';
import { renderTree } from '../visualizers/treeRenderer.js';

const typed = (o) => ({ category: 'Data Structures', ...o, allowed: Object.keys(o.spec) });
const LL = { insert_head: ['num'], insert_tail: ['num'], insert_at: ['int', 'num'], delete_head: [], delete_tail: [], delete_value: ['num'], search: ['num'], traverse: [] };
const LL_OPS = 'insert_head 1, insert_tail 12, insert_at 2 5, search 9, delete_value 7, delete_head, delete_tail, traverse';
const parseBuckets = (t) => { const n = Number(String(t).trim()); return Number.isInteger(n) && n >= 1 && n <= 10 ? { ok: true, value: n } : { ok: false, error: 'Bucket count must be a whole number from 1 to 10.' }; };

export const moreStructures = [
  typed({
    id: 'hash-table', name: 'Hash Table', run: runHashTable, render: renderBuckets, canvasClass: 'buckets', parseInitial: parseBuckets, initialLabel: 'Buckets (1-10)', initialDefault: '5',
    spec: { insert: ['num'], search: ['num'], delete: ['num'] }, defaultOps: 'insert 12, insert 7, insert 3, insert 22, insert 8, search 22, search 99, delete 7',
    description: 'Maps keys to buckets with a hash function; collisions are handled by chaining. Keys here are numbers; hash(k) = |k| mod bucket count. No automatic resizing yet.',
    complexity: [['insert / search / delete (average)', 'O(1)'], ['worst case (all keys collide)', 'O(n)'], ['Space', 'O(n + buckets)']],
    useCases: 'Dictionaries, sets, caches, counting frequencies, de-duplication.',
    pseudocode: 'insert(k): b = hash(k) mod m; if k not in chain[b]: chain[b].append(k)\nsearch(k): b = hash(k) mod m; scan chain[b] for k\ndelete(k): b = hash(k) mod m; remove k from chain[b]',
    code: { python: 'class HashTable:\n    def __init__(self, m=5):\n        self.m = m\n        self.buckets = [[] for _ in range(m)]\n    def _h(self, k):\n        return abs(int(k)) % self.m\n    def insert(self, k):\n        b = self.buckets[self._h(k)]\n        if k not in b:\n            b.append(k)\n    def search(self, k):\n        return k in self.buckets[self._h(k)]\n    def delete(self, k):\n        b = self.buckets[self._h(k)]\n        if k in b:\n            b.remove(k)' },
  }),
  typed({
    id: 'deque', name: 'Deque', run: runDeque,
    spec: { push_front: ['num'], push_back: ['num'], pop_front: [], pop_back: [], peek_front: [], peek_back: [] },
    defaultOps: 'push_back 4, push_front 9, push_back 2, peek_front, pop_back, pop_front, pop_front, pop_front',
    description: 'Double-ended queue: insert and remove at both ends.',
    complexity: [['push / pop / peek at either end', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Sliding window maximum, palindromes, undo/redo, work stealing.',
    pseudocode: 'push_front(x): insert before first\npush_back(x): insert after last\npop_front(): remove first\npop_back(): remove last',
    code: { python: 'from collections import deque\n\nd = deque()\nd.append(4)       # push_back\nd.appendleft(9)   # push_front\nd.pop()           # pop_back\nd.popleft()       # pop_front' },
  }),
  typed({
    id: 'doubly-linked-list', name: 'Doubly Linked List', parseInitial: parseArray, initialLabel: 'Initial list', initialDefault: '3, 7, 9',
    run: (o, i) => runLinkedList(o, i, { gap: '⇄', startMark: 'null ⇄', endMark: '⇄ null', tail: true }),
    spec: LL, defaultOps: LL_OPS,
    description: 'Each node has prev and next pointers, with head and tail pointers kept, so both ends are O(1).',
    complexity: [['insert / delete at head or tail', 'O(1)'], ['insert at position / delete by value / search', 'O(n)'], ['Space', 'O(n), extra pointer per node']],
    useCases: 'LRU caches, browser history, text editors, deque implementations.',
    pseudocode: 'insert_tail(x): node.prev = tail; tail.next = node; tail = node\ndelete_tail(): tail = tail.prev; tail.next = null',
    code: { python: 'class Node:\n    def __init__(self, val):\n        self.val, self.prev, self.next = val, None, None\n\nclass DLL:\n    def __init__(self):\n        self.head = self.tail = None\n    def insert_tail(self, x):\n        n = Node(x)\n        if not self.tail:\n            self.head = self.tail = n\n        else:\n            n.prev, self.tail.next = self.tail, n\n            self.tail = n' },
  }),
  typed({
    id: 'circular-linked-list', name: 'Circular Linked List', parseInitial: parseArray, initialLabel: 'Initial list', initialDefault: '3, 7, 9',
    run: (o, i) => runLinkedList(o, i, { endMark: '↩ back to head', tail: true }),
    spec: LL, defaultOps: LL_OPS,
    description: 'The last node points back to the head, so the list forms a loop. A tail pointer is kept.',
    complexity: [['insert at head or tail', 'O(1)'], ['delete head', 'O(1)'], ['search / traverse / delete by value', 'O(n)'], ['Space', 'O(n)']],
    useCases: 'Round-robin scheduling, circular buffers, multiplayer turn order.',
    pseudocode: 'insert_tail(x): node.next = head; tail.next = node; tail = node\ntraverse(): node = head; do { visit(node); node = node.next } while node != head',
    code: { python: 'class Node:\n    def __init__(self, val):\n        self.val, self.next = val, None\n\nclass CircularList:\n    def __init__(self):\n        self.tail = None\n    def insert_tail(self, x):\n        n = Node(x)\n        if not self.tail:\n            n.next = n\n        else:\n            n.next, self.tail.next = self.tail.next, n\n        self.tail = n' },
  }),
  typed({
    id: 'bst', name: 'Binary Search Tree', run: runBST, render: renderTree, canvasClass: 'tree', parseInitial: parseArray, initialLabel: 'Initial values (inserted in order)', initialDefault: '50, 30, 70, 20, 40, 60, 80',
    spec: { insert: ['num'], search: ['num'], delete: ['num'], min: [], max: [], inorder: [], preorder: [], postorder: [], levelorder: [] },
    defaultOps: 'insert 35, search 60, search 99, min, max, delete 30, delete 50, inorder, preorder, postorder, levelorder',
    description: 'Binary tree where left < node < right. Duplicates are ignored. Includes delete (leaf, one child, two children) and all four traversals.',
    complexity: [['insert / search / delete (balanced)', 'O(log n)'], ['worst case (sorted input, skewed)', 'O(n)'], ['traversals', 'O(n)'], ['Space', 'O(n)']],
    useCases: 'Ordered sets and maps, range queries, the base for AVL / Red-Black trees.',
    pseudocode: 'insert(x): walk from root: go left if x < node else right; attach at the empty child\ndelete(x): leaf -> remove; one child -> replace by child; two children -> copy inorder successor, delete it\ninorder(n): inorder(n.left); visit(n); inorder(n.right)',
    code: { python: 'class Node:\n    def __init__(self, v):\n        self.v, self.l, self.r = v, None, None\n\ndef insert(root, x):\n    if not root:\n        return Node(x)\n    if x < root.v:\n        root.l = insert(root.l, x)\n    elif x > root.v:\n        root.r = insert(root.r, x)\n    return root\n\ndef inorder(n):\n    return inorder(n.l) + [n.v] + inorder(n.r) if n else []' },
  }),
];
