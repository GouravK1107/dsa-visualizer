import { runBinaryTree } from './binaryTree.js';
import { runAVL } from './avl.js';
import { makeGraphRunner } from './graphStructure.js';
import { parseArray } from '../utils/parse.js';
import { parseGraphInput } from '../utils/parseGraph.js';
import { renderTree } from '../visualizers/treeRenderer.js';
import { renderHeap } from '../visualizers/heapRenderer.js';
import { renderGraphStructure } from '../visualizers/graphStructRenderer.js';

const typed = (o) => ({ category: 'Data Structures', ...o, allowed: Object.keys(o.spec) });
const TRAV = { inorder: [], preorder: [], postorder: [], levelorder: [] };

const graphEntry = ({ id, name, directed, weighted }) => typed({
  id, name, run: makeGraphRunner({ directed, weighted }), render: renderGraphStructure, canvasClass: 'heapview',
  parseInitial: (t) => parseGraphInput(t, { directed, weighted }), initialLabel: weighted ? 'Initial edges (A-B:4)' : 'Initial edges (A-B)',
  initialDefault: weighted ? 'A-B:4, A-C:2, B-D:5, C-D:1, E' : 'A-B, A-C, B-D, C-D, E',
  spec: { add_vertex: ['str'], add_edge: weighted ? ['str', 'str', 'num'] : ['str', 'str'], remove_edge: ['str', 'str'], remove_vertex: ['str'], has_edge: ['str', 'str'], neighbors: ['str'] },
  defaultOps: weighted ? 'add_edge E F 7, add_edge A F 3, has_edge A B, neighbors A, add_edge A B 9, remove_edge A B, remove_vertex C'
    : 'add_vertex F, add_edge E F, add_edge A F, has_edge A B, has_edge B C, neighbors A, remove_edge A B, remove_vertex C',
  description: `${directed ? 'Directed' : 'Undirected'}, ${weighted ? 'weighted' : 'unweighted'} graph. ${directed ? 'An edge A → B goes one way only.' : 'An edge A — B works in both directions.'} ${weighted ? 'Every edge carries a weight.' : 'Edges carry no weight.'} Shown as a drawing, an adjacency list and an adjacency matrix. Vertex names: 1-4 letters or digits, at most 12 vertices.`,
  complexity: [['add vertex', 'O(1) list / O(V²) matrix resize'], ['add edge', 'O(1)'], ['remove edge / has edge', 'O(degree) list / O(1) matrix'], ['remove vertex', 'O(V + E) list'], ['Space', 'O(V + E) list / O(V²) matrix']],
  useCases: 'Maps and routes, social networks, dependencies, networks, the input of every graph algorithm.',
  pseudocode: `add_edge(u, v${weighted ? ', w' : ''}): ${directed ? '' : 'adj[v].add(u); '}adj[u].add(v)\nremove_edge(u, v): remove v from adj[u]${directed ? '' : ' and u from adj[v]'}\nneighbors(u): return adj[u]`,
  code: { python: `class Graph:\n    def __init__(self):\n        self.adj = {}\n    def add_vertex(self, v):\n        self.adj.setdefault(v, {})\n    def add_edge(self, u, v, w=1):\n        self.add_vertex(u)\n        self.add_vertex(v)\n        self.adj[u][v] = w\n${directed ? '' : '        self.adj[v][u] = w\n'}    def remove_edge(self, u, v):\n        self.adj[u].pop(v, None)\n${directed ? '' : '        self.adj[v].pop(u, None)\n'}    def neighbors(self, u):\n        return list(self.adj[u])` },
});

export const graphsAndTrees = [
  typed({
    id: 'binary-tree', name: 'Binary Tree', run: runBinaryTree, render: renderHeap, canvasClass: 'heapview', parseInitial: parseArray, initialLabel: 'Initial values (level order)', initialDefault: '1, 2, 3, 4, 5, 6',
    spec: { insert: ['num'], delete: ['num'], search: ['num'], ...TRAV, height: [] }, defaultOps: 'insert 7, search 5, delete 2, inorder, preorder, postorder, levelorder, height',
    description: 'A tree where each node has at most two children (no ordering rule). Insert fills the first free spot level by level; delete copies the deepest rightmost node into the gap. Duplicates are allowed.',
    complexity: [['insert', 'O(1) with array storage'], ['search / delete', 'O(n)'], ['traversals', 'O(n)'], ['height (complete tree)', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Expression trees, hierarchies, the base for BST, heaps and AVL trees.',
    pseudocode: 'insert(x): place x at the first empty position, level by level\ndelete(x): find x; copy the last node into its place; remove the last node\ninorder(n): inorder(n.left); visit(n); inorder(n.right)',
    code: { python: 'class Node:\n    def __init__(self, v):\n        self.v, self.left, self.right = v, None, None\n\ndef inorder(n):\n    return inorder(n.left) + [n.v] + inorder(n.right) if n else []\n\ndef height(n):\n    return 0 if not n else 1 + max(height(n.left), height(n.right))' },
  }),
  typed({
    id: 'avl-tree', name: 'AVL Tree (Balanced BST)', run: runAVL, render: renderTree, canvasClass: 'tree', parseInitial: parseArray, initialLabel: 'Initial values (inserted in order)', initialDefault: '30, 20',
    spec: { insert: ['num'], delete: ['num'], search: ['num'], inorder: [] }, defaultOps: 'insert 10, insert 40, insert 50, insert 45, delete 20, search 45, inorder',
    description: 'A BST that rebalances itself: after every insert or delete, the heights of the two subtrees of any node differ by at most 1. Rotations (LL, RR, LR, RL) restore balance. The balance factor is shown under each node. Duplicates are ignored.',
    complexity: [['insert / delete / search', 'O(log n) guaranteed'], ['rotation', 'O(1)'], ['Space', 'O(n)']],
    useCases: 'Ordered maps and sets with guaranteed fast lookups, databases, in-memory indexes.',
    pseudocode: 'after insert/delete, for each ancestor from the bottom up:\n  bf = height(left) - height(right)\n  bf > 1:  Left-Left -> rotate right;  Left-Right -> rotate left on the left child, then right\n  bf < -1: Right-Right -> rotate left; Right-Left -> rotate right on the right child, then left',
    code: { python: 'def height(n):\n    return n.h if n else 0\n\ndef rotate_right(y):\n    x = y.left\n    y.left, x.right = x.right, y\n    y.h = 1 + max(height(y.left), height(y.right))\n    x.h = 1 + max(height(x.left), height(x.right))\n    return x\n\ndef balance_factor(n):\n    return height(n.left) - height(n.right)' },
  }),
  graphEntry({ id: 'graph-undirected', name: 'Graph (Undirected)', directed: false, weighted: false }),
  graphEntry({ id: 'graph-directed', name: 'Graph (Directed)', directed: true, weighted: false }),
  graphEntry({ id: 'graph-weighted', name: 'Graph (Weighted, Undirected)', directed: false, weighted: true }),
  graphEntry({ id: 'graph-directed-weighted', name: 'Graph (Weighted, Directed)', directed: true, weighted: true }),
];
