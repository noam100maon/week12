// Model loading, animated characters (procedural rig animation for the Kenney characters,
// clip animation for the robot) and weapon models.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export const MODEL_NAMES = [
  'RobotExpressive', 'zombie-1', 'zombie-2', 'survivor-male', 'survivor-female', 'cyborg-female', 'male', 'skater-male',
  'enemy-flying', 'blaster', 'blaster-repeater', 'blaster-a',
  'house-3', 'house-4', 'house-5', 'house1', 'house-7', 'house-18', 'tower',
  'tree-big', 'tree-small', 'formation-large-rock', 'formation-rock', 'formation-stone', 'grass', 'coin',
];

export const M = {};
let shadows = false;
export function setShadowMode(v) { shadows = v; }

function b64ToBuf(b64) {
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function loadModels(onProgress) {
  const loader = new GLTFLoader();
  let done = 0;
  await Promise.all(MODEL_NAMES.map(async (name) => {
    const emb = window.__EMBED_MODELS && window.__EMBED_MODELS[name];
    const gltf = emb ? await loader.parseAsync(b64ToBuf(emb), '') : await loader.loadAsync(`models/${name}.glb`);
    gltf.scene.updateMatrixWorld(true);
    M[name] = gltf;
    done++;
    if (onProgress) onProgress(done / MODEL_NAMES.length);
  }));
}

// Deep-clones a static model and normalises it: feet on y=0, centred, given height (or longest side).
export function cloneStatic(name, { height = null, size = null, center = true } = {}) {
  const src = M[name].scene;
  const obj = src.clone(true);
  const box = new THREE.Box3().setFromObject(obj);
  const dims = box.getSize(new THREE.Vector3());
  let s = 1;
  if (height) s = height / dims.y;
  else if (size) s = size / Math.max(dims.x, dims.z);
  const wrap = new THREE.Group();
  obj.scale.multiplyScalar(s);
  const c = box.getCenter(new THREE.Vector3());
  obj.position.set(center ? -c.x * s : 0, -box.min.y * s, center ? -c.z * s : 0);
  wrap.add(obj);
  wrap.traverse(o => { if (o.isMesh) { o.castShadow = shadows; o.receiveShadow = shadows; } });
  wrap.userData.dims = dims.multiplyScalar(s);
  return wrap;
}

// Merged geometry + material list of a static model, for InstancedMesh use.
export function instanceParts(name, targetHeight) {
  const src = M[name].scene;
  const box = new THREE.Box3().setFromObject(src);
  const s = targetHeight / (box.max.y - box.min.y);
  const parts = [];
  src.traverse(o => {
    if (!o.isMesh) return;
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    g.translate(-(box.min.x + box.max.x) / 2, -box.min.y, -(box.min.z + box.max.z) / 2);
    g.scale(s, s, s);
    parts.push({ geometry: g, material: o.material });
  });
  return parts;
}

// ---------------------------------------------------------------- shared helpers
const blobTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(0,0,0,0.5)');
  grd.addColorStop(0.6, 'rgba(0,0,0,0.25)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();
const blobGeo = new THREE.PlaneGeometry(1, 1);
const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false });
function addBlob(root, size) {
  const b = new THREE.Mesh(blobGeo, blobMat);
  b.rotation.x = -Math.PI / 2;
  b.position.y = 0.03;
  b.scale.setScalar(size);
  b.renderOrder = 1;
  root.add(b);
  return b;
}

function cloneMaterials(obj, fn) {
  const map = new Map();
  const mats = [];
  obj.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = shadows;
    o.frustumCulled = false;
    let m = map.get(o.material);
    if (!m) {
      m = o.material.clone();
      if (fn) fn(m);
      m.userData.baseEmissive = m.emissive ? m.emissive.clone() : null;
      m.userData.baseIntensity = m.emissiveIntensity;
      map.set(o.material, m);
      mats.push(m);
    }
    o.material = m;
  });
  return mats;
}

const Q = new THREE.Quaternion(), Q2 = new THREE.Quaternion(), E = new THREE.Euler();
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
function rot(out, rx, ry, rz) {
  // character-space rotation: Rx(rx) * Ry(ry) * Rz(rz)  (Rz applied first)
  out.setFromAxisAngle(X, rx);
  if (ry) out.multiply(Q2.setFromAxisAngle(Y, ry));
  if (rz) out.multiply(Q2.setFromAxisAngle(Z, rz));
  return out;
}

