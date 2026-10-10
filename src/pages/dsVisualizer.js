import { h } from '../utils/dom.js';
import { getDataStructure } from '../data-structures/index.js';
import { Player } from '../engine/player.js';
import { PlaybackControls } from '../components/controls.js';
import { CompleteToggle } from '../components/completeToggle.js';
import { renderCells } from '../visualizers/cellsRenderer.js';
import { parseOps } from '../utils/parse.js';
import { parseOpsSpec } from '../utils/parseSpec.js';
import { load, save } from '../utils/storage.js';

export function DataStructurePage({ id }) {
  const ds = getDataStructure(id);
  if (!ds) return h('main', { class: 'page' }, h('h1', {}, 'Data structure not found'), h('a', { href: '#/data-structures' }, 'Back'));
  const canvas = h('div', { class: `canvas ${ds.canvasClass ?? 'cells'}`, role: 'img', 'aria-label': 'Visualisation' });
  const message = h('p', { class: 'message', 'aria-live': 'polite' });
  const error = h('p', { class: 'error', role: 'alert' });
  let bar;
  const player = new Player((step, i, total, playing) => {
    (ds.render ?? renderCells)(canvas, step); message.textContent = step ? step.message : ''; bar?.update(i, total, playing);
  });
  bar = PlaybackControls(player);
  const input = h('input', { value: load(`ops:${id}`, ds.defaultOps), size: 52, 'aria-label': 'Operations' });
  const initInput = ds.parseInitial ? h('input', { value: load(`init:${id}`, ds.initialDefault), size: 22, 'aria-label': ds.initialLabel }) : null;

  const run = () => {
    error.textContent = '';
    let init;
    if (initInput) {
      const i = ds.parseInitial(initInput.value);
      if (!i.ok) { error.textContent = i.error; return; }
      init = i.value;
    }
    const r = ds.spec ? parseOpsSpec(input.value, ds.spec) : parseOps(input.value, ds.allowed, ds.needsArg);
    if (!r.ok) { error.textContent = r.error; return; }
    save(`ops:${id}`, input.value);
    if (initInput) save(`init:${id}`, initInput.value);
    player.load(ds.run(r.value, init));
  };

  const page = h('main', { class: 'page' },
    h('p', { class: 'crumbs' }, h('a', { href: '#/data-structures' }, 'Data Structures')),
    h('h1', {}, ds.name), h('p', {}, ds.description),
    h('div', { class: 'inputs' },
      initInput ? h('label', {}, ds.initialLabel, initInput) : null,
      h('label', {}, `Operations: ${ds.allowed.join(', ')}`, input),
      h('button', { class: 'btn primary', onclick: run }, 'Visualise'), CompleteToggle(id)),
    error, canvas, message, bar.el,
    h('div', { class: 'two-col' },
      h('section', {}, h('h2', {}, 'Complexity'), h('table', {}, ...ds.complexity.map(([k, v]) => h('tr', {}, h('th', {}, k), h('td', {}, v)))),
        h('h2', {}, 'Use cases'), h('p', {}, ds.useCases)),
      h('section', {}, h('h2', {}, 'Pseudocode'), h('pre', {}, ds.pseudocode), h('h2', {}, 'Python'), h('pre', {}, ds.code.python))));
  run();
  page.cleanup = () => player.stop();
  return page;
}
