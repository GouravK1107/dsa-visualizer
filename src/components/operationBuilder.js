import { h } from '../utils/dom.js';
import { parseOpsSpec } from '../utils/parseSpec.js';

const LABEL = { int: 'index', num: 'value', str: 'text' };
const MAX_OPS = 40;

/**
 * Beginner-friendly operation picker: choose an operation, fill in its boxes, press "+ Add".
 * Added operations appear as removable chips and run in order.
 * spec: { opName: ['int' | 'num' | 'str', ...] }  (same shape parseOpsSpec uses)
 */
export function OperationBuilder({ spec, initial = [], onChange = () => {} }) {
  const ops = [...initial];
  const names = Object.keys(spec);
  let argInputs = [];

  const argBox = h('div', { class: 'op-args' });
  const error = h('p', { class: 'error', role: 'alert' });
  const queue = h('div', { class: 'op-list' });
  const select = h('select', { 'aria-label': 'Operation', onchange: () => drawArgs() },
    ...names.map((op) => h('option', { value: op }, op.replace(/_/g, ' '))));
  select.value = names[0];

  function drawArgs() {
    argInputs = spec[select.value].map((type) => h('input', {
      type: type === 'str' ? 'text' : 'number', placeholder: LABEL[type], 'aria-label': LABEL[type],
      step: type === 'num' ? 'any' : type === 'int' ? '1' : null, min: type === 'int' ? '0' : null,
      onkeydown: (e) => { if (e.key === 'Enter') add(); },
    }));
    argBox.replaceChildren(...argInputs);
    if (!argInputs.length) argBox.append(h('span', { class: 'note' }, 'no value needed'));
  }

  function drawQueue() {
    queue.replaceChildren(...(ops.length
      ? ops.map((line, i) => h('span', { class: 'chip' }, `${i + 1}. ${line}`,
        h('button', { 'aria-label': `Remove operation ${i + 1}`, onclick: () => { ops.splice(i, 1); drawQueue(); onChange(); } }, '×')))
      : [h('span', { class: 'note' }, 'Nothing added yet. Pick an operation, fill in the boxes and press + Add.')]));
  }

  function add() {
    error.textContent = '';
    const types = spec[select.value];
    const values = argInputs.map((i) => i.value.trim());
    if (values.some((v) => v === '')) { error.textContent = 'Fill in all the boxes first.'; return; }
    if (types.some((t, i) => t === 'str' && /[\s,;]/.test(values[i]))) { error.textContent = 'Text cannot contain spaces or commas.'; return; }
    const line = [select.value, ...values].join(' ');
    const r = parseOpsSpec(line, spec);
    if (!r.ok) { error.textContent = r.error; return; }
    if (ops.length >= MAX_OPS) { error.textContent = `You can add at most ${MAX_OPS} operations.`; return; }
    ops.push(line);
    argInputs.forEach((i) => { i.value = ''; });
    drawQueue(); onChange();
    argInputs[0]?.focus();
  }

  drawArgs(); drawQueue();
  const el = h('div', { class: 'op-builder' },
    h('div', { class: 'op-row' }, h('label', {}, 'Operation', select), argBox, h('button', { class: 'btn', onclick: add }, '+ Add')),
    error,
    h('div', { class: 'op-queue-head' }, h('strong', {}, 'Operations to run (in order)'),
      h('button', { class: 'btn', onclick: () => { ops.length = 0; drawQueue(); onChange(); } }, 'Clear all')),
    queue);
  return { el, getText: () => ops.join(', '), getOps: () => [...ops] };
}
