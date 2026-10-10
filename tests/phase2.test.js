import test from 'node:test';
import assert from 'node:assert/strict';
import { bfs } from '../src/algorithms/bfs.js';
import { dfs } from '../src/algorithms/dfs.js';
import { runStack } from '../src/data-structures/stack.js';
import { runQueue } from '../src/data-structures/queue.js';
import { parseGraph, parseOps } from '../src/utils/parse.js';

const g = parseGraph('A-B, A-C, B-D, C-D, D-E, F').value;
test('parseGraph builds undirected adjacency and keeps isolated nodes', () => {
  assert.deepEqual(g.adj.A, ['B', 'C']);
  assert.deepEqual(g.adj.D, ['B', 'C', 'E']);
  assert.deepEqual(g.adj.F, []);
  assert.equal(parseGraph('A-B-C').ok, false);
  assert.equal(parseGraph('').ok, false);
  assert.equal(parseGraph('A-!').ok, false);
  assert.equal(parseGraph(Array.from({ length: 13 }, (_, i) => `N${i}`).join(',')).ok, false);
});
test('BFS visits level by level; unreachable nodes are not visited', () => {
  const last = bfs(g, 'A').at(-1);
  assert.deepEqual(last.order, ['A', 'B', 'C', 'D', 'E']);
  assert.ok(!last.visited.includes('F'));
});
test('DFS goes deep first', () => {
  assert.deepEqual(dfs(g, 'A').at(-1).order, ['A', 'B', 'D', 'C', 'E']);
});
test('single isolated node works for both traversals', () => {
  const one = parseGraph('X').value;
  assert.deepEqual(bfs(one, 'X').at(-1).order, ['X']);
  assert.deepEqual(dfs(one, 'X').at(-1).order, ['X']);
});
test('stack is LIFO and reports underflow', () => {
  const s = runStack(parseOps('push 1, push 2, pop, pop, pop', ['push', 'pop', 'peek'], ['push']).value);
  assert.equal(s.at(-1).type, 'error');
  assert.match(s[3].message, /returned 2/);
});
test('queue is FIFO and labels front/rear', () => {
  const s = runQueue(parseOps('enqueue 1, enqueue 2, dequeue', ['enqueue', 'dequeue', 'front'], ['enqueue']).value);
  assert.match(s.at(-1).message, /returned 1/);
  assert.deepEqual(s[2].labels, { 0: 'front', 1: 'rear' });
});
test('parseOps validation', () => {
  const a = ['push', 'pop'], n = ['push'];
  assert.equal(parseOps('push', a, n).ok, false);
  assert.equal(parseOps('push x', a, n).ok, false);
  assert.equal(parseOps('pop 3', a, n).ok, false);
  assert.equal(parseOps('jump 1', a, n).ok, false);
  assert.equal(parseOps('', a, n).ok, false);
});
