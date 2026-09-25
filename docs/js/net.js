// Two-player co-op over the artifact viewer's live room (presence channel).
// One player hosts (runs the real simulation), the other joins with a 4-letter code
// and mirrors the host's enemies, house and base while playing their own hero.

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export class Net {
  constructor() {
    this.room = null;
    this.role = null;       // 'host' | 'guest' | null
    this.code = null;
    this.partner = null;    // current partner peer
    this.lostT = 0;
    this.ready = this.init();
  }

  async init() {
    // window.claude only exists inside the claude.ai artifact viewer
    for (let i = 0; i < 40 && !(window.claude && window.claude.use); i++) await new Promise(r => setTimeout(r, 250));
    try { if (window.claude && window.claude.use) this.room = await window.claude.use('room'); } catch (_) { this.room = null; }
    return !!this.room;
  }

  get available() { return !!this.room; }
  get active() { return !!this.role; }
  get linked() { return !!(this.role && this.partner); }

  host() {
    let c = '';
    for (let i = 0; i < 4; i++) c += LETTERS[Math.floor(Math.random() * LETTERS.length)];
    this.start('host', c);
    return c;
  }

  join(code) {
    this.start('guest', String(code || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4));
  }

  start(role, code) {
    this.role = role;
    this.code = code;
    this.partner = null;
    this.send({ app: 'holdout', code, role, s: null, p: null, d: null });
  }

  leave() {
    this.role = null;
    this.code = null;
    this.partner = null;
    this.send({ app: null, code: null, role: null, s: null, p: null, d: null }, true);
  }

  send(patch, force = false) {
    if (!this.room || (!this.role && !force)) return;
    this.room.presence(patch).catch(() => {});
  }

  connected() { return !!(this.room && this.room.connected()); }

  // Find the partner in the room. Returns the partner's presence object (or null).
  poll(dt) {
    if (!this.room || !this.role) return null;
    const want = this.role === 'host' ? 'guest' : 'host';
    let found = null;
    for (const p of this.room.peers()) {
      if (p.sameTab) continue;
      const pr = p.presence || {};
      if (pr.app !== 'holdout' || pr.code !== this.code || pr.role !== want) continue;
      if (this.partner && p.peer === this.partner.peer) { found = p; break; }
      if (!found) found = p;
    }
    if (found) { this.partner = found; this.lostT = 0; }
    else if (this.partner) {
      // allow brief reconnects before declaring the partner gone
      this.lostT += dt;
      if (this.lostT > 4) this.partner = null;
    }
    return this.partner ? this.partner.presence : null;
  }
}
