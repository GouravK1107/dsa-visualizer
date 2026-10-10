import { h } from '../utils/dom.js';
import { load, save } from '../utils/storage.js';

export function applyTheme(t) { document.documentElement.dataset.theme = t; save('theme', t); }

export function Navbar() {
  const link = (href, text) => h('a', { href }, text);
  const toggle = h('button', { class: 'btn', 'aria-label': 'Toggle theme', onclick: () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  } }, 'Theme');
  return h('header', { class: 'navbar' },
    h('a', { href: '#/', class: 'brand' }, 'DSA Visualizer'),
    h('nav', {}, link('#/', 'Home'), link('#/dashboard', 'Dashboard'), link('#/algorithms', 'Algorithms'), link('#/data-structures', 'Data Structures'), link('#/about', 'About')),
    toggle);
}
export function initTheme() {
  document.documentElement.dataset.theme = load('theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}
