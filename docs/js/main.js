import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { Sfx } from './audio.js';
import { Input } from './input.js';
import { Particles, Tracers, DamageNumbers } from './fx.js';
import {
  buildWorld, makeBlobTexture, fenceIndex,
  HOUSE_COLLIDE, FENCE_R, FENCE_SEGS, WORLD_R,
} from './world.js';
import {
  WEAPONS, weaponById, weaponStats, HOUSE_UPGRADES, HERO_UPGRADES, ENEMIES,
  buildWave, waveHpMult, waveDmgMult, waveCoinMult, waveBonus, isBossWave,
  loadSave, writeSave, clearSave, defaultSave,
} from './data.js';
import { Shop } from './ui.js';

const $ = (id) => document.getElementById(id);
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerpAngle = (a, b, t) => a + ((((b - a) % TAU) + TAU * 1.5) % TAU - Math.PI) * t;
const houseVal = (key) => HOUSE_UPGRADES.find(u => u.key === key).value(save.house[key]);
const heroVal = (key) => HERO_UPGRADES.find(u => u.key === key).value(save.hero[key]);

// ---------------------------------------------------------------- setup
let save = loadSave();
const sfx = new Sfx();
sfx.enabled = save.settings.sound;
const canvas = $('game');
const input = new Input(canvas);
if (save.settings.autofire === null) save.settings.autofire = input.isTouch;
document.body.classList.add(input.isTouch ? 'touch' : 'desktop');

function qualityProfile(q) {
  if (q === 'auto') q = input.isTouch ? 'medium' : 'high';
  const dpr = window.devicePixelRatio || 1;
  if (q === 'low') return { name: 'low', pr: Math.min(dpr, 1), aa: false, shadows: false };
  if (q === 'medium') return { name: 'medium', pr: Math.min(dpr, 1.5), aa: true, shadows: false };
  return { name: 'high', pr: Math.min(dpr, 2), aa: true, shadows: true };
}
const Q = qualityProfile(save.settings.quality);
let pixelRatio = Q.pr;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: Q.aa, powerPreference: 'high-performance' });
renderer.setPixelRatio(pixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = Q.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 600);
const world = buildWorld(scene, { shadows: Q.shadows, low: Q.name === 'low' });
const sparks = new Particles(scene, 1400, true);
const smoke = new Particles(scene, 600, false);
const tracers = new Tracers(scene);
const dmgNums = new DamageNumbers($('dmgNums'), camera);

const houseBox = new THREE.Box3(new THREE.Vector3(-HOUSE_COLLIDE, 0, -HOUSE_COLLIDE), new THREE.Vector3(HOUSE_COLLIDE, 9, HOUSE_COLLIDE));
const houseRayBox = new THREE.Box3(new THREE.Vector3(-5.2, 0, -5.2), new THREE.Vector3(5.2, 8, 5.2));
const blobTex = makeBlobTexture();
const blobGeo = new THREE.PlaneGeometry(1, 1);
const blobMat = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false });

// scratch objects
const V1 = new THREE.Vector3(), V2 = new THREE.Vector3(), V3 = new THREE.Vector3();
const Q1 = new THREE.Quaternion();
const E1 = new THREE.Euler(0, 0, 0, 'YXZ');
const RAY = new THREE.Ray();
const C = (hex) => new THREE.Color(hex);
const COL = {
  spark: C(0xffd27a), blood: C(0x9cff6a), fire: C(0xff8a2a), smoke: C(0x57506a), purple: C(0xc080ff),
  coin: C(0xffe070), wood: C(0x9a6b43), white: C(0xffffff), blue: C(0x6fdcff), red: C(0xff5a4a), dust: C(0x9c8a72),
};

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < h ? 78 : 62;
  camera.updateProjectionMatrix();
  const scale = (h * pixelRatio) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  sparks.mat.uniforms.scale.value = scale;
  smoke.mat.uniforms.scale.value = scale;
  checkRotate();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------------------------------------------------------------- characters
const ROBOT = { scene: null, clips: null, height: 1, minY: 0 };

function makeCharacter({ color, height, widen = 1, emissive = 0, eyes = null }) {
  const root = new THREE.Group();
  const model = SkeletonUtils.clone(ROBOT.scene);
  const s = height / ROBOT.height;
  model.scale.set(s * widen, s, s * widen);
  model.position.y = -ROBOT.minY * s;
  root.add(model);
  const map = new Map();
  const mats = [];
  model.traverse(o => {
    if (!o.isMesh) return;
    o.frustumCulled = false;
    o.castShadow = Q.shadows;
    let m = map.get(o.material);
    if (!m) {
      m = o.material.clone();
      if (m.name === 'Main') { m.color.setHex(color); if (emissive) { m.emissive.setHex(emissive); m.emissiveIntensity = 0.5; } }
      if (m.name === 'Black' && eyes) { m.emissive.setHex(eyes); m.emissiveIntensity = 0.7; }
      m.userData.baseEmissive = m.emissive.clone();
      m.userData.baseIntensity = m.emissiveIntensity;
      map.set(o.material, m);
      mats.push(m);
    }
    o.material = m;
  });
  const mixer = new THREE.AnimationMixer(model);
  const actions = {};
  for (const clip of ROBOT.clips) actions[clip.name] = mixer.clipAction(clip);
  for (const n of ['Death', 'Jump', 'ThumbsUp', 'Wave', 'Yes', 'No']) {
    if (actions[n]) { actions[n].setLoop(THREE.LoopOnce, 1); actions[n].clampWhenFinished = true; }
  }
  const blob = new THREE.Mesh(blobGeo, blobMat);
  blob.rotation.x = -Math.PI / 2;
  blob.position.y = 0.03;
  blob.scale.setScalar(height * 0.6 * widen);
  root.add(blob);
  const bones = {};
  model.traverse(o => { if (o.isBone) bones[o.name] = o; });
  return { root, model, mixer, actions, mats, bones, current: null };
}

function playAnim(ch, name, fade = 0.2, speed = 1) {
  const next = ch.actions[name];
  if (!next) return;
  if (ch.current === name) { next.timeScale = speed; return; }
  next.reset();
  next.timeScale = speed;
  next.setEffectiveWeight(1);
  next.fadeIn(fade).play();
  if (ch.current) ch.actions[ch.current].fadeOut(fade);
  ch.current = name;
}

function flashCharacter(ch, amount) {
  for (const m of ch.mats) {
    if (amount > 0) { m.emissive.setRGB(amount, amount, amount); m.emissiveIntensity = 1; }
    else { m.emissive.copy(m.userData.baseEmissive); m.emissiveIntensity = m.userData.baseIntensity; }
  }
}

// ---------------------------------------------------------------- gun models
function makeGunMesh(w) {
  const L = w.look;
  const g = new THREE.Group();
  const body = new THREE.MeshStandardMaterial({ color: L.body, metalness: 0.5, roughness: 0.45 });
  const acc = new THREE.MeshStandardMaterial({ color: L.accent, metalness: 0.3, roughness: 0.4, emissive: L.accent, emissiveIntensity: 0.25 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x15171c, metalness: 0.6, roughness: 0.4 });
  const t = L.thick;
  let muzzleZ;
  if (L.tube) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(t * 0.5, t * 0.5, L.len, 12), body);
    tube.rotation.x = Math.PI / 2; tube.position.z = L.len * 0.3;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(t * 0.58, t * 0.58, 0.1, 12), acc);
    ring.rotation.x = Math.PI / 2; ring.position.z = L.len * 0.3 + L.len / 2;
    const ring2 = ring.clone(); ring2.position.z = L.len * 0.3 - L.len / 2;
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), dark); grip.position.set(0, -t * 0.6, 0);
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.2), acc); sight.position.set(0, t * 0.55, 0.1);
    g.add(tube, ring, ring2, grip, sight);
    muzzleZ = L.len * 0.3 + L.len / 2 + 0.05;
  } else {
    const rec = new THREE.Mesh(new THREE.BoxGeometry(t * 0.75, t, L.len), body);
    rec.position.z = L.len / 2 - 0.12;
    const top = new THREE.Mesh(new THREE.BoxGeometry(t * 0.77, t * 0.18, L.len * 0.9), acc);
    top.position.set(0, t * 0.5, L.len / 2 - 0.12);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(t * 0.6, t * 1.3, t * 0.7), dark);
    grip.position.set(0, -t * 0.9, 0); grip.rotation.x = 0.25;
    g.add(rec, top, grip);
    const bl = Math.max(0.12, L.barrel);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(t * 0.2, t * 0.2, bl, 8), dark);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = L.len - 0.12 + bl / 2;
    g.add(barrel);
    muzzleZ = L.len - 0.12 + bl;
    if (L.mag) { const m = new THREE.Mesh(new THREE.BoxGeometry(t * 0.45, t * 1.4, t * 0.6), acc); m.position.set(0, -t * 1.0, L.len * 0.35); m.rotation.x = -0.15; g.add(m); }
    if (L.stock) { const s = new THREE.Mesh(new THREE.BoxGeometry(t * 0.6, t * 0.9, 0.3), body); s.position.set(0, -t * 0.1, -0.3); g.add(s); }
    if (L.scope) {
      const sc = new THREE.Mesh(new THREE.CylinderGeometry(t * 0.3, t * 0.3, 0.4, 10), dark);
      sc.rotation.x = Math.PI / 2; sc.position.set(0, t * 0.95, L.len * 0.35); g.add(sc);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(t * 0.26, 10), acc); lens.position.set(0, t * 0.95, L.len * 0.35 + 0.201); g.add(lens);
    }
    if (L.pump) { const p = new THREE.Mesh(new THREE.BoxGeometry(t * 0.9, t * 0.6, 0.25), acc); p.position.set(0, -t * 0.25, L.len - 0.05); g.add(p); }
  }
  const muzzle = new THREE.Object3D();
  muzzle.position.z = muzzleZ;
  g.add(muzzle);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTex, color: 0xffd080, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  flash.scale.setScalar(0.7);
  flash.visible = false;
  muzzle.add(flash);
  g.userData.muzzle = muzzle;
  g.userData.flash = flash;
  g.traverse(o => { if (o.isMesh) o.castShadow = Q.shadows; });
  return g;
}

const flashTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,230,1)'); grd.addColorStop(0.3, 'rgba(255,200,80,0.9)'); grd.addColorStop(1, 'rgba(255,120,0,0)');
  g.fillStyle = grd;
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU, r = i % 2 ? 12 : 32;
    g.lineTo(32 + Math.cos(a) * r, 32 + Math.sin(a) * r);
  }
  g.fill();
  return new THREE.CanvasTexture(c);
})();

// ---------------------------------------------------------------- game state
const G = {
  state: 'loading', // loading | menu | shop | playing | paused
  phase: 'idle',    // countdown | fight | cleared | failed
  phaseT: 0,
  time: 0,
  queue: [],
  spawnT: 0,
  enemies: [],
  coins: [],
  rockets: [],
  kills: 0,
  runCoins: 0,
  houseHp: 600,
  houseMax: 600,
  houseLastHit: -10,
  shake: 0,
  kick: 0,
  failReason: '',
  dynT: 0, dynFrames: 0,
  menuAngle: 0.6,
  bossTotal: 0,
};

const player = {
  pos: new THREE.Vector3(0, 0, 9), vel: new THREE.Vector3(),
  yaw: Math.PI, pitch: -0.12, facing: 0,
  hp: 100, maxHp: 100, alive: true, radius: 0.5, lastHurt: -10,
  ch: null, gunHolder: null, gun: null, weaponId: 'pistol',
  ammo: {}, reloadT: 0, fireCd: 0, swapT: 0, lastShot: -10, bloom: 0,
};

const shop = new Shop({
  get save() { return save; },
  sfx,
  spend: (c) => spend(c),
  onShopChange: () => onShopChange(),
  toast: (t) => toast(t),
});

function spend(cost) {
  if (save.coins < cost) { sfx.deny(); toast('Not enough coins'); return false; }
  save.coins -= cost;
  sfx.buy();
  writeSave(save);
  return true;
}

let toastT = null;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.classList.remove('show'), 1600);
}

function onShopChange() {
  applyUpgradesToWorld();
  equipWeapon(save.equipped, true);
  writeSave(save);
}

function applyUpgradesToWorld() {
  const t = save.house.hp >= 12 ? 3 : save.house.hp >= 8 ? 2 : save.house.hp >= 4 ? 1 : 0;
  world.house.setTier(t);
  world.setTurrets(save.house.turrets);
  world.setSpikes(save.house.spikes);
  world.setFence(save.house.fence, houseVal('fence'));
  G.houseMax = houseVal('hp');
  player.maxHp = heroVal('hp');
}

// ---------------------------------------------------------------- weapons
function curWeapon() { return weaponById(player.weaponId); }
function curStats() { return weaponStats(curWeapon(), save.weapons[player.weaponId].lv); }
function ownedWeapons() { return WEAPONS.filter(w => save.weapons[w.id]?.owned); }

function equipWeapon(id, silent = false) {
  if (!save.weapons[id]?.owned) id = 'pistol';
  player.weaponId = id;
  if (player.gun) player.gunHolder.remove(player.gun);
  player.gun = makeGunMesh(weaponById(id));
  player.gunHolder.add(player.gun);
  player.reloadT = 0;
  if (!silent) { player.swapT = 0.35; sfx.swap(); }
  const st = curStats();
  if (player.ammo[id] === undefined || player.ammo[id] > st.mag) player.ammo[id] = st.mag;
  updateAmmoHud();
}

function refillAmmo() {
  for (const w of ownedWeapons()) player.ammo[w.id] = weaponStats(w, save.weapons[w.id].lv).mag;
}

function startReload() {
  const st = curStats();
  if (player.reloadT > 0 || player.ammo[player.weaponId] >= st.mag) return;
  player.reloadT = st.reload;
  sfx.reload();
}

// ---------------------------------------------------------------- camera
const camState = { pivot: new THREE.Vector3(), dir: new THREE.Vector3(), q: new THREE.Quaternion() };

function updateCamera(dt) {
  if (G.state === 'playing') {
    const pivot = camState.pivot.set(player.pos.x, player.pos.y + 2.0, player.pos.z);
    E1.set(player.pitch + G.kick, player.yaw, 0, 'YXZ');
    camState.q.setFromEuler(E1);
    const off = (camera.aspect < 1 ? V1.set(0.7, 0.9, 7.2) : V1.set(1.35, 0.4, 5.2)).applyQuaternion(camState.q);
    let dist = off.length();
    const dir = V2.copy(off).divideScalar(dist);
    RAY.set(pivot, dir);
    const hit = RAY.intersectBox(houseRayBox, V3);
    if (hit) dist = Math.max(0.9, pivot.distanceTo(hit) - 0.3);
    camera.position.copy(pivot).addScaledVector(dir, dist);
    if (camera.position.y < 0.4) camera.position.y = 0.4;
    camera.quaternion.copy(camState.q);
  } else {
    // orbit around the base for menus
    G.menuAngle += dt * 0.08;
    const r = 24;
    camera.position.set(Math.sin(G.menuAngle) * r, 9.5, Math.cos(G.menuAngle) * r);
    camera.lookAt(0, 3, 0);
  }
  if (G.shake > 0) {
    camera.position.x += (Math.random() - 0.5) * G.shake;
    camera.position.y += (Math.random() - 0.5) * G.shake;
    camera.position.z += (Math.random() - 0.5) * G.shake;
    G.shake = Math.max(0, G.shake - dt * 2.5);
  }
  G.kick *= Math.exp(-dt * 10);
}

function aimRay(out) {
  out.origin.copy(camera.position);
  out.direction.set(0, 0, -1).applyQuaternion(camera.quaternion);
  return out;
}

// ---------------------------------------------------------------- player
function setupPlayer() {
  const ch = makeCharacter({ color: 0x3d8bff, height: 2.0, eyes: 0x3ce0ff });
  player.ch = ch;
  scene.add(ch.root);
  const holder = new THREE.Group();
  holder.position.set(-0.3, 1.0, 0.5);
  holder.scale.setScalar(1.4);
  ch.root.add(holder);
  player.gunHolder = holder;
  playAnim(ch, 'Idle');
  equipWeapon(save.equipped, true);
}

function resetPlayer() {
  player.pos.set(0, 0, 9);
  player.vel.set(0, 0, 0);
  player.yaw = Math.PI; player.pitch = -0.12; player.facing = 0;
  player.maxHp = heroVal('hp');
  player.hp = player.maxHp;
  player.alive = true;
  player.lastHurt = -10;
  player.reloadT = 0; player.fireCd = 0; player.swapT = 0; player.bloom = 0;
  player.ch.root.position.copy(player.pos);
  player.ch.root.rotation.y = player.facing;
  player.gunHolder.visible = true;
  playAnim(player.ch, 'Idle', 0.1);
}

