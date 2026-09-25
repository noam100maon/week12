// Procedural sound effects with WebAudio (no audio files needed).

export class Sfx {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.last = {};
  }

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      const len = this.ctx.sampleRate;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  ok(name, gap = 0.025) {
    if (!this.enabled || !this.ctx || this.ctx.state !== 'running') return false;
    const t = this.ctx.currentTime;
    if (this.last[name] && t - this.last[name] < gap) return false;
    this.last[name] = t;
    return true;
  }

  noiseHit(dur, type, freq, gain, q = 1, freqEnd = null, delay = 0) {
    const c = this.ctx, t = c.currentTime + delay;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = c.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t, Math.random() * 0.5, dur + 0.05);
  }

  tone(type, f0, f1, dur, gain, delay = 0) {
    const c = this.ctx, t = c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  shot(kind) {
    if (!this.ok('shot', 0.03)) return;
    switch (kind) {
      case 'pistol':
        this.noiseHit(0.16, 'bandpass', 1800, 0.9, 0.8, 500);
        this.tone('square', 220, 60, 0.08, 0.25);
        break;
      case 'smg':
        this.noiseHit(0.09, 'bandpass', 2400, 0.6, 0.9, 900);
        this.tone('square', 180, 70, 0.05, 0.15);
        break;
      case 'shotgun':
        this.noiseHit(0.4, 'lowpass', 2600, 1.2, 0.7, 200);
        this.tone('sine', 120, 40, 0.25, 0.7);
        this.noiseHit(0.08, 'bandpass', 900, 0.4, 2, 700, 0.35);
        break;
      case 'rifle':
        this.noiseHit(0.14, 'bandpass', 1500, 0.85, 0.7, 400);
        this.tone('sawtooth', 150, 50, 0.08, 0.25);
        break;
      case 'sniper':
        this.noiseHit(0.6, 'lowpass', 4000, 1.2, 0.5, 150);
        this.tone('sine', 90, 30, 0.45, 0.8);
        break;
      case 'rocket':
        this.noiseHit(0.7, 'bandpass', 700, 0.9, 0.5, 2500);
        this.tone('sawtooth', 80, 200, 0.35, 0.2);
        break;
      case 'turret':
        this.noiseHit(0.07, 'highpass', 2800, 0.25, 0.7);
        break;
    }
  }

  hit(head) {
    if (!this.ok('hit', 0.04)) return;
    if (head) this.tone('triangle', 1600, 1200, 0.09, 0.28);
    else this.tone('triangle', 900, 500, 0.06, 0.18);
  }

  enemyDie() {
    if (!this.ok('die', 0.06)) return;
    this.tone('square', 300, 60, 0.35, 0.18);
    this.noiseHit(0.3, 'lowpass', 1200, 0.4, 1, 200);
  }

  explosion() {
    if (!this.ok('boom', 0.05)) return;
    this.noiseHit(1.1, 'lowpass', 1400, 1.4, 0.6, 80);
    this.tone('sine', 110, 25, 0.8, 1.0);
  }

  coin() {
    if (!this.ok('coin', 0.045)) return;
    const f = 1200 + Math.random() * 200;
    this.tone('square', f, f, 0.06, 0.08);
    this.tone('square', f * 1.5, f * 1.5, 0.12, 0.08, 0.05);
  }

  houseHit() {
    if (!this.ok('house', 0.18)) return;
    this.noiseHit(0.25, 'lowpass', 500, 0.8, 1, 120);
    this.tone('sine', 90, 50, 0.2, 0.4);
  }

  fenceHit() {
    if (!this.ok('fence', 0.2)) return;
    this.noiseHit(0.18, 'bandpass', 700, 0.6, 1.5, 300);
  }

  fenceBreak() {
    if (!this.ok('fencebreak', 0.1)) return;
    this.noiseHit(0.6, 'bandpass', 900, 1.0, 0.7, 150);
    this.tone('square', 200, 50, 0.3, 0.2);
  }

  hurt() {
    if (!this.ok('hurt', 0.25)) return;
    this.tone('sawtooth', 220, 110, 0.18, 0.3);
    this.noiseHit(0.15, 'lowpass', 800, 0.4);
  }

  reload() {
    if (!this.ok('reload', 0.2)) return;
    this.noiseHit(0.05, 'highpass', 3000, 0.4, 1);
    this.noiseHit(0.06, 'bandpass', 1800, 0.5, 3, null, 0.18);
  }

  reloadDone() {
    if (!this.ok('reloaddone', 0.2)) return;
    this.noiseHit(0.05, 'bandpass', 2400, 0.6, 3);
    this.tone('square', 700, 700, 0.03, 0.06, 0.02);
  }

  empty() {
    if (!this.ok('empty', 0.25)) return;
    this.tone('square', 1500, 1500, 0.02, 0.08);
  }

  swap() {
    if (!this.ok('swap', 0.1)) return;
    this.noiseHit(0.08, 'bandpass', 1300, 0.4, 2);
  }

  click() {
    if (!this.ok('click', 0.03)) return;
    this.tone('triangle', 900, 1300, 0.06, 0.15);
  }

  buy() {
    if (!this.ok('buy', 0.05)) return;
    [0, 0.07, 0.14].forEach((d, i) => this.tone('square', 660 * Math.pow(1.26, i), 660 * Math.pow(1.26, i), 0.1, 0.1, d));
  }

  deny() {
    if (!this.ok('deny', 0.1)) return;
    this.tone('square', 200, 150, 0.15, 0.12);
  }

  waveStart() {
    if (!this.ok('wave', 0.5)) return;
    this.tone('sawtooth', 110, 110, 0.9, 0.25);
    this.tone('sawtooth', 165, 165, 0.9, 0.18, 0.05);
    this.tone('sine', 55, 55, 1.2, 0.4);
  }

  countdown(final) {
    if (!this.ok('count', 0.3)) return;
    this.tone('square', final ? 880 : 440, final ? 880 : 440, final ? 0.35 : 0.12, 0.12);
  }

  victory() {
    if (!this.ok('victory', 1)) return;
    [523, 659, 784, 1046].forEach((f, i) => this.tone('square', f, f, 0.25, 0.12, i * 0.12));
  }

  defeat() {
    if (!this.ok('defeat', 1)) return;
    [392, 330, 262, 196].forEach((f, i) => this.tone('sawtooth', f, f * 0.98, 0.35, 0.14, i * 0.18));
  }

  bossRoar() {
    if (!this.ok('roar', 1)) return;
    this.noiseHit(1.5, 'lowpass', 600, 1.2, 2, 120);
    this.tone('sawtooth', 70, 45, 1.4, 0.5);
  }

  portal() {
    if (!this.ok('portal', 0.15)) return;
    this.tone('sine', 300, 900, 0.3, 0.07);
  }
  levelUp(big) {
    if (!this.ok('lvl', 0.3)) return;
    const notes = big ? [523, 659, 784, 1046, 1318] : [784, 1046];
    notes.forEach((f, i) => this.tone(big ? 'square' : 'triangle', f, f, 0.18, big ? 0.12 : 0.1, i * 0.08));
    if (big) this.noiseHit(0.8, 'highpass', 6000, 0.25, 0.5, null, 0.1);
  }

  ability() {
    if (!this.ok('ability', 0.2)) return;
    this.tone('sawtooth', 200, 900, 0.25, 0.15);
    this.noiseHit(0.3, 'bandpass', 2000, 0.4, 1, 500);
  }

  zap() {
    if (!this.ok('zap', 0.06)) return;
    this.noiseHit(0.15, 'highpass', 3500, 0.5, 0.7);
    this.tone('square', 1800, 300, 0.1, 0.08);
  }

  heal() {
    if (!this.ok('heal', 0.3)) return;
    [440, 554, 659, 880].forEach((f, i) => this.tone('sine', f, f, 0.3, 0.12, i * 0.05));
  }

  place() {
    if (!this.ok('place', 0.05)) return;
    this.noiseHit(0.12, 'lowpass', 900, 0.7, 1, 200);
    this.tone('square', 180, 120, 0.08, 0.12);
  }

  sell() {
    if (!this.ok('sell', 0.05)) return;
    this.tone('triangle', 900, 500, 0.12, 0.12);
  }

  spit() {
    if (!this.ok('spit', 0.12)) return;
    this.noiseHit(0.2, 'bandpass', 900, 0.4, 3, 300);
  }

  laser() {
    if (!this.ok('laser', 0.08)) return;
    this.tone('sawtooth', 1400, 200, 0.15, 0.08);
  }

  beep() {
    if (!this.ok('beep', 0.25)) return;
    this.tone('square', 1200, 1200, 0.05, 0.06);
  }
}

