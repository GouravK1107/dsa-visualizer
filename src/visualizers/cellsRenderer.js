import { h } from '../utils/dom.js';

/**
 * Renders linear structures (array, string, stack, queue, linked list) as boxes.
 * Optional step fields: labels{i:text}, index, marks[], span[start,len], linked, gaps[], noNull.
 */
export function renderCells(container, step) {
  container.replaceChildren();
  if (!step) return;
  if (!step.items.length) container.append(h('span', { class: 'empty' }, step.linked ? 'head → null' : '(empty)'));
  const hot = (i) => i === step.index || step.marks?.includes(i) || (step.span && i >= step.span[0] && i < step.span[0] + step.span[1]);
  step.items.forEach((v, i) => {
    if (step.linked && i === 0 && step.startMark) container.append(h('span', { class: 'arrow' }, step.startMark));
    container.append(h('div', { class: 'cell-col' },
      h('span', { class: 'cell-tag' }, step.labels?.[i] || ''),
      h('div', { class: `cell ${hot(i) ? step.type : ''}` }, v == null ? '' : String(v))));
    if (step.linked) {
      const last = i === step.items.length - 1;
      if (!last) container.append(h('span', { class: 'arrow' }, step.gaps?.[i] ?? step.gap ?? '→'));
      else if (!step.noNull) container.append(h('span', { class: 'arrow' }, step.endMark ?? '→ null'));
    }
  });
}