function updatePlayer(dt) {
  const ch = player.ch;
  if (!player.alive) { ch.mixer.update(dt); return; }
  input.update();
  // look
  const sens = save.settings.sens * (input.isTouch ? 0.0055 : 0.0032);
  player.yaw -= input.lookDX * sens;
  player.pitch = clamp(player.pitch - input.lookDY * sens, -0.75, 0.55);
  input.lookDX = input.lookDY = 0;

  // move
  const speed = 7.2 * heroVal('speed');
  const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
  const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
  const mx = input.move.x, my = input.move.y;
  const tx = (rx * mx + fx * my) * speed, tz = (rz * mx + fz * my) * speed;
  const acc = Math.min(1, dt * 12);
  player.vel.x += (tx - player.vel.x) * acc;
  player.vel.z += (tz - player.vel.z) * acc;
  player.pos.x += player.vel.x * dt;
  player.pos.z += player.vel.z * dt;
  collideCircle(player.pos, player.radius, true);
  const moving = Math.hypot(player.vel.x, player.vel.z) > 0.6;

  // facing: toward aim when shooting / recently shot, otherwise toward movement
  const aiming = G.time - player.lastShot < 0.8 || input.fireHeld;
  let targetFacing = player.facing;
  if (aiming) targetFacing = player.yaw + Math.PI;
  else if (moving) targetFacing = Math.atan2(player.vel.x, player.vel.z);
  player.facing = lerpAngle(player.facing, targetFacing, Math.min(1, dt * 14));
  ch.root.position.copy(player.pos);
  ch.root.rotation.y = player.facing;
  // aim gun pitch
  player.gunHolder.rotation.x = aiming ? -(player.pitch + 0.08) : 0.15;

  const mv = Math.hypot(input.move.x, input.move.y);
  if (moving) playAnim(ch, mv > 0.55 ? 'Running' : 'Walking', 0.2, mv > 0.55 ? heroVal('speed') : 1.2);
  else playAnim(ch, 'Idle', 0.25);
  ch.mixer.update(dt);
  poseArms(ch, aiming);

  // regen
  if (G.time - player.lastHurt > 3) player.hp = Math.min(player.maxHp, player.hp + heroVal('regen') * dt);

  // weapon
  const st = curStats();
  const w = curWeapon();
  player.fireCd -= dt;
  player.bloom = Math.max(0, player.bloom - dt * 3);
  if (player.swapT > 0) player.swapT -= dt;
  if (input.consume('swapPressed')) {
    const list = ownedWeapons();
    if (list.length > 1) {
      const i = list.findIndex(x => x.id === player.weaponId);
      equipWeapon(list[(i + 1) % list.length].id);
      save.equipped = player.weaponId;
    }
  }
  if (input.consume('reloadPressed')) startReload();
  if (player.reloadT > 0) {
    player.reloadT -= dt;
    if (player.reloadT <= 0) { player.ammo[w.id] = st.mag; sfx.reloadDone(); }
  }
  const target = findAimTarget(4, 0.2);
  $('crosshair').classList.toggle('on', !!target);
  const wantFire = input.fireHeld || (save.settings.autofire && target && G.phase === 'fight');
  if (wantFire && player.fireCd <= 0 && player.swapT <= 0 && player.reloadT <= 0) {
    if (player.ammo[w.id] > 0) fire(w, st);
    else if (input.fireHeld) { sfx.empty(); startReload(); player.fireCd = 0.25; }
  }
  if (player.ammo[w.id] <= 0 && player.reloadT <= 0 && player.fireCd <= 0) startReload();

  const fl = player.gun.userData.flash;
  if (fl.visible && G.time - player.lastShot > 0.05) fl.visible = false;
}

// Rotate the right arm so the robot holds its gun forward while aiming.
const armQ = new THREE.Quaternion();
function poseArms(ch, aiming) {
  const up = ch.bones.UpperArmR, low = ch.bones.LowerArmR;
  if (!up || !low) return;
  ch.aimBlend = THREE.MathUtils.damp(ch.aimBlend || 0, aiming ? 1 : 0, 12, 1 / 60);
  if (ch.aimBlend < 0.01) { attachGunToHand(ch); return; }
  // point the upper arm along the character's forward (+Z) direction in world space
  ch.root.updateMatrixWorld(true);
  const parentQ = up.parent.getWorldQuaternion(Q1);
  const fwd = V1.set(Math.sin(player.facing), Math.sin(player.pitch + 0.08) * 0.9, Math.cos(player.facing)).normalize();
  // bone's local "along arm" axis is +Y in this rig
  const worldTarget = armQ.setFromUnitVectors(V2.set(0, 1, 0), fwd);
  const local = parentQ.invert().multiply(worldTarget);
  up.quaternion.slerp(local, ch.aimBlend);
  low.quaternion.slerp(Q1.identity(), ch.aimBlend);
  attachGunToHand(ch);
}

// Keep the gun in the robot's right hand.
function attachGunToHand(ch) {
  const palm = ch.bones.Palm2R;
  if (!palm) return;
  ch.root.updateMatrixWorld(true);
  palm.getWorldPosition(V3);
  ch.root.worldToLocal(V3);
  player.gunHolder.position.set(V3.x, V3.y + 0.06, V3.z);
}

// ---------------------------------------------------------------- collisions
function collideCircle(p, r, isPlayer) {
  // house
  const h = HOUSE_COLLIDE + r;
  if (Math.abs(p.x) < h && Math.abs(p.z) < h) {
    const dx = h - Math.abs(p.x), dz = h - Math.abs(p.z);
    if (dx < dz) p.x = Math.sign(p.x || 1) * h; else p.z = Math.sign(p.z || 1) * h;
  }
  // obstacles
  for (const o of world.obstacles) {
    const dx = p.x - o.x, dz = p.z - o.z;
    const d2 = dx * dx + dz * dz, rr = o.r + r;
    if (d2 < rr * rr && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      p.x = o.x + dx / d * rr; p.z = o.z + dz / d * rr;
    }
  }
  if (isPlayer) {
    const d = Math.hypot(p.x, p.z);
    if (d > WORLD_R) { p.x *= WORLD_R / d; p.z *= WORLD_R / d; }
  }
}

// ---------------------------------------------------------------- shooting
const hitList = [];
function raySphere(o, d, c, r) {
  const ox = o.x - c.x, oy = o.y - c.y, oz = o.z - c.z;
  const b = ox * d.x + oy * d.y + oz * d.z;
  const cc = ox * ox + oy * oy + oz * oz - r * r;
  const disc = b * b - cc;
  if (disc < 0) return -1;
  const t = -b - Math.sqrt(disc);
  return t >= 0 ? t : (cc < 0 ? 0 : -1);
}

const SPH = new THREE.Vector3();
function enemySpheres(e) {
  const h = e.height, w = e.def.widen, p = e.pos;
  return [
    { y: h * 0.8, r: h * 0.19 * w, head: true },
    { y: h * 0.45, r: h * 0.24 * w, head: false },
    { y: h * 0.16, r: h * 0.16 * w, head: false },
  ].map(s => ({ c: new THREE.Vector3(p.x, p.y + s.y, p.z), r: s.r, head: s.head }));
}

function raycastEnemies(o, d, maxT) {
  hitList.length = 0;
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0) continue;
    // cheap reject
    SPH.set(e.pos.x - o.x, e.pos.y + e.height * 0.5 - o.y, e.pos.z - o.z);
    const along = SPH.dot(d);
    if (along < -e.height || along > maxT + e.height) continue;
    const perp2 = SPH.lengthSq() - along * along;
    if (perp2 > e.height * e.height) continue;
    let best = null;
    for (const s of enemySpheres(e)) {
      const t = raySphere(o, d, s.c, s.r);
      if (t >= 0 && t <= maxT && (!best || t < best.t - 0.05 || (s.head && Math.abs(t - best.t) < 0.05))) best = { t, head: s.head, e };
    }
    if (best) hitList.push(best);
  }
  hitList.sort((a, b) => a.t - b.t);
  return hitList;
}

function worldHitT(o, d, maxT) {
  let t = maxT;
  if (d.y < -1e-4) t = Math.min(t, -o.y / d.y);
  RAY.set(o, d);
  const hp = RAY.intersectBox(houseRayBox, V3);
  if (hp) t = Math.min(t, o.distanceTo(hp));
  return t;
}

function findAimTarget(maxDeg, slack = 0.5) {
  if (G.phase !== 'fight' && G.phase !== 'countdown') return null;
  const ray = aimRay(new THREE.Ray());
  const w = curWeapon();
  const minT = camera.position.distanceTo(camState.pivot) * 0.8;
  const cosMax = Math.cos(THREE.MathUtils.degToRad(maxDeg));
  let best = null, bestCos = cosMax;
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0) continue;
    const c = V1.set(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z).sub(ray.origin);
    const dist = c.length();
    if (dist < minT || dist > w.range + 4) continue;
    c.divideScalar(dist);
    const cosv = c.dot(ray.direction);
    // lateral miss distance must be within the enemy's size plus some slack
    const lateral = dist * Math.sqrt(Math.max(0, 1 - cosv * cosv));
    if (cosv < cosMax || lateral > e.height * 0.3 * e.def.widen + slack) continue;
    if (cosv > bestCos || !best) {
      if (worldHitT(ray.origin, c, dist) < dist - 0.5) continue;
      bestCos = cosv;
      best = { e, dir: c.clone(), dist };
    }
  }
  return best;
}

