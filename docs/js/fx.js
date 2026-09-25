// Visual effects: GPU point particles, bullet tracers, floating damage numbers.
import * as THREE from 'three';

function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

const VERT = `
attribute float psize;
attribute float palpha;
attribute vec3 pcolor;
varying vec3 vColor;
varying float vAlpha;
uniform float scale;
void main() {
  vColor = pcolor;
  vAlpha = palpha;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = psize * scale / max(0.1, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const FRAG = `
uniform sampler2D map;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 t = texture2D(map, gl_PointCoord);
  float a = t.a * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

export class Particles {
  constructor(scene, max, additive) {
    this.max = max;
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.size0 = new Float32Array(max);
    this.grow = new Float32Array(max);
    this.cursor = 0;
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('pcolor', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('psize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('palpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: dotTexture() }, scale: { value: 500 } },
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = additive ? 3 : 2;
    scene.add(this.points);
  }

  emit(x, y, z, vx, vy, vz, life, size, color, grav = 0, drag = 0, grow = 0) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.max;
    const i3 = i * 3;
    this.pos[i3] = x; this.pos[i3 + 1] = y; this.pos[i3 + 2] = z;
    this.vel[i3] = vx; this.vel[i3 + 1] = vy; this.vel[i3 + 2] = vz;
    this.col[i3] = color.r; this.col[i3 + 1] = color.g; this.col[i3 + 2] = color.b;
    this.life[i] = life; this.maxLife[i] = life;
    this.size0[i] = size; this.size[i] = size;
    this.grav[i] = grav; this.drag[i] = drag; this.grow[i] = grow;
    this.alpha[i] = 1;
  }

  update(dt) {
    const p = this.pos, v = this.vel;
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) { if (this.alpha[i] !== 0) this.alpha[i] = 0; continue; }
      this.life[i] -= dt;
      const i3 = i * 3;
      const d = Math.max(0, 1 - this.drag[i] * dt);
      v[i3] *= d; v[i3 + 1] = v[i3 + 1] * d - this.grav[i] * dt; v[i3 + 2] *= d;
      p[i3] += v[i3] * dt; p[i3 + 1] += v[i3 + 1] * dt; p[i3 + 2] += v[i3 + 2] * dt;
      if (p[i3 + 1] < 0.05 && this.grav[i] > 0) { p[i3 + 1] = 0.05; v[i3 + 1] *= -0.3; v[i3] *= 0.6; v[i3 + 2] *= 0.6; }
      const k = Math.max(0, this.life[i] / this.maxLife[i]);
      this.alpha[i] = Math.min(1, k * 1.6);
      this.size[i] = this.size0[i] * (1 + this.grow[i] * (1 - k));
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.pcolor.needsUpdate = true;
    this.geo.attributes.psize.needsUpdate = true;
    this.geo.attributes.palpha.needsUpdate = true;
  }

  clear() { this.life.fill(0); }
}

export class Tracers {
  constructor(scene, count = 48) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0, 0.5);
    this.pool = [];
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffe08a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      m.visible = false;
      m.frustumCulled = false;
      m.userData.life = 0;
      scene.add(m);
      this.pool.push(m);
    }
    this.i = 0;
  }

  spawn(from, to, color = 0xffe08a, width = 0.05, life = 0.08) {
    const m = this.pool[this.i];
    this.i = (this.i + 1) % this.pool.length;
    const len = from.distanceTo(to);
    if (len < 0.01) return;
    m.position.copy(from);
    m.lookAt(to);
    m.scale.set(width, width, len);
    m.material.color.setHex(color);
    m.material.opacity = 1;
    m.userData.life = life;
    m.userData.maxLife = life;
    m.visible = true;
  }

  update(dt) {
    for (const m of this.pool) {
      if (!m.visible) continue;
      m.userData.life -= dt;
      if (m.userData.life <= 0) { m.visible = false; continue; }
      m.material.opacity = m.userData.life / m.userData.maxLife;
    }
  }

  clear() { for (const m of this.pool) m.visible = false; }
}

