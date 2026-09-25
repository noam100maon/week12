// Player-built structures (walls, traps, turret towers) and the edit-mode controller.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { BUILD_PIECES, CELL, MAX_STRUCTURES, RARITIES, MAX_BUILD_LEVEL, pieceHp, upgradeCost, sellValue } from './data.js';
import { BUILD_R } from './world.js';
import { cloneStatic } from './assets.js';

const rnd = (a, b) => a + Math.random() * (b - a);
export const pieceById = (id) => BUILD_PIECES.find(p => p.id === id);
export const cellKey = (i, j) => i + ',' + j;

function canvasTex(draw, rep = [1, 1]) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  draw(c.getContext('2d'), 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep[0], rep[1]);
  t.anisotropy = 4;
  return t;
}

const TEX = {};
function textures() {
  if (TEX.wood) return TEX;
  TEX.wood = canvasTex((g, w, h) => {
    g.fillStyle = '#a8703f'; g.fillRect(0, 0, w, h);
    const cols = 5;
    for (let c = 0; c < cols; c++) {
      const x = c * w / cols;
      g.fillStyle = `hsl(28, ${rnd(40, 55)}%, ${rnd(36, 46)}%)`;
      g.fillRect(x + 3, 0, w / cols - 6, h);
      for (let i = 0; i < 30; i++) { g.fillStyle = `rgba(60,30,10,${rnd(0.05, 0.15)})`; g.fillRect(x + rnd(6, w / cols - 8), rnd(0, h), 1, rnd(20, 80)); }
      g.fillStyle = '#4a2c14'; g.beginPath(); g.arc(x + w / cols / 2, 40, 4, 0, 7); g.arc(x + w / cols / 2, h - 40, 4, 0, 7); g.fill();
    }
    g.fillStyle = '#6a4424'; g.fillRect(0, 60, w, 16); g.fillRect(0, h - 76, w, 16);
  });
  TEX.stone = canvasTex((g, w, h) => {
    g.fillStyle = '#7d6a5c'; g.fillRect(0, 0, w, h);
    const bh = 32, bw = 64;
    for (let r = 0; r < h / bh; r++) for (let c = -1; c < w / bw + 1; c++) {
      const x = c * bw + (r % 2 ? bw / 2 : 0);
      g.fillStyle = `hsl(${rnd(6, 16)}, ${rnd(45, 58)}%, ${rnd(36, 46)}%)`;
      g.fillRect(x + 3, r * bh + 3, bw - 6, bh - 6);
      g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x + 3, r * bh + 3, bw - 6, 4);
    }
  });
  TEX.metal = canvasTex((g, w, h) => {
    g.fillStyle = '#7b8794'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(255,255,255,${rnd(0, 0.06)})`; g.fillRect(rnd(0, w), rnd(0, h), rnd(10, 60), 1); }
    for (let y = 0; y <= h; y += 128) { g.fillStyle = '#4c5763'; g.fillRect(0, y - 4, w, 8); }
    for (let x = 0; x <= w; x += 128) { g.fillStyle = '#4c5763'; g.fillRect(x - 4, 0, 8, h); }
    for (let y = 16; y < h; y += 128) for (let x = 16; x < w; x += 32) { g.fillStyle = '#b7c2cc'; g.beginPath(); g.arc(x, y, 3, 0, 7); g.arc(x, y + 96, 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,200,40,0.9)';
    for (let x = -h; x < w; x += 40) { g.beginPath(); g.moveTo(x, h - 20); g.lineTo(x + 20, h - 20); g.lineTo(x + 40, h); g.lineTo(x + 20, h); g.fill(); }
  });
  return TEX;
}

const geo = {};
function geometries() {
  if (geo.wall) return geo;
  geo.wall = new THREE.BoxGeometry(CELL, 2.6, 0.45);
  geo.wall.translate(0, 1.3, 0);
  geo.plate = new THREE.BoxGeometry(CELL * 0.94, 0.12, CELL * 0.94);
  geo.plate.translate(0, 0.06, 0);
  const cones = [];
  for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
    if ((x + z) % 2) continue;
    const c = new THREE.ConeGeometry(0.1, 0.5, 5);
    c.translate(x * 0.35, 0.37, z * 0.35);
    cones.push(c);
  }
  geo.spikes = mergeGeometries(cones);
  const crystals = [];
  for (let k = 0; k < 7; k++) {
    const c = new THREE.OctahedronGeometry(rnd(0.12, 0.22), 0);
    c.scale(1, 2.2, 1);
    c.translate(rnd(-0.7, 0.7), 0.3, rnd(-0.7, 0.7));
    crystals.push(c);
  }
  geo.crystals = mergeGeometries(crystals);
  return geo;
}

const barTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 4, 4); return new THREE.CanvasTexture(c); })();

// ---------------------------------------------------------------- structures
export class Structures {
  constructor(scene, opts) {
    this.scene = scene;
    this.opts = opts;
    this.list = [];
    this.byCell = new Map();
    this.group = new THREE.Group();
    scene.add(this.group);
    const t = textures();
    this.mats = {
      wood: new THREE.MeshStandardMaterial({ map: t.wood, roughness: 0.85 }),
      stone: new THREE.MeshStandardMaterial({ map: t.stone, roughness: 0.9 }),
      metal: new THREE.MeshStandardMaterial({ map: t.metal, roughness: 0.4, metalness: 0.6 }),
      plate: new THREE.MeshStandardMaterial({ color: 0x5a5048, roughness: 0.9 }),
      freezePlate: new THREE.MeshStandardMaterial({ color: 0x2a5a78, emissive: 0x1a6a9a, emissiveIntensity: 0.6, roughness: 0.5 }),
      spike: new THREE.MeshStandardMaterial({ color: 0xe4ebf2, metalness: 0.5, roughness: 0.3 }),
      crystal: new THREE.MeshStandardMaterial({ color: 0xaaf0ff, emissive: 0x3cc8ff, emissiveIntensity: 1.2, transparent: true, opacity: 0.9 }),
      grate: new THREE.MeshStandardMaterial({ color: 0x2a2420, metalness: 0.6, roughness: 0.5 }),
      ember: new THREE.MeshStandardMaterial({ color: 0xff7a2a, emissive: 0xff5a10, emissiveIntensity: 1.6 }),
      healPlate: new THREE.MeshStandardMaterial({ color: 0x2a6a4a, emissive: 0x1a8a4a, emissiveIntensity: 0.5, roughness: 0.5 }),
      healGlow: new THREE.MeshStandardMaterial({ color: 0x9dffbf, emissive: 0x3cff7a, emissiveIntensity: 1.6 }),
      coil: new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 }),
      zap: new THREE.MeshStandardMaterial({ color: 0xdff4ff, emissive: 0x7fd0ff, emissiveIntensity: 2 }),
      steel: new THREE.MeshStandardMaterial({ color: 0x4a5058, metalness: 0.7, roughness: 0.4 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xffc02e, emissive: 0xffa000, emissiveIntensity: 0.8 }),
      thorn: new THREE.MeshStandardMaterial({ map: t.wood, color: 0x9fcf7a, roughness: 0.85 }),
      thornSpike: new THREE.MeshStandardMaterial({ color: 0xdfe8c8, roughness: 0.5 }),
      flak: new THREE.MeshStandardMaterial({ color: 0xa8483a, metalness: 0.5, roughness: 0.45 }),
      pink: new THREE.MeshStandardMaterial({ color: 0xffb0ee, emissive: 0xff4dd2, emissiveIntensity: 2 }),
      violet: new THREE.MeshStandardMaterial({ color: 0xb48cff, emissive: 0x7a4aff, emissiveIntensity: 1.4 }),
    };
  }

  static cellCenter(i, j, out = new THREE.Vector3()) { return out.set(i * CELL, 0, j * CELL); }
  static cellOf(x, z) { return [Math.round(x / CELL), Math.round(z / CELL)]; }

  canPlace(i, j, houseHalf) {
    const x = i * CELL, z = j * CELL;
    if (Math.hypot(x, z) > BUILD_R) return 'Too far from the house';
    if (Math.abs(x) < houseHalf.x + CELL * 0.5 + 0.4 && Math.abs(z) < houseHalf.z + CELL * 0.5 + 0.4) return 'Too close to the house';
    if (this.byCell.has(cellKey(i, j))) return 'Something is already here';
    if (this.list.length >= MAX_STRUCTURES) return `Build limit reached (${MAX_STRUCTURES})`;
    return null;
  }

  makeMesh(piece, rot, level = 1) {
    const g = geometries();
    const grp = new THREE.Group();
    if (level > 1) {
      // upgrade ring: colour climbs the rarity ladder, one pip per level
      const col = RARITIES[Math.min(RARITIES.length - 1, Math.floor((level - 1) / 2) + 1)].hex;
      const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.2 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(piece.kind === 'wall' ? 0.5 : 0.95, 0.06, 6, 28), mat);
      ring.rotation.x = Math.PI / 2; ring.position.y = piece.kind === 'wall' ? 2.95 : 0.2;
      grp.add(ring);
      for (let k = 0; k < level - 1; k++) {
        const pip = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), mat);
        const a = (k / Math.max(1, level - 1)) * Math.PI * 2;
        const rr = piece.kind === 'wall' ? 0.5 : 0.95;
        pip.position.set(Math.cos(a) * rr, (piece.kind === 'wall' ? 2.95 : 0.2) + 0.12, Math.sin(a) * rr);
        grp.add(pip);
      }
    }
    if (piece.kind === 'wall') {
      const m = new THREE.Mesh(g.wall, this.mats[piece.id]);
      m.castShadow = m.receiveShadow = !!this.opts.shadows;
      grp.add(m);
      if (piece.thorns) {
        const cones = [];
        for (let k = -2; k <= 2; k++) for (const side of [-1, 1]) for (const y of [0.7, 1.6]) {
          const c = new THREE.ConeGeometry(0.08, 0.45, 5);
          c.rotateX(side * Math.PI / 2); c.translate(k * 0.36 + (y > 1 ? 0.18 : 0), y, side * 0.42);
          cones.push(c);
        }
        grp.add(new THREE.Mesh(mergeGeometries(cones), this.mats.thornSpike));
      }
      if (piece.id !== 'wood' && !piece.thorns) {
        const cap = new THREE.Mesh(new THREE.BoxGeometry(CELL + 0.06, 0.18, 0.55), piece.id === 'metal' ? this.mats.metal : this.mats.plate);
        cap.position.y = 2.65;
        grp.add(cap);
      }
      grp.rotation.y = rot ? Math.PI / 2 : 0;
    } else if (piece.id === 'spikes') {
      const p = new THREE.Mesh(g.plate, this.mats.plate);
      const s = new THREE.Mesh(g.spikes, this.mats.spike);
      p.receiveShadow = !!this.opts.shadows;
      grp.add(p, s);
      grp.userData.spikes = s;
    } else if (piece.id === 'freeze') {
      const p = new THREE.Mesh(g.plate, this.mats.freezePlate);
      const s = new THREE.Mesh(g.crystals, this.mats.crystal);
      grp.add(p, s);
      grp.userData.spikes = s;
    } else if (piece.id === 'flame') {
      const p = new THREE.Mesh(g.plate, this.mats.grate);
      grp.add(p);
      for (let k = -2; k <= 2; k++) {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(CELL * 0.8, 0.06, 0.1), this.mats.ember);
        bar.position.set(0, 0.14, k * 0.34);
        grp.add(bar);
      }
      for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) {
        const n = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.25, 8), this.mats.steel);
        n.position.set(x, 0.2, z);
        grp.add(n);
      }
    } else if (piece.kind === 'pad') {
      const p = new THREE.Mesh(g.plate, this.mats.healPlate);
      const a = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.34), this.mats.healGlow);
      a.position.y = 0.14;
      const b = a.clone(); b.rotation.y = Math.PI / 2;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 6, 32), this.mats.healGlow);
      ring.rotation.x = Math.PI / 2; ring.position.y = 0.14;
      grp.add(p, a, b, ring);
      grp.userData.top = ring;
    } else if (piece.style === 'tesla') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.9, 0.5, 12), this.mats.steel);
      base.position.y = 0.25;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 2.6, 10), this.mats.steel);
      pole.position.y = 1.8;
      grp.add(base, pole);
      for (let k = 0; k < 5; k++) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.5 - k * 0.04, 0.09, 6, 20), this.mats.coil);
        t.rotation.x = Math.PI / 2; t.position.y = 1.0 + k * 0.45;
        grp.add(t);
      }
      const top = new THREE.Group();
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 10), this.mats.zap);
      const halo = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.05, 6, 24), this.mats.zap);
      halo.rotation.x = Math.PI / 2.4;
      top.add(orb, halo);
      top.position.y = 3.5;
      grp.add(top);
      grp.userData.top = top; grp.userData.topY = 3.5;
    } else if (piece.style === 'mortar') {
      const tower = cloneStatic('tower', { height: 2.2 });
      tower.scale.x = tower.scale.z = 0.7;
      grp.add(tower);
      const top = new THREE.Group();
      const ringB = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.75, 0.3, 14), this.mats.steel);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.2, 12), this.mats.steel);
      barrel.rotation.x = -0.6; barrel.position.set(0, 0.55, 0.15);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.12, 12), this.mats.gold);
      band.rotation.x = -0.6; band.position.set(0, 0.95, 0.4);
      top.add(ringB, barrel, band);
      top.position.y = 2.4;
      grp.add(top);
      grp.userData.top = top; grp.userData.topY = 3.4;
    } else if (piece.style === 'flak' || piece.style === 'sniper') {
      const sniper = piece.style === 'sniper';
      const tower = cloneStatic('tower', { height: sniper ? 4.6 : 3.0 });
      tower.scale.x = tower.scale.z = sniper ? 0.5 : 0.7;
      grp.add(tower);
      const head = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.4, 12), this.mats.steel);
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.9), sniper ? this.mats.steel : this.mats.flak);
      box.position.y = 0.4;
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), sniper ? this.mats.violet : this.mats.ember);
      eye.position.set(0, 0.5, 0.46);
      const barrel = new THREE.Group();
      if (sniper) {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 2.0, 8), this.mats.steel);
        b.rotation.x = Math.PI / 2; b.position.z = 0.8;
        const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8), this.mats.violet);
        scope.rotation.x = Math.PI / 2; scope.position.set(0, 0.18, 0.2);
        barrel.add(b, scope);
      } else {
        for (const x of [-0.2, 0.2]) {
          const b = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 1.1, 10), this.mats.steel);
          b.rotation.x = Math.PI / 2; b.position.set(x, 0, 0.45);
          barrel.add(b);
        }
      }
      barrel.position.set(0, 0.45, 0.2);
      const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, sniper ? 1.8 : 1.0);
      barrel.add(muzzle);
      head.add(base, box, eye, barrel);
      head.userData = { barrel, muzzle };
      head.position.y = sniper ? 4.7 : 3.1;
      grp.add(head);
      grp.userData.head = head; grp.userData.topY = head.position.y + 0.5;
    } else if (piece.style === 'laser') {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.6, 8), this.mats.steel);
      base.position.y = 0.3;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.35, 2.8, 8), this.mats.steel);
      pole.position.y = 2.0;
      const top = new THREE.Group();
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), this.mats.pink);
      crystal.scale.y = 1.6;
      const halo1 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.05, 6, 24), this.mats.pink);
      halo1.rotation.x = Math.PI / 2;
      const halo2 = halo1.clone(); halo2.rotation.x = Math.PI / 3;
      top.add(crystal, halo1, halo2);
      top.position.y = 3.9;
      grp.add(base, pole, top);
      grp.userData.top = top; grp.userData.topY = 3.9;
    } else if (piece.kind === 'turret') {
      const tower = cloneStatic('tower', { height: 3.4 });
      tower.scale.x = tower.scale.z = 0.62;
      grp.add(tower);
      const head = makeTurretHead();
      head.position.y = 3.6;
      grp.add(head);
      grp.userData.head = head;
    }
    return grp;
  }

  add(pieceId, i, j, rot = 0, temporary = false, level = 1) {
    const piece = pieceById(pieceId);
    level = Math.max(1, Math.min(MAX_BUILD_LEVEL, level | 0 || 1));
    const mesh = this.makeMesh(piece, rot, level);
    const c = Structures.cellCenter(i, j);
    mesh.position.copy(c);
    this.group.add(mesh);
    const s = { piece, i, j, rot, mesh, x: c.x, z: c.z, hp: 1, max: 1, alive: true, shake: 0, cooldown: Math.random() * 0.3, temporary, life: 0, bar: null, level, stunT: 0 };
    s.max = s.hp = pieceHp(piece, level);
    if (piece.kind === 'wall') {
      s.hx = rot ? 0.28 : CELL / 2;
      s.hz = rot ? CELL / 2 : 0.28;
      s.bar = makeBar(mesh, 3.1);
    } else s.bar = makeBar(mesh, piece.kind === 'turret' ? (piece.style === 'mortar' ? 4.2 : 4.6) : 1.2);
    if (piece.kind === 'turret') { s.hx = s.hz = 0.9; }
    if (piece.kind === 'pad') { s.hx = s.hz = 0; }
    this.list.push(s);
    if (!temporary) this.byCell.set(cellKey(i, j), s);
    return s;
  }

  removeAt(i, j) {
    const s = this.byCell.get(cellKey(i, j));
    if (!s) return null;
    this.removeStructure(s);
    return s;
  }

  removeStructure(s) {
    this.group.remove(s.mesh);
    this.list = this.list.filter(x => x !== s);
    if (!s.temporary) this.byCell.delete(cellKey(s.i, s.j));
  }

  rotateAt(i, j) {
    const s = this.byCell.get(cellKey(i, j));
    if (!s || s.piece.kind !== 'wall') return null;
    this.removeStructure(s);
    return this.add(s.piece.id, i, j, s.rot ? 0 : 1, false, s.level);
  }

  // rebuild the mesh at a new level (keeps the cell)
  upgradeAt(i, j) {
    const s = this.byCell.get(cellKey(i, j));
    if (!s || s.level >= MAX_BUILD_LEVEL) return null;
    this.removeStructure(s);
    return this.add(s.piece.id, i, j, s.rot, false, s.level + 1);
  }

  loadFrom(saved) {
    for (const s of [...this.list]) this.removeStructure(s);
    for (const s of saved) if (pieceById(s.p)) this.add(s.p, s.i, s.j, s.r || 0, false, s.l || 1);
  }

  serialize() { return this.list.filter(s => !s.temporary).map(s => ({ p: s.piece.id, i: s.i, j: s.j, r: s.rot, l: s.level })); }

  // Restore every structure to full health for a new wave attempt.
  resetForWave(wallMult) {
    for (const s of [...this.list]) if (s.temporary) this.removeStructure(s);
    for (const s of this.list) {
      s.alive = true;
      s.mesh.visible = true;
      s.mesh.scale.set(1, 1, 1);
      s.mesh.position.set(s.x, 0, s.z);
      s.max = pieceHp(s.piece, s.level) * wallMult; s.hp = s.max; s.stunT = 0;
      updateBar(s);
    }
  }

  // Next wave of the same run: buildings keep their damage (and stay broken) until you die.
  refreshWave(wallMult) {
    for (const s of this.list) {
      const f = s.alive ? s.hp / s.max : 0;
      s.max = pieceHp(s.piece, s.level) * wallMult;
      s.hp = s.max * f;
      s.stunT = 0;
      updateBar(s);
    }
  }

  wallAt(x, z, r) {
    for (const s of this.list) {
      if (!s.alive || s.piece.kind === 'trap' || s.piece.kind === 'pad') continue;
      if (Math.abs(x - s.x) < s.hx + r && Math.abs(z - s.z) < s.hz + r) return s;
    }
    return null;
  }

  // push a circle out of all solid structures
  collide(p, r) {
    for (const s of this.list) {
      if (!s.alive || s.piece.kind === 'trap' || s.piece.kind === 'pad') continue;
      const dx = p.x - s.x, dz = p.z - s.z;
      const ox = s.hx + r - Math.abs(dx), oz = s.hz + r - Math.abs(dz);
      if (ox > 0 && oz > 0) {
        if (ox < oz) p.x += Math.sign(dx || 1) * ox; else p.z += Math.sign(dz || 1) * oz;
      }
    }
  }

  damage(s, amount) {
    if (!s.alive) return false;
    s.hp -= amount;
    s.shake = 1;
    updateBar(s);
    if (s.hp <= 0) {
      s.alive = false;
      s.mesh.visible = false;
      return true;
    }
    return false;
  }

  revive(s) { s.alive = true; s.hp = s.max; s.mesh.visible = true; updateBar(s); }

  heal(s, amount) { if (!s.alive) return; s.hp = Math.min(s.max, s.hp + amount); updateBar(s); }

  update(dt) {
    for (const s of this.list) {
      if (s.shake > 0) {
        s.shake = Math.max(0, s.shake - dt * 4);
        s.mesh.position.x = s.x + (Math.random() - 0.5) * s.shake * 0.2;
        s.mesh.position.z = s.z + (Math.random() - 0.5) * s.shake * 0.2;
      }
      if (s.recoil > 0) {
        s.recoil = Math.max(0, s.recoil - dt * 6);
        const head = s.mesh.userData.head;
        if (head) head.userData.barrel.position.z = (s.piece.style ? 0.2 : 0.55) - s.recoil * 0.15;
        else if (s.mesh.userData.top) s.mesh.userData.top.position.y = 2.4 - s.recoil * 0.2;
      }
      if (s.pop > 0) { s.pop = Math.max(0, s.pop - dt * 3); const sp = s.mesh.userData.spikes; if (sp) sp.position.y = s.pop * 0.25; }
    }
  }
}

export function makeTurretHead() {
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x3a4250, metalness: 0.6, roughness: 0.4 });
  const headMat = new THREE.MeshStandardMaterial({ color: 0x5b6573, metalness: 0.5, roughness: 0.4 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x3cc8ff, emissive: 0x3cc8ff, emissiveIntensity: 1.5 });
  const head = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), headMat);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.8), headMat);
  box.position.y = 0.15;
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), accent);
  eye.position.set(0, 0.25, 0.41);
  const barrel = new THREE.Group();
  const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 8), baseMat);
  b1.rotation.x = Math.PI / 2; b1.position.set(0.14, 0, 0);
  const b2 = b1.clone(); b2.position.x = -0.14;
  barrel.add(b1, b2);
  barrel.position.set(0, 0.2, 0.55);
  const muzzle = new THREE.Object3D(); muzzle.position.set(0, 0, 0.55);
  barrel.add(muzzle);
  head.add(dome, box, eye, barrel);
  head.userData = { barrel, muzzle };
  return head;
}

function makeBar(parent, y) {
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x140a28, depthTest: false, transparent: true, opacity: 0.8 }));
  const fill = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x5cc8ff, depthTest: false }));
  bg.scale.set(1.3, 0.2, 1); fill.scale.set(1.2, 0.12, 1);
  bg.position.y = fill.position.y = y;
  bg.renderOrder = 10; fill.renderOrder = 11;
  bg.visible = fill.visible = false;
  parent.add(bg, fill);
  return { bg, fill };
}

function updateBar(s) {
  if (!s.bar) return;
  const f = Math.max(0.001, Math.min(1, s.hp / s.max));
  const show = s.alive && f < 0.999;
  s.bar.bg.visible = s.bar.fill.visible = show;
  if (!show) return;
  s.bar.fill.scale.set(1.2 * f, 0.12, 1);
  s.bar.fill.center.set(0.5 / f, 0.5);
  s.bar.fill.material.color.setHex(f > 0.5 ? 0x5cc8ff : f > 0.25 ? 0xffc02e : 0xff4d5e);
}

// ---------------------------------------------------------------- edit mode
export class BuildMode {
  constructor({ scene, camera, canvas, structures, getHouseHalf, onPlace, onRemove, onRotate, onExit, sfx }) {
    Object.assign(this, { scene, camera, canvas, structures, getHouseHalf, onPlace, onRemove, onRotate, onExit, sfx });
    this.active = false;
    this.yaw = 0.7;
    this.dist = 38;
    this.selected = 'wood';
    this.pointers = new Map();
    this.ray = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.hover = null;
    this.focus = null;

    // grid & range ring
    const grid = new THREE.GridHelper(BUILD_R * 2 + CELL * 2, BUILD_R + 1, 0xffffff, 0xffffff);
    grid.material.transparent = true; grid.material.opacity = 0.18; grid.material.depthWrite = false;
    grid.position.set(CELL / 2, 0.05, CELL / 2);
    const ring = new THREE.Mesh(new THREE.RingGeometry(BUILD_R + 0.8, BUILD_R + 1.2, 96), new THREE.MeshBasicMaterial({ color: 0x3ce0ff, transparent: true, opacity: 0.6, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.06;
    this.helpers = new THREE.Group();
    this.helpers.add(grid, ring);
    this.helpers.visible = false;
    scene.add(this.helpers);

    this.ghost = new THREE.Group();
    this.ghostOk = new THREE.MeshBasicMaterial({ color: 0x5cf08a, transparent: true, opacity: 0.45, depthWrite: false });
    this.ghostBad = new THREE.MeshBasicMaterial({ color: 0xff4d5e, transparent: true, opacity: 0.45, depthWrite: false });
    this.ghostMesh = null;
    this.ghost.visible = false;
    scene.add(this.ghost);

    const sel = new THREE.Mesh(new THREE.RingGeometry(1.2, 1.45, 32), new THREE.MeshBasicMaterial({ color: 0xffc02e, transparent: true, depthWrite: false }));
    sel.rotation.x = -Math.PI / 2; sel.position.y = 0.08; sel.visible = false;
    this.selRing = sel;
    scene.add(sel);

    this.bind();
  }

  bind() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => {
      if (!this.active) return;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now() });
      if (this.pointers.size === 2) this.pinch = this.pinchDist();
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.active) return;
      const p = this.pointers.get(e.pointerId);
      if (!p) { if (e.pointerType === 'mouse') this.updateGhost(e.clientX, e.clientY); return; }
      const dx = e.clientX - p.x;
      p.x = e.clientX; p.y = e.clientY;
      if (this.pointers.size === 2) {
        const d = this.pinchDist();
        if (this.pinch) this.dist = THREE.MathUtils.clamp(this.dist * this.pinch / d, 22, 70);
        this.pinch = d;
      } else if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 8) {
        this.yaw -= dx * 0.006;
        this.dragging = true;
      }
      if (e.pointerType === 'mouse') this.updateGhost(e.clientX, e.clientY);
    });
    const up = (e) => {
      if (!this.active) return;
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = null;
      const moved = Math.hypot(e.clientX - p.sx, e.clientY - p.sy);
      if (moved < 10 && performance.now() - p.t < 500 && !this.wasMulti) this.tap(e.clientX, e.clientY);
      if (this.pointers.size === 0) { this.dragging = false; this.wasMulti = false; }
    };
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    c.addEventListener('wheel', (e) => { if (this.active) { this.dist = THREE.MathUtils.clamp(this.dist + e.deltaY * 0.03, 22, 70); e.preventDefault(); } }, { passive: false });
  }

  pinchDist() {
    const ps = [...this.pointers.values()];
    this.wasMulti = true;
    return Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) || 1;
  }

  cellAt(cx, cy) {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    this.ray.setFromCamera(ndc, this.camera);
    const hit = new THREE.Vector3();
    if (!this.ray.ray.intersectPlane(this.plane, hit)) return null;
    return Structures.cellOf(hit.x, hit.z);
  }

  setGhostPiece(id) {
    if (this.ghostMesh) this.ghost.remove(this.ghostMesh);
    const piece = pieceById(id);
    this.ghostMesh = this.structures.makeMesh(piece, 0);
    this.ghostMesh.traverse(o => { if (o.isMesh) { o.material = this.ghostOk; o.castShadow = false; } });
    this.ghost.add(this.ghostMesh);
  }

  autoRot(i, j) { return Math.abs(i) > Math.abs(j) ? 1 : 0; }

  updateGhost(cx, cy) {
    const cell = this.cellAt(cx, cy);
    if (!cell || !this.selected) { this.ghost.visible = false; return; }
    const [i, j] = cell;
    const bad = this.structures.canPlace(i, j, this.getHouseHalf());
    this.ghost.visible = !this.structures.byCell.has(cellKey(i, j));
    this.ghost.position.set(i * CELL, 0, j * CELL);
    this.ghost.rotation.y = pieceById(this.selected).kind === 'wall' && this.autoRot(i, j) ? Math.PI / 2 : 0;
    this.ghostMesh.traverse(o => { if (o.isMesh) o.material = bad ? this.ghostBad : this.ghostOk; });
  }

  tap(cx, cy) {
    const cell = this.cellAt(cx, cy);
    if (!cell) return;
    const [i, j] = cell;
    const existing = this.structures.byCell.get(cellKey(i, j));
    if (existing) { this.select(existing); return; }
    this.select(null);
    if (!this.selected) return;
    const bad = this.structures.canPlace(i, j, this.getHouseHalf());
    if (bad) { this.onPlace(null, bad); return; }
    const piece = pieceById(this.selected);
    this.onPlace({ piece, i, j, rot: piece.kind === 'wall' ? this.autoRot(i, j) : 0 });
    this.ghost.position.set(i * CELL, 0, j * CELL);
  }

  select(s) {
    this.focus = s;
    this.selRing.visible = !!s;
    if (s) { this.selRing.position.set(s.x, 0.08, s.z); this.sfx.click(); }
    const bar = document.getElementById('buildContext');
    bar.classList.toggle('hidden', !s);
    if (s) {
      const L = s.level || 1;
      document.getElementById('ctxName').textContent = `${s.piece.name} · Lv ${L}`;
      document.getElementById('ctxRotate').classList.toggle('hidden', s.piece.kind !== 'wall');
      const up = document.getElementById('ctxUpgrade');
      up.innerHTML = L >= MAX_BUILD_LEVEL ? 'MAX LEVEL' : `Upgrade → Lv ${L + 1} <span class="coin-ico"></span>${upgradeCost(s.piece, L)}`;
      up.disabled = L >= MAX_BUILD_LEVEL;
      document.getElementById('ctxSell').innerHTML = `Sell <span class="coin-ico"></span>${sellValue(s.piece, L)}`;
    }
  }

  enter() {
    this.active = true;
    this.helpers.visible = true;
    this.setGhostPiece(this.selected);
    this.select(null);
  }

  exit() {
    this.active = false;
    this.helpers.visible = false;
    this.ghost.visible = false;
    this.select(null);
    this.pointers.clear();
  }

  updateCamera(dt) {
    const pitch = 0.95;
    // shift the view target so the base sits in the visible area right of the side panel
    const shift = 4.5 * (this.dist / 44);
    const tx = -Math.cos(this.yaw) * shift, tz = Math.sin(this.yaw) * shift;
    this.camera.position.set(tx + Math.sin(this.yaw) * Math.cos(pitch) * this.dist, Math.sin(pitch) * this.dist, tz + Math.cos(this.yaw) * Math.cos(pitch) * this.dist);
    this.camera.lookAt(tx, 0, tz);
  }
}