function fire(w, st) {
  player.ammo[w.id]--;
  player.fireCd = 1 / st.rate;
  player.lastShot = G.time;
  G.kick += w.recoil;
  player.bloom = Math.min(1.5, player.bloom + 0.25);
  sfx.shot(w.sound);
  updateAmmoHud();

  const ray = aimRay(new THREE.Ray());
  let dir = ray.direction.clone();
  const minT = camera.position.distanceTo(camState.pivot) * 0.9;
  if (input.isTouch) {
    const t = findAimTarget(8, 0.9);
    if (t) {
      // aim assist: steer toward the target body (keep headshots if already on the head)
      const direct = raycastEnemies(ray.origin, ray.direction, w.range)[0];
      if (!direct || direct.e !== t.e) dir = t.dir;
    }
  }
  const muzzle = player.gun.userData.muzzle.getWorldPosition(new THREE.Vector3());
  const fl = player.gun.userData.flash;
  fl.visible = true;
  fl.material.rotation = Math.random() * TAU;
  fl.scale.setScalar(0.5 + Math.random() * 0.4 + (w.pellets > 1 ? 0.4 : 0));
  for (let i = 0; i < 3; i++) sparks.emit(muzzle.x, muzzle.y, muzzle.z, dir.x * 4 + (Math.random() - 0.5) * 2, dir.y * 4 + Math.random(), dir.z * 4 + (Math.random() - 0.5) * 2, 0.12, 0.35, COL.fire);

  if (w.projectile) {
    const tEnd = worldHitT(ray.origin, dir, w.range);
    const hits = raycastEnemies(ray.origin, dir, tEnd).filter(h => h.t > minT);
    const aimPoint = ray.origin.clone().addScaledVector(dir, hits.length ? hits[0].t : tEnd);
    spawnRocket(muzzle, aimPoint, st.dmg, w.splash);
    return;
  }
  const spread = w.spread * (1 + player.bloom * 0.6);
  const origin = ray.origin;
  for (let p = 0; p < w.pellets; p++) {
    const d = dir.clone();
    if (spread > 0) {
      d.x += (Math.random() - 0.5) * 2 * spread;
      d.y += (Math.random() - 0.5) * 2 * spread;
      d.z += (Math.random() - 0.5) * 2 * spread;
      d.normalize();
    }
    let endT = worldHitT(origin, d, w.range);
    const hits = raycastEnemies(origin, d, endT);
    let pierce = w.pierce || 1;
    let hitEnemy = false;
    for (const h of hits) {
      if (h.t < minT) continue;
      const pt = origin.clone().addScaledVector(d, h.t);
      damageEnemy(h.e, st.dmg * (h.head ? (w.headMult || 1.75) : 1), h.head, pt, true);
      hitEnemy = true;
      if (--pierce <= 0) { endT = h.t; break; }
    }
    const end = origin.clone().addScaledVector(d, endT);
    if (p < 4 || Math.random() < 0.4) tracers.spawn(muzzle, end, w.id === 'sniper' ? 0xc89bff : 0xffe08a, w.id === 'sniper' ? 0.08 : 0.045, w.id === 'sniper' ? 0.2 : 0.07);
    if (!hitEnemy && endT < w.range - 0.1) {
      for (let k = 0; k < 4; k++) sparks.emit(end.x, end.y + 0.05, end.z, (Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3, 0.25, 0.18, COL.spark, 9);
      smoke.emit(end.x, end.y + 0.1, end.z, 0, 0.5, 0, 0.5, 0.4, COL.dust, 0, 1, 1.5);
    }
  }
}

function spawnRocket(from, to, dmg, splash) {
  const mesh = new THREE.Group();
  const bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8), new THREE.MeshStandardMaterial({ color: 0x6a7a3a }));
  bodyM.rotation.x = Math.PI / 2;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0xff4b3c }));
  tip.rotation.x = Math.PI / 2; tip.position.z = 0.37;
  mesh.add(bodyM, tip);
  mesh.position.copy(from);
  mesh.lookAt(to);
  scene.add(mesh);
  const vel = to.clone().sub(from).normalize().multiplyScalar(42);
  G.rockets.push({ mesh, vel, dmg, splash, life: 3 });
}

function updateRockets(dt) {
  for (let i = G.rockets.length - 1; i >= 0; i--) {
    const r = G.rockets[i];
    r.life -= dt;
    const p = r.mesh.position;
    const steps = 3;
    let boom = r.life <= 0;
    for (let s = 0; s < steps && !boom; s++) {
      p.addScaledVector(r.vel, dt / steps);
      if (p.y < 0.1 || houseRayBox.containsPoint(p)) boom = true;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0) continue;
        const dx = p.x - e.pos.x, dz = p.z - e.pos.z, dy = p.y - (e.pos.y + e.height * 0.5);
        const rr = e.height * 0.3 * e.def.widen + 0.3;
        if (dx * dx + dz * dz < rr * rr && Math.abs(dy) < e.height * 0.55) { boom = true; break; }
      }
    }
    smoke.emit(p.x, p.y, p.z, (Math.random() - 0.5) * 0.4, 0.4, (Math.random() - 0.5) * 0.4, 0.6, 0.5, COL.smoke, 0, 1, 2);
    sparks.emit(p.x, p.y, p.z, -r.vel.x * 0.05, -r.vel.y * 0.05, -r.vel.z * 0.05, 0.15, 0.45, COL.fire);
    if (boom) {
      explode(p.clone(), r.dmg, r.splash);
      scene.remove(r.mesh);
      r.mesh.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
      G.rockets.splice(i, 1);
    }
  }
}

function explode(pos, dmg, radius) {
  sfx.explosion();
  const dPlayer = pos.distanceTo(player.pos);
  G.shake = Math.max(G.shake, clamp(0.6 - dPlayer * 0.02, 0.1, 0.6));
  for (let i = 0; i < 40; i++) {
    const a = Math.random() * TAU, u = Math.random() * 2 - 1, s = 4 + Math.random() * 8;
    const k = Math.sqrt(1 - u * u);
    sparks.emit(pos.x, pos.y + 0.2, pos.z, Math.cos(a) * k * s, Math.abs(u) * s, Math.sin(a) * k * s, 0.4 + Math.random() * 0.3, 0.5 + Math.random() * 0.6, i % 3 ? COL.fire : COL.spark, 6, 2);
  }
  for (let i = 0; i < 18; i++) {
    smoke.emit(pos.x + (Math.random() - 0.5), pos.y + Math.random(), pos.z + (Math.random() - 0.5), (Math.random() - 0.5) * 3, 1 + Math.random() * 2, (Math.random() - 0.5) * 3, 1.2 + Math.random(), 1.4, COL.smoke, -0.5, 1.5, 2.5);
  }
  if (dmg <= 0) return;
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0) continue;
    const d = Math.hypot(pos.x - e.pos.x, pos.z - e.pos.z) - e.radius;
    if (d < radius && Math.abs(pos.y - e.pos.y) < e.height + radius) {
      const f = 1 - 0.6 * clamp(d / radius, 0, 1);
      damageEnemy(e, dmg * f, false, V1.set(e.pos.x, e.pos.y + e.height * 0.6, e.pos.z).clone(), true);
    }
  }
}

function showHitmarker(kind) {
  const el = $('hitmarker');
  el.className = '';
  void el.offsetWidth;
  el.className = 'show ' + (kind || '');
}

// ---------------------------------------------------------------- enemies
function spawnEnemy(type) {
  const def = ENEMIES[type];
  const n = save.wave;
  const active = world.portals.filter(p => p.active);
  const portal = active[Math.floor(Math.random() * active.length)];
  const ch = makeCharacter({ color: def.color, height: def.height, widen: def.widen, emissive: def.emissive || 0, eyes: type === 'boss' ? 0xff40ff : 0xff3020 });
  const side = (Math.random() - 0.5) * 3.5;
  const pos = new THREE.Vector3(
    portal.pos.x - Math.cos(portal.angle) * 1.5 + Math.cos(portal.angle + Math.PI / 2) * side,
    0,
    portal.pos.z - Math.sin(portal.angle) * 1.5 + Math.sin(portal.angle + Math.PI / 2) * side,
  );
  ch.root.position.copy(pos);
  ch.root.rotation.y = Math.atan2(-pos.x, -pos.z);
  ch.root.scale.setScalar(0.01);
  scene.add(ch.root);
  const hpMult = waveHpMult(n) * (type === 'boss' ? 1 + Math.floor(n / 20) * 0.3 : 1);
  const e = {
    type, def, ch, pos, alive: true,
    hp: def.hp * hpMult, maxHp: def.hp * hpMult,
    dmg: def.dmg * waveDmgMult(n),
    speed: def.speed * (0.92 + Math.random() * 0.16) * (1 + Math.min(0.25, n * 0.008)),
    radius: def.radius, height: def.height,
    state: 'walk', atkCd: 0.5 + Math.random() * 0.5, atkHit: -1, atkTarget: null,
    flash: 0, dieT: 0, spawnT: 0.7, slow: 1, fenceSeg: null,
    coinValue: def.coins * waveCoinMult(n),
    hpBar: null, facing: ch.root.rotation.y,
  };
  playAnim(ch, def.anim, 0.1, def.animSpeed);
  if (type !== 'boss') e.hpBar = makeHpBar(ch.root, def.height + 0.35 * (def.height / 2));
  G.enemies.push(e);
  sfx.portal();
  for (let i = 0; i < 16; i++) sparks.emit(pos.x, 1 + Math.random() * 2, pos.z, (Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5, 0.6, 0.5, COL.purple, 2, 1);
  if (type === 'boss') {
    G.bossTotal++;
    showBanner('STORM KING!', 'A boss has entered the field', 'red', 2.2);
    sfx.bossRoar();
    G.shake = 0.5;
  }
  return e;
}

const barTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 4, 4); return new THREE.CanvasTexture(c); })();
function makeHpBar(parent, y) {
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x140a28, depthTest: false, transparent: true, opacity: 0.8 }));
  const fill = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x5cf08a, depthTest: false }));
  const w = 1.1, h = 0.13;
  bg.scale.set(w + 0.08, h + 0.07, 1);
  fill.scale.set(w, h, 1);
  bg.position.y = fill.position.y = y;
  bg.renderOrder = 10; fill.renderOrder = 11;
  bg.visible = fill.visible = false;
  parent.add(bg, fill);
  return { bg, fill, w };
}

