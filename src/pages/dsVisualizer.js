import { h } from '../utils/dom.js';
import { getDataStructure } from '../data-structures/index.js';
import { Player } from '../engine/player.js';
import { PlaybackControls } from '../components/controls.js';
import { CompleteToggle } from '../components/completeToggle.js';
import { OperationBuilder } from '../components/operationBuilder.js';
import { renderCells } from '../visualizers/cellsRenderer.js';
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

  // Older structures (stack, queue) describe ops as allowed/needsArg; convert to the typed spec the builder uses.
  const spec = ds.spec ?? Object.fromEntries(ds.allowed.map((op) => [op, ds.needsArg.includes(op) ? ['num'] : []]));
  const builder = OperationBuilder({ spec, initial: load(`oplist:${id}`, ds.defaultOps.split(',').map((s) => s.trim())) });
  const initInput = ds.parseInitial ? h('input', { value: load(`init:${id}`, ds.initialDefault), size: 22, 'aria-label': ds.initialLabel }) : null;

  const run = () => {
    error.textContent = '';
    let init;
    if (initInput) {
      const i = ds.parseInitial(initInput.value);
      if (!i.ok) { error.textContent = i.error; return; }
      init = i.value;
    }
    let ops = [];
    if (builder.getOps().length) {
      const r = parseOpsSpec(builder.getText(), spec);
      if (!r.ok) { error.textContent = r.error; return; }
      ops = ds.spec ? r.value : r.value.map(({ op, args }) => ({ op, arg: args[0] }));
    }
    save(`oplist:${id}`, builder.getOps());
    if (initInput) save(`init:${id}`, initInput.value);
    player.load(ds.run(ops, init));
  };

  const page = h('main', { class: 'page' },
    h('p', { class: 'crumbs' }, h('a', { href: '#/data-structures' }, 'Data Structures')),
    h('h1', {}, ds.name), h('p', {}, ds.description),
    initInput ? h('div', { class: 'inputs' }, h('label', {}, ds.initialLabel, initInput)) : null,
    builder.el,
    h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: run }, 'Visualise'), CompleteToggle(id)),
    error, canvas, message, bar.el,
    h('div', { class: 'two-col' },
      h('section', {}, h('h2', {}, 'Complexity'), h('table', {}, ...ds.complexity.map(([k, v]) => h('tr', {}, h('th', {}, k), h('td', {}, v)))),
        h('h2', {}, 'Use cases'), h('p', {}, ds.useCases)),
      h('section', {}, h('h2', {}, 'Pseudocode'), h('pre', {}, ds.pseudocode), h('h2', {}, 'Python'), h('pre', {}, ds.code.python))));
  run();
  page.cleanup = () => player.stop();
  return page;
}
