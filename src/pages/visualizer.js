import { h } from '../utils/dom.js';
import { getAlgorithm } from '../algorithms/index.js';
import { Player } from '../engine/player.js';
import { PlaybackControls } from '../components/controls.js';
import { renderBars } from '../visualizers/barsRenderer.js';
import { renderGraph } from '../visualizers/graphRenderer.js';
import { CompleteToggle } from '../components/completeToggle.js';
import { parseArray, parseNumber, parseGraph, isSorted } from '../utils/parse.js';
import { load, save } from '../utils/storage.js';

export function VisualizerPage({ id }) {
  const algo = getAlgorithm(id);
  if (!algo) return h('main', { class: 'page' }, h('h1', {}, 'Algorithm not found'), h('a', { href: '#/algorithms' }, 'Back to library'));
  save('recent', [id, ...load('recent', []).filter((x) => x !== id)].slice(0, 5));

  const canvas = h('div', { class: 'canvas', role: 'img', 'aria-label': 'Visualisation' });
  const message = h('p', { class: 'message', 'aria-live': 'polite' });
  const error = h('p', { class: 'error', role: 'alert' });
  let bar;
  const player = new Player((step, i, total, playing) => {
    (algo.kind === 'graph' ? renderGraph : renderBars)(canvas, step);
    message.textContent = step ? step.message : '';
    bar?.update(i, total, playing);
  });
  bar = PlaybackControls(player);

  const isGraph = algo.kind === 'graph';
  const saved = load(`input:${id}`, isGraph ? { array: 'A-B, A-C, B-D, C-D, D-E, F', target: 'A' } : { array: algo.needsSorted ? '2, 5, 8, 12, 16, 23, 38' : '5, 2, 9, 1, 7', target: '23' });
  const arrayInput = h('input', { value: saved.array, 'aria-label': 'Array' });
  const targetInput = h('input', { value: saved.target, size: 6, 'aria-label': 'Target' });

  const run = () => {
    error.textContent = '';
    const arr = (isGraph ? parseGraph : parseArray)(arrayInput.value);
    if (!arr.ok) { error.textContent = arr.error; return; }
    const args = [arr.value];
    if (isGraph) {
      const s = targetInput.value.trim();
      if (!arr.value.nodes.includes(s)) { error.textContent = `Start node "${s}" is not in the graph.`; return; }
      args.push(s);
    } else if (algo.kind === 'search') {
      const t = parseNumber(targetInput.value);
      if (!t.ok) { error.textContent = t.error; return; }
      args.push(t.value);
    }
    if (algo.needsSorted && !isSorted(arr.value)) { error.textContent = `${algo.name} needs a sorted (ascending) array.`; return; }
    save(`input:${id}`, { array: arrayInput.value, target: targetInput.value });
    player.load(algo.run(...args));
  };

  const form = h('div', { class: 'inputs' },
    h('label', {}, isGraph ? 'Edges (u-v, comma separated)' : 'Array', arrayInput),
    algo.kind !== 'sort' ? h('label', {}, isGraph ? 'Start node' : 'Target', targetInput) : null,
    h('button', { class: 'btn primary', onclick: run }, 'Visualise'), CompleteToggle(id));

  const c = algo.complexity;
  const page = h('main', { class: 'page' },
    h('p', { class: 'crumbs' }, h('a', { href: '#/algorithms' }, 'Algorithms'), ' / ', algo.category),
    h('h1', {}, algo.name), h('p', {}, algo.description),
    form, error, canvas, message, bar.el,
    h('div', { class: 'two-col' },
      h('section', {}, h('h2', {}, 'Complexity'),
        h('table', {}, ...[['Best', c.best], ['Average', c.average], ['Worst', c.worst], ['Space', c.space]]
          .map(([k, v]) => h('tr', {}, h('th', {}, k), h('td', {}, v)))),
        h('h2', {}, 'Use cases'), h('p', {}, algo.useCases)),
      h('section', {}, h('h2', {}, 'Pseudocode'), h('pre', {}, algo.pseudocode),
        h('h2', {}, 'Python'), h('pre', {}, algo.code.python),
        h('p', { class: 'note' }, 'Code shown is for reading; the animation runs the JavaScript implementation in src/algorithms/.'))));
  run();
  page.cleanup = () => player.stop();
  return page;
}