function updateHpBar(e) {
  if (!e.hpBar) return;
  const f = clamp(e.hp / e.maxHp, 0.001, 1);
  const show = e.alive && f < 0.999;
  e.hpBar.bg.visible = e.hpBar.fill.visible = show;
  if (!show) return;
  // compensate for the root scale so bars stay a fixed size
  const inv = 1 / (e.ch.root.scale.x || 1);
  e.hpBar.bg.scale.set((e.hpBar.w + 0.08) * inv, 0.2 * inv, 1);
  e.hpBar.fill.scale.set(e.hpBar.w * f * inv, 0.13 * inv, 1);
  e.hpBar.fill.center.set(0.5 / f, 0.5);
  e.hpBar.fill.material.color.setHex(f > 0.5 ? 0x5cf08a : f > 0.25 ? 0xffc02e : 0xff4d5e);
}

function damageEnemy(e, amount, head, point, byPlayer) {
  if (!e.alive) return;
  amount = Math.max(1, Math.round(amount));
  e.hp -= amount;
  e.flash = 0.09;
  if (byPlayer) {
    dmgNums.spawn(point || V1.set(e.pos.x, e.pos.y + e.height, e.pos.z), amount, head ? 'crit' : amount >= 100 ? 'big' : '');
    sfx.hit(head);
  }
  if (point) {
    for (let i = 0; i < (head ? 8 : 5); i++) sparks.emit(point.x, point.y, point.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.3, 0.22, head ? COL.spark : COL.blood, 8);
  }
  if (e.hp <= 0) {
    killEnemy(e);
    if (byPlayer) showHitmarker('kill');
  } else if (byPlayer) showHitmarker(head ? 'head' : '');
}

function killEnemy(e) {
  e.alive = false;
  e.state = 'dying';
  e.dieT = 0;
  G.kills++;
  save.kills++;
  playAnim(e.ch, 'Death', 0.1, 1.3);
  sfx.enemyDie();
  if (e.hpBar) e.hpBar.bg.visible = e.hpBar.fill.visible = false;
  const c = V1.set(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z);
  for (let i = 0; i < 14; i++) sparks.emit(c.x, c.y, c.z, (Math.random() - 0.5) * 6, Math.random() * 5, (Math.random() - 0.5) * 6, 0.5, 0.3, COL.purple, 9, 1);
  dropCoins(e.pos, e.coinValue, e.type === 'boss' ? 14 : e.type === 'brute' ? 5 : 2);
  if (e.type === 'boss') { G.shake = 0.6; explode(c.clone(), 0, 0.1); }
}

function updateEnemies(dt) {
  const fenceOn = save.house.fence > 0;
  const fenceBlockR = FENCE_R * Math.cos(Math.PI / FENCE_SEGS);
  const spikeDps = houseVal('spikes');
  for (let i = G.enemies.length - 1; i >= 0; i--) {
    const e = G.enemies[i];
    const ch = e.ch;
    ch.mixer.update(dt);
    if (e.flash > 0) { e.flash -= dt; flashCharacter(ch, e.flash > 0 ? 0.7 : 0); }
    if (e.state === 'dying') {
      e.dieT += dt;
      if (e.dieT > 1.3) ch.root.position.y -= dt * 1.4;
      if (e.dieT > 2.6) { removeEnemy(e); G.enemies.splice(i, 1); }
      continue;
    }
    if (e.spawnT > 0) {
      e.spawnT -= dt;
      ch.root.scale.setScalar(clamp(1 - e.spawnT / 0.7, 0.01, 1));
      if (e.spawnT <= 0) ch.root.scale.setScalar(1);
      continue;
    }

    // spikes
    e.slow = 1;
    if (spikeDps > 0) {
      for (const sp of world.spikePatches) {
        if (Math.hypot(e.pos.x - sp.x, e.pos.z - sp.z) < sp.r + e.radius * 0.5) {
          e.slow = 0.65;
          e.hp -= spikeDps * dt;
          e.flash = Math.max(e.flash, 0.02);
          if (Math.random() < dt * 6) sparks.emit(e.pos.x, 0.3, e.pos.z, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.3, 0.2, COL.blood, 8);
          if (e.hp <= 0) { killEnemy(e); }
          break;
        }
      }
      if (!e.alive) continue;
    }

    // choose target
    const dpx = player.pos.x - e.pos.x, dpz = player.pos.z - e.pos.z;
    const dp = Math.hypot(dpx, dpz);
    const aggro = e.type === 'boss' ? 9 : e.type === 'runner' ? 8 : 6.5;
    let tx, tz, targetKind;
    if (player.alive && dp < aggro) {
      tx = player.pos.x; tz = player.pos.z; targetKind = 'player';
    } else {
      tx = clamp(e.pos.x, -HOUSE_COLLIDE, HOUSE_COLLIDE);
      tz = clamp(e.pos.z, -HOUSE_COLLIDE, HOUSE_COLLIDE);
      targetKind = 'house';
    }
    const dx = tx - e.pos.x, dz = tz - e.pos.z;
    const dist = Math.hypot(dx, dz);
    const reach = e.def.reach + (targetKind === 'player' ? player.radius : 0) + e.radius * 0.6;

    let attackTarget = null;
    if (e.state === 'fence' && e.fenceSeg && e.fenceSeg.alive && Math.hypot(tx, tz) < fenceBlockR) {
      attackTarget = e.fenceSeg;
    } else if (dist <= reach) {
      attackTarget = targetKind;
    }

    if (attackTarget) {
      e.state = attackTarget === 'player' || attackTarget === 'house' ? 'attack' : 'fence';
      const face = attackTarget === 'player' || attackTarget === 'house' ? Math.atan2(dx, dz) : Math.atan2(-e.pos.x, -e.pos.z);
      e.facing = lerpAngle(e.facing, face, Math.min(1, dt * 8));
      const clip = ch.actions.Punch.getClip();
      playAnim(ch, 'Punch', 0.15, clip.duration / e.def.rate);
      e.atkCd -= dt;
      if (e.atkCd <= 0) {
        e.atkCd = e.def.rate;
        e.atkHit = e.def.rate * 0.45;
        e.atkTarget = attackTarget;
      }
    } else {
      e.state = 'walk';
      e.fenceSeg = null;
      const spd = e.speed * e.slow * dt;
      const nx = e.pos.x + dx / dist * spd, nz = e.pos.z + dz / dist * spd;
      const rOld = Math.hypot(e.pos.x, e.pos.z), rNew = Math.hypot(nx, nz);
      const blockR = fenceBlockR + e.radius + 0.35;
      let blocked = false;
      if (fenceOn && rOld >= blockR - 0.05 && rNew < blockR && Math.hypot(tx, tz) < blockR) {
        const seg = world.fence[fenceIndex(nx, nz)];
        if (seg.alive) {
          blocked = true;
          e.pos.x = nx / rNew * blockR; e.pos.z = nz / rNew * blockR;
          e.state = 'fence'; e.fenceSeg = seg;
        }
      }
      if (!blocked) { e.pos.x = nx; e.pos.z = nz; }
      e.facing = lerpAngle(e.facing, Math.atan2(dx, dz), Math.min(1, dt * 6));
      playAnim(ch, e.def.anim, 0.2, e.def.animSpeed * e.slow);
      e.atkCd = Math.min(e.atkCd, 0.4);
    }

    // pending hit
    if (e.atkHit > 0) {
      e.atkHit -= dt;
      if (e.atkHit <= 0) applyEnemyHit(e);
    }
  }

  // separation + collisions
  const list = G.enemies;
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (!a.alive || a.spawnT > 0) continue;
    for (let j = i + 1; j < list.length; j++) {
      const b = list[j];
      if (!b.alive || b.spawnT > 0) continue;
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
      const rr = a.radius + b.radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-6) {
        const d = Math.sqrt(d2), push = (rr - d) * 0.5;
        const wa = b.type === 'boss' ? 0.9 : a.type === 'boss' ? 0.1 : 0.5;
        a.pos.x -= dx / d * push * wa * 2; a.pos.z -= dz / d * push * wa * 2;
        b.pos.x += dx / d * push * (1 - wa) * 2; b.pos.z += dz / d * push * (1 - wa) * 2;
      }
    }
    // player push
    if (player.alive) {
      const dx = player.pos.x - a.pos.x, dz = player.pos.z - a.pos.z;
      const rr = a.radius + player.radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-6) {
        const d = Math.sqrt(d2);
        player.pos.x = a.pos.x + dx / d * rr; player.pos.z = a.pos.z + dz / d * rr;
      }
    }
    collideCircle(a.pos, a.radius, false);
    // keep fence-blocked enemies outside
    if (fenceOn && a.state === 'fence') {
      const r = Math.hypot(a.pos.x, a.pos.z), blockR = fenceBlockR + a.radius + 0.35;
      if (r < blockR && r > blockR - 1.2 && world.fence[fenceIndex(a.pos.x, a.pos.z)].alive) {
        a.pos.x *= blockR / r; a.pos.z *= blockR / r;
      }
    }
  }
  for (const e of list) {
    if (e.state === 'dying') continue;
    e.ch.root.position.set(e.pos.x, e.ch.root.position.y, e.pos.z);
    e.ch.root.rotation.y = e.facing;
    updateHpBar(e);
  }
}