// ---------------------------------------------------------------- Kenney characters (procedural animation)
const RIG_BONES = ['Hips', 'Spine', 'Chest', 'Head', 'LeftArm', 'LeftForeArm', 'RightArm', 'RightForeArm', 'LeftUpLeg', 'LeftLeg', 'RightUpLeg', 'RightLeg'];
const rigCache = new Map();

function rigData(name) {
  if (rigCache.has(name)) return rigCache.get(name);
  const scene = M[name].scene;
  scene.updateMatrixWorld(true);
  const rootInv = scene.getWorldQuaternion(new THREE.Quaternion()).invert();
  const bones = {};
  scene.traverse(o => { if (o.isBone) bones[o.name] = o; });
  const data = {};
  for (const n of RIG_BONES) {
    const b = bones[n];
    if (!b) continue;
    const w = rootInv.clone().multiply(b.getWorldQuaternion(new THREE.Quaternion()));
    const pw = rootInv.clone().multiply(b.parent.getWorldQuaternion(new THREE.Quaternion()));
    data[n] = { A: pw.invert(), B: w };
  }
  const box = new THREE.Box3().setFromObject(scene);
  const d = { data, height: box.max.y - box.min.y, minY: box.min.y };
  rigCache.set(name, d);
  return d;
}

export class Char {
  constructor() {
    this.root = new THREE.Group();     // world position / yaw
    this.body = new THREE.Group();     // death tilt, bobbing
    this.root.add(this.body);
    this.mats = [];
    this.flashT = 0;
    this.phase = Math.random() * 6;
    this.dead = false;
    this.deadT = 0;
  }
  flash(t = 0.09) { this.flashT = t; }
  updateFlash(dt, status = 0) {
    if (this.flashT > 0) this.flashT -= dt;
    const on = this.flashT > 0;
    const key = on ? -1 : status;
    if (key === this.emKey) return;
    this.emKey = key;
    for (const m of this.mats) {
      if (!m.emissive) continue;
      if (on) { m.emissive.setRGB(0.9, 0.9, 0.9); m.emissiveIntensity = 1; }
      else if (status) { m.emissive.setHex(status); m.emissiveIntensity = 1; }
      else { m.emissive.copy(m.userData.baseEmissive); m.emissiveIntensity = m.userData.baseIntensity; }
    }
  }
  die() { this.dead = true; this.deadT = 0; }
  dispose() { for (const m of this.mats) m.dispose(); }
}

export class KenneyChar extends Char {
  constructor(modelName, { height = 1.9, tint = null, glow = null, zombie = false } = {}) {
    super();
    const rig = rigData(modelName);
    this.rig = rig.data;
    this.zombie = zombie;
    const model = SkeletonUtils.clone(M[modelName].scene);
    const s = height / rig.height;
    model.scale.setScalar(s);
    model.position.y = -rig.minY * s;
    this.baseY = model.position.y;
    this.model = model;
    this.body.add(model);
    this.mats = cloneMaterials(model, (m) => {
      if (tint) m.color.setHex(tint);
      if (glow && m.emissive) { m.emissive.setHex(glow); m.emissiveIntensity = 0.35; }
    });
    this.bones = {};
    model.traverse(o => { if (o.isBone) this.bones[o.name] = o; });
    this.height = height;
    addBlob(this.root, height * 0.45);
    this.q = new THREE.Quaternion();
    this.pose(0, 0, 0);
  }

  setBone(name, rx, ry, rz) {
    const b = this.bones[name], d = this.rig[name];
    if (!b || !d) return;
    rot(this.q, rx, ry, rz);
    b.quaternion.copy(d.A).multiply(this.q).multiply(d.B);
  }

