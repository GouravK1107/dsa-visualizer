import { h } from '../utils/dom.js';
/** Hash table: one row per bucket with its chain. step: {buckets:[[...]], hot:{b,i}, type}. */
export function renderBuckets(container, step) {
  container.replaceChildren();
  if (!step) return;
  step.buckets.forEach((chain, b) => {
    const on = step.hot && step.hot.b === b;
    container.append(h('div', { class: `bucket-row${on ? ' hot' : ''}` },
      h('span', { class: 'bucket-idx' }, `[${b}]`),
      ...chain.flatMap((v, i) => [h('div', { class: `cell ${on && step.hot.i === i ? step.type : ''}` }, String(v)), h('span', { class: 'arrow' }, '→')]),
      h('span', { class: 'arrow' }, 'null')));
  });
}