export class DamageNumbers {
  constructor(container, camera, count = 36) {
    this.camera = camera;
    this.pool = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'dmg';
      el.style.display = 'none';
      container.appendChild(el);
      this.pool.push({ el, pos: new THREE.Vector3(), life: 0, vy: 0 });
    }
    this.i = 0;
    this.v = new THREE.Vector3();
  }

  spawn(pos, text, kind = '') {
    const d = this.pool[this.i];
    this.i = (this.i + 1) % this.pool.length;
    d.pos.copy(pos);
    d.pos.x += (Math.random() - 0.5) * 0.6;
    d.life = 0.9;
    d.vy = 1.6;
    d.el.textContent = text;
    d.el.className = 'dmg ' + kind;
    d.el.style.display = 'block';
  }

  update(dt, w, h) {
    for (const d of this.pool) {
      if (d.life <= 0) continue;
      d.life -= dt;
      if (d.life <= 0) { d.el.style.display = 'none'; continue; }
      d.pos.y += d.vy * dt;
      d.vy *= 0.94;
      this.v.copy(d.pos).project(this.camera);
      if (this.v.z > 1) { d.el.style.opacity = 0; continue; }
      const x = (this.v.x * 0.5 + 0.5) * w, y = (-this.v.y * 0.5 + 0.5) * h;
      const age = 0.9 - d.life;
      const s = age < 0.1 ? 0.6 + age * 6 : 1;
      d.el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(${s})`;
      d.el.style.opacity = Math.min(1, d.life * 3);
    }
  }

  clear() { for (const d of this.pool) { d.life = 0; d.el.style.display = 'none'; } }
}

// Jagged lightning bolts (chain lightning, storm strikes, Lightning Rod).
export class Bolts {
  constructor(scene, count = 16, segs = 10) {
    this.pool = [];
    this.segs = segs;
    for (let i = 0; i < count; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array((segs + 1) * 3), 3));
      const mat = new THREE.LineBasicMaterial({ color: 0xbfe6ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      line.visible = false;
      line.userData.life = 0;
      scene.add(line);
      this.pool.push(line);
    }
    this.i = 0;
  }

  spawn(from, to, color = 0xbfe6ff, life = 0.18, jitter = 0.6) {
    const line = this.pool[this.i];
    this.i = (this.i + 1) % this.pool.length;
    const p = line.geometry.attributes.position.array;
    for (let k = 0; k <= this.segs; k++) {
      const t = k / this.segs;
      const j = k === 0 || k === this.segs ? 0 : jitter;
      p[k * 3] = from.x + (to.x - from.x) * t + (Math.random() - 0.5) * j;
      p[k * 3 + 1] = from.y + (to.y - from.y) * t + (Math.random() - 0.5) * j;
      p[k * 3 + 2] = from.z + (to.z - from.z) * t + (Math.random() - 0.5) * j;
    }
    line.geometry.attributes.position.needsUpdate = true;
    line.material.color.setHex(color);
    line.material.opacity = 1;
    line.userData.life = life;
    line.userData.maxLife = life;
    line.visible = true;
  }

  update(dt) {
    for (const l of this.pool) {
      if (!l.visible) continue;
      l.userData.life -= dt;
      if (l.userData.life <= 0) { l.visible = false; continue; }
      l.material.opacity = l.userData.life / l.userData.maxLife;
    }
  }

  clear() { for (const l of this.pool) l.visible = false; }
}

// Expanding ground rings (shockwaves, heal pulses, explosions).
export class Rings {
  constructor(scene, count = 12) {
    this.pool = [];
    const geo = new THREE.RingGeometry(0.85, 1, 48);
    geo.rotateX(-Math.PI / 2);
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      m.visible = false;
      m.frustumCulled = false;
      scene.add(m);
      this.pool.push(m);
    }
    this.i = 0;
  }

  spawn(pos, radius, color = 0xffffff, life = 0.5) {
    const m = this.pool[this.i];
    this.i = (this.i + 1) % this.pool.length;
    m.position.set(pos.x, (pos.y || 0) + 0.12, pos.z);
    m.material.color.setHex(color);
    m.userData = { life, maxLife: life, radius };
    m.scale.setScalar(0.1);
    m.visible = true;
  }

  update(dt) {
    for (const m of this.pool) {
      if (!m.visible) continue;
      m.userData.life -= dt;
      if (m.userData.life <= 0) { m.visible = false; continue; }
      const k = 1 - m.userData.life / m.userData.maxLife;
      m.scale.setScalar(Math.max(0.1, m.userData.radius * (1 - Math.pow(1 - k, 3))));
      m.material.opacity = 1 - k;
    }
  }

  clear() { for (const m of this.pool) m.visible = false; }
}
