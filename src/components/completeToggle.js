import { h } from '../utils/dom.js';
import { load, save } from '../utils/storage.js';

/** "Mark as completed" button persisted in localStorage under 'done'. */
export function CompleteToggle(id) {
  const btn = h('button', { class: 'btn', onclick: () => {
    const d = load('done', []);
    save('done', d.includes(id) ? d.filter((x) => x !== id) : [...d, id]);
    paint();
  } });
  const paint = () => { btn.textContent = load('done', []).includes(id) ? '✓ Completed' : 'Mark as completed'; };
  paint();
  return btn;
}