function applyEnemyHit(e) {
  if (!e.alive) return;
  const t = e.atkTarget;
  if (t === 'player') {
    const d = Math.hypot(player.pos.x - e.pos.x, player.pos.z - e.pos.z);
    if (d < e.def.reach + player.radius + e.radius + 0.6) hurtPlayer(e.dmg);
  } else if (t === 'house') {
    hurtHouse(e.dmg, e.pos);
  } else if (t && t.alive) {
    t.hp -= e.dmg;
    t.shake = 1;
    sfx.fenceHit();
    const p = t.group.position;
    for (let i = 0; i < 4; i++) smoke.emit(p.x + (Math.random() - 0.5) * 3, 1, p.z + (Math.random() - 0.5) * 3, 0, 1, 0, 0.5, 0.35, COL.wood, 6);
    t.group.scale.y = 0.55 + 0.45 * clamp(t.hp / t.max, 0, 1);
    if (t.hp <= 0) {
      t.alive = false;
      t.group.visible = false;
      sfx.fenceBreak();
      for (let i = 0; i < 26; i++) smoke.emit(p.x + (Math.random() - 0.5) * 4, 0.5 + Math.random(), p.z + (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6, 3 + Math.random() * 4, (Math.random() - 0.5) * 6, 1, 0.4, COL.wood, 12);
      toast('A barricade was destroyed!');
    }
  }
}

function hurtPlayer(dmg) {
  if (!player.alive || G.phase !== 'fight') return;
  player.hp -= dmg;
  player.lastHurt = G.time;
  G.shake = Math.max(G.shake, 0.25);
  sfx.hurt();
  const v = $('vignette');
  v.style.transition = 'none'; v.style.opacity = 1;
  requestAnimationFrame(() => { v.style.transition = 'opacity .6s'; v.style.opacity = player.hp / player.maxHp < 0.3 ? 0.5 : 0; });
  if (player.hp <= 0) {
    player.hp = 0;
    player.alive = false;
    player.gunHolder.visible = false;
    playAnim(player.ch, 'Death', 0.1);
    failWave('player');
  }
}

function hurtHouse(dmg, from) {
  if (G.phase !== 'fight') return;
  const armor = houseVal('armor') / 100;
  G.houseHp -= dmg * (1 - armor);
  G.houseLastHit = G.time;
  world.house.flash = 1;
  sfx.houseHit();
  const px = clamp(from.x, -5.2, 5.2), pz = clamp(from.z, -5.2, 5.2);
  for (let i = 0; i < 6; i++) smoke.emit(px, 1 + Math.random() * 2, pz, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.6, 0.4, COL.dust, 5, 1);
  if (G.houseHp <= 0) {
    G.houseHp = 0;
    for (let i = 0; i < 5; i++) setTimeout(() => explode(new THREE.Vector3((Math.random() - 0.5) * 8, 2 + Math.random() * 4, (Math.random() - 0.5) * 8), 0, 0.1), i * 180);
    failWave('house');
  }
}

function removeEnemy(e) {
  scene.remove(e.ch.root);
  e.ch.mixer.stopAllAction();
  for (const m of e.ch.mats) m.dispose();
  if (e.hpBar) { e.hpBar.bg.material.dispose(); e.hpBar.fill.material.dispose(); }
}

// ---------------------------------------------------------------- turrets
function updateTurrets(dt) {
  const dmg = houseVal('tdmg');
  const rate = 3 + save.house.tdmg * 0.18;
  const range = 30;
  for (const t of world.turrets) {
    if (!t.active) continue;
    const tp = t.group.position;
    let best = null, bd = range;
    for (const e of G.enemies) {
      if (!e.alive || e.spawnT > 0) continue;
      const d = Math.hypot(e.pos.x - tp.x, e.pos.z - tp.z);
      if (d < bd) { bd = d; best = e; }
    }
    if (!best) { t.head.rotation.y += dt * 0.5; continue; }
    const aim = Math.atan2(best.pos.x - tp.x, best.pos.z - tp.z);
    t.head.rotation.y = lerpAngle(t.head.rotation.y, aim, Math.min(1, dt * 10));
    const dy = best.pos.y + best.height * 0.5 - 6;
    t.barrel.rotation.x = -Math.atan2(dy, bd);
    t.cooldown -= dt;
    if (t.cooldown <= 0 && G.phase === 'fight') {
      t.cooldown = 1 / rate;
      t.recoil = 1;
      const from = t.muzzle.getWorldPosition(new THREE.Vector3());
      const to = new THREE.Vector3(best.pos.x, best.pos.y + best.height * 0.5, best.pos.z);
      tracers.spawn(from, to, 0x6fdcff, 0.05, 0.06);
      sparks.emit(from.x, from.y, from.z, 0, 0.5, 0, 0.08, 0.5, COL.blue);
      sfx.shot('turret');
      damageEnemy(best, dmg, false, to, false);
    }
  }
}

// ---------------------------------------------------------------- coins
const coinGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.07, 14);
coinGeo.rotateX(Math.PI / 2);
const coinMat = new THREE.MeshStandardMaterial({ color: 0xffc830, metalness: 0.9, roughness: 0.25, emissive: 0x6a4400, emissiveIntensity: 0.6 });

function dropCoins(pos, total, count) {
  total = Math.max(1, Math.round(total));
  count = Math.min(count, total);
  let left = total;
  for (let i = 0; i < count; i++) {
    const v = i === count - 1 ? left : Math.floor(total / count);
    left -= v;
    const m = new THREE.Mesh(coinGeo, coinMat);
    m.position.set(pos.x, 1, pos.z);
    scene.add(m);
    const a = Math.random() * TAU, s = 1.5 + Math.random() * 2.5;
    G.coins.push({ mesh: m, vel: new THREE.Vector3(Math.cos(a) * s, 5 + Math.random() * 3, Math.sin(a) * s), value: v, state: 'drop', t: 0, spin: Math.random() * TAU });
  }
}

function updateCoins(dt, collectAll) {
  const magnet = heroVal('magnet');
  for (let i = G.coins.length - 1; i >= 0; i--) {
    const c = G.coins[i];
    const p = c.mesh.position;
    c.t += dt;
    c.spin += dt * 4;
    c.mesh.rotation.y = c.spin;
    const tx = player.pos.x - p.x, ty = player.pos.y + 1 - p.y, tz = player.pos.z - p.z;
    const d = Math.hypot(tx, ty, tz);
    if (c.state !== 'fly' && c.t > 0.4 && player.alive && (d < magnet || collectAll)) c.state = 'fly';
    if (c.state === 'drop' || c.state === 'rest') {
      c.vel.y -= 20 * dt;
      p.addScaledVector(c.vel, dt);
      if (p.y < 0.35) { p.y = 0.35; c.vel.y *= -0.35; c.vel.x *= 0.6; c.vel.z *= 0.6; if (Math.abs(c.vel.y) < 0.8) { c.vel.set(0, 0, 0); c.state = 'rest'; } }
      if (c.state === 'rest') p.y = 0.45 + Math.sin(c.t * 3 + c.spin) * 0.1;
    } else {
      const sp = 6 + c.t * 14;
      p.x += tx / d * sp * dt; p.y += ty / d * sp * dt; p.z += tz / d * sp * dt;
      if (d < 0.8) {
        save.coins += c.value;
        G.runCoins += c.value;
        sfx.coin();
        const pill = $('coinPill');
        pill.classList.add('pop');
        setTimeout(() => pill.classList.remove('pop'), 90);
        sparks.emit(p.x, p.y, p.z, 0, 1, 0, 0.25, 0.5, COL.coin);
        scene.remove(c.mesh);
        G.coins.splice(i, 1);
      }
    }
  }
}

// ---------------------------------------------------------------- waves
function clearArena() {
  for (const e of G.enemies) removeEnemy(e);
  G.enemies.length = 0;
  for (const c of G.coins) scene.remove(c.mesh);
  G.coins.length = 0;
  for (const r of G.rockets) scene.remove(r.mesh);
  G.rockets.length = 0;
  sparks.clear(); smoke.clear(); tracers.clear(); dmgNums.clear();
}

