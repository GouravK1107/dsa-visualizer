import { h } from '../utils/dom.js';

/** Renders one recorded step (sorting or searching) as labelled bars. */
export function renderBars(container, step) {
  container.replaceChildren();
  if (!step) return;
  const max = Math.max(...step.array.map(Math.abs), 1);
  const [lo, hi] = step.range || [0, step.array.length - 1];
  step.array.forEach((v, i) => {
    const cls = ['bar'];
    if (step.sorted?.includes(i)) cls.push('sorted');
    if (step.range && (i < lo || i > hi)) cls.push('dim');
    if (step.indices.includes(i)) cls.push(step.type === 'swap' ? 'swap' : 'active');
    if (step.found === i) cls.push('found');
    container.append(h('div', { class: 'bar-col' },
      h('div', { class: cls.join(' '), style: `height:${Math.max(6, (Math.abs(v) / max) * 100)}%` }),
      h('span', { class: 'bar-label' }, String(v)),
      h('span', { class: 'bar-index' }, String(i))));
  });
}
