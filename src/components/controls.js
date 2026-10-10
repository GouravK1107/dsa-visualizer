import { h } from '../utils/dom.js';

/** Playback bar bound to a Player. Returns {el, update(index,total,playing)}. */
export function PlaybackControls(player) {
  const info = h('span', { class: 'step-info' }, 'Step 0 / 0');
  const playBtn = h('button', { class: 'btn primary', onclick: () => (player.playing ? player.pause() : player.play()) }, 'Play');
  const speed = h('select', { 'aria-label': 'Speed', onchange: (e) => player.setSpeed(Number(e.target.value)) },
    ...[0.5, 1, 2, 4].map((s) => h('option', { value: s, selected: s === 1 }, `${s}x`)));
  const el = h('div', { class: 'controls' },
    h('button', { class: 'btn', onclick: () => player.reset() }, 'Reset'),
    h('button', { class: 'btn', onclick: () => player.prev() }, 'Prev'),
    playBtn,
    h('button', { class: 'btn', onclick: () => player.next() }, 'Next'),
    speed, info);
  return { el, update(i, total, playing) { info.textContent = `Step ${total ? i + 1 : 0} / ${total}`; playBtn.textContent = playing ? 'Pause' : 'Play'; } };
}