function startWave() {
  clearArena();
  applyUpgradesToWorld();
  G.houseHp = G.houseMax;
  resetPlayer();
  refillAmmo();
  equipWeapon(save.equipped, true);
  const n = save.wave;
  G.queue = buildWave(n);
  G.spawnT = 0;
  G.kills = 0;
  G.runCoins = 0;
  G.bossTotal = 0;
  G.houseLastHit = -10;
  world.setActivePortals(Math.min(4, 1 + Math.floor((n - 1) / 2)));
  G.state = 'playing';
  G.phase = 'countdown';
  G.phaseT = 3;
  G.lastCount = 4;
  showScreen(null);
  $('hud').classList.remove('hidden');
  $('touch').classList.toggle('hidden', !input.isTouch);
  $('desktopHint').classList.toggle('hidden', input.isTouch);
  $('bossWrap').classList.add('hidden');
  input.setEnabled(true);
  $('waveLabel').textContent = `WAVE ${n}`;
  showBanner(`WAVE ${n}`, isBossWave(n) ? 'Boss wave! Defend the house!' : 'Get ready!', isBossWave(n) ? 'red' : '', 2.5);
  sfx.waveStart();
  updateHud(true);
  checkRotate();
  if (!input.isTouch) setTimeout(() => $('desktopHint').classList.add('hidden'), 6000);
}

function updateWave(dt) {
  if (G.phase === 'countdown') {
    G.phaseT -= dt;
    const c = Math.ceil(G.phaseT);
    if (c !== G.lastCount && c > 0 && c <= 3) { G.lastCount = c; sfx.countdown(false); }
    if (G.phaseT <= 0) { G.phase = 'fight'; sfx.countdown(true); }
    return;
  }
  if (G.phase === 'fight') {
    const n = save.wave;
    const maxAlive = 12 + Math.min(16, n);
    const alive = G.enemies.filter(e => e.alive).length;
    G.spawnT -= dt;
    if (G.queue.length && G.spawnT <= 0 && alive < maxAlive) {
      spawnEnemy(G.queue.shift());
      G.spawnT = Math.max(0.3, 1.5 - n * 0.045) * (0.7 + Math.random() * 0.6);
    }
    G.houseHp = Math.min(G.houseMax, G.houseHp + houseVal('regen') * dt);
    if (!G.queue.length && !G.enemies.some(e => e.alive)) waveCleared();
    return;
  }
  if (G.phase === 'cleared' || G.phase === 'failed') {
    G.phaseT -= dt;
    if (G.phaseT <= 0) showResults();
  }
}

function waveCleared() {
  G.phase = 'cleared';
  G.phaseT = 3;
  G.bonus = waveBonus(save.wave);
  save.coins += G.bonus;
  G.clearedWave = save.wave;
  save.wave++;
  save.best = Math.max(save.best, save.wave);
  writeSave(save);
  sfx.victory();
  showBanner('WAVE CLEARED!', `+${G.bonus} bonus coins`, 'gold', 2.8);
  playAnim(player.ch, 'Dance', 0.3);
  player.gunHolder.visible = false;
  input.setEnabled(false);
}

function failWave(reason) {
  if (G.phase !== 'fight') return;
  G.phase = 'failed';
  G.phaseT = 3;
  G.failReason = reason;
  G.bonus = 0;
  writeSave(save);
  sfx.defeat();
  const title = { house: 'HOUSE DESTROYED', player: 'YOU WERE DEFEATED', quit: 'WAVE ABANDONED' }[reason];
  showBanner(title, 'Upgrade and try again!', 'red', 2.8);
  input.setEnabled(false);
}

function showResults() {
  // any remaining coins get collected automatically
  for (const c of G.coins) { save.coins += c.value; G.runCoins += c.value; scene.remove(c.mesh); }
  G.coins.length = 0;
  writeSave(save);
  const won = G.phase === 'cleared';
  $('resTitle').textContent = won ? `WAVE ${G.clearedWave} CLEARED` : 'WAVE FAILED';
  $('resSub').textContent = won ? 'Nice defending! Spend your coins at the base.' : `You keep all ${G.runCoins} coins you collected. Upgrade and retry wave ${save.wave}!`;
  $('resKills').textContent = G.kills;
  $('resCoins').textContent = G.runCoins;
  $('resBonus').textContent = G.bonus;
  $('resBonusRow').classList.toggle('hidden', !won);
  $('resTotal').textContent = save.coins.toLocaleString();
  $('resBtn').textContent = won ? 'TO THE BASE' : 'UPGRADE & RETRY';
  G.phase = 'results';
  showScreen('results');
  $('hud').classList.add('hidden');
  $('touch').classList.add('hidden');
}

function goToShop() {
  clearArena();
  G.state = 'shop';
  G.phase = 'idle';
  input.setEnabled(false);
  applyUpgradesToWorld();
  resetPlayer();
  playAnim(player.ch, save.wave > 1 ? 'Idle' : 'Wave', 0.2);
  world.setActivePortals(0);
  $('hud').classList.add('hidden');
  $('touch').classList.add('hidden');
  shop.render();
  showScreen('shop');
}

// ---------------------------------------------------------------- HUD
let hudCache = {};
function setText(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).textContent = v; } }
function setWidth(id, f) { const v = (clamp(f, 0, 1) * 100).toFixed(1) + '%'; if (hudCache[id] !== v) { hudCache[id] = v; $(id).style.width = v; } }

function updateAmmoHud() {
  const w = curWeapon();
  if (!w) return;
  const st = curStats();
  const a = player.ammo[w.id] ?? st.mag;
  setText('weaponName', w.name.toUpperCase());
  setText('ammoText', String(a));
  setText('magText', String(st.mag));
  $('ammoText').classList.toggle('low', a <= Math.ceil(st.mag * 0.25));
}

function updateHud(force) {
  if (force) hudCache = {};
  setText('coinText', save.coins.toLocaleString());
  setText('houseHpText', Math.ceil(G.houseHp).toString());
  setWidth('houseHpFill', G.houseHp / G.houseMax);
  setWidth('houseHpLag', G.houseHp / G.houseMax);
  $('houseHpFill').classList.toggle('low', G.houseHp / G.houseMax < 0.3);
  setText('hpText', Math.ceil(player.hp).toString());
  setWidth('hpFill', player.hp / player.maxHp);
  setWidth('hpLag', player.hp / player.maxHp);
  $('hpFill').classList.toggle('low', player.hp / player.maxHp < 0.3);
  const remaining = G.queue.length + G.enemies.filter(e => e.alive).length;
  setText('enemyText', String(remaining));
  updateAmmoHud();
  const rb = $('reloadBar');
  if (player.reloadT > 0) {
    rb.classList.add('on');
    $('reloadFill').style.width = ((1 - player.reloadT / curStats().reload) * 100).toFixed(0) + '%';
  } else rb.classList.remove('on');
  const spread = 10 + (curWeapon().spread * 300) + player.bloom * 8;
  $('crosshair').style.setProperty('--s', spread.toFixed(0) + 'px');
  $('houseAlert').classList.toggle('on', G.time - G.houseLastHit < 1.2 && G.phase === 'fight');
  // boss bar
  const bosses = G.enemies.filter(e => e.type === 'boss' && e.alive);
  if (bosses.length) {
    $('bossWrap').classList.remove('hidden');
    const hp = bosses.reduce((s, b) => s + Math.max(0, b.hp), 0), max = bosses.reduce((s, b) => s + b.maxHp, 0);
    setWidth('bossFill', hp / max);
  } else $('bossWrap').classList.add('hidden');
  updateOffscreen();
}

const arrows = [];
function updateOffscreen() {
  const box = $('offscreen');
  if (!arrows.length) for (let i = 0; i < 6; i++) { const a = document.createElement('div'); a.className = 'offarrow'; a.style.display = 'none'; box.appendChild(a); arrows.push(a); }
  const w = window.innerWidth, h = window.innerHeight;
  const threats = G.enemies.filter(e => e.alive && e.spawnT <= 0 && (e.state !== 'walk' || e.type === 'boss' || Math.hypot(e.pos.x, e.pos.z) < 16));
  let k = 0;
  for (const e of threats) {
    if (k >= arrows.length) break;
    V1.set(e.pos.x, e.pos.y + e.height * 0.6, e.pos.z);
    V2.copy(V1).applyMatrix4(camera.matrixWorldInverse);
    V1.project(camera);
    const onScreen = V2.z < 0 && Math.abs(V1.x) < 1 && Math.abs(V1.y) < 1;
    if (onScreen) continue;
    let x = V2.x, y = V2.y;
    if (V2.z > 0 && Math.abs(x) < 0.01) x = 0.01;
    const ang = Math.atan2(x, y);
    const rx = w * 0.5 - 40, ry = h * 0.5 - 50;
    const s = Math.min(rx / Math.abs(Math.sin(ang) || 1e-3), ry / Math.abs(Math.cos(ang) || 1e-3));
    const px = w / 2 + Math.sin(ang) * s, py = h / 2 - Math.cos(ang) * s;
    const a = arrows[k++];
    a.style.display = 'block';
    a.style.transform = `translate(${px - 10}px, ${py - 9}px) rotate(${ang}rad)`;
  }
  for (; k < arrows.length; k++) arrows[k].style.display = 'none';
}