  pose(dt, speed, attack, aim = null, extra = {}) {
    if (this.dead) {
      this.deadT += dt;
      const k = Math.min(1, this.deadT / 0.45);
      const e = 1 - Math.pow(1 - k, 3);
      this.body.rotation.x = -Math.PI / 2 * e;
      this.body.position.y = 0.1 * e;
      return;
    }
    const run = Math.min(1, speed / 6);
    this.phase += dt * (speed * 2.1 + (speed > 0.1 ? 1.5 : 0));
    const ph = this.phase;
    const moving = speed > 0.15;
    const amp = moving ? 0.35 + 0.55 * run : 0;
    const s = Math.sin(ph), c = Math.cos(ph);
    // legs
    this.setBone('LeftUpLeg', -s * amp, 0, 0);
    this.setBone('RightUpLeg', s * amp, 0, 0);
    this.setBone('LeftLeg', amp * 1.3 * Math.max(0, c), 0, 0);
    this.setBone('RightLeg', amp * 1.3 * Math.max(0, -c), 0, 0);
    // body
    const breathe = Math.sin(ph * 0.5 + performance.now() * 0.0015) * 0.02;
    const lean = (this.zombie ? 0.25 : 0.05) + run * 0.2 + (extra.lean || 0);
    this.setBone('Spine', lean + breathe, extra.twist || 0, 0);
    this.setBone('Head', aim !== null ? -aim * 0.5 : (this.zombie ? -0.25 + Math.sin(ph * 0.5) * 0.1 : 0), 0, this.zombie ? Math.sin(ph * 0.35) * 0.2 : 0);
    this.model.position.y = this.baseY + (moving ? Math.abs(s) * 0.06 * (0.5 + run) : 0);

    // arms
    if (extra.cheer) {
      const w = Math.sin(performance.now() * 0.012);
      this.setBone('LeftArm', 0, 0, 1.1 + w * 0.25);
      this.setBone('RightArm', 0, 0, -1.1 + w * 0.25);
      this.setBone('LeftForeArm', 0, 0, 0.3);
      this.setBone('RightForeArm', 0, 0, -0.3);
      this.model.position.y = this.baseY + Math.abs(Math.sin(performance.now() * 0.008)) * 0.25;
    } else if (aim !== null) {
      // holding a gun: right arm points along the aim, left hand supports it
      this.setBone('RightArm', -aim - 0.05, 1.5, 0);
      this.setBone('RightForeArm', 0, 0.1, 0);
      this.setBone('LeftArm', -aim - 0.1, -1.95, 0);
      this.setBone('LeftForeArm', 0, -0.35, 0);
    } else if (this.zombie) {
      const a = attack >= 0 ? Math.sin(attack * Math.PI) : 0;
      const sway = Math.sin(ph * 0.5) * 0.15;
      this.setBone('LeftArm', -1.35 - a * 0.9 + sway + (attack >= 0 ? a * 1.6 * (attack > 0.5 ? 1 : 0) : 0), 0, -1.2);
      this.setBone('RightArm', -1.35 - a * 0.9 - sway + (attack >= 0 ? a * 1.6 * (attack > 0.5 ? 1 : 0) : 0), 0, 1.2);
      this.setBone('LeftForeArm', 0, -0.25, 0);
      this.setBone('RightForeArm', 0, 0.25, 0);
    } else {
      const sw = s * amp * 0.9;
      const a = attack >= 0 ? Math.sin(attack * Math.PI) : 0;
      this.setBone('LeftArm', sw - a * 1.5, 0, -1.25);
      this.setBone('RightArm', -sw - a * 1.5, 0, 1.25);
      this.setBone('LeftForeArm', 0, -0.35 - run * 0.6, 0);
      this.setBone('RightForeArm', 0, 0.35 + run * 0.6, 0);
    }
  }

  handWorld(out) {
    const h = this.bones.RightHand;
    return h ? h.getWorldPosition(out) : this.root.getWorldPosition(out);
  }
}

// ---------------------------------------------------------------- robot (clip animation)
let robotInfo = null;
function robotData() {
  if (robotInfo) return robotInfo;
  const g = M.RobotExpressive;
  const box = new THREE.Box3().setFromObject(g.scene);
  robotInfo = { height: box.max.y - box.min.y, minY: box.min.y };
  return robotInfo;
}

export class RobotChar extends Char {
  constructor({ color = 0x3d8bff, height = 2, widen = 1, emissive = 0, eyes = null } = {}) {
    super();
    const info = robotData();
    const model = SkeletonUtils.clone(M.RobotExpressive.scene);
    const s = height / info.height;
    model.scale.set(s * widen, s, s * widen);
    model.position.y = -info.minY * s;
    this.model = model;
    this.body.add(model);
    this.mats = cloneMaterials(model, (m) => {
      if (m.name === 'Main') { m.color.setHex(color); if (emissive) { m.emissive.setHex(emissive); m.emissiveIntensity = 0.5; } }
      if (m.name === 'Black' && eyes) { m.emissive.setHex(eyes); m.emissiveIntensity = 0.8; }
    });
    this.mixer = new THREE.AnimationMixer(model);
    this.actions = {};
    for (const clip of M.RobotExpressive.animations) this.actions[clip.name] = this.mixer.clipAction(clip);
    for (const n of ['Death', 'Jump', 'ThumbsUp', 'Wave', 'Yes', 'No']) {
      const a = this.actions[n];
      if (a) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
    }
    this.bones = {};
    model.traverse(o => { if (o.isBone) this.bones[o.name] = o; });
    this.height = height;
    this.current = null;
    addBlob(this.root, height * 0.55 * widen);
    this.play('Idle');
  }

