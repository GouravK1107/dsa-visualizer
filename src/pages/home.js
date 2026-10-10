import { h } from '../utils/dom.js';
import { algorithms, categories, getAlgorithm } from '../algorithms/index.js';
import { dataStructures } from '../data-structures/index.js';
import { load } from '../utils/storage.js';

export function HomePage() {
  const recent = load('recent', []).map(getAlgorithm).filter(Boolean);
  return h('main', { class: 'page' },
    h('h1', {}, 'Learn algorithms by watching them run'),
    h('p', { class: 'lead' }, 'Free, open, no account. Enter your own input and step through the real execution.'),
    h('a', { class: 'btn primary', href: '#/algorithms' }, 'Browse algorithms'),
    h('h2', {}, 'Available now'),
    h('p', {}, `${algorithms.length} algorithms in ${categories.length} categories: ${categories.join(', ')}, plus ${dataStructures.length} data structures (${dataStructures.map((d) => d.name).join(', ')}).`),
    recent.length ? h('div', {}, h('h2', {}, 'Recently visited'), h('ul', {}, recent.map((a) => h('li', {}, h('a', { href: `#/algorithms/${a.id}` }, a.name))))) : null);
}
