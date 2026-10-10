import { h } from '../utils/dom.js';
import { algorithms, getAlgorithm } from '../algorithms/index.js';
import { dataStructures } from '../data-structures/index.js';
import { load, save } from '../utils/storage.js';

export function DashboardPage() {
  const done = load('done', []);
  const items = [
    ...algorithms.map((a) => ({ ...a, href: `#/algorithms/${a.id}` })),
    ...dataStructures.map((d) => ({ ...d, href: `#/data-structures/${d.id}` })),
  ];
  const groups = {};
  items.forEach((i) => (groups[i.category] ||= []).push(i));
  const recent = load('recent', []).map(getAlgorithm).filter(Boolean);
  return h('main', { class: 'page' }, h('h1', {}, 'Dashboard'),
    h('p', { class: 'lead' }, `${items.filter((i) => done.includes(i.id)).length} of ${items.length} topics completed (saved in this browser only).`),
    recent.length ? h('section', {}, h('h2', {}, 'Recently visited'), h('ul', {}, recent.map((a) => h('li', {}, h('a', { href: `#/algorithms/${a.id}` }, a.name))))) : null,
    ...Object.entries(groups).map(([cat, list]) => h('section', {},
      h('h2', {}, `${cat} (${list.filter((i) => done.includes(i.id)).length}/${list.length})`),
      h('ul', {}, list.map((i) => h('li', {}, done.includes(i.id) ? '✓ ' : '', h('a', { href: i.href }, i.name)))))),
    h('button', { class: 'btn', onclick: () => { save('done', []); location.reload(); } }, 'Reset progress'));
}