  play(name, fade = 0.2, speed = 1) {
    const next = this.actions[name];
    if (!next) return;
    if (this.current === name) { next.timeScale = speed; return; }
    next.reset();
    next.timeScale = speed;
    next.setEffectiveWeight(1);
    next.fadeIn(fade).play();
    if (this.current) this.actions[this.current].fadeOut(fade);
    this.current = name;
  }

  die() { super.die(); this.play('Death', 0.1, 1.3); }

  pose(dt, speed, attack, aim = null, extra = {}) {
    if (!this.dead) {
      if (extra.anim) this.play(extra.anim, 0.2, extra.animSpeed || 1);
      else if (attack >= 0) this.play('Punch', 0.15, extra.attackSpeed || 1);
      else if (speed > 3.5) this.play('Running', 0.2, speed / 6);
      else if (speed > 0.15) this.play('Walking', 0.2, Math.max(0.6, speed / 2.6));
      else this.play('Idle', 0.25);
    }
    this.mixer.update(dt);
    if (aim !== null && !this.dead) this.aimArm(aim);
  }

  aimArm(aim) {
    const up = this.bones.UpperArmR, low = this.bones.LowerArmR;
    if (!up || !low) return;
    this.root.updateMatrixWorld(true);
    const parentQ = up.parent.getWorldQuaternion(Q);
    const yaw = this.root.rotation.y;
    const fwd = new THREE.Vector3(Math.sin(yaw) * Math.cos(aim), Math.sin(aim), Math.cos(yaw) * Math.cos(aim));
    const target = Q2.setFromUnitVectors(Y, fwd);
    up.quaternion.copy(parentQ.invert().multiply(target));
    low.quaternion.identity();
  }

  handWorld(out) {
    const h = this.bones.Palm2R;
    return h ? h.getWorldPosition(out) : this.root.getWorldPosition(out);
  }
}

// ---------------------------------------------------------------- drone
export class DroneChar extends Char {
  constructor({ height = 1.2 } = {}) {
    super();
    const m = cloneStatic('enemy-flying', { height });
    this.model = m;
    this.body.add(m);
    this.mats = cloneMaterials(m);
    this.height = height;
    this.blob = addBlob(this.root, 1.2);
  }
  pose(dt, speed, attack) {
    this.phase += dt * 3;
    if (this.dead) {
      this.deadT += dt;
      this.body.rotation.z += dt * 6;
      return;
    }
    this.body.position.y = Math.sin(this.phase) * 0.25;
    this.body.rotation.x = Math.min(0.35, speed * 0.06) + (attack >= 0 ? -0.2 : 0);
    this.body.rotation.z = Math.sin(this.phase * 0.7) * 0.08;
  }
}

// ---------------------------------------------------------------- weapons
const flashTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,230,1)'); grd.addColorStop(0.3, 'rgba(255,220,120,0.9)'); grd.addColorStop(1, 'rgba(255,140,0,0)');
  g.fillStyle = grd;
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, r = i % 2 ? 12 : 32;
    g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
  }
  g.fill();
  return new THREE.CanvasTexture(c);
})();

// Kenney blasters point down -Z (blaster, repeater) or along X (blaster-a); rotate so the muzzle is at +Z.
const GUN_ORIENT = { blaster: Math.PI, 'blaster-repeater': Math.PI, 'blaster-a': Math.PI / 2 };

