import { h } from '../utils/dom.js';
export function AboutPage() {
  return h('main', { class: 'page' }, h('h1', {}, 'About'),
    h('p', {}, 'DSA Visualizer is a free, open-use learning project built by Gourav R (Adex). No login, no backend, no tracking; only theme, recent algorithms and your last inputs are stored in your browser.'),
    h('p', {}, 'Built with plain HTML, CSS and JavaScript modules. Add profile links here.'));
}