let bannerT = null;
function showBanner(title, sub, cls, dur) {
  const b = $('banner');
  $('bannerTitle').textContent = title;
  $('bannerTitle').className = cls || '';
  $('bannerSub').textContent = sub || '';
  b.classList.add('show');
  clearTimeout(bannerT);
  bannerT = setTimeout(() => b.classList.remove('show'), dur * 1000);
}

// ---------------------------------------------------------------- screens
let modalReturn = null;
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('show', s.id === id));
}
function showModal(id) { $(id).classList.add('show'); }
function hideModal(id) { $(id).classList.remove('show'); }

function openMenu() {
  G.state = 'menu';
  clearArena();
  applyUpgradesToWorld();
  resetPlayer();
  world.setActivePortals(0);
  $('menuStats').innerHTML = save.wave > 1 || save.coins > 0
    ? `<div>Wave <b>${save.wave}</b></div><div>Best <b>${save.best - 1 > 0 ? save.best - 1 : 0}</b> cleared</div><div>Kills <b>${save.kills}</b></div>`
    : '';
  $('playBtn').textContent = save.wave > 1 ? 'CONTINUE' : 'PLAY';
  showScreen('menu');
  checkRotate();
}

function pauseGame() {
  if (G.state !== 'playing' || !['countdown', 'fight'].includes(G.phase)) return;
  G.state = 'paused';
  input.setEnabled(false);
  writeSave(save);
  showModal('pause');
}

function resumeGame() {
  hideModal('pause');
  hideModal('settings');
  G.state = 'playing';
  input.setEnabled(true);
  clock.getDelta();
}

function confirmBox(title, text, yes) {
  $('confirmTitle').textContent = title;
  $('confirmText').textContent = text;
  showModal('confirm');
  $('confirmYes').onclick = () => { sfx.click(); hideModal('confirm'); yes(); };
  $('confirmNo').onclick = () => { sfx.click(); hideModal('confirm'); };
}

function requestFullscreen() {
  const el = document.documentElement;
  const req = el.requestFullscreen || el.webkitRequestFullscreen;
  if (!req || document.fullscreenElement) return;
  try {
    const p = req.call(el, { navigationUI: 'hide' });
    if (p && p.then) p.then(() => screen.orientation?.lock?.('landscape').catch(() => {})).catch(() => {});
  } catch (e) { /* ignore */ }
}

let rotateDismissed = false;
function checkRotate() {
  const show = input.isTouch && !rotateDismissed && window.innerHeight > window.innerWidth && G.state !== 'loading';
  $('rotate').classList.toggle('hidden', !show);
}

function syncSettingsUi() {
  $('sensRange').value = save.settings.sens;
  $('sensVal').textContent = Number(save.settings.sens).toFixed(2);
  $('soundChk').checked = save.settings.sound;
  $('autoChk').checked = !!save.settings.autofire;
  $('qualitySel').value = save.settings.quality;
}

function bindUi() {
  const click = (id, fn) => $(id).addEventListener('click', (e) => { sfx.unlock(); sfx.click(); fn(e); });
  click('playBtn', () => { if (input.isTouch) requestFullscreen(); goToShop(); });
  click('howBtn', () => showModal('how'));
  click('menuSettingsBtn', () => { syncSettingsUi(); showModal('settings'); });
  document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => { sfx.click(); b.closest('.screen').classList.remove('show'); }));
  click('startWaveBtn', () => { if (input.isTouch) requestFullscreen(); startWave(); });
  click('shopHomeBtn', () => openMenu());
  click('resBtn', () => goToShop());
  click('pauseBtn', () => pauseGame());
  click('resumeBtn', () => resumeGame());
  click('pauseSettingsBtn', () => { syncSettingsUi(); showModal('settings'); });
  click('quitBtn', () => confirmBox('Abandon wave?', 'You keep the coins collected so far.', () => {
    hideModal('pause');
    G.state = 'playing';
    G.phase = 'fight';
    failWave('quit');
    G.phaseT = 0.01;
  }));
  click('rotateDismiss', () => { rotateDismissed = true; checkRotate(); });
  click('fullscreenBtn', () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else requestFullscreen();
  });
  click('resetBtn', () => confirmBox('Reset progress?', 'This erases all waves, coins and upgrades.', () => {
    clearSave();
    const settings = save.settings;
    save = defaultSave();
    save.settings = settings;
    writeSave(save);
    player.ammo = {};
    equipWeapon('pistol', true);
    hideModal('settings');
    openMenu();
    toast('Progress reset');
  }));
  $('sensRange').addEventListener('input', (e) => { save.settings.sens = +e.target.value; $('sensVal').textContent = save.settings.sens.toFixed(2); writeSave(save); });
  $('soundChk').addEventListener('change', (e) => { save.settings.sound = e.target.checked; sfx.enabled = e.target.checked; writeSave(save); });
  $('autoChk').addEventListener('change', (e) => { save.settings.autofire = e.target.checked; writeSave(save); });
  $('qualitySel').addEventListener('change', (e) => {
    save.settings.quality = e.target.value;
    writeSave(save);
    const q = qualityProfile(e.target.value);
    pixelRatio = q.pr;
    resize();
    if (q.shadows !== Q.shadows || q.aa !== Q.aa) toast('Some graphics changes apply after reloading');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseGame(); });
  // unlock audio on the first touch anywhere
  window.addEventListener('pointerdown', () => sfx.unlock(), { once: false, passive: true });
}

// ---------------------------------------------------------------- main loop
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, clock.getDelta());
  if (G.state === 'loading') return;
  if (G.state !== 'paused') {
    G.time += dt;
    world.update(dt);
    if (G.state === 'playing') {
      if (input.consume('pausePressed')) { pauseGame(); }
      else {
        if (G.phase === 'countdown' || G.phase === 'fight') updatePlayer(dt);
        else { player.ch.mixer.update(dt); }
        updateWave(dt);
        updateEnemies(dt);
        updateTurrets(dt);
        updateRockets(dt);
        updateCoins(dt, G.phase === 'cleared');
        updateHud();
        if (G.houseHp / G.houseMax < 0.4 && Math.random() < dt * 8) {
          const c = world.house.chimneyTop;
          smoke.emit(c.x + (Math.random() - 0.5) * 6, 5 + Math.random() * 2, c.z + (Math.random() - 0.5) * 6, 0, 1.5, 0, 2, 1.2, COL.smoke, -0.3, 0.5, 2);
        }
      }
    } else {
      player.ch.mixer.update(dt);
      if (G.state === 'shop' && player.ch.current === 'Wave' && !player.ch.actions.Wave.isRunning()) playAnim(player.ch, 'Idle', 0.3);
    }
    sparks.update(dt);
    smoke.update(dt);
    tracers.update(dt);
    dmgNums.update(dt, window.innerWidth, window.innerHeight);
    updateCamera(dt);
  }
  renderer.render(scene, camera);
  dynamicResolution(dt);
}

function dynamicResolution(dt) {
  if (save.settings.quality !== 'auto' || G.state !== 'playing') return;
  G.dynT += dt; G.dynFrames++;
  if (G.dynT < 2) return;
  const fps = G.dynFrames / G.dynT;
  G.dynT = 0; G.dynFrames = 0;
  const maxPr = Q.pr;
  if (fps < 45 && pixelRatio > 0.75) { pixelRatio = Math.max(0.75, pixelRatio - 0.15); resize(); }
  else if (fps > 58 && pixelRatio < maxPr) { pixelRatio = Math.min(maxPr, pixelRatio + 0.1); resize(); }
}

// ---------------------------------------------------------------- boot
function boot() {
  resize();
  bindUi();
  const loader = new GLTFLoader();
  loader.load('models/RobotExpressive.glb', (gltf) => {
    ROBOT.scene = gltf.scene;
    ROBOT.clips = gltf.animations;
    const box = new THREE.Box3().setFromObject(gltf.scene);
    ROBOT.height = box.max.y - box.min.y;
    ROBOT.minY = box.min.y;
    $('loadFill').style.width = '100%';
    setupPlayer();
    applyUpgradesToWorld();
    resetPlayer();
    // warm up shaders
    renderer.compile(scene, camera);
    setTimeout(() => {
      G.state = 'menu';
      openMenu();
    }, 250);
  }, (xhr) => {
    if (xhr.total) $('loadFill').style.width = (xhr.loaded / xhr.total * 90).toFixed(0) + '%';
  }, (err) => {
    console.error(err);
    $('loadText').textContent = 'Could not load the game files. Please serve this folder over http(s) and reload.';
  });
  frame();
}

boot();

// expose for debugging
window.__game = {
  G, player, input, camera, renderer, scene, THREE,
  killAll: () => { G.queue.length = 0; G.enemies.forEach(e => e.alive && killEnemy(e)); }, save: () => save, world, startWave, spawnEnemy, goToShop };
