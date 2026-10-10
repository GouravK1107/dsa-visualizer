import { h } from '../utils/dom.js';
import { algorithms } from '../algorithms/index.js';

export function LibraryPage() {
  const list = h('div', { class: 'grid' });
  const draw = (q = '') => {
    list.replaceChildren(...algorithms
      .filter((a) => (a.name + a.category).toLowerCase().includes(q.toLowerCase()))
      .map((a) => h('a', { class: 'card', href: `#/algorithms/${a.id}` },
        h('span', { class: 'tag' }, a.category), h('h3', {}, a.name), h('p', {}, a.description))));
    if (!list.children.length) list.append(h('p', {}, 'No algorithms match your search.'));
  };
  draw();
  return h('main', { class: 'page' }, h('h1', {}, 'Algorithm Library'),
    h('input', { type: 'search', placeholder: 'Search algorithms…', 'aria-label': 'Search', oninput: (e) => draw(e.target.value) }), list);
}