export function makeGun(w, rarityHex, rarityIdx) {
  const g = new THREE.Group();
  let len;
  const glowMat = new THREE.MeshStandardMaterial({ color: rarityHex, emissive: rarityHex, emissiveIntensity: 0.9 + rarityIdx * 0.25, roughness: 0.3 });
  if (w.model === 'tube') {
    const bodyM = new THREE.MeshStandardMaterial({ color: 0x4a5a2a, roughness: 0.6, metalness: 0.3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1d2024, roughness: 0.5, metalness: 0.5 });
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.95, 14), bodyM);
    tube.rotation.x = Math.PI / 2; tube.position.z = 0.25;
    const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.1, 14), glowMat); r1.rotation.x = Math.PI / 2; r1.position.z = 0.72;
    const r2 = r1.clone(); r2.position.z = -0.22;
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), dark); grip.position.set(0, -0.15, 0.05);
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.22), dark); sight.position.set(0, 0.15, 0.3);
    g.add(tube, r1, r2, grip, sight);
    len = 0.78;
  } else {
    const inner = M[w.model].scene.clone(true);
    inner.rotation.y = GUN_ORIENT[w.model] || 0;
    const holder = new THREE.Group();
    holder.add(inner);
    const box = new THREE.Box3().setFromObject(holder);
    const size = box.getSize(new THREE.Vector3());
    const s = (w.modelScale || 0.35) / Math.max(size.y, 0.001) * 0.5;
    holder.scale.set(s, s, s * (w.stretch || 1));
    const c = box.getCenter(new THREE.Vector3());
    holder.position.set(-c.x * s, -c.y * s, -c.z * s * (w.stretch || 1) + size.z * s * (w.stretch || 1) * 0.25);
    g.add(holder);
    len = size.z * s * (w.stretch || 1) * 0.75;
    // rarity stripe along the top
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.025, len * 0.9), glowMat);
    stripe.position.set(0, size.y * s * 0.52, len * 0.35);
    g.add(stripe);
    if (w.scope) {
      const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.34, 10), new THREE.MeshStandardMaterial({ color: 0x15171c, metalness: 0.6, roughness: 0.3 }));
      sc.rotation.x = Math.PI / 2; sc.position.set(0, size.y * s * 0.62, len * 0.3);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), glowMat); lens.position.set(0, size.y * s * 0.62, len * 0.3 + 0.171);
      g.add(sc, lens);
    }
  }
  // tint the gun body toward its rarity
  g.traverse(o => {
    if (o.isMesh && o.material !== glowMat && o.material.emissive) {
      o.material = o.material.clone();
      o.material.emissive.setHex(rarityHex);
      o.material.emissiveIntensity = 0.04 + rarityIdx * 0.035;
    }
    if (o.isMesh) o.castShadow = shadows;
  });
  const muzzle = new THREE.Object3D();
  muzzle.position.z = len;
  g.add(muzzle);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, color: 0xffe0a0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flash.scale.setScalar(0.6);
  flash.visible = false;
  muzzle.add(flash);
  g.userData = { muzzle, flash, glowMat };
  return g;
}

// ---------------------------------------------------------------- thumbnails for the UI
export function renderThumbs(renderer, jobs, w = 256, h = 192) {
  const out = {};
  const rt = new THREE.WebGLRenderTarget(w, h, { samples: 4 });
  rt.texture.colorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445066, 2.2));
  const d = new THREE.DirectionalLight(0xffffff, 2.2); d.position.set(3, 5, 4); scene.add(d);
  const cam = new THREE.PerspectiveCamera(30, w / h, 0.01, 100);
  const px = new Uint8Array(w * h * 4);
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const prevTarget = renderer.getRenderTarget();
  const prevColor = new THREE.Color(); renderer.getClearColor(prevColor);
  const prevAlpha = renderer.getClearAlpha();
  for (const job of jobs) {
    const obj = job.object;
    scene.add(obj);
    obj.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    const r = Math.max(size.x, size.y, size.z);
    const dir = new THREE.Vector3(...(job.dir || [0.9, 0.35, 1])).normalize();
    cam.position.copy(c).addScaledVector(dir, r * (job.dist || 1.9));
    cam.lookAt(c);
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, cam);
    renderer.readRenderTargetPixels(rt, 0, 0, w, h, px);
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) img.data.set(px.subarray((h - 1 - y) * w * 4, (h - y) * w * 4), y * w * 4);
    ctx.putImageData(img, 0, 0);
    out[job.id] = canvas.toDataURL('image/png');
    scene.remove(obj);
  }
  renderer.setRenderTarget(prevTarget);
  renderer.setClearColor(prevColor, prevAlpha);
  rt.dispose();
  return out;
}
