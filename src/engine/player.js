/**
 * Generic playback engine. Knows nothing about algorithms or rendering:
 * it just walks a list of recorded steps and notifies a listener.
 */
export class Player {
  constructor(onChange) {
    this.onChange = onChange;
    this.steps = [];
    this.index = 0;
    this.speed = 1;
    this.timer = null;
  }
  get playing() { return this.timer !== null; }
  get current() { return this.steps[this.index]; }
  load(steps) { this.stop(); this.steps = steps; this.index = 0; this.emit(); }
  emit() { this.onChange(this.current, this.index, this.steps.length, this.playing); }
  stop() { if (this.timer !== null) { clearInterval(this.timer); this.timer = null; } }
  tick() {
    if (this.index < this.steps.length - 1) this.index++;
    if (this.index >= this.steps.length - 1) this.stop();
    this.emit();
  }
  play() {
    if (this.playing || this.steps.length === 0) return;
    if (this.index >= this.steps.length - 1) this.index = 0;
    this.timer = setInterval(() => this.tick(), 900 / this.speed);
    this.emit();
  }
  pause() { this.stop(); this.emit(); }
  next() { this.stop(); if (this.index < this.steps.length - 1) this.index++; this.emit(); }
  prev() { this.stop(); if (this.index > 0) this.index--; this.emit(); }
  reset() { this.stop(); this.index = 0; this.emit(); }
  setSpeed(s) { this.speed = s; if (this.playing) { this.stop(); this.play(); } }
}
