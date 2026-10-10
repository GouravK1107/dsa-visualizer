import { runStack } from './stack.js';
import { runQueue } from './queue.js';
import { runArray } from './array.js';
import { runString } from './string.js';
import { runLinkedList } from './linkedList.js';
import { moreStructures } from './more.js';
import { parseArray } from '../utils/parse.js';
import { parseText } from '../utils/parseSpec.js';

/** Entries with `spec` use typed args (parseOpsSpec); older ones use allowed/needsArg. */
const typed = (o) => ({ category: 'Data Structures', ...o, allowed: Object.keys(o.spec) });

export const dataStructures = [
  typed({
    id: 'array', name: 'Array', run: runArray, parseInitial: parseArray, initialLabel: 'Initial array', initialDefault: '10, 20, 30, 40',
    spec: { access: ['int'], update: ['int', 'num'], insert: ['int', 'num'], delete: ['int'], append: ['num'], search: ['num'] },
    defaultOps: 'access 2, update 1 25, insert 2 99, delete 0, append 7, search 30, search 500, access 9',
    description: 'Contiguous elements addressed by index. Operations: access, update, insert, delete, append, search.',
    complexity: [['access / update', 'O(1)'], ['append (amortised)', 'O(1)'], ['insert / delete at index', 'O(n) – elements shift'], ['search (unsorted)', 'O(n)'], ['Space', 'O(n)']],
    useCases: 'Lookup by index, buffers, the base for stacks, heaps and hash tables.',
    pseudocode: 'insert(i, x): grow by 1; for k from n down to i+1: a[k] = a[k-1]; a[i] = x\ndelete(i): for k from i to n-2: a[k] = a[k+1]; shrink by 1\nsearch(x): for i in 0..n-1: if a[i] == x: return i',
    code: { python: 'a = [10, 20, 30, 40]\nv = a[2]          # access  O(1)\na[1] = 25         # update  O(1)\na.insert(2, 99)   # insert  O(n)\ndel a[0]          # delete  O(n)\na.append(7)       # append  O(1) amortised\nidx = a.index(30) if 30 in a else -1   # search O(n)' },
  }),
  typed({
    id: 'string', name: 'String', run: runString, parseInitial: parseText, initialLabel: 'Initial string', initialDefault: 'hello',
    spec: { append: ['str'], insert: ['int', 'str'], delete: ['int'], charat: ['int'], find: ['str'], reverse: [], upper: [], lower: [] },
    defaultOps: 'append _world, insert 0 >>, charat 3, find wor, upper, reverse, delete 0, find zzz',
    description: 'Sequence of characters. Operations: append, insert, delete, charat, find, reverse, upper, lower. Values cannot contain spaces or commas.',
    complexity: [['charat', 'O(1)'], ['append', 'O(k) for k new chars'], ['insert / delete', 'O(n)'], ['find (naive)', 'O(n·m)'], ['reverse / upper / lower', 'O(n)'], ['Space', 'O(n)']],
    useCases: 'Text processing, parsing, searching, pattern problems.',
    pseudocode: 'find(sub): for i in 0..n-m: if s[i..i+m-1] == sub: return i\nreturn -1\nreverse(): l = 0; r = n-1; while l < r: swap(s[l], s[r]); l++; r--',
    code: { python: 's = "hello"\ns = s + "_world"      # append (strings are immutable: builds a new one)\ns = s[:0] + ">>" + s[0:]   # insert\nc = s[3]             # charat\ni = s.find("wor")    # find, -1 if missing\ns = s.upper()[::-1] # upper + reverse' },
  }),
  typed({
    id: 'linked-list', name: 'Linked List', run: runLinkedList, parseInitial: parseArray, initialLabel: 'Initial list', initialDefault: '3, 7, 9',
    spec: { insert_head: ['num'], insert_tail: ['num'], insert_at: ['int', 'num'], delete_head: [], delete_tail: [], delete_value: ['num'], search: ['num'], traverse: [], reverse: [] },
    defaultOps: 'insert_head 1, insert_tail 12, insert_at 2 5, search 9, delete_value 7, delete_head, delete_tail, reverse, traverse',
    description: 'Singly linked list: nodes joined by next pointers (head pointer only). Operations: insert/delete at head, tail, position or by value, search, traverse, reverse.',
    complexity: [['insert / delete at head', 'O(1)'], ['insert / delete at tail', 'O(n) – no tail pointer'], ['insert at position / delete by value', 'O(n)'], ['search / traverse', 'O(n)'], ['reverse', 'O(n) time, O(1) space'], ['Space', 'O(n)']],
    useCases: 'Cheap head insertion, stacks/queues, adjacency lists, when random access is not needed.',
    pseudocode: 'insert_head(x): node = Node(x); node.next = head; head = node\nreverse(): prev = null; curr = head\n  while curr: next = curr.next; curr.next = prev; prev = curr; curr = next\n  head = prev',
    code: { python: 'class Node:\n    def __init__(self, val, nxt=None):\n        self.val, self.next = val, nxt\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    def insert_head(self, x):\n        self.head = Node(x, self.head)\n    def reverse(self):\n        prev, curr = None, self.head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev, curr = curr, nxt\n        self.head = prev' },
  }),
  {
    id: 'stack', name: 'Stack', category: 'Data Structures', run: runStack,
    allowed: ['push', 'pop', 'peek'], needsArg: ['push'], defaultOps: 'push 5, push 3, push 8, pop, peek, pop, pop, pop',
    description: 'Last-in, first-out (LIFO) collection. Operations: push, pop, peek.',
    complexity: [['push', 'O(1)'], ['pop', 'O(1)'], ['peek', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Undo history, call stack, expression evaluation, DFS.',
    pseudocode: 'push(x): items.append(x)\npop(): if empty: underflow else return items.removeLast()\npeek(): if empty: underflow else return items.last',
    code: { python: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, x):\n        self.items.append(x)\n    def pop(self):\n        if not self.items:\n            raise IndexError("underflow")\n        return self.items.pop()\n    def peek(self):\n        return self.items[-1]' },
  },
  {
    id: 'queue', name: 'Queue', category: 'Data Structures', run: runQueue,
    allowed: ['enqueue', 'dequeue', 'front'], needsArg: ['enqueue'], defaultOps: 'enqueue 4, enqueue 7, enqueue 1, dequeue, front, dequeue, dequeue, dequeue',
    description: 'First-in, first-out (FIFO) collection. Operations: enqueue, dequeue, front.',
    complexity: [['enqueue', 'O(1)'], ['dequeue', 'O(1) with a deque / linked list'], ['front', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Task scheduling, buffering, BFS.',
    pseudocode: 'enqueue(x): items.append(x)\ndequeue(): if empty: underflow else return items.removeFirst()\nfront(): if empty: underflow else return items.first',
    code: { python: 'from collections import deque\n\nclass Queue:\n    def __init__(self):\n        self.items = deque()\n    def enqueue(self, x):\n        self.items.append(x)\n    def dequeue(self):\n        if not self.items:\n            raise IndexError("underflow")\n        return self.items.popleft()\n    def front(self):\n        return self.items[0]' },
  },
  ...moreStructures,
];
export const getDataStructure = (id) => dataStructures.find((d) => d.id === id);
