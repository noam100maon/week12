// Touch (virtual joystick + drag-to-look + buttons) and keyboard/mouse input.

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    this.enabled = false;
    this.move = { x: 0, y: 0 };
    this.lookDX = 0;
    this.lookDY = 0;
    this.firing = false;
    this.reloadPressed = false;
    this.swapPressed = false;
    this.pausePressed = false;
    this.abilityPressed = false;
    this.fpPressed = false;
    this.keys = {};
    this.mouseDown = false;
    this.pointers = new Map();
    this.joy = { id: null, cx: 0, cy: 0, x: 0, y: 0 };
    this.joyRadius = 60;

    this.joyEl = document.getElementById('joy');
    this.knobEl = document.getElementById('joyKnob');
    this.fireBtn = document.getElementById('fireBtn');

    this.bindTouch();
    this.bindDesktop();
  }

  setEnabled(v) {
    this.enabled = v;
    if (!v) this.reset();
  }

  reset() {
    this.move.x = this.move.y = 0;
    this.lookDX = this.lookDY = 0;
    this.firing = false;
    this.mouseDown = false;
    this.keys = {};
    this.pointers.clear();
    this.joy.id = null;
    this.joyEl.classList.remove('active');
    this.fireBtn.classList.remove('pressed');
    if (document.pointerLockElement) document.exitPointerLock();
  }

  bindTouch() {
    const layer = document.getElementById('touch');
    const joyZone = document.getElementById('joyZone');
    const lookZone = document.getElementById('lookZone');

    const onDown = (role) => (e) => {
      if (!this.enabled) return;
      e.preventDefault();
      e.stopPropagation();
      try { e.target.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
      const p = { role, x: e.clientX, y: e.clientY };
      this.pointers.set(e.pointerId, p);
      if (role === 'joy') {
        this.joy.id = e.pointerId;
        this.joy.cx = e.clientX; this.joy.cy = e.clientY;
        this.joy.x = 0; this.joy.y = 0;
        this.joyEl.style.left = e.clientX + 'px';
        this.joyEl.style.top = e.clientY + 'px';
        this.joyEl.classList.add('active');
        this.knobEl.style.transform = 'translate(-50%,-50%)';
      } else if (role === 'fire') {
        this.firing = true;
        this.fireBtn.classList.add('pressed');
      } else if (role === 'reload') {
        this.reloadPressed = true;
      } else if (role === 'swap') {
        this.swapPressed = true;
      } else if (role === 'fp') {
        this.fpPressed = true;
      } else if (role === 'ability') {
        this.abilityPressed = true;
      }
    };

    const onMove = (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p || !this.enabled) return;
      e.preventDefault();
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (p.role === 'joy') {
        let ox = e.clientX - this.joy.cx, oy = e.clientY - this.joy.cy;
        const len = Math.hypot(ox, oy), r = this.joyRadius;
        if (len > r) {
          // Drag the joystick base along so it never feels stuck.
          const k = (len - r) / len;
          this.joy.cx += ox * k; this.joy.cy += oy * k;
          ox -= ox * k; oy -= oy * k;
          this.joyEl.style.left = this.joy.cx + 'px';
          this.joyEl.style.top = this.joy.cy + 'px';
        }
        this.joy.x = ox / r; this.joy.y = oy / r;
        this.knobEl.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
      } else if (p.role === 'look' || p.role === 'fire') {
        this.lookDX += dx * 1.0;
        this.lookDY += dy * 1.0;
      }
    };

    const onUp = (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      this.pointers.delete(e.pointerId);
      if (p.role === 'joy') {
        this.joy.id = null; this.joy.x = 0; this.joy.y = 0;
        this.joyEl.classList.remove('active');
      } else if (p.role === 'fire') {
        let still = false;
        for (const q of this.pointers.values()) if (q.role === 'fire') still = true;
        if (!still) { this.firing = false; this.fireBtn.classList.remove('pressed'); }
      }
    };

    joyZone.addEventListener('pointerdown', onDown('joy'));
    lookZone.addEventListener('pointerdown', onDown('look'));
    this.fireBtn.addEventListener('pointerdown', onDown('fire'));
    document.getElementById('reloadBtn').addEventListener('pointerdown', onDown('reload'));
    document.getElementById('abilityBtn').addEventListener('pointerdown', onDown('ability'));
    document.getElementById('fpBtn').addEventListener('pointerdown', onDown('fp'));
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    layer.addEventListener('contextmenu', e => e.preventDefault());
  }

  bindDesktop() {
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('keydown', (e) => {
      if (!this.enabled) return;
      this.keys[e.code] = true;
      if (e.code === 'KeyR') this.reloadPressed = true;
      if (e.code === 'KeyV') this.fpPressed = true;
      if (e.code === 'KeyE' || e.code === 'KeyF' || e.code === 'ShiftLeft') this.abilityPressed = true;
      if (e.code === 'Tab') e.preventDefault();
      if (e.code === 'Escape' || e.code === 'KeyP') this.pausePressed = true;
    });
    window.addEventListener('keyup', (e) => { this.keys[e.code] = false; });
    window.addEventListener('blur', () => { this.keys = {}; this.mouseDown = false; });

    this.canvas.addEventListener('mousedown', (e) => {
      if (!this.enabled || this.isTouch) return;
      if (!document.pointerLockElement) {
        this.canvas.requestPointerLock?.();
        return;
      }
      if (e.button === 0) this.mouseDown = true;
      if (e.button === 2) this.abilityPressed = true;
    });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) this.mouseDown = false; });
    window.addEventListener('mousemove', (e) => {
      if (!this.enabled || document.pointerLockElement !== this.canvas) return;
      this.lookDX += e.movementX;
      this.lookDY += e.movementY;
    });
    document.addEventListener('pointerlockchange', () => {
      if (!document.pointerLockElement) {
        this.mouseDown = false;
        if (this.enabled && !this.isTouch) this.pausePressed = true;
      }
    });
  }

  update() {
    let x = this.joy.x, y = -this.joy.y;
    if (this.keys.KeyW || this.keys.ArrowUp) y += 1;
    if (this.keys.KeyS || this.keys.ArrowDown) y -= 1;
    if (this.keys.KeyA || this.keys.ArrowLeft) x -= 1;
    if (this.keys.KeyD || this.keys.ArrowRight) x += 1;
    const len = Math.hypot(x, y);
    if (len > 1) { x /= len; y /= len; }
    this.move.x = x; this.move.y = y;
  }

  get fireHeld() { return this.firing || this.mouseDown; }

  consume(flag) {
    const v = this[flag];
    this[flag] = false;
    return v;
  }
}
