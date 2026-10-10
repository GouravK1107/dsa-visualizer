import { bubbleSort } from './bubbleSort.js';
import { selectionSort } from './selectionSort.js';
import { linearSearch } from './linearSearch.js';
import { binarySearch } from './binarySearch.js';
import { bfs } from './bfs.js';
import { dfs } from './dfs.js';

/** Single registry: add an algorithm here and it appears in the library and gets a page. */
export const algorithms = [
  {
    id: 'bubble-sort', name: 'Bubble Sort', category: 'Sorting', kind: 'sort', run: bubbleSort,
    description: 'Repeatedly compares adjacent elements and swaps them if they are in the wrong order; the largest value "bubbles" to the end each pass.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    useCases: 'Teaching; tiny or nearly sorted inputs.',
    pseudocode: 'for end from n-1 down to 1:\n  swapped = false\n  for j from 0 to end-1:\n    if a[j] > a[j+1]: swap(a[j], a[j+1]); swapped = true\n  if not swapped: stop',
    code: { python: 'def bubble_sort(a):\n    for end in range(len(a) - 1, 0, -1):\n        swapped = False\n        for j in range(end):\n            if a[j] > a[j + 1]:\n                a[j], a[j + 1] = a[j + 1], a[j]\n                swapped = True\n        if not swapped:\n            break\n    return a' },
  },
  {
    id: 'selection-sort', name: 'Selection Sort', category: 'Sorting', kind: 'sort', run: selectionSort,
    description: 'Finds the minimum of the unsorted part and places it at the front, growing a sorted prefix.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    useCases: 'When writes are expensive (at most n-1 swaps).',
    pseudocode: 'for i from 0 to n-2:\n  min = i\n  for j from i+1 to n-1:\n    if a[j] < a[min]: min = j\n  swap(a[i], a[min])',
    code: { python: 'def selection_sort(a):\n    for i in range(len(a) - 1):\n        m = i\n        for j in range(i + 1, len(a)):\n            if a[j] < a[m]:\n                m = j\n        a[i], a[m] = a[m], a[i]\n    return a' },
  },
  {
    id: 'linear-search', name: 'Linear Search', category: 'Searching', kind: 'search', run: linearSearch,
    description: 'Checks each element in order until the target is found or the array ends.',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    useCases: 'Unsorted data; very small arrays.',
    pseudocode: 'for i from 0 to n-1:\n  if a[i] == target: return i\nreturn -1',
    code: { python: 'def linear_search(a, target):\n    for i, v in enumerate(a):\n        if v == target:\n            return i\n    return -1' },
  },
  {
    id: 'binary-search', name: 'Binary Search', category: 'Binary Search', kind: 'search', needsSorted: true, run: binarySearch,
    description: 'Halves the search range each step by comparing the target with the middle element. Requires a sorted array.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    useCases: 'Lookups in sorted arrays; answer-space search.',
    pseudocode: 'lo = 0; hi = n-1\nwhile lo <= hi:\n  mid = (lo+hi)/2\n  if a[mid] == target: return mid\n  if a[mid] < target: lo = mid+1\n  else: hi = mid-1\nreturn -1',
    code: { python: 'def binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == target:\n            return mid\n        if a[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1' },
  },
  {
    id: 'bfs', name: 'Breadth-First Search (BFS)', category: 'Graphs', kind: 'graph', run: bfs,
    description: 'Explores a graph level by level from a start node using a queue. Finds shortest paths in unweighted graphs.',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    useCases: 'Shortest path in unweighted graphs, level-order traversal, connected components.',
    pseudocode: 'queue = [start]; visited = {start}\nwhile queue not empty:\n  u = queue.dequeue()\n  for v in neighbours(u):\n    if v not in visited: visited.add(v); queue.enqueue(v)',
    code: { python: 'from collections import deque\n\ndef bfs(adj, start):\n    seen, order, q = {start}, [], deque([start])\n    while q:\n        u = q.popleft()\n        order.append(u)\n        for v in adj[u]:\n            if v not in seen:\n                seen.add(v)\n                q.append(v)\n    return order' },
  },
  {
    id: 'dfs', name: 'Depth-First Search (DFS)', category: 'Graphs', kind: 'graph', run: dfs,
    description: 'Goes as deep as possible along each branch before backtracking (recursion / stack).',
    complexity: { best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)', space: 'O(V)' },
    useCases: 'Cycle detection, topological sort, connected components, maze solving.',
    pseudocode: 'visit(u):\n  visited.add(u)\n  for v in neighbours(u):\n    if v not in visited: visit(v)',
    code: { python: 'def dfs(adj, start):\n    seen, order = set(), []\n    def visit(u):\n        seen.add(u)\n        order.append(u)\n        for v in adj[u]:\n            if v not in seen:\n                visit(v)\n    visit(start)\n    return order' },
  },
];
export const getAlgorithm = (id) => algorithms.find((a) => a.id === id);
export const categories = [...new Set(algorithms.map((a) => a.category))];
