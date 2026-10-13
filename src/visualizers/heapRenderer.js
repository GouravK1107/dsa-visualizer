import { h } from '../utils/dom.js';
import { renderTree } from './treeRenderer.js';
import { renderCells } from './cellsRenderer.js';

/** Tree on top, backing array underneath. Used by heaps, priority queue and disjoint set. */
export function renderHeap(container, step) {
  container.replaceChildren();
  if (!step) return;
  const treeBox = h('div', { class: 'heap-tree' }), arrBox = h('div', { class: 'heap-array' });
  container.append(treeBox, arrBox);
  renderTree(treeBox, step);
  renderCells(arrBox, step);
}
