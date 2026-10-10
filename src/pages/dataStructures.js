import { h } from '../utils/dom.js';
import { dataStructures } from '../data-structures/index.js';

export function DataStructuresPage() {
  return h('main', { class: 'page' }, h('h1', {}, 'Data Structures'),
    h('div', { class: 'grid' }, dataStructures.map((d) => h('a', { class: 'card', href: `#/data-structures/${d.id}` },
      h('h3', {}, d.name), h('p', {}, d.description)))));
}
