import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sfx } from './audio.js';
import { Input } from './input.js';
import { Particles, Tracers, DamageNumbers, Bolts, Rings } from './fx.js';
import { loadModels, setShadowMode, KenneyChar, RobotChar, DroneChar, PetChar, makeGun, cloneStatic, renderThumbs } from './assets.js';
import { buildWorld, WORLD_R, COMPASS } from './world.js';
import { Structures, BuildMode, pieceById } from './build.js';
import {
  WEAPONS, weaponById, weaponStats, HEROES, heroById, heroStats, PETS, petById, petStats, PET_PERK_NAMES, houseTier, houseMaxHp, ENEMIES, BUILD_PIECES,
  RARITIES, rarityIndex, rarityOf, xpToNext, addXp, MAX_LEVEL,
  buildWave, waveSummary, waveHpMult, waveDmgMult, waveCoinMult, waveBonus, isBossWave, portalCount,
  loadSave, parseSave, writeLocal, clearSave, defaultSave,
} from './data.js';
import { Shop } from './ui.js';
import { Net } from './net.js';

const $ = (id) => document.getElementById(id);
const PET_NAMES = PET_PERK_NAMES;
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerpAngle = (a, b, t) => a + ((((b - a) % TAU) + TAU * 1.5) % TAU - Math.PI) * t;

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
  if (q === 'low') return { name: 'low', pr: Math.min(dpr, 1), aa: false, shadows: false, shadowSize: 512, bloom: false, samples: 0 };
  if (q === 'medium') return { name: 'medium', pr: Math.min(dpr, 1.25), aa: true, shadows: true, shadowSize: 1024, bloom: true, samples: 0 };
  return { name: 'high', pr: Math.min(dpr, 1.5), aa: true, shadows: true, shadowSize: 2048, bloom: true, samples: 2 };
}
const Q = qualityProfile(save.settings.quality);
// 'auto' starts light and sharpens itself when the frame rate allows
let pixelRatio = save.settings.quality === 'auto' ? Math.min(Q.pr, 1) : Q.pr;
setShadowMode(Q.shadows);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: Q.aa && !Q.bloom, powerPreference: 'high-performance' });
renderer.setPixelRatio(pixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = Q.shadows;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 700);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

let composer = null, bloomPass = null;
if (Q.bloom) {
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Q.samples });
  composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  // guards against any invalid (NaN/Inf) pixel, which bloom would otherwise smear into a black flash
  composer.addPass(new ShaderPass({
    uniforms: { tDiffuse: { value: null } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: 'uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); if (!(c.r == c.r && c.g == c.g && c.b == c.b && c.a == c.a)) c = vec4(0.0, 0.0, 0.0, 1.0); gl_FragColor = clamp(c, 0.0, 64.0); }',
  }));
  bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.45, 0.82);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
}

let world = null, structures = null, buildMode = null;
const sparks = new Particles(scene, 1600, true);
const smoke = new Particles(scene, 700, false);
const tracers = new Tracers(scene, 56);
const bolts = new Bolts(scene, 20);
const rings = new Rings(scene, 14);
const dmgNums = new DamageNumbers($('dmgNums'), camera, 40);

const V1 = new THREE.Vector3(), V2 = new THREE.Vector3(), V3 = new THREE.Vector3();
const E1 = new THREE.Euler(0, 0, 0, 'YXZ');
const RAY = new THREE.Ray();
const houseBox = new THREE.Box3();
const C = (hex) => new THREE.Color(hex);
const COL = {
  spark: C(0xffd27a), blood: C(0x9cff6a), fire: C(0xff8a2a), smoke: C(0x57506a), purple: C(0xc080ff), ice: C(0x9fe8ff),
  coin: C(0xffe070), wood: C(0x9a6b43), white: C(0xffffff), blue: C(0x6fdcff), red: C(0xff5a4a), dust: C(0x9c8a72), green: C(0x7dff8a), acid: C(0x9dff3a), toxic: C(0x6fa82a), gold: C(0xffc02e),
};

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  if (composer) { composer.setPixelRatio(pixelRatio); composer.setSize(w, h); bloomPass.resolution.set(w * pixelRatio * 0.5, h * pixelRatio * 0.5); }
  camera.aspect = w / h;
  camera.fov = w < h ? 76 : 62;
  camera.updateProjectionMatrix();
  const scale = (h * pixelRatio) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  sparks.mat.uniforms.scale.value = scale;
  smoke.mat.uniforms.scale.value = scale;
  checkRotate();
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => setTimeout(resize, 200));

// ---------------------------------------------------------------- saving (local + cloud)
const cloud = { ref: null, timer: null };
function writeSave(now = false) {
  save.t = Date.now();
  writeLocal(save);
  if (!cloud.ref) return;
  clearTimeout(cloud.timer);
  const push = () => cloud.ref.set({ t: save.t, json: JSON.stringify(save) }).catch(() => {});
  if (now) push(); else cloud.timer = setTimeout(push, 2500);
}

async function initCloud() {
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
    if (!db || !user) return;
    const uid = await user.id();
    if (!uid) return;
    cloud.ref = db.doc('data/users/' + uid + '/save');
    const snap = await cloud.ref.get();
    if (snap.exists) {
      const d = snap.data();
      if (d && d.t > (save.t || 0)) {
        const s = parseSave(d.json);
        if (s && (G.state === 'menu' || G.state === 'loading' || G.state === 'shop')) {
          const settings = save.settings;
          save = s;
          save.settings = settings;
          writeLocal(save);
          onSaveReplaced();
          toast('Cloud save loaded');
        }
      }
    } else writeSave(true);
  } catch (e) { cloud.ref = null; }
}

// ---------------------------------------------------------------- state
const G = {
  state: 'loading', phase: 'idle', phaseT: 0, time: 0,
  queue: [], spawnT: 0, enemies: [], coins: [], rockets: [], globs: [], grenades: [], clouds: [],
  kills: 0, runCoins: 0, houseHp: 700, houseMax: 700, houseLastHit: -10,
  shake: 0, kick: 0, failReason: '', dynT: 0, dynFrames: 0, menuAngle: 0.6,
  hitCount: 0, novaQueue: [], xpStart: null, thumbs: {},
};

const player = {
  pos: new THREE.Vector3(0, 0, 10), vel: new THREE.Vector3(),
  yaw: Math.PI, pitch: -0.1, facing: 0,
  hp: 100, maxHp: 100, alive: true, radius: 0.45, lastHurt: -10,
  char: null, gunHolder: null, gun: null, weaponId: 'pistol', ammo: {},
  reloadT: 0, fireCd: 0, swapT: 0, lastShot: -10, bloom: 0,
  abilityCd: 0, charges: 1, shieldT: 0, boostT: 0, adrenalineT: 0, dashT: 0, dashDir: new THREE.Vector3(), rebootUsed: false,
  stormT: 0, slowT: 0, burnT: 0, burnDps: 0,
  ring: null,
};
let HS = null;      // hero stats
let PS = null;      // pet stats
const WS = {};      // weapon stats cache

const heroRec = () => save.heroes[save.hero];
const heroDef = () => heroById(save.hero);
const weaponRec = (id = player.weaponId) => save.weapons[id];
const petRec = () => save.pets[save.pet];
const petDef = () => petById(save.pet);
function refreshHero() {
  HS = heroStats(heroDef(), heroRec().level);
  PS = petStats(petDef(), petRec().level);
  player.maxHp = HS.hp;
}
const coinMult = () => HS.coinMult * (1 + 0.12 * PS.count('coins'));
function refreshWeapon(id) { WS[id] = weaponStats(weaponById(id), save.weapons[id].level); return WS[id]; }
function curWeapon() { return weaponById(player.weaponId); }
function curStats() { return WS[player.weaponId] || refreshWeapon(player.weaponId); }
function ownedWeapons() { return WEAPONS.filter(w => save.weapons[w.id]?.owned); }
// ---------------------------------------------------------------- co-op state
const net = new Net();
const NET = {
  lastSend: 0, wave: 1, remote: null, avatar: null, host: null, mirror: new Map(), idSeq: 1,
  dmgOut: new Map(), applied: new Map(), hurtOut: 0, hurtSeen: 0, coinsOut: 0, coinsSeen: null, structKey: '', shots: 0,
  hostRun: 0, guestRun: -1, wasLinked: false, usingHostBase: false,
};
const ENEMY_KEYS = Object.keys(ENEMIES);
const isGuest = () => net.role === 'guest';
const isHost = () => net.role === 'host' && net.linked;
const curWave = () => isGuest() ? NET.wave : save.wave;
const waveScale = () => Math.sqrt(waveHpMult(curWave()));

// ---------------------------------------------------------------- shop / ui hooks
const shop = new Shop({
  get save() { return save; },
  get thumbs() { return G.thumbs; },
  sfx,
  spend: (c) => spend(c),
  onShopChange: () => onShopChange(),
  toast: (t) => toast(t),
});

function spend(cost) {
  if (save.coins < cost) { sfx.deny(); toast('Not enough coins'); return false; }
  save.coins -= cost;
  sfx.buy();
  writeSave();
  return true;
}

let toastT = null;
function toast(text, cls = '') {
  const el = $('toast');
  el.textContent = text;
  el.className = 'show ' + cls;
  clearTimeout(toastT);
  toastT = setTimeout(() => { el.className = ''; }, 1800);
}

function onShopChange() {
  applyUpgradesToWorld();
  setupHeroModel();
  setupPet();
  refreshAllWeapons();
  equipWeapon(save.equipped, true);
  resetPlayer();
  resetPet();
  updateThumbs();
  writeSave();
}

function onSaveReplaced() {
  structures.loadFrom(save.structures);
  applyUpgradesToWorld();
  setupHeroModel();
  setupPet();
  refreshAllWeapons();
  equipWeapon(save.equipped, true);
  resetPlayer();
  updateThumbs();
  if (G.state === 'menu') openMenu();
  if (G.state === 'shop') shop.render();
}

function refreshAllWeapons() { for (const w of ownedWeapons()) refreshWeapon(w.id); }

function applyUpgradesToWorld() {
  world.house.setTier(houseTier(curWave()));
  G.houseMax = houseMaxHp(curWave());
  refreshHero();
}

function wallMult() {
  let m = 1 + 0.08 * (curWave() - 1);
  if (save.hero === 'cyra') m *= 1.3;
  if (HS.perks.has('fortify')) m *= 1.3;
  return m;
}
function trapMult() {
  let m = 1;
  if (HS.perks.has('overclock')) m *= 1.3;
  return m * waveScale();
}

// ---------------------------------------------------------------- hero model & weapon
function setupHeroModel() {
  const def = heroDef();
  const ri = rarityIndex(heroRec().level);
  if (player.char && player.char.heroId === def.id) {
    if (player.ring) player.ring.material.color.setHex(RARITIES[ri].hex);
    return;
  }
  if (player.char) { scene.remove(player.char.root); player.char.dispose(); }
  let ch;
  if (def.model === 'robot') ch = new RobotChar({ color: def.color || 0x3d8bff, height: 2.0, eyes: def.color ? 0xffc02e : 0x3ce0ff });
  else ch = new KenneyChar(def.model, { height: 1.85 });
  ch.heroId = def.id;
  scene.add(ch.root);
  player.char = ch;
  const holder = new THREE.Group();
  ch.root.add(holder);
  player.gunHolder = holder;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.78, 40), new THREE.MeshBasicMaterial({ color: RARITIES[ri].hex, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
  ch.root.add(ring);
  player.ring = ring;
  player.gun = null;
  ch.root.position.copy(player.pos);
  ch.root.rotation.y = player.facing;
  equipWeapon(player.weaponId || save.equipped, true);
}

function equipWeapon(id, silent = false) {
  if (!save.weapons[id]?.owned) id = 'pistol';
  player.weaponId = id;
  const w = weaponById(id);
  const st = refreshWeapon(id);
  if (player.gun && player.gun.parent) player.gun.parent.remove(player.gun);
  const ri = rarityIndex(weaponRec(id).level);
  player.gun = makeGun(w, RARITIES[ri].hex, ri);
  player.gun.userData.rarity = ri;
  player.gunHolder.add(player.gun);
  player.reloadT = 0;
  if (!silent) { player.swapT = 0.35; sfx.swap(); }
  if (player.ammo[id] === undefined || player.ammo[id] > st.mag) player.ammo[id] = st.mag;
  updateWeaponHud(true);
}

function refillAmmo() { for (const w of ownedWeapons()) player.ammo[w.id] = refreshWeapon(w.id).mag; }

function startReload() {
  const st = curStats();
  if (player.reloadT > 0 || player.ammo[player.weaponId] >= st.mag) return;
  player.reloadT = st.reload * (HS.perks.has('reload') ? 0.8 : 1);
  player.reloadMax = player.reloadT;
  sfx.reload();
}

// ---------------------------------------------------------------- thumbnails for the UI
function updateThumbs() {
  const jobs = [];
  for (const h of HEROES) {
    const key = 'hero_' + h.id;
    if (G.thumbs[key]) continue;
    const ch = h.model === 'robot' ? new RobotChar({ color: h.color || 0x3d8bff, height: 2, eyes: h.color ? 0xffc02e : 0x3ce0ff }) : new KenneyChar(h.model, { height: 1.85 });
    ch.pose(0.016, 0, -1, null);
    if (ch.mixer) ch.mixer.update(0.5);
    jobs.push({ id: key, object: ch.root, dir: [0.35, 0.25, 1], dist: 1.3, done: () => ch.dispose() });
  }
  for (const p of PETS) {
    const key = 'pet_' + p.id;
    if (G.thumbs[key]) continue;
    const ch = new PetChar(p.model, { height: 0.9 });
    ch.mixer.update(0.3);
    jobs.push({ id: key, object: ch.root, dir: [0.6, 0.45, 1], dist: 1.5, done: () => ch.dispose() });
  }
  for (const w of WEAPONS) {
    const ri = rarityIndex(save.weapons[w.id]?.level || 1);
    const key = 'weapon_' + w.id + '_' + ri;
    if (!G.thumbs[key]) jobs.push({ id: key, object: makeGun(w, RARITIES[ri].hex, ri), dir: [1, 0.3, 0.15], dist: 1.25 });
    G.thumbs['weapon_' + w.id] = key;
  }
  for (const p of BUILD_PIECES) {
    const key = 'piece_' + p.id;
    if (!G.thumbs[key]) jobs.push({ id: key, object: structures.makeMesh(p, 0), dir: [0.9, 0.7, 1], dist: 1.5 });
  }
  if (!jobs.length) return;
  const out = renderThumbs(renderer, jobs, 192, 144);
  for (const j of jobs) { if (j.done) j.done(); }
  Object.assign(G.thumbs, out);
}

// ---------------------------------------------------------------- camera
const camState = { pivot: new THREE.Vector3(), q: new THREE.Quaternion() };

function updateCamera(dt) {
  if (G.state === 'playing' || G.state === 'paused') {
    const pivot = camState.pivot.set(player.pos.x, player.pos.y + 1.75, player.pos.z);
    E1.set(player.pitch + G.kick, player.yaw, 0, 'YXZ');
    camState.q.setFromEuler(E1);
    if (isFp()) {
      // first person: eyes of the hero, gun held in view
      camera.position.set(player.pos.x, player.pos.y + (heroDef().model === 'robot' ? 1.85 : 1.65), player.pos.z);
      camera.position.addScaledVector(V1.set(0, 0, -0.15).applyQuaternion(camState.q), 1);
      camera.quaternion.copy(camState.q);
      camState.dist = null;
    } else {
      const big = heroDef().model === 'robot';
      const off = (camera.aspect < 1 ? V1.set(0.35, big ? 0.8 : 0.6, big ? 5.4 : 4.6) : big ? V1.set(0.85, 0.55, 4.2) : V1.set(0.62, 0.32, 3.4)).applyQuaternion(camState.q);
      let dist = off.length();
      const dir = V2.copy(off).divideScalar(dist);
      RAY.set(pivot, dir);
      const hit = RAY.intersectBox(houseBox, V3);
      if (hit) dist = Math.max(1.2, pivot.distanceTo(hit) - 0.3);
      // ease the distance so the view never pops in and out
      if (camState.dist == null) camState.dist = dist;
      camState.dist += (dist - camState.dist) * Math.min(1, dt * (dist < camState.dist ? 6 : 2.5));
      camera.position.copy(pivot).addScaledVector(dir, camState.dist);
      if (camera.position.y < 0.4) camera.position.y = 0.4;
      camera.quaternion.copy(camState.q);
    }
  } else if (G.state === 'build') {
    buildMode.updateCamera(dt);
  } else {
    G.menuAngle += dt * 0.08;
    const r = 25;
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
  const dv = window.__debugView;
  if (dv) { camera.position.set(...dv.pos); camera.lookAt(...dv.look); }
  if (world && Q.shadows) {
    const c = G.state === 'playing' || G.state === 'paused' ? player.pos : V1.set(0, 0, 0);
    world.sun.target.position.set(c.x, 0, c.z);
    world.sun.position.copy(world.sunDir).multiplyScalar(60).add(world.sun.target.position);
  }
}

function aimRay(out) {
  out.origin.copy(camera.position);
  out.direction.set(0, 0, -1).applyQuaternion(camera.quaternion);
  return out;
}

// ---------------------------------------------------------------- player
function resetPlayer() {
  if (player.char) player.char.body.visible = true;
  if (player.gun && player.gun.parent === viewModel) { player.gunHolder.add(player.gun); player.gun.position.set(0, 0, 0); player.gun.rotation.set(0, 0, 0); player.gun.scale.setScalar(1); }
  player.pos.set(isGuest() ? 3 : 0, 0, world.houseHalf.z + 4);
  player.vel.set(0, 0, 0);
  player.respawnT = 0;
  player.yaw = Math.PI; player.pitch = -0.1; player.facing = 0;
  refreshHero();
  player.hp = player.maxHp;
  player.alive = true;
  player.lastHurt = -10;
  player.reloadT = 0; player.fireCd = 0; player.swapT = 0; player.bloom = 0;
  player.abilityCd = 0; player.charges = HS.perks.has('doubledash') ? 2 : 1;
  player.shieldT = 0; player.boostT = 0; player.adrenalineT = 0; player.dashT = 0; player.rebootUsed = false;
  player.stormT = 0; player.slowT = 0; player.burnT = 0;
  const ch = player.char;
  ch.dead = false; ch.deadT = 0; ch.body.rotation.set(0, 0, 0); ch.body.position.set(0, 0, 0);
  if (ch.play) { ch.current = null; ch.mixer.stopAllAction(); ch.play('Idle', 0.1); }
  ch.root.position.copy(player.pos);
  ch.root.rotation.y = player.facing;
  player.gunHolder.visible = true;
}

function updatePlayer(dt) {
  const ch = player.char;
  if (!player.alive) {
    ch.pose(dt, 0, -1); ch.updateFlash(dt, 0);
    if (player.respawnT > 0 && G.phase === 'fight') {
      player.respawnT -= dt;
      setText('incomingText', `Respawning in ${Math.ceil(player.respawnT)}…`);
      if (player.respawnT <= 0) respawnPlayer();
    }
    return;
  }
  input.update();
  const sens = save.settings.sens * (input.isTouch ? 0.0055 : 0.0036);
  player.yaw -= input.lookDX * sens;
  player.pitch = clamp(player.pitch - input.lookDY * sens, -0.8, 0.6);
  input.lookDX = input.lookDY = 0;

  const speed = 6.8 * HS.speed * (1 + 0.08 * PS.count('swift')) * (player.slowT > 0 ? 0.6 : 1);
  const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
  const rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
  if (player.dashT > 0) {
    player.dashT -= dt;
    player.pos.addScaledVector(player.dashDir, 50 * dt);
    player.vel.copy(player.dashDir).multiplyScalar(8);
    dashDamage();
  } else {
    const tx = (rx * input.move.x + fx * input.move.y) * speed, tz = (rz * input.move.x + fz * input.move.y) * speed;
    const acc = Math.min(1, dt * 12);
    player.vel.x += (tx - player.vel.x) * acc;
    player.vel.z += (tz - player.vel.z) * acc;
    player.pos.x += player.vel.x * dt;
    player.pos.z += player.vel.z * dt;
  }
  collideWorld(player.pos, player.radius, true);
  const spd = Math.hypot(player.vel.x, player.vel.z);
  const moving = spd > 0.6;

  const aiming = G.time - player.lastShot < 0.9 || input.fireHeld;
  let targetFacing = player.facing;
  if (aiming) targetFacing = player.yaw + Math.PI;
  else if (moving) targetFacing = Math.atan2(player.vel.x, player.vel.z);
  player.facing = lerpAngle(player.facing, targetFacing, Math.min(1, dt * 14));
  ch.root.position.copy(player.pos);
  ch.root.rotation.y = player.facing;
  const aimPitch = player.pitch + 0.06;
  ch.pose(dt, spd, -1, aiming ? aimPitch : null);
  attachGun(aiming, aimPitch);
  ch.updateFlash(dt, player.shieldT > 0 ? 0x2a70c0 : player.burnT > 0 ? 0x5a2000 : player.slowT > 0 ? 0x2a7aa8 : player.stormT > 0 ? 0x5a4000 : 0);
  if (player.ring) player.ring.material.opacity = 0.45 + 0.3 * Math.sin(G.time * 3);

  if (G.time - player.lastHurt > 3) player.hp = Math.min(player.maxHp, player.hp + HS.regen * dt);
  player.hp = Math.min(player.maxHp, player.hp + 2 * PS.count('heal') * dt);
  player.shieldT = Math.max(0, player.shieldT - dt);
  player.boostT = Math.max(0, player.boostT - dt);
  player.adrenalineT = Math.max(0, player.adrenalineT - dt);
  player.stormT = Math.max(0, player.stormT - dt);
  if (player.slowT > 0) {
    player.slowT -= dt;
    if (Math.random() < dt * 8) sparks.emit(player.pos.x, 0.3 + Math.random() * 1.6, player.pos.z, 0, 0.5, 0, 0.5, 0.2, COL.ice, 1);
  }
  if (player.burnT > 0) {
    player.burnT -= dt;
    hurtPlayer(player.burnDps * dt, true);
    if (Math.random() < dt * 14) sparks.emit(player.pos.x + (Math.random() - 0.5) * 0.5, 0.3 + Math.random() * 1.6, player.pos.z + (Math.random() - 0.5) * 0.5, 0, 2, 0, 0.4, 0.35, COL.fire, -1);
    if (!player.alive) return;
  }
  if (player.stormT > 0 && Math.random() < dt * 10) {
    const m = player.gun.userData.muzzle.getWorldPosition(V1);
    sparks.emit(m.x, m.y, m.z, (Math.random() - 0.5) * 2, 1, (Math.random() - 0.5) * 2, 0.35, 0.25, COL.coin, 2);
  }
  const maxCharges = HS.perks.has('doubledash') ? 2 : 1;
  if (player.charges < maxCharges) {
    player.abilityCd -= dt;
    if (player.abilityCd <= 0) { player.charges++; if (player.charges < maxCharges) player.abilityCd = heroDef().active.cd; }
  }
  if (HS.perks.has('static')) staticField(dt);
  if (input.consume('abilityPressed')) useAbility();

  const st = curStats();
  const w = curWeapon();
  player.fireCd -= dt;
  player.bloom = Math.max(0, player.bloom - dt * 3);
  if (player.swapT > 0) player.swapT -= dt;
  input.consume('swapPressed'); // guns are locked in for the whole run
  if (input.consume('fpPressed')) { save.settings.fp = !save.settings.fp; writeSave(); toast(save.settings.fp ? 'First person' : 'Third person'); $('fpBtn').classList.toggle('on', save.settings.fp); }
  if (input.consume('reloadPressed')) startReload();
  if (player.reloadT > 0) {
    player.reloadT -= dt;
    if (player.reloadT <= 0) { player.ammo[w.id] = st.mag; sfx.reloadDone(); updateWeaponHud(); }
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
  if (player.gun.userData.rarity >= 5 && Math.random() < dt * 20) {
    const m = player.gun.userData.muzzle.getWorldPosition(V1);
    sparks.emit(m.x + (Math.random() - 0.5) * 0.3, m.y + (Math.random() - 0.5) * 0.2, m.z + (Math.random() - 0.5) * 0.3, 0, 0.6, 0, 0.5, 0.18, COL.coin);
  }
}

const HAND = new THREE.Vector3();
const viewModel = new THREE.Group();
camera.add(viewModel);
scene.add(camera);
const isFp = () => save.settings.fp && player.alive && (G.state === 'playing' || G.state === 'paused');

function attachGun(aiming, pitch) {
  const ch = player.char;
  const fp = isFp();
  ch.body.visible = !fp;
  if (player.ring) player.ring.visible = !fp;
  if (fp) {
    if (player.gun.parent !== viewModel) viewModel.add(player.gun);
    const bob = Math.sin(G.time * 9) * Math.min(1, Math.hypot(player.vel.x, player.vel.z) / 6) * 0.015;
    player.gun.position.set(0.2, -0.19 + bob - G.kick * 0.4, -0.46 + G.kick * 1.2);
    player.gun.rotation.set(G.kick * 2, Math.PI + 0.06, 0);
    player.gun.scale.setScalar(0.62);
    return;
  }
  if (player.gun.parent !== player.gunHolder) { player.gunHolder.add(player.gun); player.gun.position.set(0, 0, 0); player.gun.rotation.set(0, 0, 0); player.gun.scale.setScalar(1); }
  ch.root.updateMatrixWorld(true);
  ch.handWorld(HAND);
  ch.root.worldToLocal(HAND);
  player.gunHolder.position.copy(HAND);
  player.gunHolder.position.y += 0.02;
  player.gunHolder.rotation.set(aiming ? -pitch : 0.25, 0, 0);
}

// ---------------------------------------------------------------- hero abilities
function useAbility() {
  const def = heroDef();
  if (!player.alive || (G.phase !== 'fight' && G.phase !== 'countdown')) return;
  if (player.charges <= 0) { sfx.deny(); return; }
  const maxCharges = HS.perks.has('doubledash') ? 2 : 1;
  if (player.charges === maxCharges) player.abilityCd = def.active.cd;
  player.charges--;
  sfx.ability();
  const power = HS.power * waveScale();
  const ray = aimRay(new THREE.Ray());
  switch (def.id) {
    case 'rex': {
      const from = player.pos.clone().add(V1.set(0, 1.6, 0));
      const tEnd = Math.min(28, worldHitT(ray.origin, ray.direction, 28));
      const to = ray.origin.clone().addScaledVector(ray.direction, tEnd);
      to.y = Math.max(0, to.y);
      throwGrenade(from, to, 90 * power, HS.perks.has('bigboom') ? 6 : 4, HS.perks.has('cluster'));
      break;
    }
    case 'bolt': {
      player.shieldT = HS.perks.has('titan') ? 7 : 4;
      if (HS.perks.has('titan')) player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.3);
      rings.spawn(player.pos, 8, 0x5cb8ff, 0.6);
      G.shake = 0.3;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0) continue;
        const d = Math.hypot(e.pos.x - player.pos.x, e.pos.z - player.pos.z);
        if (d < 8) {
          damageEnemy(e, 60 * power, { point: e.pos.clone().setY(e.pos.y + e.height * 0.6), src: 'ability' });
          if (!e.def.boss && !e.def.fly) {
            const kx = (e.pos.x - player.pos.x) / (d || 1) * 3, kz = (e.pos.z - player.pos.z) / (d || 1) * 3;
            if (e.mirror) netRequest(['kb', e.id, r1(kx), r1(kz)]); else { e.pos.x += kx; e.pos.z += kz; }
          }
        }
      }
      break;
    }
    case 'nova': {
      if (input.move.x || input.move.y) {
        const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw), rx = Math.cos(player.yaw), rz = -Math.sin(player.yaw);
        player.dashDir.set(rx * input.move.x + fx * input.move.y, 0, rz * input.move.x + fz * input.move.y).normalize();
      } else player.dashDir.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
      player.dashT = 0.2;
      player.dashHit = new Set();
      player.dashPower = 80 * power * (HS.perks.has('blades') ? 2 : 1);
      if (HS.perks.has('secondwind')) player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.12);
      break;
    }
    case 'cyra': {
      const n = HS.perks.has('twin') ? 2 : 1;
      for (let k = 0; k < n; k++) {
        const side = n === 2 ? (k ? 1.4 : -1.4) : 0;
        const x = player.pos.x + Math.cos(player.yaw) * side - Math.sin(player.yaw) * 1.5;
        const z = player.pos.z - Math.sin(player.yaw) * side - Math.cos(player.yaw) * 1.5;
        if (isGuest()) { netRequest(['tu', r1(x), r1(z)]); continue; }
        const s = structures.add('turret', 0, 0, 0, true);
        s.x = x; s.z = z; s.mesh.position.set(x, 0, z); s.life = 20; s.hx = s.hz = 0.6;
        s.mesh.scale.setScalar(0.7);
        for (let i = 0; i < 16; i++) sparks.emit(x, 1, z, (Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5, 0.5, 0.35, COL.blue, 6);
      }
      break;
    }
    case 'doc': {
      player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.4);
      healHouse(G.houseMax * 0.1);
      rings.spawn(player.pos, 10, 0x6dff9a, 0.8);
      sfx.heal();
      if (HS.perks.has('boost')) player.boostT = 6;
      if (HS.perks.has('fieldmedic') || HS.perks.has('miracle')) {
        for (const s of structures.list) {
          if (s.piece.kind !== 'wall') continue;
          if (!s.alive && HS.perks.has('miracle')) fixWall(s, 'revive');
          else if (s.alive && HS.perks.has('fieldmedic')) fixWall(s, s.max);
        }
      }
      for (let i = 0; i < 30; i++) sparks.emit(player.pos.x + (Math.random() - 0.5) * 2, 0.5 + Math.random() * 2, player.pos.z + (Math.random() - 0.5) * 2, 0, 2, 0, 0.8, 0.4, COL.green, -1);
      break;
    }
    case 'skye': {
      const tEnd = worldHitT(ray.origin, ray.direction, 60);
      const center = ray.origin.clone().addScaledVector(ray.direction, tEnd);
      const n = HS.perks.has('chainstorm') ? 9 : 5;
      const list = G.enemies.filter(e => e.alive && e.spawnT <= 0).map(e => ({ e, d: Math.hypot(e.pos.x - center.x, e.pos.z - center.z) })).filter(o => o.d < 14).sort((a, b) => a.d - b.d).slice(0, n);
      const dmg = 110 * power * (HS.perks.has('overcharge') ? 1.6 : 1);
      if (!list.length) { stormStrike(center, 3, dmg, 'ability'); break; }
      for (const o of list) stormStrike(new THREE.Vector3(o.e.pos.x, o.e.pos.y, o.e.pos.z), 2.2, dmg, 'ability');
      break;
    }
    case 'luna': {
      player.stormT = HS.perks.has('longstorm') ? 9 : 6;
      player.ammo[player.weaponId] = curStats().mag;
      player.reloadT = 0;
      updateWeaponHud();
      rings.spawn(player.pos, 5, 0xffc02e, 0.5);
      showBanner('BULLET STORM', 'Infinite ammo, faster fire', 'gold', 1.4);
      break;
    }
    case 'zed': {
      const tEnd = Math.min(22, worldHitT(ray.origin, ray.direction, 22));
      const at = ray.origin.clone().addScaledVector(ray.direction, tEnd);
      at.y = 0;
      const r = 5 * (HS.perks.has('horde') ? 1.5 : 1);
      spawnCloud(at, r, 45 * power * (HS.perks.has('plague') ? 1.6 : 1), 5, true);
      rings.spawn(at, r, 0x9dff3a, 0.6);
      break;
    }
    case 'titan': {
      const n = HS.perks.has('salvo') ? 14 : 8;
      const tEnd = worldHitT(ray.origin, ray.direction, 70);
      const center = ray.origin.clone().addScaledVector(ray.direction, tEnd);
      const list = G.enemies.filter(e => e.alive && e.spawnT <= 0).map(e => ({ e, d: Math.hypot(e.pos.x - center.x, e.pos.z - center.z) })).filter(o => o.d < 18).sort((a, b) => a.d - b.d);
      const dmg = 70 * power * (HS.perks.has('payload') ? 1.5 : 1);
      for (let k = 0; k < n; k++) {
        const target = list.length ? list[k % list.length].e : null;
        const from = player.pos.clone().add(V1.set((Math.random() - 0.5) * 1.2, 2.4, (Math.random() - 0.5) * 1.2));
        const to = target ? target.pos.clone().setY(target.pos.y + target.height * 0.5) : center.clone().add(V2.set((Math.random() - 0.5) * 6, 0, (Math.random() - 0.5) * 6));
        const up = from.clone().add(V2.set((Math.random() - 0.5) * 6, 8, (Math.random() - 0.5) * 6));
        const r = spawnRocket(from, up, dmg, 2.6, 0xff6a3a, { src: 'ability', homing: target, aim: to, delay: k * 0.06, speed: 30 });
        r.vel.multiplyScalar(0.5);
      }
      break;
    }
  }
}

// ---------------------------------------------------------------- poison / plague clouds
function spawnCloud(pos, r, dps, t, friendly) {
  G.clouds.push({ pos: pos.clone(), r, dps, t, max: t, friendly });
}

function updateClouds(dt) {
  for (let i = G.clouds.length - 1; i >= 0; i--) {
    const c = G.clouds[i];
    c.t -= dt;
    if (c.t <= 0) { G.clouds.splice(i, 1); continue; }
    const col = c.friendly ? COL.acid : COL.toxic;
    for (let k = 0; k < Math.ceil(c.r * 1.2); k++) {
      if (Math.random() > dt * 10) continue;
      const a = Math.random() * TAU, rr = Math.sqrt(Math.random()) * c.r;
      smoke.emit(c.pos.x + Math.cos(a) * rr, 0.3 + Math.random() * 0.8, c.pos.z + Math.sin(a) * rr, 0, 0.4, 0, 1.2, 1.2, col, -0.2, 1.2, 2.2);
    }
    if (c.friendly) {
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0) continue;
        if (Math.hypot(e.pos.x - c.pos.x, e.pos.z - c.pos.z) < c.r + e.radius) damageEnemy(e, c.dps * dt, { src: 'ability', quiet: true });
      }
    } else {
      if (Math.hypot(player.pos.x - c.pos.x, player.pos.z - c.pos.z) < c.r) hurtPlayer(c.dps * dt, true);
      hurtRemoteNear(c.pos.x, c.pos.z, c.r, c.dps * dt);
    }
  }
}

function dashDamage() {
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0 || player.dashHit.has(e)) continue;
    if (Math.hypot(e.pos.x - player.pos.x, e.pos.z - player.pos.z) < e.radius + 1.6) {
      player.dashHit.add(e);
      damageEnemy(e, player.dashPower, { point: e.pos.clone().setY(e.pos.y + e.height * 0.6), src: 'ability' });
      for (let i = 0; i < 8; i++) sparks.emit(e.pos.x, e.pos.y + 1, e.pos.z, (Math.random() - 0.5) * 6, Math.random() * 3, (Math.random() - 0.5) * 6, 0.3, 0.3, COL.purple, 5);
    }
  }
  smoke.emit(player.pos.x, 1, player.pos.z, 0, 0.3, 0, 0.35, 0.8, COL.purple, 0, 1, 1);
}

function staticField(dt) {
  const dps = 18 * HS.power * waveScale();
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0) continue;
    if (Math.hypot(e.pos.x - player.pos.x, e.pos.z - player.pos.z) < 4.2) {
      damageEnemy(e, dps * dt, { src: 'ability', quiet: true });
      if (Math.random() < dt * 4) bolts.spawn(V1.set(player.pos.x, 1.2, player.pos.z), V2.set(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z), 0x7fd0ff, 0.1, 0.4);
    }
  }
}

function throwGrenade(from, to, dmg, radius, cluster) {
  const T = 0.8;
  const vel = to.clone().sub(from).divideScalar(T);
  vel.y += 0.5 * 20 * T;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), new THREE.MeshStandardMaterial({ color: 0x3a5a2a, roughness: 0.6 }));
  mesh.position.copy(from);
  scene.add(mesh);
  G.grenades.push({ mesh, vel, dmg, radius, cluster, life: 3 });
}

function updateGrenades(dt) {
  for (let i = G.grenades.length - 1; i >= 0; i--) {
    const g = G.grenades[i];
    g.vel.y -= 20 * dt;
    g.mesh.position.addScaledVector(g.vel, dt);
    g.mesh.rotation.x += dt * 10;
    g.life -= dt;
    if (Math.random() < 0.5) sparks.emit(g.mesh.position.x, g.mesh.position.y, g.mesh.position.z, 0, 0, 0, 0.2, 0.18, COL.fire);
    if (g.mesh.position.y <= 0.15 || g.life <= 0) {
      const p = g.mesh.position.clone(); p.y = 0.2;
      explode(p, g.dmg, g.radius, { src: 'ability' });
      if (g.cluster) {
        for (let k = 0; k < 3; k++) {
          const a = Math.random() * TAU;
          throwGrenade(p.clone().setY(0.5), p.clone().add(V1.set(Math.cos(a) * 3.5, 0, Math.sin(a) * 3.5)), g.dmg * 0.45, g.radius * 0.6, false);
        }
      }
      scene.remove(g.mesh);
      g.mesh.geometry.dispose();
      G.grenades.splice(i, 1);
    }
  }
}


// ---------------------------------------------------------------- pets
const pet = { char: null, id: null, pos: new THREE.Vector3(), vel: new THREE.Vector3(), facing: 0, target: null, cd: 0, atkT: -1, roarCd: 6, healCd: 4, ring: null, speedNow: 0 };

function setupPet() {
  const def = petDef();
  const ri = rarityIndex(petRec().level);
  if (pet.char && pet.id === def.id) { if (pet.ring) pet.ring.material.color.setHex(RARITIES[ri].hex); return; }
  if (pet.char) { scene.remove(pet.char.root); pet.char.dispose(); }
  pet.char = new PetChar(def.model, { height: def.fly ? 0.75 : 0.85 });
  pet.id = def.id;
  scene.add(pet.char.root);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 32), new THREE.MeshBasicMaterial({ color: RARITIES[ri].hex, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
  pet.char.root.add(ring);
  pet.ring = ring;
  resetPet();
}

function resetPet() {
  if (!pet.char) return;
  pet.pos.set(player.pos.x + 1.6, 0, player.pos.z + 0.6);
  pet.target = null; pet.fix = null; pet.cd = 0.5; pet.atkT = -1; pet.roarCd = 6; pet.healCd = 4; pet.speedNow = 0;
  pet.char.root.position.copy(pet.pos);
}

function petDamage(e, dmg, point) {
  const def = petDef();
  if (PS.perks.has('crit') && Math.random() < 0.25) dmg *= 3;
  damageEnemy(e, dmg, { point, src: 'ability', pet: true });
  if (e.alive) {
    if (PS.perks.has('burn')) e.burn = { dps: dmg * 0.4, t: 3 };
    if (PS.perks.has('freeze') || def.id === 'penguin') setChill(e, 0.4, 2);
  }
  if (PS.perks.has('splash')) {
    for (const o of G.enemies) if (o !== e && o.alive && o.spawnT <= 0 && o.pos.distanceTo(e.pos) < 2.8) damageEnemy(o, dmg * 0.5, { point: new THREE.Vector3(o.pos.x, o.pos.y + o.height * 0.5, o.pos.z), src: 'ability', pet: true });
    rings.spawn(e.pos, 2.8, def.color || 0xffc02e, 0.3);
  }
  if (PS.perks.has('chain')) {
    let from = point.clone();
    const near = G.enemies.filter(o => o !== e && o.alive && o.spawnT <= 0 && o.pos.distanceTo(e.pos) < 7).slice(0, 2);
    for (const o of near) {
      const to = new THREE.Vector3(o.pos.x, o.pos.y + o.height * 0.5, o.pos.z);
      bolts.spawn(from, to, 0xffe066, 0.14, 0.4);
      damageEnemy(o, dmg * 0.5, { point: to, src: 'ability', pet: true });
      from = to;
    }
  }
}

function petTargets(range) {
  return G.enemies.filter(e => e.alive && e.spawnT <= 0 && Math.hypot(e.pos.x - player.pos.x, e.pos.z - player.pos.z) < range)
    .sort((a, b) => a.pos.distanceTo(pet.pos) - b.pos.distanceTo(pet.pos));
}

function updatePet(dt) {
  if (!pet.char) return;
  const def = petDef();
  const power = PS.dmg * waveScale() * HS.power;
  const inFight = G.phase === 'fight' && player.alive;
  const flyH = def.fly || 0;
  // pick what to do
  let goal = null, attackPhase = -1;
  const f = player.facing;
  // stay at the hero's left side, slightly ahead, so it never blocks the over-the-shoulder camera
  const home = new THREE.Vector3(player.pos.x + Math.sin(f) * 0.6 + Math.cos(f) * 1.6, 0, player.pos.z + Math.cos(f) * 0.6 - Math.sin(f) * 1.6);
  pet.cd -= dt * PS.rate / def.rate;
  // builder: walk to damaged / broken walls and fix them
  let fixing = null;
  if (inFight && def.kind === 'builder') {
    if (!pet.fix || (pet.fix.alive && pet.fix.hp >= pet.fix.max)) {
      pet.fix = null;
      let bd = 40;
      for (const st of structures.list) {
        if (st.piece.kind !== 'wall' || st.temporary || (st.alive && st.hp >= st.max * 0.95)) continue;
        const d = Math.hypot(st.x - player.pos.x, st.z - player.pos.z) + (st.alive ? 0 : 6);
        if (d < bd) { bd = d; pet.fix = st; }
      }
    }
    if (pet.fix) {
      fixing = pet.fix;
      const d = Math.hypot(fixing.x - pet.pos.x, fixing.z - pet.pos.z);
      pet.facing = Math.atan2(fixing.x - pet.pos.x, fixing.z - pet.pos.z);
      if (d > 2.2) goal = new THREE.Vector3(fixing.x, 0, fixing.z);
      else {
        pet.buildT = (pet.buildT || 0) + dt * (1 + 0.4 * PS.count('repair')) * PS.rate;
        if (pet.buildT >= 0.5) {
          pet.buildT = 0;
          pet.atkT = 0;
          if (!fixing.alive) { fixing.rebuild = (fixing.rebuild || 0) + 0.12; if (fixing.rebuild >= 1) { fixing.rebuild = 0; fixWall(fixing, 'revive'); toast(`${def.name} rebuilt a wall!`); pet.fix = null; } }
          else fixWall(fixing, fixing.max * 0.08);
          for (let k = 0; k < 6; k++) sparks.emit(fixing.x + (Math.random() - 0.5) * 1.5, 0.5 + Math.random() * 2, fixing.z + (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.5, 0.3, COL.wood, 6);
          sfx.fenceHit();
        }
      }
    }
  }
  if (inFight && !fixing && (def.kind === 'melee' || def.kind === 'roar' || def.kind === 'builder')) {
    if (!pet.target || !pet.target.alive || pet.target.pos.distanceTo(player.pos) > 16) pet.target = petTargets(12)[0] || null;
    if (pet.target && !pet.target.def.fly) {
      const t = pet.target;
      const d = Math.hypot(t.pos.x - pet.pos.x, t.pos.z - pet.pos.z);
      if (d > t.radius + 0.7) goal = new THREE.Vector3(t.pos.x, 0, t.pos.z);
      else if (pet.cd <= 0 && pet.atkT < 0) { pet.atkT = 0; pet.cd = 1 / def.rate; }
      pet.facing = Math.atan2(t.pos.x - pet.pos.x, t.pos.z - pet.pos.z);
    } else pet.target = null;
  }
  if (inFight && (def.kind === 'ranged' || def.kind === 'collector')) {
    const list = petTargets(def.range);
    if (list.length && pet.cd <= 0) {
      pet.cd = 1 / def.rate;
      const shots = 1 + (PS.perks.has('double') ? 1 : 0);
      for (let k = 0; k < Math.min(shots, list.length); k++) {
        const t = list[k];
        const from = new THREE.Vector3(pet.pos.x, (flyH || 0.5) + 0.4, pet.pos.z);
        const to = new THREE.Vector3(t.pos.x, t.pos.y + t.height * 0.55, t.pos.z);
        tracers.spawn(from, to, def.color || 0xffffff, def.id === 'penguin' ? 0.14 : 0.06, 0.12);
        sparks.emit(to.x, to.y, to.z, 0, 1, 0, 0.3, 0.4, new THREE.Color(def.color || 0xffffff), 3);
        petDamage(t, power, to);
      }
      pet.facing = Math.atan2(list[0].pos.x - pet.pos.x, list[0].pos.z - pet.pos.z);
      pet.atkT = 0.3;
    }
  }
  if (inFight && def.kind === 'support') {
    pet.healCd -= dt;
    if (pet.healCd <= 0) {
      pet.healCd = 5 / (PS.rate / def.rate);
      const heal = player.maxHp * 0.08 * (1 + 0.01 * (petRec().level - 1));
      player.hp = Math.min(player.maxHp, player.hp + heal);
      healHouse(G.houseMax * 0.02);
      rings.spawn(pet.pos, 3, 0x6dff9a, 0.6);
      for (let i = 0; i < 10; i++) sparks.emit(player.pos.x, 0.5 + Math.random() * 1.5, player.pos.z, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.7, 0.3, COL.green, -1);
      pet.atkT = 0;
    }
  }
  if (inFight && def.kind === 'roar') {
    pet.roarCd -= dt;
    if (pet.roarCd <= 0) {
      const r = 6 * (1 + 0.25 * PS.count('roar'));
      pet.roarCd = 10 / (1 + 0.3 * PS.count('roar'));
      rings.spawn(pet.pos, r, 0xffb13a, 0.6);
      G.shake = Math.max(G.shake, 0.15);
      for (const e of G.enemies) if (e.alive && e.spawnT <= 0 && e.pos.distanceTo(pet.pos) < r) { petDamage(e, power * 1.2, new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z)); setChill(e, 0.5, 2.5); }
    }
  }
  // collector: pull coins near the pet too
  if (def.kind === 'collector') for (const c of G.coins) if (c.state !== 'fly' && c.t > 0.4 && c.mesh.position.distanceTo(pet.pos) < 6 + 5 * PS.count('magnet')) c.state = 'fly';

  // melee hit timing
  if (pet.atkT >= 0) {
    pet.atkT += dt * 3;
    attackPhase = pet.atkT;
    if ((def.kind === 'melee' || def.kind === 'roar' || def.kind === 'builder') && !fixing && pet.target && !pet.hitDone && pet.atkT >= 0.5) {
      pet.hitDone = true;
      const t = pet.target;
      const pt = new THREE.Vector3(t.pos.x, t.pos.y + t.height * 0.4, t.pos.z);
      petDamage(t, power, pt);
      if (PS.perks.has('double')) { const o = petTargets(12).find(x => x !== t); if (o) petDamage(o, power * 0.7, new THREE.Vector3(o.pos.x, o.pos.y + o.height * 0.4, o.pos.z)); }
      sfx.hit(false);
    }
    if (pet.atkT >= 1) { pet.atkT = -1; pet.hitDone = false; }
  }
  if (!goal && !fixing && !(pet.atkT >= 0 && (def.kind === 'melee' || def.kind === 'roar' || def.kind === 'builder'))) {
    if (Math.hypot(home.x - pet.pos.x, home.z - pet.pos.z) > 1.2) goal = home;
  }
  // movement
  let spd = 0;
  if (goal) {
    const dx = goal.x - pet.pos.x, dz = goal.z - pet.pos.z;
    const d = Math.hypot(dx, dz);
    const far = Math.hypot(pet.pos.x - player.pos.x, pet.pos.z - player.pos.z);
    if (far > 30) { pet.pos.set(player.pos.x - 1.2, 0, player.pos.z - 1.2); }
    else {
      const sp = Math.min(d * 4, def.speed * (far > 8 ? 1.5 : 1));
      pet.pos.x += dx / d * sp * dt; pet.pos.z += dz / d * sp * dt;
      spd = sp;
      if (!(pet.target && pet.atkT >= 0)) pet.facing = lerpAngle(pet.facing, Math.atan2(dx, dz), Math.min(1, dt * 10));
    }
    if (!flyH) collideWorld(pet.pos, 0.3, true);
  } else if (!pet.target) pet.facing = lerpAngle(pet.facing, player.facing, Math.min(1, dt * 3));
  pet.speedNow += (spd - pet.speedNow) * Math.min(1, dt * 8);
  pet.char.root.position.set(pet.pos.x, flyH ? flyH + Math.sin(G.time * 4) * 0.15 : 0, pet.pos.z);
  pet.char.root.rotation.y = pet.facing;
  pet.char.pose(dt, pet.speedNow, attackPhase);
  pet.char.updateFlash(dt, 0);
}

// ---------------------------------------------------------------- collisions
function collideWorld(p, r, isPlayer, noStructures = false) {
  const hx = world.houseHalf.x + r, hz = world.houseHalf.z + r;
  if (Math.abs(p.x) < hx && Math.abs(p.z) < hz) {
    const dx = hx - Math.abs(p.x), dz = hz - Math.abs(p.z);
    if (dx < dz) p.x = Math.sign(p.x || 1) * hx; else p.z = Math.sign(p.z || 1) * hz;
  }
  for (const o of world.obstacles) {
    const dx = p.x - o.x, dz = p.z - o.z;
    const d2 = dx * dx + dz * dz, rr = o.r + r;
    if (d2 < rr * rr && d2 > 1e-6) {
      const d = Math.sqrt(d2);
      p.x = o.x + dx / d * rr; p.z = o.z + dz / d * rr;
    }
  }
  if (!noStructures) structures.collide(p, r);
  if (isPlayer) {
    const d = Math.hypot(p.x, p.z);
    if (d > WORLD_R) { p.x *= WORLD_R / d; p.z *= WORLD_R / d; }
  }
}

function housePoint(x, z, out) {
  out.x = clamp(x, -world.houseHalf.x, world.houseHalf.x);
  out.z = clamp(z, -world.houseHalf.z, world.houseHalf.z);
  return out;
}

// ---------------------------------------------------------------- shooting
function raySphere(o, d, cx, cy, cz, r) {
  const ox = o.x - cx, oy = o.y - cy, oz = o.z - cz;
  const b = ox * d.x + oy * d.y + oz * d.z;
  const cc = ox * ox + oy * oy + oz * oz - r * r;
  const disc = b * b - cc;
  if (disc < 0) return -1;
  const t = -b - Math.sqrt(disc);
  return t >= 0 ? t : (cc < 0 ? 0 : -1);
}

const hitList = [];
const SPH_GROUND = [[0.84, 0.17, true], [0.52, 0.22, false], [0.2, 0.17, false]];
const SPH_FLY = [[0.5, 0.5, false]];
function raycastEnemies(o, d, maxT) {
  hitList.length = 0;
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0 || e.phased) continue;
    const h = e.height, w = e.def.widen || 1, p = e.pos;
    const cx = p.x - o.x, cy = p.y + h * 0.5 - o.y, cz = p.z - o.z;
    const along = cx * d.x + cy * d.y + cz * d.z;
    if (along < -h || along > maxT + h) continue;
    if (cx * cx + cy * cy + cz * cz - along * along > h * h * 1.5) continue;
    let best = null;
    for (const [yy, rr, head] of (e.def.fly ? SPH_FLY : SPH_GROUND)) {
      const t = raySphere(o, d, p.x, p.y + h * yy, p.z, h * rr * w + (e.def.fly ? 0.3 : 0));
      if (t >= 0 && t <= maxT && (!best || t < best.t - 0.05 || (head && Math.abs(t - best.t) < 0.05))) best = { t, head, e };
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
  const hp = RAY.intersectBox(houseBox, V3);
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
    const lateral = dist * Math.sqrt(Math.max(0, 1 - cosv * cosv));
    if (cosv < cosMax || lateral > e.height * 0.3 * (e.def.widen || 1) + slack) continue;
    if (cosv > bestCos || !best) {
      if (worldHitT(ray.origin, c, dist) < dist - 0.5) continue;
      bestCos = cosv;
      best = { e, dir: c.clone(), dist };
    }
  }
  return best;
}

function fire(w, st) {
  if (player.stormT <= 0) player.ammo[w.id]--;
  const rateMult = (player.adrenalineT > 0 ? 1.3 : 1) * (player.stormT > 0 ? 1.5 : 1) * (save.hero === 'luna' ? 1.15 : 1);
  player.fireCd = 1 / (st.rate * rateMult);
  player.lastShot = G.time;
  NET.shots++;
  G.kick += w.recoil;
  player.bloom = Math.min(1.5, player.bloom + 0.25);
  sfx.shot(w.sound);
  updateWeaponHud();

  const ray = aimRay(new THREE.Ray());
  let dir = ray.direction.clone();
  const minT = camera.position.distanceTo(camState.pivot) * 0.9;
  if (input.isTouch) {
    const t = findAimTarget(8, 0.9);
    if (t) {
      const direct = raycastEnemies(ray.origin, ray.direction, w.range)[0];
      if (!direct || direct.e !== t.e) dir = t.dir;
    }
  }
  const muzzle = player.gun.userData.muzzle.getWorldPosition(new THREE.Vector3());
  const fl = player.gun.userData.flash;
  fl.visible = true;
  fl.material.rotation = Math.random() * TAU;
  fl.scale.setScalar((0.45 + Math.random() * 0.35 + (w.pellets > 1 ? 0.35 : 0)) * (isFp() ? 0.4 : 1));
  const ri = player.gun.userData.rarity;
  const tracerCol = ri > 0 ? RARITIES[ri].hex : 0xffe08a;
  fl.material.color.setHex(ri > 0 ? tracerCol : 0xffe0a0);
  for (let i = 0; i < 3; i++) sparks.emit(muzzle.x, muzzle.y, muzzle.z, dir.x * 4 + (Math.random() - 0.5) * 2, dir.y * 4 + Math.random(), dir.z * 4 + (Math.random() - 0.5) * 2, 0.12, 0.3, COL.fire);

  const abilities = st.abilities;
  const extra = abilities.filter(a => a.key === 'multishot').reduce((s, a) => s + a.v.n, 0);
  const extraPierce = abilities.filter(a => a.key === 'pierce').reduce((s, a) => s + a.v.n, 0) + (HS.perks.has('ricochet') ? 1 : 0);
  const dmgBase = st.dmg * HS.dmg * (player.boostT > 0 ? 1.3 : 1);

  if (w.projectile) {
    for (let k = 0; k <= extra; k++) {
      const d = dir.clone();
      if (k > 0) { d.x += (Math.random() - 0.5) * 0.12; d.y += Math.random() * 0.05; d.z += (Math.random() - 0.5) * 0.12; d.normalize(); }
      const tEnd = worldHitT(ray.origin, d, w.range);
      const hits = raycastEnemies(ray.origin, d, tEnd).filter(h => h.t > minT);
      const aimPoint = ray.origin.clone().addScaledVector(d, hits.length ? hits[0].t : tEnd);
      spawnRocket(muzzle, aimPoint, dmgBase * (k > 0 ? 0.6 : 1), w.splash, tracerCol, { lob: w.lob, plasma: w.plasma });
    }
    return;
  }
  const spread = w.spread * (1 + player.bloom * 0.6);
  const origin = ray.origin;
  const shots = w.pellets * (1 + extra);
  for (let p = 0; p < shots; p++) {
    const d = dir.clone();
    const sp = spread + (p >= w.pellets ? 0.025 : 0);
    if (sp > 0) {
      d.x += (Math.random() - 0.5) * 2 * sp;
      d.y += (Math.random() - 0.5) * 2 * sp;
      d.z += (Math.random() - 0.5) * 2 * sp;
      d.normalize();
    }
    let endT = worldHitT(origin, d, w.range);
    const hits = raycastEnemies(origin, d, endT).slice();
    let pierce = (w.pierce || 1) + extraPierce;
    let hitEnemy = false;
    for (const h of hits) {
      if (h.t < minT) continue;
      const pt = origin.clone().addScaledVector(d, h.t);
      weaponHit(h.e, dmgBase * (h.head ? (w.headMult || 1.75) : 1) * (p >= w.pellets ? 0.6 : 1), h.head, pt, abilities);
      hitEnemy = true;
      if (--pierce <= 0) { endT = h.t; break; }
    }
    const end = origin.clone().addScaledVector(d, endT);
    if (w.flame) {
      const md = end.clone().sub(muzzle);
      const len = md.length(); md.divideScalar(len || 1);
      for (let k = 0; k < 3; k++) {
        const s = 10 + Math.random() * 8;
        sparks.emit(muzzle.x, muzzle.y, muzzle.z, md.x * s + (Math.random() - 0.5) * 2, md.y * s + Math.random() * 1.5, md.z * s + (Math.random() - 0.5) * 2, Math.min(0.55, len / s), 0.5 + Math.random() * 0.5, k ? COL.fire : COL.spark, -2, 2.5);
      }
      if (Math.random() < 0.3) smoke.emit(end.x, end.y + 0.3, end.z, 0, 1, 0, 0.6, 0.5, COL.smoke, -0.4, 1, 2);
      continue;
    }
    if (p < 4 || Math.random() < 0.4) {
      const beam = w.beamColor ? (ri > 0 ? tracerCol : w.beamColor) : w.id === 'sniper' && ri === 0 ? 0xc89bff : tracerCol;
      const width = w.beamWidth || (w.beamColor ? 0.07 : w.id === 'sniper' ? 0.08 : 0.045);
      tracers.spawn(muzzle, end, beam, width, w.beamColor || w.id === 'sniper' ? 0.2 : 0.07);
      if (w.beamWidth) tracers.spawn(muzzle, end, 0xffffff, w.beamWidth * 0.35, 0.25);
    }
    if (!hitEnemy && endT < w.range - 0.1) {
      for (let k = 0; k < 4; k++) sparks.emit(end.x, end.y + 0.05, end.z, (Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3, 0.25, 0.16, COL.spark, 9);
      smoke.emit(end.x, end.y + 0.1, end.z, 0, 0.5, 0, 0.5, 0.35, COL.dust, 0, 1, 1.5);
    }
  }
}

// Applies weapon abilities on a hit.
function weaponHit(e, dmg, head, point, abilities, fromExplosion = false) {
  let crit = head;
  let critChance = (HS.perks.has('critblades') ? 0.2 : 0) + (HS.perks.has('deadeye') ? 0.15 : 0);
  for (const a of abilities) if (a.key === 'crit') critChance += a.v.chance;
  if (Math.random() < critChance) { dmg *= 2; crit = true; }
  for (const a of abilities) if (a.key === 'executioner' && e.hp / e.maxHp < 0.35) dmg *= 1 + a.v.f;
  const dealt = damageEnemy(e, dmg, { point, head: crit, src: 'weapon' });
  if (save.hero === 'zed' && player.alive) player.hp = Math.min(player.maxHp, player.hp + dealt * (HS.perks.has('leech') ? 0.06 : 0.03));
  if (e.alive && HS.perks.has('rot') && !e.burn) e.burn = { dps: dmg * 0.3, t: 3 };
  if (e.alive) {
    for (const a of abilities) {
      if (a.key === 'burn') e.burn = { dps: dmg * a.v.f, t: a.v.dur };
      if (a.key === 'freeze') setChill(e, a.v.slow, a.v.dur);
    }
  } else if (!e.novaDone) {
    e.novaDone = true;
    for (const a of abilities) if (a.key === 'nova') G.novaQueue.push({ pos: e.pos.clone().setY(e.pos.y + 0.8), dmg: dmg * a.v.f, r: a.v.r });
  }
  for (const a of abilities) {
    if (a.key === 'vampire' && player.alive) player.hp = Math.min(player.maxHp, player.hp + dmg * a.v.f);
    if (fromExplosion) continue;
    if (a.key === 'chain') {
      const near = G.enemies.filter(o => o !== e && o.alive && o.spawnT <= 0).map(o => ({ o, d: o.pos.distanceTo(e.pos) })).filter(x => x.d < 7).sort((a2, b2) => a2.d - b2.d).slice(0, a.v.n);
      let from = point.clone();
      for (const { o } of near) {
        const to = new THREE.Vector3(o.pos.x, o.pos.y + o.height * 0.55, o.pos.z);
        bolts.spawn(from, to, 0x9fd8ff, 0.16, 0.5);
        damageEnemy(o, dmg * a.v.f, { point: to, src: 'weapon' });
        from = to;
      }
      if (near.length) sfx.zap();
    }
    if (a.key === 'explode') explode(point.clone(), dmg * a.v.f, a.v.r, { src: 'weapon', small: true, noAbilities: true });
    if (a.key === 'orbital') {
      G.hitCount++;
      if (G.hitCount % a.v.every === 0) stormStrike(point.clone().setY(0), a.v.r, dmg * a.v.f, 'weapon');
    }
  }
}

function stormStrike(pos, r, dmg, src) {
  const top = new THREE.Vector3(pos.x + (Math.random() - 0.5) * 3, 30, pos.z + (Math.random() - 0.5) * 3);
  const bottom = new THREE.Vector3(pos.x, 0.2, pos.z);
  bolts.spawn(top, bottom, 0xd6b8ff, 0.3, 2.5);
  bolts.spawn(top, bottom, 0xffffff, 0.2, 1.5);
  rings.spawn(bottom, r * 1.4, 0xc28bff, 0.45);
  sfx.zap();
  G.shake = Math.max(G.shake, 0.15);
  for (let i = 0; i < 18; i++) sparks.emit(pos.x, 0.4, pos.z, (Math.random() - 0.5) * 8, Math.random() * 6, (Math.random() - 0.5) * 8, 0.4, 0.4, COL.purple, 8);
  for (const e of G.enemies) {
    if (!e.alive || e.spawnT > 0) continue;
    if (Math.hypot(e.pos.x - pos.x, e.pos.z - pos.z) < r + e.radius) damageEnemy(e, dmg, { point: new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.6, e.pos.z), src });
  }
}

function spawnRocket(from, to, dmg, splash, color, opts = {}) {
  const mesh = new THREE.Group();
  if (opts.plasma) {
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), new THREE.MeshBasicMaterial({ color: 0xa060ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
    mesh.add(core, glow);
  } else if (opts.lob) {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(opts.big ? 0.28 : 0.15, 10, 8), new THREE.MeshStandardMaterial({ color: opts.big ? 0x3a3a3a : 0x3a5a2a, roughness: 0.6, emissive: color, emissiveIntensity: 0.25 }));
    mesh.add(ball);
  } else {
    const bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8), new THREE.MeshStandardMaterial({ color: 0x6a7a3a }));
    bodyM.rotation.x = Math.PI / 2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1 }));
    tip.rotation.x = Math.PI / 2; tip.position.z = 0.37;
    mesh.add(bodyM, tip);
  }
  mesh.position.copy(from);
  mesh.lookAt(to);
  scene.add(mesh);
  let vel;
  if (opts.lob) {
    const flat = Math.hypot(to.x - from.x, to.z - from.z);
    const T = clamp(flat / 26, 0.35, 1.6);
    vel = to.clone().sub(from).divideScalar(T);
    vel.y += 0.5 * 20 * T;
  } else vel = to.clone().sub(from).normalize().multiplyScalar(opts.speed || (opts.plasma ? 34 : 42));
  const r = { mesh, vel, dmg, splash, life: opts.lob ? 4 : 3, gravity: opts.lob ? 20 : 0, src: opts.src || 'weapon', plasma: opts.plasma, homing: opts.homing || null, aim: opts.aim || null, delay: opts.delay || 0, speed: opts.speed || 42, color };
  G.rockets.push(r);
  return r;
}

function updateRockets(dt) {
  for (let i = G.rockets.length - 1; i >= 0; i--) {
    const r = G.rockets[i];
    r.life -= dt;
    const p = r.mesh.position;
    let boom = r.life <= 0;
    if (r.gravity) r.vel.y -= r.gravity * dt;
    if (r.aim) {
      if (r.delay > 0) r.delay -= dt;
      else {
        if (r.homing && r.homing.alive) r.aim.set(r.homing.pos.x, r.homing.pos.y + r.homing.height * 0.5, r.homing.pos.z);
        const want = V1.copy(r.aim).sub(p).normalize().multiplyScalar(r.speed);
        r.vel.lerp(want, Math.min(1, dt * 5));
        r.vel.setLength(Math.min(r.speed, r.vel.length() + dt * 60));
      }
      r.mesh.lookAt(V2.copy(p).add(r.vel));
    } else if (r.gravity) r.mesh.rotation.x += dt * 10;
    for (let s = 0; s < 3 && !boom; s++) {
      p.addScaledVector(r.vel, dt / 3);
      if (p.y < 0.1 || houseBox.containsPoint(p) || (structures.wallAt(p.x, p.z, 0) && p.y < 2.6)) boom = true;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0) continue;
        const dx = p.x - e.pos.x, dz = p.z - e.pos.z, dy = p.y - (e.pos.y + e.height * 0.5);
        const rr = e.height * 0.3 * (e.def.widen || 1) + 0.35;
        if (dx * dx + dz * dz < rr * rr && Math.abs(dy) < e.height * 0.6) { boom = true; break; }
      }
    }
    if (r.plasma) sparks.emit(p.x, p.y, p.z, (Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5), 0.3, 0.5, COL.purple, 0);
    else if (r.gravity) { if (Math.random() < 0.6) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.2, 0.18, COL.fire); }
    else {
      smoke.emit(p.x, p.y, p.z, (Math.random() - 0.5) * 0.4, 0.4, (Math.random() - 0.5) * 0.4, 0.6, 0.45, COL.smoke, 0, 1, 2);
      sparks.emit(p.x, p.y, p.z, -r.vel.x * 0.05, -r.vel.y * 0.05, -r.vel.z * 0.05, 0.15, 0.4, COL.fire);
    }
    if (boom) {
      explode(p.clone(), r.dmg, r.splash, { src: r.src, color: r.plasma ? COL.purple : undefined, small: r.src === 'ability' });
      scene.remove(r.mesh);
      r.mesh.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
      G.rockets.splice(i, 1);
    }
  }
}

function explode(pos, dmg, radius, opts = {}) {
  fxRecord(['x', r1(pos.x), r1(pos.y), r1(pos.z), r1(radius), opts.small ? 1 : 0, colHex(opts.color || COL.fire)]);
  sfx.explosion();
  const dPlayer = pos.distanceTo(player.pos);
  G.shake = Math.max(G.shake, clamp((opts.small ? 0.25 : 0.6) - dPlayer * 0.02, 0.05, 0.6));
  const n = opts.small ? 14 : 40;
  const col = opts.color || COL.fire;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * TAU, u = Math.random() * 2 - 1, s = 4 + Math.random() * 8;
    const k = Math.sqrt(1 - u * u);
    sparks.emit(pos.x, pos.y + 0.2, pos.z, Math.cos(a) * k * s, Math.abs(u) * s, Math.sin(a) * k * s, 0.4 + Math.random() * 0.3, 0.5 + Math.random() * 0.5, i % 3 ? col : COL.spark, 6, 2);
  }
  for (let i = 0; i < (opts.small ? 5 : 16); i++) {
    smoke.emit(pos.x + (Math.random() - 0.5), pos.y + Math.random(), pos.z + (Math.random() - 0.5), (Math.random() - 0.5) * 3, 1 + Math.random() * 2, (Math.random() - 0.5) * 3, 1.2 + Math.random(), 1.3, COL.smoke, -0.5, 1.5, 2.5);
  }
  rings.spawn(pos, radius * 1.2, 0xffa040, 0.35);
  if (dmg <= 0) return;
  const abilities = opts.src === 'weapon' && !opts.noAbilities ? curStats().abilities : [];
  for (const e of [...G.enemies]) {
    if (!e.alive || e.spawnT > 0 || e === opts.exclude) continue;
    const d = Math.hypot(pos.x - e.pos.x, pos.z - e.pos.z) - e.radius;
    if (d < radius && Math.abs(pos.y - e.pos.y) < e.height + radius) {
      const f = 1 - 0.6 * clamp(d / radius, 0, 1);
      const pt = new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.6, e.pos.z);
      if (abilities.length) weaponHit(e, dmg * f, false, pt, abilities, true);
      else damageEnemy(e, dmg * f, { point: pt, src: opts.src || 'weapon' });
    }
  }
}

function showHitmarker(kind) {
  const el = $('hitmarker');
  el.className = '';
  void el.offsetWidth;
  el.className = 'show ' + (kind || '');
}

// ---------------------------------------------------------------- XP & levels
function gainXp(amount, src) {
  if (amount <= 0) return;
  const xp = amount * 2;
  const hr = heroRec();
  const hLv = hr.level;
  if (addXp(hr, xp).length) onLevel('hero', heroDef().name, hLv, hr.level);
  const pr = petRec();
  const pLv = pr.level;
  if (addXp(pr, xp).length) onLevel('pet', petDef().name, pLv, pr.level);
  if (src === 'weapon') {
    const wr = weaponRec();
    const wLv = wr.level;
    if (addXp(wr, xp).length) onLevel('weapon', curWeapon().name, wLv, wr.level);
  }
}

function onLevel(kind, name, from, to) {
  const r0 = rarityIndex(from), r1 = rarityIndex(to);
  if (r1 > r0) {
    const r = RARITIES[r1];
    const ability = kind === 'weapon' ? curWeapon().abilities[r1 - 1].name : kind === 'pet' ? PET_NAMES[petDef().perks[r1 - 1]] : heroDef().perks[r1 - 1].name;
    showBanner(`${name} is now ${r.name.toUpperCase()}!`, `New ${kind === 'weapon' ? 'ability' : 'perk'}: ${ability}`, 'rarity', 3.2, r.css);
    sfx.levelUp(true);
    for (let i = 0; i < 40; i++) sparks.emit(player.pos.x, 1 + Math.random() * 1.5, player.pos.z, (Math.random() - 0.5) * 6, Math.random() * 6, (Math.random() - 0.5) * 6, 1, 0.4, new THREE.Color(r.hex), 3);
    rings.spawn(player.pos, 5, r.hex, 0.8);
  } else {
    toast(`${name} reached level ${to}`, 'lvl');
    sfx.levelUp(false);
  }
  if (kind === 'weapon') {
    refreshWeapon(player.weaponId);
    if (r1 > r0) equipWeapon(player.weaponId, true);
  } else if (kind === 'pet') {
    refreshHero();
    if (r1 > r0 && pet.ring) pet.ring.material.color.setHex(RARITIES[r1].hex);
  } else {
    const hpFrac = player.hp / player.maxHp;
    refreshHero();
    player.hp = hpFrac * player.maxHp;
    if (r1 > r0 && player.ring) player.ring.material.color.setHex(RARITIES[r1].hex);
  }
  updateWeaponHud(true);
  updateHeroHud();
}

// ---------------------------------------------------------------- enemies
function makeEnemyChar(def) {
  if (def.model === 'robot') return new RobotChar({ color: def.color, height: def.height, widen: def.widen || 1, emissive: def.emissive || 0, eyes: def.boss ? 0xff40ff : 0xff3020 });
  if (def.model === 'drone') return new DroneChar({ height: def.height, tint: def.tint || null });
  return new KenneyChar(def.model, { height: def.height, tint: def.tint || null, glow: def.glow || null, zombie: def.model.startsWith('zombie') });
}

let shieldGeo = null;
function spawnEnemy(type, portalIndex, at = null) {
  const def = ENEMIES[type];
  const n = curWave();
  const portal = world.portals[portalIndex] || world.portals[0];
  const char = makeEnemyChar(def);
  let pos;
  if (at) pos = at.clone();
  else {
    const side = (Math.random() - 0.5) * 3.5;
    pos = new THREE.Vector3(
      portal.pos.x - Math.cos(portal.angle) * 1.5 + Math.cos(portal.angle + Math.PI / 2) * side, 0,
      portal.pos.z - Math.sin(portal.angle) * 1.5 + Math.sin(portal.angle + Math.PI / 2) * side);
  }
  if (def.fly) pos.y = def.fly;
  char.root.position.copy(pos);
  char.root.rotation.y = Math.atan2(-pos.x, -pos.z);
  char.root.scale.setScalar(0.01);
  scene.add(char.root);
  if (def.shield) {
    if (!shieldGeo) shieldGeo = new THREE.BoxGeometry(0.95, 1.3, 0.08);
    const sh = new THREE.Mesh(shieldGeo, new THREE.MeshStandardMaterial({ color: 0x4f6f96, metalness: 0.6, roughness: 0.35, emissive: 0x16304f, emissiveIntensity: 0.6, transparent: true, opacity: 0.92 }));
    sh.position.set(0, 1.0, 0.5);
    char.root.add(sh);
    char.mats.push(sh.material);
    sh.material.userData.baseEmissive = sh.material.emissive.clone();
    sh.material.userData.baseIntensity = 0.6;
  }
  const hpMult = waveHpMult(n) * (def.boss ? 1 + Math.floor(n / 20) * 0.3 : 1);
  const e = {
    type, def, char, pos, alive: true,
    hp: def.hp * hpMult, maxHp: def.hp * hpMult,
    dmg: def.dmg * waveDmgMult(n),
    speed: def.speed * (0.92 + Math.random() * 0.16) * (1 + Math.min(0.25, n * 0.008)),
    radius: def.radius, height: def.height,
    state: 'walk', atkCd: 0.5 + Math.random() * 0.5, atkT: -1, atkTarget: null, hitDone: false,
    dieT: 0, spawnT: 0.7, trapSlow: 1, wall: null,
    coinValue: def.coins * waveCoinMult(n),
    hpBar: null, facing: char.root.rotation.y, speedNow: 0,
    burn: null, chill: null, healT: 2 + Math.random() * 2, summonT: def.summon ? 5 : 8,
    lastHit: -10, blinkT: 2 + Math.random() * 2, phaseT: Math.random() * 3, phased: false, huntT: 0, huntWall: null,
    haste: 1, shielded: false, enraged: false, life: 0, wander: null, hop: Math.random() * 6,
  };
  if (def.phase) for (const m of char.mats) { m.transparent = true; m.opacity = 0.7; m.depthWrite = false; }
  e.id = NET.idSeq++;
  if (!def.boss) e.hpBar = makeHpBar(char.root, def.height + 0.35 + (def.fly ? 0.3 : 0));
  G.enemies.push(e);
  sfx.portal();
  if (!at) for (let i = 0; i < 16; i++) sparks.emit(pos.x, 1 + Math.random() * 2, pos.z, (Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5, 0.6, 0.5, COL.purple, 2, 1);
  if (def.goblin) { showBanner('LOOT GOBLIN!', 'Catch it before it escapes!', 'gold', 2); sfx.coin(); }
  if (def.boss) {
    showBanner(def.name.toUpperCase() + '!', 'A boss has entered the field', 'red', 2.2);
    sfx.bossRoar();
    G.shake = 0.5;
  }
  return e;
}

const barTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 4; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 4, 4); return new THREE.CanvasTexture(c); })();
function makeHpBar(parent, y) {
  const bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x140a28, depthTest: false, transparent: true, opacity: 0.8 }));
  const fill = new THREE.Sprite(new THREE.SpriteMaterial({ map: barTex, color: 0x5cf08a, depthTest: false }));
  bg.position.y = fill.position.y = y;
  bg.renderOrder = 10; fill.renderOrder = 11;
  bg.visible = fill.visible = false;
  parent.add(bg, fill);
  return { bg, fill, w: 1.1 };
}

function updateHpBar(e) {
  if (!e.hpBar) return;
  const f = clamp(e.hp / e.maxHp, 0.001, 1);
  const show = e.alive && f < 0.999;
  e.hpBar.bg.visible = e.hpBar.fill.visible = show;
  if (!show) return;
  const inv = 1 / (e.char.root.scale.x || 1);
  e.hpBar.bg.scale.set((e.hpBar.w + 0.08) * inv, 0.2 * inv, 1);
  e.hpBar.fill.scale.set(e.hpBar.w * f * inv, 0.13 * inv, 1);
  e.hpBar.fill.center.set(0.5 / f, 0.5);
  e.hpBar.fill.material.color.setHex(e.burn ? 0xff8a2a : e.chill ? 0x7fdcff : f > 0.5 ? 0x5cf08a : f > 0.25 ? 0xffc02e : 0xff4d5e);
}

// Central damage function. Returns damage actually dealt.
function damageEnemy(e, amount, opts = {}) {
  if (!e.alive) return 0;
  const src = opts.src || 'weapon';
  const byPlayer = src === 'weapon' || src === 'ability';
  if (e.phased) return 0;
  if (e.mirror && src !== 'remote') NET.dmgOut.set(e.id, (NET.dmgOut.get(e.id) || 0) + amount);
  let blocked = false;
  e.lastHit = G.time;
  if (e.def.armor) amount *= 1 - e.def.armor;
  if (e.shielded) { amount *= 0.5; blocked = true; }
  if (e.def.shield && src === 'weapon') {
    const toPlayer = Math.atan2(player.pos.x - e.pos.x, player.pos.z - e.pos.z);
    const diff = Math.abs(((toPlayer - e.facing + Math.PI * 3) % TAU) - Math.PI);
    if (diff < 1.1) { amount *= 0.25; blocked = true; }
  }
  const dealt = Math.min(Math.max(0, e.hp), amount);
  e.hp -= amount;
  if (!opts.quiet) e.char.flash(0.08);
  if (byPlayer) gainXp(dealt, src);
  if (byPlayer && !opts.quiet) {
    const p = opts.point || V1.set(e.pos.x, e.pos.y + e.height, e.pos.z);
    const shown = Math.max(1, Math.round(amount));
    dmgNums.spawn(p, shown, blocked ? 'blocked' : opts.head ? 'crit' : shown >= 150 ? 'big' : '');
    if (src === 'weapon') sfx.hit(opts.head);
  }
  if (opts.point && !opts.quiet) {
    const col = blocked ? COL.white : e.def.model === 'robot' || e.def.fly ? COL.spark : COL.blood;
    for (let i = 0; i < (opts.head ? 7 : 4); i++) sparks.emit(opts.point.x, opts.point.y, opts.point.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.3, 0.2, col, 8);
  }
  if (e.mirror) {
    if (e.hp <= 0 && src === 'weapon' && !opts.quiet) showHitmarker('kill');
    else if (src === 'weapon' && !opts.quiet) showHitmarker(opts.head ? 'head' : '');
    return dealt;
  }
  if (e.hp <= 0) {
    killEnemy(e, byPlayer || src === 'trap');
    if (src === 'weapon' && !opts.quiet) showHitmarker('kill');
  } else if (src === 'weapon' && !opts.quiet) showHitmarker(opts.head ? 'head' : '');
  return dealt;
}

function killEnemy(e, byPlayer = true, noCoins = false) {
  if (!e.alive) return;
  e.alive = false;
  e.state = 'dying';
  e.dieT = 0;
  G.kills++;
  save.kills++;
  e.char.die();
  sfx.enemyDie();
  if (e.hpBar) e.hpBar.bg.visible = e.hpBar.fill.visible = false;
  const c = new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z);
  for (let i = 0; i < 14; i++) sparks.emit(c.x, c.y, c.z, (Math.random() - 0.5) * 6, Math.random() * 5, (Math.random() - 0.5) * 6, 0.5, 0.3, COL.purple, 9, 1);
  if (!noCoins) {
    let v = e.coinValue * coinMult();
    if (HS.perks.has('jackpot') && Math.random() < 0.1) { v *= 3; dmgNums.spawn(c.clone().setY(c.y + 1), 'JACKPOT', 'coin'); }
    dropCoins(e.pos, v, e.def.boss ? 14 : e.def.coins >= 12 ? 5 : 2);
  }
  if (byPlayer && HS.perks.has('adrenaline')) player.adrenalineT = 4;
  if (e.mirror) return;
  if (e.def.explode && byPlayer) explode(c, e.dmg * 0.8, e.def.explode, { src: 'weapon', noAbilities: true, color: COL.spark, exclude: e });
  const def = e.def;
  if (def.split) {
    for (let k = 0; k < def.split.n; k++) {
      const a = (k / def.split.n) * TAU + Math.random();
      const o = spawnEnemy(def.split.type, 0, new THREE.Vector3(e.pos.x + Math.cos(a) * 1.2, 0, e.pos.z + Math.sin(a) * 1.2));
      o.spawnT = 0.35;
    }
  }
  if (def.deathFire) {
    explode(c, 0, def.deathFire, { color: COL.fire, small: true });
    if (Math.hypot(player.pos.x - c.x, player.pos.z - c.z) < def.deathFire) { hurtPlayer(e.dmg * 0.8); burnPlayer(e.dmg * 0.25, 2.5); }
    hurtRemoteNear(c.x, c.z, def.deathFire, e.dmg * 0.8);
    for (const s of structures.list) if (s.alive && s.piece.kind === 'wall' && Math.hypot(s.x - c.x, s.z - c.z) < def.deathFire + 0.5) hitStructure(s, e.dmg * 2);
  }
  if (def.deathCloud) { spawnCloud(e.pos.clone().setY(0), def.deathCloud, e.dmg * 0.9, 5, false); rings.spawn(e.pos, def.deathCloud, 0x9aff4a, 0.5); }
  if (e.def.boss) { G.shake = 0.6; explode(c, 0, 1); }
}

function removeEnemy(e) {
  scene.remove(e.char.root);
  e.char.dispose();
  if (e.hpBar) { e.hpBar.bg.material.dispose(); e.hpBar.fill.material.dispose(); }
}

const TP = new THREE.Vector3();
function updateAuras() {
  const list = G.enemies;
  for (const e of list) { e.haste = 1; e.shielded = false; }
  for (const a of list) {
    if (!a.alive || a.spawnT > 0 || !(a.def.hasteAura || a.def.shieldAura)) continue;
    const r = a.def.hasteAura || a.def.shieldAura;
    for (const o of list) {
      if (o === a || !o.alive || Math.hypot(o.pos.x - a.pos.x, o.pos.z - a.pos.z) > r) continue;
      if (a.def.hasteAura) o.haste = 1.35; else o.shielded = true;
    }
    a.auraT = (a.auraT || 0) - 1;
    if (a.auraT <= 0) { a.auraT = 90; rings.spawn(a.pos, r, a.def.hasteAura ? 0xffd070 : 0x3cc8ff, 0.7); }
  }
}

function hostileTarget(e, def) {
  // wall hunters go straight for nearby walls
  if (def.wallHunter) {
    e.huntT -= 1;
    if (e.huntT <= 0 || (e.huntWall && !e.huntWall.alive)) {
      e.huntT = 40;
      e.huntWall = null;
      let bd = 20;
      for (const s of structures.list) {
        if (!s.alive || s.piece.kind !== 'wall') continue;
        const d = Math.hypot(s.x - e.pos.x, s.z - e.pos.z);
        if (d < bd) { bd = d; e.huntWall = s; }
      }
    }
  }
  return e.huntWall;
}

function updateGoblin(e, dt) {
  e.life += dt;
  const dpx = e.pos.x - player.pos.x, dpz = e.pos.z - player.pos.z;
  const dp = Math.hypot(dpx, dpz) || 1;
  let tx, tz;
  if (dp < 14) { tx = dpx / dp; tz = dpz / dp; }
  else {
    if (!e.wander || Math.hypot(e.wander.x - e.pos.x, e.wander.z - e.pos.z) < 2) { const a = Math.random() * TAU, r = 16 + Math.random() * 20; e.wander = { x: Math.cos(a) * r, z: Math.sin(a) * r }; }
    tx = e.wander.x - e.pos.x; tz = e.wander.z - e.pos.z;
    const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
  }
  const spd = e.speed * (e.chill ? 1 - e.chill.slow : 1) * e.trapSlow * (dp < 14 ? 1 : 0.6);
  e.trapSlow = 1;
  e.pos.x += tx * spd * dt; e.pos.z += tz * spd * dt;
  const d0 = Math.hypot(e.pos.x, e.pos.z);
  if (d0 > WORLD_R - 4) { e.pos.x *= (WORLD_R - 4) / d0; e.pos.z *= (WORLD_R - 4) / d0; e.wander = null; }
  e.facing = lerpAngle(e.facing, Math.atan2(tx, tz), Math.min(1, dt * 8));
  e.speedNow = spd;
  if (Math.random() < dt * 8) sparks.emit(e.pos.x, 0.6 + Math.random(), e.pos.z, 0, 1.5, 0, 0.6, 0.25, COL.coin, 1);
  e.char.pose(dt, spd, -1);
  e.char.updateFlash(dt, e.burn ? 0x5a2000 : 0);
  if (e.life > 25) {
    // escaped with the loot
    e.alive = false; e.state = 'dying'; e.dieT = 2.2;
    for (let i = 0; i < 24; i++) sparks.emit(e.pos.x, 1, e.pos.z, (Math.random() - 0.5) * 5, Math.random() * 5, (Math.random() - 0.5) * 5, 0.6, 0.4, COL.coin, 3);
    toast('The Loot Goblin escaped!');
  }
}

function updateEnemies(dt) {
  const list = G.enemies;
  updateAuras();
  for (let i = list.length - 1; i >= 0; i--) {
    const e = list[i];
    const ch = e.char;
    if (e.state === 'dying') {
      e.dieT += dt;
      ch.pose(dt, 0, -1);
      ch.updateFlash(dt, 0);
      if (e.def.fly) { e.pos.y = Math.max(0.3, e.pos.y - dt * 6); ch.root.position.y = e.pos.y; }
      if (e.dieT > 1.3) ch.root.position.y -= dt * 1.4;
      if (e.dieT > 2.5) { removeEnemy(e); list.splice(i, 1); }
      continue;
    }
    if (e.spawnT > 0) {
      e.spawnT -= dt;
      ch.root.scale.setScalar(clamp(1 - e.spawnT / 0.7, 0.01, 1));
      if (e.spawnT <= 0) ch.root.scale.setScalar(1);
      ch.pose(dt, 0, -1);
      continue;
    }

    // status effects
    let statusCol = 0;
    if (e.burn) {
      e.burn.t -= dt;
      damageEnemy(e, e.burn.dps * dt, { src: 'weapon', quiet: true });
      if (Math.random() < dt * 14) sparks.emit(e.pos.x + (Math.random() - 0.5) * 0.5, e.pos.y + Math.random() * e.height, e.pos.z + (Math.random() - 0.5) * 0.5, 0, 2, 0, 0.4, 0.35, COL.fire, -1);
      statusCol = 0x5a2000;
      if (e.burn && e.burn.t <= 0) e.burn = null;
      if (!e.alive) continue;
    }
    let slow = e.trapSlow;
    e.trapSlow = 1;
    if (e.chill) {
      e.chill.t -= dt;
      slow *= 1 - e.chill.slow;
      statusCol = 0x2a7aa8;
      if (Math.random() < dt * 6) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, 0, 0.5, 0, 0.5, 0.2, COL.ice, 1);
      if (e.chill.t <= 0) e.chill = null;
    }
    if (e.def.enrage && !e.enraged && e.hp < e.maxHp * 0.5) {
      e.enraged = true; e.speed *= 1.7; e.dmg *= 1.5;
      rings.spawn(e.pos, 2.5, 0xff3030, 0.4);
      for (let k = 0; k < 12; k++) sparks.emit(e.pos.x, e.pos.y + e.height * 0.7, e.pos.z, (Math.random() - 0.5) * 4, Math.random() * 4, (Math.random() - 0.5) * 4, 0.5, 0.3, COL.red, 4);
    }
    if (e.enraged && !statusCol) statusCol = 0x6a0000;
    if (e.shielded && !statusCol) statusCol = 0x0a3a6a;
    if (e.haste > 1 && !statusCol) statusCol = 0x4a3a00;
    ch.updateFlash(dt, statusCol);
    if (e.def.goblin) { updateGoblin(e, dt); continue; }
    slow *= e.haste;

    if (e.def.regen && G.time - e.lastHit > 2 && e.hp < e.maxHp) {
      e.hp = Math.min(e.maxHp, e.hp + e.maxHp * e.def.regen * dt);
      if (Math.random() < dt * 6) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, 0, 2, 0, 0.6, 0.3, COL.green, -1);
    }
    if (e.def.phase) {
      e.phaseT += dt;
      const was = e.phased;
      e.phased = e.phaseT % 4 > 2.6;
      if (was !== e.phased) {
        for (const m of ch.mats) m.opacity = e.phased ? 0.18 : 0.7;
        for (let k = 0; k < 10; k++) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, (Math.random() - 0.5) * 2, 1, (Math.random() - 0.5) * 2, 0.5, 0.3, COL.ice, 0);
      }
    }

    if (e.def.healer) {
      e.healT -= dt;
      if (e.healT <= 0) {
        e.healT = 3;
        let any = false;
        for (const o of list) {
          if (!o.alive || o === e || o.def.boss) continue;
          if (o.pos.distanceTo(e.pos) < 9 && o.hp < o.maxHp) { o.hp = Math.min(o.maxHp, o.hp + o.maxHp * 0.12); any = true; for (let k = 0; k < 5; k++) sparks.emit(o.pos.x, o.pos.y + o.height * Math.random(), o.pos.z, 0, 2, 0, 0.6, 0.3, COL.green, -1); }
        }
        rings.spawn(e.pos, 9, 0x6dff9a, 0.7);
        if (any) sfx.heal();
      }
    }
    if (e.def.summon) {
      e.summonT -= dt;
      if (e.summonT <= 0) {
        e.summonT = e.def.boss ? 9 : 7;
        if (list.filter(o => o.alive).length < 40) {
          const n = e.def.boss ? 4 : 2;
          for (let k = 0; k < n; k++) {
            const a = Math.random() * TAU;
            spawnEnemy(e.def.summon, 0, new THREE.Vector3(e.pos.x + Math.cos(a) * 2.5, 0, e.pos.z + Math.sin(a) * 2.5));
          }
          rings.spawn(e.pos, 4, 0xb070ff, 0.6);
        }
      }
    } else if (e.def.boss) {
      e.summonT -= dt;
      if (e.summonT <= 0) {
        e.summonT = 11;
        for (let k = 0; k < 3; k++) {
          const a = Math.random() * TAU;
          spawnEnemy(k === 2 && curWave() >= 10 ? 'runner' : 'husk', 0, new THREE.Vector3(e.pos.x + Math.cos(a) * 3, 0, e.pos.z + Math.sin(a) * 3));
        }
        rings.spawn(e.pos, 6, 0xb070ff, 0.6);
      }
    }
    if (e.def.explode && Math.random() < dt * 3) sfx.beep();

    // target selection
    let dp = Math.hypot(player.pos.x - e.pos.x, player.pos.z - e.pos.z);
    let tgtPos = player.pos, tgtKind = 'player', tgtOk = player.alive && (player.shieldT <= 0 || e.def.boss);
    const RM = NET.remote;
    if (RM && RM.alive && (!RM.shield || e.def.boss)) {
      const dr = Math.hypot(RM.pos.x - e.pos.x, RM.pos.z - e.pos.z);
      if (!tgtOk || dr < dp) { dp = dr; tgtPos = RM.pos; tgtKind = 'remote'; tgtOk = true; }
    }
    const aggro = e.def.boss ? 9 : e.def.fast ? 8 : e.def.ranged ? e.def.ranged * 0.8 : 6.5;
    let targetKind;
    const hunt = hostileTarget(e, e.def);
    if (tgtOk && dp < aggro) { TP.set(tgtPos.x, 0, tgtPos.z); targetKind = tgtKind; }
    else if (hunt) { TP.set(clamp(e.pos.x, hunt.x - hunt.hx, hunt.x + hunt.hx), 0, clamp(e.pos.z, hunt.z - hunt.hz, hunt.z + hunt.hz)); targetKind = 'wall'; }
    else { housePoint(e.pos.x, e.pos.z, TP); TP.y = 0; targetKind = 'house'; }
    let dx = TP.x - e.pos.x, dz = TP.z - e.pos.z;
    const dist = Math.hypot(dx, dz) || 0.001;
    const reach = e.def.reach + (targetKind === 'player' || targetKind === 'remote' ? player.radius : 0) + e.radius * 0.6;
    const stopAt = e.def.ranged ? e.def.ranged : e.def.keepAway && targetKind === 'house' ? e.def.keepAway : reach;

    let attackTarget = null;
    if (e.wall && e.wall.alive && !e.def.fly && dist > stopAt) attackTarget = e.wall;
    else e.wall = null;
    if (!attackTarget && dist <= stopAt) attackTarget = targetKind === 'wall' ? hunt : e.def.keepAway && targetKind === 'house' ? 'idle' : targetKind;
    if (e.def.blink && !attackTarget) {
      e.blinkT -= dt;
      if (e.blinkT <= 0 && dist > e.def.blink + stopAt) {
        e.blinkT = 3.5;
        for (let k = 0; k < 14; k++) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.5, 0.35, COL.purple, 0);
        e.pos.x += dx / dist * e.def.blink; e.pos.z += dz / dist * e.def.blink;
        dx = TP.x - e.pos.x; dz = TP.z - e.pos.z;
        for (let k = 0; k < 14; k++) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.5, 0.35, COL.purple, 0);
        sfx.zap();
        continue;
      }
    }

    let moveSpeed = 0;
    if (!attackTarget) {
      const spd = e.speed * slow * dt;
      const nx = e.pos.x + dx / dist * spd, nz = e.pos.z + dz / dist * spd;
      const wall = e.def.fly || e.def.leap ? null : structures.wallAt(nx, nz, e.radius * 0.8);
      if (wall) { e.wall = wall; attackTarget = wall; }
      else { e.pos.x = nx; e.pos.z = nz; moveSpeed = e.speed * slow; }
      e.facing = lerpAngle(e.facing, Math.atan2(dx, dz), Math.min(1, dt * 6));
    }
    if (attackTarget && attackTarget !== 'idle') {
      if (attackTarget !== 'player' && attackTarget !== 'house' && attackTarget !== 'remote') { dx = attackTarget.x - e.pos.x; dz = attackTarget.z - e.pos.z; }
      e.facing = lerpAngle(e.facing, Math.atan2(dx, dz), Math.min(1, dt * 8));
      e.atkCd -= dt * slow;
      if (e.atkCd <= 0 && e.atkT < 0) {
        e.atkCd = e.def.rate;
        e.atkT = 0;
        e.hitDone = false;
        e.atkTarget = attackTarget;
      }
    } else if (attackTarget === 'idle') {
      e.facing = lerpAngle(e.facing, Math.atan2(dx, dz), Math.min(1, dt * 4));
    }
    let attackPhase = -1;
    if (e.atkT >= 0) {
      const dur = Math.min(0.9, e.def.rate * 0.8);
      e.atkT += dt;
      attackPhase = e.atkT / dur;
      if (!e.hitDone && attackPhase >= 0.5) { e.hitDone = true; applyEnemyHit(e); if (!e.alive) continue; }
      if (attackPhase >= 1) { e.atkT = -1; attackPhase = -1; }
    }
    e.speedNow += (moveSpeed - e.speedNow) * Math.min(1, dt * 8);
    if (e.def.leap) {
      // bounding leaps that clear walls
      e.hop += dt * 5.5 * Math.min(1, e.speedNow / 2);
      const onWall = structures.wallAt(e.pos.x, e.pos.z, e.radius);
      e.pos.y = e.speedNow > 0.5 ? Math.abs(Math.sin(e.hop)) * (onWall ? 3.2 : 1.1) : Math.max(0, e.pos.y - dt * 6);
    }
    const clip = ch.actions && ch.actions.Punch ? ch.actions.Punch.getClip() : null;
    ch.pose(dt, e.speedNow, attackPhase, null, { attackSpeed: clip ? clip.duration / Math.max(0.4, e.def.rate) : 1 });
  }

  // separation + collisions
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (!a.alive || a.spawnT > 0) continue;
    for (let j = i + 1; j < list.length; j++) {
      const b = list[j];
      if (!b.alive || b.spawnT > 0 || !!a.def.fly !== !!b.def.fly) continue;
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
      const rr = a.radius + b.radius;
      const d2 = dx * dx + dz * dz;
      if (d2 < rr * rr && d2 > 1e-6) {
        const d = Math.sqrt(d2), push = (rr - d) * 0.5;
        const wa = b.def.boss ? 0.9 : a.def.boss ? 0.1 : 0.5;
        a.pos.x -= dx / d * push * wa * 2; a.pos.z -= dz / d * push * wa * 2;
        b.pos.x += dx / d * push * (1 - wa) * 2; b.pos.z += dz / d * push * (1 - wa) * 2;
      }
    }
    if (!a.def.fly) {
      if (player.alive) {
        const dx = player.pos.x - a.pos.x, dz = player.pos.z - a.pos.z;
        const rr = a.radius + player.radius;
        const d2 = dx * dx + dz * dz;
        if (d2 < rr * rr && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          player.pos.x = a.pos.x + dx / d * rr; player.pos.z = a.pos.z + dz / d * rr;
        }
      }
      collideWorld(a.pos, a.radius, false, !!a.def.leap);
    }
  }
  for (const e of list) {
    if (e.state === 'dying') continue;
    e.char.root.position.set(e.pos.x, e.pos.y, e.pos.z);
    e.char.root.rotation.y = e.facing;
    updateHpBar(e);
  }
}

function applyEnemyHit(e) {
  if (!e.alive) return;
  const t = e.atkTarget;
  const def = e.def;
  if (def.explode) {
    const c = new THREE.Vector3(e.pos.x, 0.8, e.pos.z);
    explode(c, 0, def.explode, { color: COL.spark });
    if (Math.hypot(player.pos.x - c.x, player.pos.z - c.z) < def.explode) hurtPlayer(e.dmg * 0.6);
    hurtRemoteNear(c.x, c.z, def.explode, e.dmg * 0.6);
    const hp = housePoint(c.x, c.z, V2);
    if (Math.hypot(hp.x - c.x, hp.z - c.z) < def.explode) hurtHouse(e.dmg, c);
    for (const s of structures.list) if (s.alive && s.piece.kind !== 'trap' && Math.hypot(s.x - c.x, s.z - c.z) < def.explode + 0.5) hitStructure(s, e.dmg * 1.5);
    killEnemy(e, false, true);
    return;
  }
  if (def.ranged) {
    const target = t === 'player' ? player.pos.clone().setY(1) : t === 'remote' && NET.remote ? NET.remote.pos.clone().setY(1) : t === 'house' ? housePoint(e.pos.x, e.pos.z, new THREE.Vector3()).setY(2) : new THREE.Vector3(t.x, 1.3, t.z);
    const from = new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.8, e.pos.z);
    if (def.bomb) {
      const drop = target.clone(); drop.y = 0;
      spitGlob(from.setY(e.pos.y - 0.2), drop, e, t, { bomb: true, splash: 3, T: 0.8, grav: 14, color: 0x2a2a2a, emissive: 0xff5020, size: 0.3 });
      sfx.spit();
      return;
    }
    if (def.rocket) {
      spitGlob(from, target, e, t, { bomb: true, splash: 2.6, T: Math.max(0.35, from.distanceTo(target) / 24), grav: 4, color: 0x6a7a3a, emissive: 0xff6a2a, size: 0.18, trail: true });
      sfx.shot('rocket');
      return;
    }
    if (def.beam) {
      tracers.spawn(from, target, def.beam, 0.07, 0.25);
      tracers.spawn(from, target, 0xffffff, 0.025, 0.25);
      sfx.shot('sniper');
      for (let k = 0; k < 6; k++) sparks.emit(target.x, target.y, target.z, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.25, 0.25, COL.red, 6);
      hitTarget(e, t, e.dmg);
      return;
    }
    if (def.fly) {
      tracers.spawn(from, target, 0xff4060, 0.08, 0.12);
      sfx.laser();
      for (let k = 0; k < 4; k++) sparks.emit(target.x, target.y, target.z, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.25, 0.25, COL.red, 6);
      hitTarget(e, t, e.dmg);
    } else spitGlob(from, target, e, t);
    return;
  }
  if (def.boss) { rings.spawn(e.pos, 4.5, 0xb070ff, 0.4); G.shake = Math.max(G.shake, 0.3); if (Math.hypot(player.pos.x - e.pos.x, player.pos.z - e.pos.z) < 4.5 && t !== 'player') hurtPlayer(e.dmg * 0.7); }
  hitTarget(e, t, e.dmg);
}

function hitTarget(e, t, dmg) {
  if (t === 'player') {
    const d = Math.hypot(player.pos.x - e.pos.x, player.pos.z - e.pos.z);
    if (d < (e.def.ranged || e.def.reach + player.radius + e.radius + 0.7) + 1) {
      hurtPlayer(dmg);
      if (e.def.slowOnHit) player.slowT = 2.5;
      if (e.def.burnOnHit) burnPlayer(e.dmg * 0.3, 3);
    }
  } else if (t === 'remote') {
    const R2 = NET.remote;
    if (R2 && R2.alive && Math.hypot(R2.pos.x - e.pos.x, R2.pos.z - e.pos.z) < (e.def.ranged || e.def.reach + player.radius + e.radius + 0.7) + 1) NET.hurtOut += dmg;
  } else if (t === 'house') hurtHouse(dmg, e.pos);
  else if (t && t.alive) hitStructure(t, dmg * (e.def.wallMult || 1));
}

function hitStructure(s, dmg) {
  const destroyed = structures.damage(s, dmg);
  sfx.fenceHit();
  for (let i = 0; i < 3; i++) smoke.emit(s.x + (Math.random() - 0.5) * 2, 1, s.z + (Math.random() - 0.5) * 2, 0, 1, 0, 0.5, 0.35, COL.wood, 6);
  if (destroyed) {
    sfx.fenceBreak();
    for (let i = 0; i < 24; i++) smoke.emit(s.x + (Math.random() - 0.5) * 2, 0.5 + Math.random() * 2, s.z + (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 6, 3 + Math.random() * 4, (Math.random() - 0.5) * 6, 1, 0.4, s.piece.id === 'metal' ? COL.white : COL.wood, 12);
    toast(`${s.piece.name} destroyed!`);
    for (const e of G.enemies) if (e.wall === s) e.wall = null;
  }
}

function spitGlob(from, to, e, t, o = {}) {
  if (!o.bomb) sfx.spit();
  const T = o.T || 0.9, grav = o.grav ?? 18;
  const vel = to.clone().sub(from).divideScalar(T);
  vel.y += 0.5 * grav * T;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(o.size || 0.22, 8, 6), new THREE.MeshStandardMaterial({ color: o.color || 0x9dff3a, emissive: o.emissive || 0x4aff1a, emissiveIntensity: o.bomb ? 0.6 : 1.2 }));
  mesh.position.copy(from);
  scene.add(mesh);
  G.globs.push({ mesh, vel, grav, dmg: e.dmg, target: t, life: 2.5, splash: o.splash || 0, trail: o.trail, wallMult: e.def.wallMult || 1 });
}

function updateGlobs(dt) {
  for (let i = G.globs.length - 1; i >= 0; i--) {
    const g = G.globs[i];
    g.vel.y -= g.grav * dt;
    g.mesh.position.addScaledVector(g.vel, dt);
    g.life -= dt;
    const p = g.mesh.position;
    if (g.splash) {
      if (g.trail) smoke.emit(p.x, p.y, p.z, 0, 0.4, 0, 0.5, 0.4, COL.smoke, 0, 1, 1.8);
      if (Math.random() < 0.6) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.2, 0.2, COL.fire);
    } else if (Math.random() < 0.6) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.3, 0.2, COL.acid);
    if (g.splash && (p.y <= 0.1 || houseBox.containsPoint(p) || g.life <= 0 || (structures.wallAt(p.x, p.z, 0.2) && p.y < 2.6))) {
      const c = p.clone(); c.y = Math.max(0.3, c.y);
      explode(c, 0, g.splash, { small: true });
      if (Math.hypot(player.pos.x - c.x, player.pos.z - c.z) < g.splash && c.y < 3.5) hurtPlayer(g.dmg);
      if (c.y < 3.5) hurtRemoteNear(c.x, c.z, g.splash, g.dmg);
      const hp = housePoint(c.x, c.z, V2);
      if (Math.hypot(hp.x - c.x, hp.z - c.z) < g.splash) hurtHouse(g.dmg, c);
      for (const s of structures.list) if (s.alive && s.piece.kind === 'wall' && Math.hypot(s.x - c.x, s.z - c.z) < g.splash + 0.6) hitStructure(s, g.dmg * g.wallMult);
      scene.remove(g.mesh);
      g.mesh.geometry.dispose();
      G.globs.splice(i, 1);
      continue;
    }
    const hitHouse = houseBox.containsPoint(p);
    const wall = structures.wallAt(p.x, p.z, 0.2);
    if (p.y <= 0.1 || hitHouse || (wall && p.y < 2.6) || g.life <= 0) {
      for (let k = 0; k < 10; k++) sparks.emit(p.x, Math.max(0.2, p.y), p.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.4, 0.3, COL.acid, 8);
      if (Math.hypot(player.pos.x - p.x, player.pos.z - p.z) < 1.8 && p.y < 2.5) hurtPlayer(g.dmg);
      if (p.y < 2.5) hurtRemoteNear(p.x, p.z, 1.8, g.dmg);
      const hp = housePoint(p.x, p.z, V2);
      if (hitHouse || Math.hypot(hp.x - p.x, hp.z - p.z) < 1.2) hurtHouse(g.dmg, p);
      if (wall && wall.alive) hitStructure(wall, g.dmg);
      scene.remove(g.mesh);
      g.mesh.geometry.dispose();
      G.globs.splice(i, 1);
    }
  }
}

function burnPlayer(dps, t) {
  if (!player.alive || player.shieldT > 0) return;
  player.burnT = Math.max(player.burnT, t);
  player.burnDps = Math.max(player.burnT > 0 ? player.burnDps : 0, dps);
}

function hurtPlayer(dmg, dot = false) {
  if (!player.alive || G.phase !== 'fight') return;
  if (player.shieldT > 0) { if (!dot) rings.spawn(player.pos, 1.5, 0x5cb8ff, 0.25); return; }
  dmg *= (1 - HS.armor) * Math.pow(0.9, PS.count('guard'));
  player.hp -= dmg;
  player.lastHurt = G.time;
  if (dot && player.hp > 0) return;
  G.shake = Math.max(G.shake, 0.25);
  sfx.hurt();
  player.char.flash(0.08);
  const v = $('vignette');
  v.style.transition = 'none'; v.style.opacity = 1;
  requestAnimationFrame(() => { v.style.transition = 'opacity .6s'; v.style.opacity = player.hp / player.maxHp < 0.3 ? 0.5 : 0; });
  if (player.hp <= 0) {
    if ((HS.perks.has('reboot') || HS.perks.has('undying')) && !player.rebootUsed) {
      player.rebootUsed = true;
      player.hp = player.maxHp * 0.5;
      player.shieldT = 2;
      player.burnT = 0;
      rings.spawn(player.pos, 6, HS.perks.has('undying') ? 0x9dff3a : 0x5cb8ff, 0.7);
      showBanner(HS.perks.has('undying') ? 'UNDYING' : 'REBOOT', HS.perks.has('undying') ? 'Zed rises again!' : 'Bolt is back online!', 'gold', 1.5);
      return;
    }
    player.hp = 0;
    player.alive = false;
    player.gunHolder.visible = false;
    player.char.die();
    if (net.linked) {
      player.respawnT = 10;
      showBanner('YOU ARE DOWN', 'Your partner has to hold on: respawning in 10s', 'red', 2.4);
      if (isHost() && !(NET.remote && NET.remote.alive)) failWave('player');
      return;
    }
    failWave('player');
  }
}

function hurtHouse(dmg, from) {
  if (G.phase !== 'fight') return;
  let mult = 1;
  if (save.hero === 'cyra') mult *= 0.9;
  if (HS.perks.has('ironwill')) mult *= 0.85;
  G.houseHp -= dmg * mult;
  G.houseLastHit = G.time;
  world.house.flash = 1;
  world.domeHit();
  sfx.houseHit();
  const px = clamp(from.x, -world.houseHalf.x, world.houseHalf.x), pz = clamp(from.z, -world.houseHalf.z, world.houseHalf.z);
  for (let i = 0; i < 6; i++) smoke.emit(px, 1 + Math.random() * 2, pz, (Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3, 0.6, 0.4, COL.dust, 5, 1);
  if (G.houseHp <= 0) {
    G.houseHp = 0;
    for (let i = 0; i < 5; i++) setTimeout(() => explode(new THREE.Vector3((Math.random() - 0.5) * 8, 2 + Math.random() * 4, (Math.random() - 0.5) * 6), 0, 1), i * 180);
    failWave('house');
  }
}

// ---------------------------------------------------------------- traps & turrets
function updateStructures(dt) {
  structures.update(dt);
  const vis = isGuest(); // the guest only animates the host's structures; damage happens on the host
  const tm = trapMult();
  for (const s of [...structures.list]) {
    if (!s.alive) continue;
    if (s.temporary && !vis) {
      s.life -= dt;
      if (s.life <= 0) { structures.removeStructure(s); for (let i = 0; i < 12; i++) sparks.emit(s.x, 1, s.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.4, 0.3, COL.blue, 6); continue; }
    }
    const p = s.piece;
    if (p.kind === 'pad') {
      const on = player.alive && Math.abs(player.pos.x - s.x) < 1.2 && Math.abs(player.pos.z - s.z) < 1.2;
      if (on && G.phase === 'fight' && player.hp < player.maxHp) {
        player.hp = Math.min(player.maxHp, player.hp + 12 * tm * dt);
        if (Math.random() < dt * 12) sparks.emit(player.pos.x + (Math.random() - 0.5), 0.3, player.pos.z + (Math.random() - 0.5), 0, 2.5, 0, 0.7, 0.3, COL.green, -1);
      }
      continue;
    }
    if (p.kind === 'turret' && p.style) {
      s.cooldown -= dt;
      const targets = G.enemies.filter(e => e.alive && e.spawnT <= 0 && !e.phased && Math.hypot(e.pos.x - s.x, e.pos.z - s.z) < p.range);
      const top = s.mesh.userData.top;
      if (top) top.rotation.y += dt * (targets.length ? 4 : 0.6);
      if (!targets.length || s.cooldown > 0 || G.phase !== 'fight' || vis) continue;
      s.cooldown = 1 / p.rate;
      const from = V1.set(s.x, s.mesh.userData.topY || 4, s.z).clone();
      if (p.style === 'tesla') {
        targets.sort((a, b) => Math.hypot(a.pos.x - s.x, a.pos.z - s.z) - Math.hypot(b.pos.x - s.x, b.pos.z - s.z));
        let prev = from;
        for (const e of targets.slice(0, p.chain)) {
          const to = new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.55, e.pos.z);
          bolts.spawn(prev, to, 0x9fd8ff, 0.14, 0.6);
          damageEnemy(e, p.dmg * tm, { point: to, src: 'trap' });
          if (e.alive) e.chill = { slow: 0.3, t: 0.6 };
          prev = to;
        }
        sfx.zap();
      } else {
        const t = targets.sort((a, b) => b.maxHp - a.maxHp)[0];
        const to = new THREE.Vector3(t.pos.x + t.speedNow * 0.3 * Math.sin(t.facing), 0.2, t.pos.z + t.speedNow * 0.3 * Math.cos(t.facing));
        const r = spawnRocket(from, to, p.dmg * tm, p.splash, 0xffc02e, { lob: true, big: true, src: 'trap' });
        s.recoil = 1;
        sfx.shot('rocket');
        for (let k = 0; k < 8; k++) smoke.emit(from.x, from.y, from.z, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.6, 0.6, COL.smoke, 0, 1, 2);
      }
      continue;
    }
    if (p.kind === 'trap') {
      let hit = false;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0 || e.def.fly) continue;
        if (Math.abs(e.pos.x - s.x) < 1.1 + e.radius * 0.4 && Math.abs(e.pos.z - s.z) < 1.1 + e.radius * 0.4) {
          if (!vis) damageEnemy(e, p.dps * tm * dt, { src: 'trap', quiet: true });
          if (p.slow) { e.trapSlow = Math.min(e.trapSlow, 1 - p.slow); if (Math.random() < dt * 5) sparks.emit(e.pos.x, 0.4, e.pos.z, 0, 1, 0, 0.5, 0.25, COL.ice, 0); }
          else if (p.burn) { if (e.alive && !vis) e.burn = { dps: p.dps * tm * 0.6, t: 2.5 }; }
          else { e.trapSlow = Math.min(e.trapSlow, 0.75); if (Math.random() < dt * 6) sparks.emit(e.pos.x, 0.3, e.pos.z, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.3, 0.2, COL.blood, 8); }
          hit = true;
        }
      }
      if (hit && !p.slow && !p.burn) s.pop = 1;
      if (p.burn && Math.random() < dt * (hit ? 30 : 6)) sparks.emit(s.x + (Math.random() - 0.5) * 1.6, 0.2, s.z + (Math.random() - 0.5) * 1.6, 0, 2 + Math.random() * 2, 0, 0.5, 0.35, COL.fire, -1);
    } else if (p.kind === 'turret') {
      const head = s.mesh.userData.head;
      const hy = head.position.y * s.mesh.scale.y;
      let best = null, bd = p.range;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0) continue;
        const d = Math.hypot(e.pos.x - s.x, e.pos.z - s.z);
        if (d < bd) { bd = d; best = e; }
      }
      if (!best) { head.rotation.y += dt * 0.5; continue; }
      const aim = Math.atan2(best.pos.x - s.x, best.pos.z - s.z);
      head.rotation.y = lerpAngle(head.rotation.y, aim, Math.min(1, dt * 10));
      head.userData.barrel.rotation.x = -Math.atan2(best.pos.y + best.height * 0.5 - hy, bd);
      s.cooldown -= dt;
      if (s.cooldown <= 0 && G.phase === 'fight' && !vis) {
        s.cooldown = 1 / p.rate;
        s.recoil = 1;
        const from = head.userData.muzzle.getWorldPosition(new THREE.Vector3());
        const to = new THREE.Vector3(best.pos.x, best.pos.y + best.height * 0.5, best.pos.z);
        tracers.spawn(from, to, 0x6fdcff, 0.05, 0.06);
        sparks.emit(from.x, from.y, from.z, 0, 0.5, 0, 0.08, 0.45, COL.blue);
        sfx.shot('turret');
        damageEnemy(best, p.dmg * tm, { point: to, src: 'trap' });
      }
    }
  }
}

// ---------------------------------------------------------------- coins
function dropCoins(pos, total, count) {
  total = Math.max(1, Math.round(total));
  count = Math.min(count, total);
  let left = total;
  for (let i = 0; i < count; i++) {
    const v = i === count - 1 ? left : Math.floor(total / count);
    left -= v;
    const m = cloneStatic('coin', { height: 0.5 });
    m.position.set(pos.x, Math.max(1, pos.y), pos.z);
    scene.add(m);
    const a = Math.random() * TAU, s = 1.5 + Math.random() * 2.5;
    G.coins.push({ mesh: m, vel: new THREE.Vector3(Math.cos(a) * s, 5 + Math.random() * 3, Math.sin(a) * s), value: v, state: 'drop', t: 0, spin: Math.random() * TAU });
  }
}

function updateCoins(dt, collectAll) {
  const magnet = HS.magnet + 5 * PS.count('magnet');
  for (let i = G.coins.length - 1; i >= 0; i--) {
    const c = G.coins[i];
    const p = c.mesh.position;
    c.t += dt;
    c.spin += dt * 4;
    c.mesh.rotation.y = c.spin;
    let tgt = player.pos, tAlive = player.alive;
    const RMc = NET.remote;
    if (RMc && RMc.alive && (!player.alive || RMc.pos.distanceTo(p) < player.pos.distanceTo(p))) { tgt = RMc.pos; tAlive = true; }
    const tx = tgt.x - p.x, ty = (tgt.y || 0) + 1 - p.y, tz = tgt.z - p.z;
    const d = Math.hypot(tx, ty, tz);
    if (c.state !== 'fly' && c.t > 0.4 && tAlive && (d < magnet || collectAll)) c.state = 'fly';
    if (c.state !== 'fly') {
      if (c.state === 'drop') {
        c.vel.y -= 20 * dt;
        p.addScaledVector(c.vel, dt);
        if (p.y < 0.1) { p.y = 0.1; c.vel.y *= -0.35; c.vel.x *= 0.6; c.vel.z *= 0.6; if (Math.abs(c.vel.y) < 0.8) c.state = 'rest'; }
      } else p.y = 0.15 + Math.sin(c.t * 3 + c.spin) * 0.1;
    } else {
      const sp = 6 + c.t * 14;
      p.x += tx / d * sp * dt; p.y += ty / d * sp * dt; p.z += tz / d * sp * dt;
      if (d < 0.8) {
        save.coins += c.value;
        G.runCoins += c.value;
        NET.coinsOut += c.value;
        if (tgt === player.pos) sfx.coin();
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
  for (const list of [G.rockets, G.globs, G.grenades]) { for (const r of list) scene.remove(r.mesh); list.length = 0; }
  G.novaQueue.length = 0;
  G.clouds.length = 0;
  clearGhosts();
  sparks.clear(); smoke.clear(); tracers.clear(); dmgNums.clear(); bolts.clear(); rings.clear();
  for (const pt of world.portals) { pt.warnTarget = 0; pt.laneShow = 0; }
}

// A run starts at the base and keeps going wave after wave until you (or the house) fall.
function startWave(fresh = true) {
  const n = curWave();
  if (fresh) {
    clearArena();
    applyUpgradesToWorld();
    structures.resetForWave(wallMult());
    G.houseHp = G.houseMax;
    resetPlayer();
    setupPet();
    resetPet();
    equipWeapon(save.equipped, true);
    if (!isGuest()) G.runId = (G.runId || 0) + 1;
    G.run = { startWave: n, kills: 0, coins: 0, xpStart: { weapon: weaponRec().level, hero: heroRec().level, pet: petRec().level } };
    G.kills = 0;
    G.runCoins = 0;
  } else {
    // next wave in the same run: heal up, repair, rebuild walls
    const oldMax = G.houseMax;
    applyUpgradesToWorld();
    G.houseHp = Math.min(G.houseMax, G.houseHp + (G.houseMax - oldMax) + G.houseMax * 0.35);
    structures.resetForWave(wallMult());
    player.hp = player.maxHp;
    player.charges = HS.perks.has('doubledash') ? 2 : 1;
    player.abilityCd = 0;
    player.gunHolder.visible = true;
    player.reloadT = 0;
    player.rebootUsed = false; player.burnT = 0; player.slowT = 0;
    if (!player.alive) respawnPlayer();
    G.clouds.length = 0;
    if (player.char.play) player.char.play('Idle', 0.2);
  }
  refillAmmo();
  updateWeaponHud(true);
  G.queue = isGuest() ? [] : buildWave(n);
  G.spawnT = 0;
  G.hitCount = 0;
  G.houseLastHit = -10;
  world.setActivePortals(portalCount(n));
  const sum = waveSummary(n);
  for (const pt of world.portals) { pt.laneShow = sum.portals.includes(pt.index) ? 1 : 0; pt.warnTarget = pt.laneShow; }
  G.state = 'playing';
  G.phase = 'countdown';
  G.phaseT = fresh ? 4 : 3;
  G.lastCount = 6;
  showScreen(null);
  $('hud').classList.remove('hidden');
  $('touch').classList.toggle('hidden', !input.isTouch);
  $('bossWrap').classList.add('hidden');
  input.setEnabled(true);
  $('waveLabel').textContent = `WAVE ${n}`;
  const from = sum.portals.map(i => COMPASS[i]).join(', ');
  showBanner(`WAVE ${n}`, `${sum.total} enemies incoming from ${from}`, isBossWave(n) ? 'red' : '', fresh ? 3.2 : 2.2);
  sfx.waveStart();
  updateHud(true);
  updateHeroHud();
  checkRotate();
  writeSave(true);
  $('fpBtn').classList.toggle('on', !!save.settings.fp);
  if (fresh) {
    $('desktopHint').classList.toggle('hidden', input.isTouch);
    if (!input.isTouch) setTimeout(() => $('desktopHint').classList.add('hidden'), 7000);
  }
}

function updateWave(dt) {
  if (isGuest()) { updateGuestWave(dt); return; }
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
      const s = G.queue.shift();
      spawnEnemy(s.type, s.portal);
      G.spawnT = Math.max(0.3, 1.5 - n * 0.045) * (0.7 + Math.random() * 0.6);
    }
    const upcoming = G.queue.slice(0, 4).map(s => s.portal);
    for (const pt of world.portals) {
      const idx = upcoming.indexOf(pt.index);
      pt.warnTarget = idx === 0 ? 1 : idx > 0 ? 0.55 : 0;
      pt.laneShow = idx >= 0 ? (idx === 0 ? 1 : 0.5) : 0;
    }
    const regen = (HS.perks.has('basekit') ? 6 : 0) + 5 * PS.count('repair');
    G.houseHp = Math.min(G.houseMax, G.houseHp + regen * dt);
    if (!G.queue.length && !G.enemies.some(e => e.alive)) waveCleared();
    return;
  }
  if (G.phase === 'cleared') {
    G.phaseT -= dt;
    if (G.phaseT <= 0) startWave(false);
    return;
  }
  if (G.phase === 'failed') {
    G.phaseT -= dt;
    if (G.phaseT <= 0) showResults();
  }
}

function processNovas() {
  let guard = 0;
  while (G.novaQueue.length && guard++ < 6) {
    const n = G.novaQueue.shift();
    explode(n.pos, n.dmg, n.r, { src: 'weapon', small: true, noAbilities: true, color: COL.purple });
  }
}

function waveCleared() {
  G.phase = 'cleared';
  G.phaseT = 1.5;
  const bonus = waveBonus(save.wave);
  save.coins += bonus;
  G.runCoins += bonus;
  NET.coinsOut += bonus;
  save.wave++;
  save.best = Math.max(save.best, save.wave);
  writeSave(true);
  // no reward screen between waves: the run just keeps going
  for (const pt of world.portals) { pt.warnTarget = 0; pt.laneShow = 0; }
}

function failWave(reason) {
  if (G.phase !== 'fight' && G.phase !== 'countdown') return;
  G.phase = 'failed';
  G.phaseT = 3;
  G.failReason = reason;
  writeSave(true);
  sfx.defeat();
  const title = { house: 'HOUSE DESTROYED', player: 'YOU WERE DEFEATED', quit: 'RUN ENDED' }[reason];
  showBanner(title, 'Back to base to swap gear and try again', 'red', 2.8);
  input.setEnabled(false);
}

function showResults() {
  $('lockHint').classList.add('hidden');
  for (const c of G.coins) { save.coins += c.value; G.runCoins += c.value; NET.coinsOut += c.value; scene.remove(c.mesh); }
  G.coins.length = 0;
  writeSave(true);
  const cw = curWave();
  const cleared = cw - G.run.startWave;
  $('resTitle').textContent = G.failReason === 'left' ? 'CO-OP ENDED' : `WAVE ${cw} FAILED`;
  $('resSub').textContent = G.failReason === 'left' ? 'Your partner left the game. You keep every coin and all XP.' : cleared > 0
    ? `You cleared ${cleared} wave${cleared > 1 ? 's' : ''} this run. You keep every coin and all XP. Swap gear and retry wave ${cw}!`
    : `You keep every coin and all XP. Swap your gear, build defenses and retry wave ${cw}!`;
  $('resKills').textContent = G.kills;
  $('resCoins').textContent = G.runCoins;
  $('resBonus').textContent = cleared;
  $('resTotal').textContent = save.coins.toLocaleString();
  const rows = [];
  rows.push(levelRow(heroDef().name, G.run.xpStart.hero, heroRec().level, heroRec()));
  rows.push(levelRow(curWeapon().name, G.run.xpStart.weapon, weaponRec().level, weaponRec()));
  rows.push(levelRow(petDef().name, G.run.xpStart.pet, petRec().level, petRec()));
  $('resLevels').innerHTML = rows.join('');
  $('resBtn').textContent = 'TO THE BASE';
  G.phase = 'results';
  showScreen('results');
  $('hud').classList.add('hidden');
  $('touch').classList.add('hidden');
}

function levelRow(name, from, to, rec) {
  const r = rarityOf(to);
  const pct = to >= MAX_LEVEL ? 100 : Math.round(rec.xp / xpToNext(to) * 100);
  return `<div class="lvrow"><span class="rname" style="color:${r.css}">${name}</span><span class="lv">Lv ${from}${to > from ? ` → <b>${to}</b>` : ''} · ${r.name}</span><div class="xpbar"><i style="width:${pct}%;background:${r.css}"></i></div></div>`;
}

function goToShop() {
  clearArena();
  if (NET.usingHostBase) { NET.usingHostBase = false; NET.structKey = ''; structures.loadFrom(save.structures); }
  G.state = 'shop';
  G.phase = 'idle';
  input.setEnabled(false);
  applyUpgradesToWorld();
  structures.resetForWave(wallMult());
  setupHeroModel();
  resetPlayer();
  setupPet();
  resetPet();
  if (player.char.play) player.char.play(save.wave > 1 ? 'Idle' : 'Wave', 0.2);
  world.setActivePortals(0);
  $('hud').classList.add('hidden');
  $('touch').classList.add('hidden');
  updateThumbs();
  shop.render();
  showScreen('shop');
  syncShopCoop();
}

// ---------------------------------------------------------------- edit mode
function enterBuild() {
  if (isGuest()) { toast('The host builds the base in 2 player'); return; }
  G.state = 'build';
  showScreen('buildUI');
  buildMode.enter();
  const sum = waveSummary(save.wave);
  world.setActivePortals(portalCount(save.wave));
  for (const pt of world.portals) { pt.laneShow = sum.portals.includes(pt.index) ? 1 : 0; pt.warnTarget = pt.laneShow; }
  $('buildWarn').textContent = `Wave ${save.wave}: ${sum.total} enemies from ${sum.portals.map(i => COMPASS[i]).join(', ')} (red arrows)`;
  renderBuildPalette();
  updateBuildHud();
}

function exitBuild() {
  buildMode.exit();
  for (const pt of world.portals) { pt.laneShow = 0; pt.warnTarget = 0; }
  world.setActivePortals(0);
  save.structures = structures.serialize();
  writeSave();
  G.state = 'shop';
  shop.render();
  showScreen('shop');
}

function renderBuildPalette() {
  $('buildPalette').innerHTML = BUILD_PIECES.map(p => `<button class="bpiece ${buildMode.selected === p.id ? 'sel' : ''} ${save.coins < p.cost ? 'poor' : ''}" data-piece="${p.id}">
    <img src="${G.thumbs['piece_' + p.id] || ''}" alt=""><span class="bname">${p.name}</span><span class="bcost"><span class="coin-ico"></span>${p.cost}</span></button>`).join('');
}

function updateBuildHud() {
  $('buildCoins').textContent = save.coins.toLocaleString();
  $('buildCount').textContent = `${structures.list.filter(s => !s.temporary).length} / 48 built`;
  const p = pieceById(buildMode.selected);
  $('buildHint').textContent = p ? `${p.name}: ${p.desc}` : 'Pick a piece, then tap the ground.';
}

// ---------------------------------------------------------------- HUD
let hudCache = {};
function setText(id, v) { if (hudCache[id] !== v) { hudCache[id] = v; $(id).textContent = v; } }
function setWidth(id, f) { const v = (clamp(f, 0, 1) * 100).toFixed(1) + '%'; if (hudCache[id] !== v) { hudCache[id] = v; $(id).style.width = v; } }

function updateWeaponHud(force) {
  const w = curWeapon();
  if (!w) return;
  const st = curStats();
  const a = player.ammo[w.id] ?? st.mag;
  const rec = weaponRec();
  const r = rarityOf(rec.level);
  if (force || hudCache.wr !== r.css) { hudCache.wr = r.css; $('weaponName').style.color = r.css; $('weaponXp').style.background = r.css; }
  setText('weaponName', w.name.toUpperCase());
  setText('weaponLv', `Lv ${rec.level} · ${r.name}`);
  setText('ammoText', String(a));
  setText('magText', String(st.mag));
  setWidth('weaponXp', rec.level >= MAX_LEVEL ? 1 : rec.xp / xpToNext(rec.level));
  $('ammoText').classList.toggle('low', a <= Math.ceil(st.mag * 0.25));
}

function updateHeroHud() {
  const h = heroDef(), rec = heroRec(), r = rarityOf(rec.level);
  $('heroName').textContent = `${h.name} · Lv ${rec.level}`;
  $('heroName').style.color = r.css;
  const pd = petDef(), prc = petRec(), pr = rarityOf(prc.level);
  $('petName').textContent = `${pd.name} · Lv ${prc.level}`;
  $('petName').style.color = pr.css;
  $('abilityName').textContent = h.active.name;
  $('abilityBtn').style.setProperty('--rc', r.css);
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
  setText('enemyText', String(G.queue.length + G.enemies.filter(e => e.alive).length));
  updateWeaponHud();
  const rb = $('reloadBar');
  if (player.reloadT > 0) {
    rb.classList.add('on');
    $('reloadFill').style.width = ((1 - player.reloadT / (player.reloadMax || 1)) * 100).toFixed(0) + '%';
  } else rb.classList.remove('on');
  $('crosshair').style.setProperty('--s', (10 + curWeapon().spread * 300 + player.bloom * 8).toFixed(0) + 'px');
  $('houseAlert').classList.toggle('on', G.time - G.houseLastHit < 1.2 && G.phase === 'fight');
  const cdFrac = player.charges > 0 ? 0 : clamp(player.abilityCd / heroDef().active.cd, 0, 1);
  const ab = $('abilityBtn');
  ab.style.setProperty('--cd', (cdFrac * 360).toFixed(0) + 'deg');
  ab.classList.toggle('ready', player.charges > 0);
  setText('abilityCharges', player.charges > 1 ? '×' + player.charges : '');
  const next = G.queue[0];
  if (G.phase === 'countdown') setText('incomingText', `Starting in ${Math.ceil(G.phaseT)}…`);
  else if (next && G.phase === 'fight') setText('incomingText', `⚠ Next: ${ENEMIES[next.type].name} from ${COMPASS[next.portal]}`);
  else setText('incomingText', G.phase === 'fight' ? 'Final enemies!' : '');
  const bosses = G.enemies.filter(e => e.def.boss && e.alive);
  if (bosses.length) {
    $('bossWrap').classList.remove('hidden');
    const hp = bosses.reduce((s, b) => s + Math.max(0, b.hp), 0), max = bosses.reduce((s, b) => s + b.maxHp, 0);
    setWidth('bossFill', hp / max);
    setText('bossName', [...new Set(bosses.map(b => b.def.name.toUpperCase()))].join(' + '));
  } else $('bossWrap').classList.add('hidden');
  updateOffscreen();
  drawMinimap();
  if (!input.isTouch) $('lockHint').classList.toggle('hidden', !!document.pointerLockElement || G.phase === 'results' || G.phase === 'failed');
}

const arrows = [];
function updateOffscreen() {
  const box = $('offscreen');
  if (!arrows.length) for (let i = 0; i < 8; i++) { const a = document.createElement('div'); a.className = 'offarrow'; a.style.display = 'none'; box.appendChild(a); arrows.push(a); }
  const w = window.innerWidth, h = window.innerHeight;
  const items = [];
  for (const pt of world.portals) if (pt.warnTarget >= 1 && G.phase === 'fight') items.push({ p: pt.pos.clone().setY(3.8), cls: 'offarrow warn' });
  for (const e of G.enemies) if (e.alive && e.spawnT <= 0 && (e.state !== 'walk' || e.def.boss || Math.hypot(e.pos.x, e.pos.z) < 18)) items.push({ p: new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.6, e.pos.z), cls: 'offarrow' });
  let k = 0;
  for (const it of items) {
    if (k >= arrows.length) break;
    const cam = V2.copy(it.p).applyMatrix4(camera.matrixWorldInverse);
    const ndc = V1.copy(it.p).project(camera);
    if (cam.z < 0 && Math.abs(ndc.x) < 1 && Math.abs(ndc.y) < 1) continue;
    let x = cam.x;
    const y = cam.y;
    if (cam.z > 0 && Math.abs(x) < 0.01) x = 0.01;
    const ang = Math.atan2(x, y);
    const rx = w * 0.5 - 44, ry = h * 0.5 - 56;
    const s = Math.min(rx / Math.abs(Math.sin(ang) || 1e-3), ry / Math.abs(Math.cos(ang) || 1e-3));
    const a = arrows[k++];
    a.className = it.cls;
    a.style.display = 'block';
    a.style.transform = `translate(${w / 2 + Math.sin(ang) * s - 12}px, ${h / 2 - Math.cos(ang) * s - 12}px) rotate(${ang}rad)`;
  }
  for (; k < arrows.length; k++) arrows[k].style.display = 'none';
}

let mapCtx = null;
function drawMinimap() {
  const c = $('minimap');
  if (!mapCtx) { const d = Math.min(2, window.devicePixelRatio || 1); c.width = (c.clientWidth || 110) * d; c.height = (c.clientHeight || 110) * d; mapCtx = c.getContext('2d'); }
  const g = mapCtx, W = c.width, R = W / 2, u = W / 130;
  const k = R / 70;
  g.clearRect(0, 0, W, W);
  g.save();
  g.beginPath(); g.arc(R, R, R - 1, 0, TAU); g.clip();
  g.fillStyle = 'rgba(16,10,36,0.72)'; g.fillRect(0, 0, W, W);
  g.translate(R, R);
  g.rotate(player.yaw);
  const tx = (x) => (x - player.pos.x) * k, tz = (z) => (z - player.pos.z) * k;
  for (const pt of world.portals) {
    const px = tx(pt.pos.x), pz = tz(pt.pos.z);
    g.strokeStyle = pt.laneShow > 0 ? `rgba(255,70,90,${0.35 + 0.5 * pt.laneShow})` : 'rgba(160,120,90,0.35)';
    g.lineWidth = 3 * u;
    g.beginPath(); g.moveTo(px, pz); g.lineTo(tx(Math.cos(pt.angle) * 12), tz(Math.sin(pt.angle) * 12)); g.stroke();
    const pulse = pt.warnTarget > 0 ? 1 + 0.35 * Math.sin(G.time * 8) : 1;
    g.fillStyle = pt.warnTarget >= 1 ? '#ff4d5e' : pt.active ? '#b070ff' : 'rgba(120,90,160,0.6)';
    g.beginPath(); g.arc(px, pz, 5 * pulse * u, 0, TAU); g.fill();
  }
  g.fillStyle = '#3ce0ff';
  const hx = world.houseHalf.x * k, hz = world.houseHalf.z * k;
  g.fillRect(tx(0) - hx, tz(0) - hz, hx * 2, hz * 2);
  g.fillStyle = 'rgba(210,220,235,0.85)';
  for (const s of structures.list) if (s.alive && s.piece.kind !== 'trap') g.fillRect(tx(s.x) - s.hx * k, tz(s.z) - s.hz * k, Math.max(1.5, s.hx * 2 * k), Math.max(1.5, s.hz * 2 * k));
  for (const e of G.enemies) {
    if (!e.alive) continue;
    g.fillStyle = e.def.boss ? '#ff40ff' : e.def.fly ? '#ffa23a' : '#ff4d5e';
    g.beginPath(); g.arc(tx(e.pos.x), tz(e.pos.z), (e.def.boss ? 5 : 2.6) * u, 0, TAU); g.fill();
  }
  g.restore();
  g.fillStyle = '#fff';
  g.beginPath(); g.moveTo(R, R - 7 * u); g.lineTo(R + 5 * u, R + 5 * u); g.lineTo(R - 5 * u, R + 5 * u); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 2; g.beginPath(); g.arc(R, R, R - 1, 0, TAU); g.stroke();
}

let bannerT = null;
function showBanner(title, sub, cls, dur, color) {
  const b = $('banner');
  $('bannerTitle').textContent = title;
  $('bannerTitle').className = cls || '';
  $('bannerTitle').style.color = color || '';
  $('bannerSub').textContent = sub || '';
  b.classList.add('show');
  clearTimeout(bannerT);
  bannerT = setTimeout(() => b.classList.remove('show'), dur * 1000);
}

// ---------------------------------------------------------------- screens
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('show', s.id === id));
}
function showModal(id) { $(id).classList.add('show'); }
function hideModal(id) { $(id).classList.remove('show'); }

function openMenu() {
  G.state = 'menu';
  clearArena();
  applyUpgradesToWorld();
  setupHeroModel();
  resetPlayer();
  setupPet();
  resetPet();
  world.setActivePortals(0);
  const h = heroDef(), hr = heroRec();
  $('menuStats').innerHTML = save.wave > 1 || save.kills > 0
    ? `<div>Wave <b>${save.wave}</b></div><div>Best <b>${Math.max(0, save.best - 1)}</b> cleared</div><div>${h.name} <b>Lv ${hr.level}</b></div>`
    : '';
  $('playBtn').textContent = save.wave > 1 ? `CONTINUE · WAVE ${save.wave}` : 'PLAY';
  showScreen('menu');
  checkRotate();
}

function pauseGame() {
  if (G.state !== 'playing' || !['countdown', 'fight'].includes(G.phase)) return;
  if (net.linked) { confirmBox('Leave 2 player?', 'There is no pausing in 2 player: the fight keeps going while this is open.', () => leaveCoop()); return; }
  G.state = 'paused';
  input.setEnabled(false);
  writeSave(true);
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
  click('startWaveBtn', () => { if (isGuest()) return; if (input.isTouch) requestFullscreen(); startWave(); });
  click('coopBtn', () => openCoop());
  click('shopCoopBtn', () => openCoop());
  click('buildBtn', () => enterBuild());
  click('buildDone', () => exitBuild());
  click('shopHomeBtn', () => openMenu());
  click('resBtn', () => goToShop());
  click('pauseBtn', () => pauseGame());
  click('resumeBtn', () => resumeGame());
  click('pauseSettingsBtn', () => { syncSettingsUi(); showModal('settings'); });
  click('quitBtn', () => confirmBox('End this run?', 'You go back to the base and keep all coins and XP. You will retry the wave you are on.', () => {
    hideModal('pause');
    G.state = 'playing';
    G.phase = 'fight';
    failWave('quit');
    G.phaseT = 0.01;
  }));
  click('rotateDismiss', () => { rotateDismissed = true; checkRotate(); });
  click('fullscreenBtn', () => { if (document.fullscreenElement) document.exitFullscreen?.(); else requestFullscreen(); });
  click('resetBtn', () => confirmBox('Reset progress?', 'This erases all waves, coins, levels and buildings.', () => {
    clearSave();
    const settings = save.settings;
    save = defaultSave();
    save.settings = settings;
    writeSave(true);
    player.ammo = {};
    onSaveReplaced();
    hideModal('settings');
    openMenu();
    toast('Progress reset');
  }));
  $('buildPalette').addEventListener('click', (e) => {
    const b = e.target.closest('[data-piece]');
    if (!b) return;
    sfx.click();
    buildMode.selected = b.dataset.piece;
    buildMode.setGhostPiece(buildMode.selected);
    renderBuildPalette();
    updateBuildHud();
  });
  click('ctxRotate', () => { const s = buildMode.focus; if (!s) return; const n = structures.rotateAt(s.i, s.j); structures.resetForWave(wallMult()); buildMode.select(n); save.structures = structures.serialize(); writeSave(); });
  click('ctxSell', () => {
    const s = buildMode.focus; if (!s) return;
    structures.removeAt(s.i, s.j);
    save.coins += s.piece.cost;
    sfx.sell();
    buildMode.select(null);
    save.structures = structures.serialize();
    writeSave();
    renderBuildPalette(); updateBuildHud();
  });
  click('ctxClose', () => buildMode.select(null));
  $('sensRange').addEventListener('input', (e) => { save.settings.sens = +e.target.value; $('sensVal').textContent = save.settings.sens.toFixed(2); writeSave(); });
  $('soundChk').addEventListener('change', (e) => { save.settings.sound = e.target.checked; sfx.enabled = e.target.checked; writeSave(); });
  $('autoChk').addEventListener('change', (e) => { save.settings.autofire = e.target.checked; writeSave(); });
  $('qualitySel').addEventListener('change', (e) => {
    save.settings.quality = e.target.value;
    writeSave(true);
    const q = qualityProfile(e.target.value);
    pixelRatio = q.pr;
    resize();
    if (q.shadows !== Q.shadows || q.bloom !== Q.bloom || q.aa !== Q.aa) toast('Reload the page to fully apply graphics changes');
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { pauseGame(); writeSave(true); } });
  window.addEventListener('pagehide', () => writeSave(true));
  window.addEventListener('pointerdown', () => sfx.unlock(), { passive: true });
}

// ---------------------------------------------------------------- co-op (2 players)
// Host = the real simulation. Guest = its own hero/pet + a mirror of everything else.
// Both sides share: players, pets, projectiles, fx (tracers, bolts, rings, explosions),
// clouds, coins and (host -> guest) enemies, base, house and wave state.
const nowS = () => performance.now() / 1000;
const INTERP = 0.13;
const r1 = (v) => Math.round(v * 10);
const r2 = (v) => Math.round(v * 100);
const colHex = (c) => (c && c.isColor ? c.getHex() : c) | 0;

// ---- interpolation buffers: [t, a, b, c, ...]
function bufPush(buf, t, vals) {
  if (buf.length && t - buf[buf.length - 1][0] < 0.004) buf[buf.length - 1] = [t, ...vals];
  else buf.push([t, ...vals]);
  if (buf.length > 10) buf.shift();
}
// angleIdx: indices (into vals) that are angles
function bufSample(buf, t, out, angleIdx = []) {
  if (!buf.length) return false;
  let a = buf[0], b = buf[0];
  if (t >= buf[buf.length - 1][0]) a = b = buf[buf.length - 1];
  else if (t > buf[0][0]) {
    for (let i = 1; i < buf.length; i++) if (buf[i][0] >= t) { a = buf[i - 1]; b = buf[i]; break; }
  }
  const span = b[0] - a[0];
  const k = span > 1e-4 ? clamp((t - a[0]) / span, 0, 1) : 1;
  for (let i = 1; i < a.length; i++) {
    out[i - 1] = angleIdx.includes(i - 1) ? lerpAngle(a[i], b[i], k) : a[i] + (b[i] - a[i]) * k;
  }
  return true;
}

// ---- fx replication (wrap the fx pools so every tracer/bolt/ring/explosion is mirrored)
const fxOut = [];
let fxSeq = 0, fxReplay = false, fxSeen = 0;
function fxRecord(ev) {
  if (fxReplay || !net.linked || G.state !== 'playing') return;
  fxOut.push([nowS(), ++fxSeq, ...ev]);
  if (fxOut.length > 40) fxOut.shift();
}
{
  const tr = tracers.spawn.bind(tracers);
  tracers.spawn = (a, b, c = 0xffe08a, w = 0.05, l = 0.08) => { fxRecord(['t', r1(a.x), r1(a.y), r1(a.z), r1(b.x), r1(b.y), r1(b.z), colHex(c), r2(w), r2(l)]); return tr(a, b, c, w, l); };
  const bo = bolts.spawn.bind(bolts);
  bolts.spawn = (a, b, c = 0xbfe6ff, l = 0.18, j = 0.6) => { fxRecord(['b', r1(a.x), r1(a.y), r1(a.z), r1(b.x), r1(b.y), r1(b.z), colHex(c), r2(l), r2(j)]); return bo(a, b, c, l, j); };
  const ri = rings.spawn.bind(rings);
  rings.spawn = (p, r, c = 0xffffff, l = 0.5) => { fxRecord(['r', r1(p.x), r1(p.y || 0), r1(p.z), r1(r), colHex(c), r2(l)]); return ri(p, r, c, l); };
}
function fxPlay(list) {
  if (!Array.isArray(list)) return;
  let max = fxSeen;
  fxReplay = true;
  try {
    for (const ev of list) {
      if (!Array.isArray(ev) || ev[0] <= fxSeen) continue;
      max = Math.max(max, ev[0]);
      const k = ev[1];
      if (k === 't') tracers.spawn(V1.set(ev[2] / 10, ev[3] / 10, ev[4] / 10), V2.set(ev[5] / 10, ev[6] / 10, ev[7] / 10), ev[8], ev[9] / 100, ev[10] / 100);
      else if (k === 'b') bolts.spawn(new THREE.Vector3(ev[2] / 10, ev[3] / 10, ev[4] / 10), new THREE.Vector3(ev[5] / 10, ev[6] / 10, ev[7] / 10), ev[8], ev[9] / 100, ev[10] / 100);
      else if (k === 'r') rings.spawn(V1.set(ev[2] / 10, ev[3] / 10, ev[4] / 10), ev[5] / 10, ev[6], ev[7] / 100);
      else if (k === 'x') explode(new THREE.Vector3(ev[2] / 10, ev[3] / 10, ev[4] / 10), 0, ev[5] / 10, { small: !!ev[6], color: new THREE.Color(ev[7]) });
      else if (k === 'z') { sfx.zap(); }
    }
  } finally { fxReplay = false; }
  fxSeen = max;
}
function fxPack() {
  const t = nowS();
  while (fxOut.length && t - fxOut[0][0] > 0.4) fxOut.shift();
  return fxOut.slice(-14).map(e => e.slice(1));
}

// ---- projectiles, clouds, coins as shared lists
let projSeq = 1;
const PK = { rocket: 0, lob: 1, shell: 2, plasma: 3, glob: 4, bomb: 5, erocket: 6, nade: 7 };
function projPack() {
  const out = [];
  for (const r of G.rockets) { if (!r.nid) r.nid = projSeq++; out.push([r.nid, r.plasma ? PK.plasma : r.gravity ? (r.src === 'trap' ? PK.shell : PK.lob) : PK.rocket, r1(r.mesh.position.x), r1(r.mesh.position.y), r1(r.mesh.position.z)]); }
  for (const g of G.globs) { if (!g.nid) g.nid = projSeq++; out.push([g.nid, g.splash ? (g.trail ? PK.erocket : PK.bomb) : PK.glob, r1(g.mesh.position.x), r1(g.mesh.position.y), r1(g.mesh.position.z)]); }
  for (const g of G.grenades) { if (!g.nid) g.nid = projSeq++; out.push([g.nid, PK.nade, r1(g.mesh.position.x), r1(g.mesh.position.y), r1(g.mesh.position.z)]); }
  return out.slice(0, 24);
}
const ghostProj = new Map();
function makeGhostProj(kind) {
  let m;
  const std = (c, e, ei = 1) => new THREE.MeshStandardMaterial({ color: c, emissive: e, emissiveIntensity: ei });
  if (kind === PK.plasma) {
    m = new THREE.Group();
    m.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })));
    m.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), new THREE.MeshBasicMaterial({ color: 0xa060ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })));
  } else if (kind === PK.rocket || kind === PK.erocket) {
    m = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8), std(0x6a7a3a, 0x000000, 0));
    body.rotation.x = Math.PI / 2;
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), std(0xff6a3a, 0xff6a3a));
    tip.rotation.x = Math.PI / 2; tip.position.z = 0.37;
    m.add(body, tip);
  } else if (kind === PK.glob) m = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), std(0x9dff3a, 0x4aff1a, 1.2));
  else if (kind === PK.bomb) m = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), std(0x2a2a2a, 0xff5020, 0.6));
  else if (kind === PK.shell) m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), std(0x3a3a3a, 0xffc02e, 0.25));
  else m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), std(0x3a5a2a, 0xff8a2a, 0.25));
  scene.add(m);
  return { mesh: m, kind, buf: [], last: new THREE.Vector3(), seen: 0 };
}
function syncGhostProj(list, t) {
  const seen = new Set();
  for (const a of list || []) {
    if (!Array.isArray(a)) continue;
    const [id, kind, x, y, z] = a;
    seen.add(id);
    let g = ghostProj.get(id);
    if (!g) { g = makeGhostProj(kind); ghostProj.set(id, g); }
    bufPush(g.buf, t, [x / 10, y / 10, z / 10]);
  }
  for (const [id, g] of ghostProj) if (!seen.has(id)) { g.gone = (g.gone || 0) + 1; if (g.gone > 1) { disposeGhost(g); ghostProj.delete(id); } } else g.gone = 0;
}
function disposeGhost(g) {
  scene.remove(g.mesh);
  g.mesh.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
}
const SMP = [0, 0, 0, 0, 0, 0, 0, 0];
function updateGhostProj(t) {
  for (const g of ghostProj.values()) {
    if (!bufSample(g.buf, t, SMP)) continue;
    const p = g.mesh.position;
    g.last.copy(p);
    p.set(SMP[0], SMP[1], SMP[2]);
    if (g.kind === PK.rocket || g.kind === PK.erocket) {
      if (p.distanceToSquared(g.last) > 1e-4) g.mesh.lookAt(V1.copy(p).sub(g.last).add(p));
      smoke.emit(p.x, p.y, p.z, 0, 0.4, 0, 0.5, 0.4, COL.smoke, 0, 1, 1.8);
      sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.12, 0.35, COL.fire);
    } else if (g.kind === PK.plasma) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.3, 0.5, COL.purple, 0);
    else if (g.kind === PK.glob) { if (Math.random() < 0.6) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.3, 0.2, COL.acid); }
    else if (Math.random() < 0.6) sparks.emit(p.x, p.y, p.z, 0, 0, 0, 0.2, 0.18, COL.fire);
    if (g.kind !== PK.rocket && g.kind !== PK.erocket) g.mesh.rotation.x += 0.2;
  }
}
function clearGhosts() {
  for (const g of ghostProj.values()) disposeGhost(g);
  ghostProj.clear();
  ghostClouds.length = 0;
  for (const c of ghostCoins.values()) scene.remove(c.mesh);
  ghostCoins.clear();
}

const ghostClouds = [];
function cloudPack() { return G.clouds.slice(0, 8).map(c => [r1(c.pos.x), r1(c.pos.z), r1(c.r), c.friendly ? 1 : 0]); }
function syncGhostClouds(list) {
  ghostClouds.length = 0;
  for (const a of list || []) if (Array.isArray(a)) ghostClouds.push({ x: a[0] / 10, z: a[1] / 10, r: a[2] / 10, friendly: !!a[3] });
}
function updateGhostClouds(dt) {
  for (const c of ghostClouds) {
    const col = c.friendly ? COL.acid : COL.toxic;
    for (let k = 0; k < Math.ceil(c.r * 1.2); k++) {
      if (Math.random() > dt * 10) continue;
      const a = Math.random() * TAU, rr = Math.sqrt(Math.random()) * c.r;
      smoke.emit(c.x + Math.cos(a) * rr, 0.3 + Math.random() * 0.8, c.z + Math.sin(a) * rr, 0, 0.4, 0, 1.2, 1.2, col, -0.2, 1.2, 2.2);
    }
  }
}

let coinSeq = 1;
const ghostCoins = new Map();
function coinPack() {
  const out = [];
  for (const c of G.coins) { if (!c.nid) c.nid = coinSeq++; out.push([c.nid, r1(c.mesh.position.x), r1(c.mesh.position.y), r1(c.mesh.position.z)]); if (out.length >= 24) break; }
  return out;
}
function syncGhostCoins(list, t) {
  const seen = new Set();
  for (const a of list || []) {
    if (!Array.isArray(a)) continue;
    seen.add(a[0]);
    let c = ghostCoins.get(a[0]);
    if (!c) { const m = cloneStatic('coin', { height: 0.5 }); scene.add(m); c = { mesh: m, buf: [], spin: Math.random() * TAU }; ghostCoins.set(a[0], c); }
    bufPush(c.buf, t, [a[1] / 10, a[2] / 10, a[3] / 10]);
  }
  for (const [id, c] of ghostCoins) if (!seen.has(id)) {
    if (c.mesh.position.distanceTo(player.pos) < 2.5) { sfx.coin(); sparks.emit(c.mesh.position.x, c.mesh.position.y, c.mesh.position.z, 0, 1, 0, 0.25, 0.5, COL.coin); }
    scene.remove(c.mesh); ghostCoins.delete(id);
  }
}
function updateGhostCoins(t, dt) {
  for (const c of ghostCoins.values()) {
    if (bufSample(c.buf, t, SMP)) c.mesh.position.set(SMP[0], SMP[1], SMP[2]);
    c.spin += dt * 4; c.mesh.rotation.y = c.spin;
  }
}

// ---- guest -> host requests (things that must happen in the host's world)
const rqOut = [];
let rqSeq = 0, rqSeen = 0;
function netRequest(ev) {
  rqOut.push([nowS(), ++rqSeq, ...ev]);
  if (rqOut.length > 30) rqOut.shift();
}
function rqPack() {
  const t = nowS();
  while (rqOut.length && t - rqOut[0][0] > 2.5) rqOut.shift();
  return rqOut.map(e => e.slice(1));
}
function healHouse(amount) {
  if (amount <= 0) return;
  if (isGuest()) netRequest(['hh', Math.round(amount)]);
  else G.houseHp = Math.min(G.houseMax, G.houseHp + amount);
}
function fixWall(s, amount) {
  if (isGuest()) { netRequest(['wf', s.i, s.j, amount === 'revive' ? -1 : Math.round(amount)]); if (amount === 'revive') structures.revive(s); else structures.heal(s, amount); return; }
  if (amount === 'revive') structures.revive(s); else structures.heal(s, amount);
}
function setChill(e, slow, t) {
  e.chill = { slow, t };
  if (e.mirror && G.time - (e.chillSent || -1) > 0.3) { e.chillSent = G.time; netRequest(['ch', e.id, r2(slow), r1(t)]); }
}
function hostRequests(list) {
  if (!Array.isArray(list)) return;
  let max = rqSeen;
  for (const ev of list) {
    if (!Array.isArray(ev) || ev[0] <= rqSeen) continue;
    max = Math.max(max, ev[0]);
    const k = ev[1];
    if (G.state !== 'playing') continue;
    if (k === 'hh') G.houseHp = Math.min(G.houseMax, G.houseHp + Math.min(G.houseMax * 0.2, +ev[2] || 0));
    else if (k === 'wf') {
      const s = structures.byCell.get(ev[2] + ',' + ev[3]);
      if (s && s.piece.kind === 'wall') { if (ev[4] < 0) structures.revive(s); else structures.heal(s, Math.min(s.max, +ev[4] || 0)); }
    } else if (k === 'ch') {
      const e = G.enemies.find(o => o.id === ev[2]);
      if (e && e.alive) e.chill = { slow: clamp(ev[3] / 100, 0, 0.9), t: clamp(ev[4] / 10, 0, 5) };
    } else if (k === 'kb') {
      const e = G.enemies.find(o => o.id === ev[2]);
      if (e && e.alive && !e.def.boss && !e.def.fly) { e.pos.x += clamp(ev[3] / 10, -4, 4); e.pos.z += clamp(ev[4] / 10, -4, 4); }
    } else if (k === 'tu') {
      const s = structures.add('turret', 0, 0, 0, true);
      s.x = clamp(ev[2] / 10, -WORLD_R, WORLD_R); s.z = clamp(ev[3] / 10, -WORLD_R, WORLD_R);
      s.mesh.position.set(s.x, 0, s.z); s.life = 20; s.hx = s.hz = 0.6;
      s.mesh.scale.setScalar(0.7);
      for (let i = 0; i < 16; i++) sparks.emit(s.x, 1, s.z, (Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5, 0.5, 0.35, COL.blue, 6);
    }
  }
  rqSeen = max;
}

function hurtRemoteNear(x, z, r, dmg) {
  const R = NET.remote;
  if (R && R.alive && !R.shield && Math.hypot(R.pos.x - x, R.pos.z - z) < r) NET.hurtOut += dmg;
}

function respawnPlayer() {
  player.alive = true;
  player.hp = player.maxHp;
  player.shieldT = 2;
  player.burnT = 0; player.slowT = 0;
  player.pos.set(isGuest() ? 3 : 0, 0, world.houseHalf.z + 4);
  player.vel.set(0, 0, 0);
  const ch = player.char;
  ch.dead = false; ch.deadT = 0; ch.body.rotation.set(0, 0, 0); ch.body.position.set(0, 0, 0);
  if (ch.play) { ch.current = null; ch.mixer.stopAllAction(); ch.play('Idle', 0.1); }
  player.gunHolder.visible = true;
  rings.spawn(player.pos, 4, 0x6dff9a, 0.6);
  showBanner('BACK IN THE FIGHT', '', 'gold', 1.2);
}

// ---- what each side sends
function playerSnap() {
  const def = petDef();
  return {
    x: r2(player.pos.x), z: r2(player.pos.z), f: r2(player.facing), yw: r2(player.yaw), pt: r2(player.pitch),
    h: save.hero, w: player.weaponId, r: player.gun ? player.gun.userData.rarity : 0, sc: NET.shots,
    al: player.alive ? 1 : 0, hp: Math.round(player.hp / player.maxHp * 100), sp: r1(Math.hypot(player.vel.x, player.vel.z)),
    a: G.time - player.lastShot < 0.9 ? 1 : 0, pl: G.state === 'playing' ? 1 : 0, run: isGuest() ? NET.guestRun : G.runId || 0,
    sh: player.shieldT > 0 ? 1 : 0,
    pe: pet.char ? [def.id, r2(pet.char.root.position.x), r2(pet.char.root.position.z), r2(pet.char.root.position.y), r2(pet.facing), r1(pet.speedNow), pet.atkT >= 0 ? r2(pet.atkT) : -1, petRec().level] : null,
  };
}

function hostSnapshot(maxE = 40) {
  const es = [];
  const push = (e) => {
    let fl = 0;
    if (!e.alive) fl |= 1;
    if (e.atkT >= 0) fl |= 2;
    if (e.phased) fl |= 4;
    if (e.shielded) fl |= 8;
    if (e.enraged) fl |= 16;
    if (e.burn) fl |= 32;
    if (e.chill) fl |= 64;
    if (e.spawnT > 0) fl |= 128;
    es.push([e.id, ENEMY_KEYS.indexOf(e.type), r1(e.pos.x), r1(e.pos.z), r1(e.pos.y), r2(e.facing), Math.round(clamp(e.hp / e.maxHp, 0, 1) * 1000), fl]);
  };
  for (const e of G.enemies) if (e.alive && es.length < maxE) push(e);
  for (const e of G.enemies) if (!e.alive && e.state === 'dying' && e.dieT < 0.6 && es.length < maxE + 6) push(e);
  const perm = structures.list.filter(x => !x.temporary);
  return {
    w: save.wave, ph: G.state === 'playing' ? G.phase : 'base', pt: Math.round(G.phaseT * 10), run: G.runId || 0, fr: G.failReason || '',
    hh: Math.round(G.houseHp), hm: Math.round(G.houseMax), e: es,
    sl: perm.map(x => `${BUILD_PIECES.indexOf(x.piece)}.${x.i}.${x.j}.${x.rot}`).join(','),
    sw: perm.map(x => x.piece.kind === 'wall' ? (x.alive ? Math.max(1, Math.round(x.hp / x.max * 99)) : 0) : 1).join('.'),
    tt: structures.list.filter(x => x.temporary && x.alive).map(x => [r1(x.x), r1(x.z)]),
    hu: Math.round(NET.hurtOut), co: Math.round(NET.coinsOut), q: G.queue.length,
    up: G.queue.slice(0, 4).map(s => [ENEMY_KEYS.indexOf(s.type), s.portal]),
  };
}

function sendNet() {
  if (!net.active || G.time - NET.lastSend < 1 / 20) return;
  NET.lastSend = G.time;
  const playing = net.linked && G.state === 'playing';
  const common = { p: playerSnap(), fx: playing ? fxPack() : [], pj: playing ? projPack() : [], cl: playing ? cloudPack() : [] };
  let patch;
  if (net.role === 'host') {
    patch = { ...common, s: hostSnapshot(), cn: playing ? coinPack() : [] };
    // stay well inside the 4 KiB presence budget
    for (let tries = 0; tries < 4 && JSON.stringify(patch).length > 3700; tries++) {
      patch.fx = patch.fx.slice(-6); patch.cn = patch.cn.slice(0, 10); patch.pj = patch.pj.slice(0, 12);
      patch.s = hostSnapshot(tries ? 24 : 32);
    }
  } else {
    const d = [];
    for (const [id, v] of NET.dmgOut) if (NET.mirror.has(id)) d.push([id, r1(v)]); else NET.dmgOut.delete(id);
    patch = { ...common, d: d.slice(0, 50), rq: rqPack() };
    for (let tries = 0; tries < 3 && JSON.stringify(patch).length > 3700; tries++) { patch.fx = patch.fx.slice(-5); patch.pj = patch.pj.slice(0, 10); patch.d = patch.d.slice(0, 30); }
  }
  NET.lastSize = JSON.stringify(patch).length;
  NET.maxSize = Math.max(NET.maxSize || 0, NET.lastSize);
  net.send(patch);
}

// ---- partner avatar + partner pet (shown on both screens)
function nameTag(text, color) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.font = 'bold 40px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 8; g.strokeStyle = 'rgba(0,0,0,.7)'; g.strokeText(text, 128, 32);
  g.fillStyle = color; g.fillText(text, 128, 32);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true }));
  sp.scale.set(2, 0.5, 1); sp.renderOrder = 12;
  return sp;
}

function removeAvatar() {
  const A = NET.avatar;
  if (A) { scene.remove(A.char.root); A.char.dispose(); NET.avatar = null; }
  removeRemotePet();
}
function removeRemotePet() {
  const P = NET.rpet;
  if (P) { scene.remove(P.char.root); P.char.dispose(); NET.rpet = null; }
}

function avatarNewSnap(pp, t) {
  const A = NET.avatar;
  if (A) bufPush(A.buf, t, [pp.x / 100, pp.z / 100, pp.f / 100, pp.sp / 10, pp.pt / 100, pp.yw / 100]);
  const P = NET.rpet;
  if (P && Array.isArray(pp.pe)) bufPush(P.buf, t, [pp.pe[1] / 100, pp.pe[2] / 100, pp.pe[3] / 100, pp.pe[4] / 100, pp.pe[5] / 10, pp.pe[6] / 100]);
}

const ASMP = [0, 0, 0, 0, 0, 0];
function updateAvatar(dt, pp, t) {
  const show = pp && pp.pl && G.state === 'playing' && pp.run === (isGuest() ? NET.guestRun : G.runId);
  if (!show) { removeAvatar(); NET.remote = null; return; }
  let A = NET.avatar;
  const def = heroById(pp.h) || HEROES[0];
  if (!A || A.hero !== def.id) {
    if (A) { scene.remove(A.char.root); A.char.dispose(); }
    const ch = def.model === 'robot' ? new RobotChar({ color: def.color || 0x3d8bff, height: 2.0, eyes: def.color ? 0xffc02e : 0x3ce0ff }) : new KenneyChar(def.model, { height: 1.85 });
    scene.add(ch.root);
    const holder = new THREE.Group();
    ch.root.add(holder);
    const tag = nameTag(isGuest() ? 'HOST' : 'FRIEND', '#6dff9a');
    tag.position.y = 2.5;
    ch.root.add(tag);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.62, 0.78, 40), new THREE.MeshBasicMaterial({ color: 0x6dff9a, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
    ch.root.add(ring);
    A = NET.avatar = { char: ch, hero: def.id, holder, gunKey: '', gun: null, pos: new THREE.Vector3(pp.x / 100, 0, pp.z / 100), facing: pp.f / 100, sc: pp.sc, alive: true, buf: [], flashT: 0 };
    bufPush(A.buf, t, [pp.x / 100, pp.z / 100, pp.f / 100, pp.sp / 10, pp.pt / 100, pp.yw / 100]);
  }
  const gk = pp.w + ':' + pp.r;
  if (A.gunKey !== gk && weaponById(pp.w)) {
    if (A.gun) A.holder.remove(A.gun);
    const ri = clamp(pp.r | 0, 0, RARITIES.length - 1);
    A.gun = makeGun(weaponById(pp.w), RARITIES[ri].hex, ri);
    A.holder.add(A.gun);
    A.gunKey = gk;
  }
  bufSample(A.buf, t - INTERP, ASMP, [2, 5]);
  A.pos.set(ASMP[0], 0, ASMP[1]);
  A.facing = ASMP[2];
  const ch = A.char;
  if (!pp.al && A.alive) { A.alive = false; ch.die(); A.holder.visible = false; }
  else if (pp.al && !A.alive) {
    A.alive = true; ch.dead = false; ch.deadT = 0; ch.body.rotation.set(0, 0, 0); ch.body.position.set(0, 0, 0);
    if (ch.play) { ch.current = null; ch.mixer.stopAllAction(); ch.play('Idle', 0.1); }
    A.holder.visible = true;
  }
  ch.root.position.copy(A.pos);
  ch.root.rotation.y = A.facing;
  const aimP = pp.a && A.alive ? ASMP[4] + 0.06 : null;
  ch.pose(dt, ASMP[3], -1, aimP);
  ch.updateFlash(dt, pp.sh ? 0x2a70c0 : 0);
  if (A.alive && A.gun) {
    ch.root.updateMatrixWorld(true);
    ch.handWorld(HAND);
    ch.root.worldToLocal(HAND);
    A.holder.position.copy(HAND);
    A.holder.position.y += 0.02;
    A.holder.rotation.set(aimP !== null ? -aimP : 0.25, 0, 0);
  }
  // partner's shots: muzzle flash + sound (their tracers arrive through fx)
  if (pp.sc > A.sc && A.gun && A.alive) {
    const w = weaponById(pp.w);
    const fl = A.gun.userData.flash;
    fl.visible = true; fl.material.rotation = Math.random() * TAU; A.flashT = 0.05;
    if (w && w.flame) {
      const from = A.gun.userData.muzzle.getWorldPosition(new THREE.Vector3());
      const yw = ASMP[5], pt = ASMP[4];
      const d = V2.set(-Math.sin(yw) * Math.cos(pt), Math.sin(pt), -Math.cos(yw) * Math.cos(pt));
      for (let i = 0; i < 3; i++) { const s = 10 + Math.random() * 8; sparks.emit(from.x, from.y, from.z, d.x * s + (Math.random() - 0.5) * 2, d.y * s + Math.random() * 1.5, d.z * s + (Math.random() - 0.5) * 2, 0.55, 0.6, i ? COL.fire : COL.spark, -2, 2.5); }
    }
    if (w && A.pos.distanceTo(player.pos) < 45 && G.time - (A.sndT || 0) > 0.06) { A.sndT = G.time; sfx.shot(w.sound); }
  }
  A.sc = pp.sc;
  if (A.flashT > 0) { A.flashT -= dt; if (A.flashT <= 0 && A.gun) A.gun.userData.flash.visible = false; }
  NET.remote = { pos: A.pos, alive: A.alive && !!pp.al, hp: pp.hp, shield: !!pp.sh };
  updateRemotePet(dt, pp, t);
}

function updateRemotePet(dt, pp, t) {
  const pe = pp.pe;
  const def = Array.isArray(pe) ? petById(pe[0]) : null;
  if (!def) { removeRemotePet(); return; }
  let P = NET.rpet;
  if (!P || P.id !== def.id) {
    removeRemotePet();
    const ch = new PetChar(def.model, { height: def.fly ? 0.75 : 0.85 });
    scene.add(ch.root);
    const ri = rarityIndex(pe[7] || 1);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 32), new THREE.MeshBasicMaterial({ color: RARITIES[ri].hex, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05;
    ch.root.add(ring);
    P = NET.rpet = { char: ch, id: def.id, buf: [] };
    bufPush(P.buf, t, [pe[1] / 100, pe[2] / 100, pe[3] / 100, pe[4] / 100, pe[5] / 10, pe[6] / 100]);
  }
  bufSample(P.buf, t - INTERP, ASMP, [3]);
  P.char.root.position.set(ASMP[0], ASMP[2], ASMP[1]);
  P.char.root.rotation.y = ASMP[3];
  P.char.pose(dt, ASMP[4], ASMP[5] >= 0 ? ASMP[5] : -1);
  P.char.updateFlash(dt, 0);
}

// ---- host: apply the guest's damage and requests
function hostReceive(pp) {
  if (!pp || G.state !== 'playing') return;
  hostRequests(pp.rq);
  if (!Array.isArray(pp.d)) return;
  const byId = new Map();
  for (const e of G.enemies) byId.set(e.id, e);
  for (const pair of pp.d) {
    if (!Array.isArray(pair)) continue;
    const id = pair[0] | 0, cum = (+pair[1] || 0) / 10;
    const e = byId.get(id);
    if (!e) continue;
    const prev = NET.applied.get(id) || 0;
    if (cum > prev) {
      NET.applied.set(id, cum);
      if (e.alive && e.spawnT <= 0) damageEnemy(e, cum - prev, { src: 'remote' });
    }
  }
  if (NET.applied.size > 300) for (const id of [...NET.applied.keys()]) if (!byId.has(id)) NET.applied.delete(id);
}

// ---- guest: mirror the host's world
function guestSyncStructures(hs) {
  const parts = hs.sl ? hs.sl.split(',').filter(Boolean).map(t => t.split('.').map(Number)) : [];
  const key = hs.sl || '';
  if (key !== NET.structKey || !NET.usingHostBase) {
    NET.structKey = key;
    NET.usingHostBase = true;
    structures.loadFrom(parts.filter(a => BUILD_PIECES[a[0]]).map(a => ({ p: BUILD_PIECES[a[0]].id, i: a[1], j: a[2], r: a[3] })));
    structures.resetForWave(wallMult());
  }
  const hp = (hs.sw || '').split('.').map(Number);
  const list = structures.list.filter(x => !x.temporary);
  list.forEach((s, idx) => {
    if (s.piece.kind !== 'wall' || hp[idx] === undefined || isNaN(hp[idx])) return;
    const f = hp[idx] / 99;
    if (f <= 0) { if (s.alive) { structures.damage(s, s.hp + 1); sfx.fenceBreak(); for (let i = 0; i < 16; i++) smoke.emit(s.x + (Math.random() - 0.5) * 2, 0.5 + Math.random() * 2, s.z + (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 6, 3 + Math.random() * 4, (Math.random() - 0.5) * 6, 1, 0.4, COL.wood, 12); } }
    else {
      if (!s.alive) structures.revive(s);
      const nhp = s.max * f;
      if (nhp < s.hp - 0.5) s.shake = 1;
      s.hp = nhp; structures.heal(s, 0);
    }
  });
  // host's temporary turrets (e.g. Cyra's)
  const tt = Array.isArray(hs.tt) ? hs.tt : [];
  const temps = structures.list.filter(x => x.temporary);
  for (let i = 0; i < Math.max(tt.length, temps.length); i++) {
    if (i >= tt.length) { structures.removeStructure(temps[i]); continue; }
    let s = temps[i];
    if (!s) {
      s = structures.add('turret', 0, 0, 0, true);
      s.life = 999; s.hx = s.hz = 0.6; s.mesh.scale.setScalar(0.7);
      for (let k = 0; k < 16; k++) sparks.emit(tt[i][0] / 10, 1, tt[i][1] / 10, (Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5, 0.5, 0.35, COL.blue, 6);
    }
    s.x = tt[i][0] / 10; s.z = tt[i][1] / 10; s.mesh.position.set(s.x, 0, s.z); s.life = 999;
  }
}

function guestSyncEnemies(es, t) {
  const seen = new Set();
  for (const a of es || []) {
    if (!Array.isArray(a) || a.length < 8) continue;
    const [id, ti, x, z, y, f, hp, fl] = a;
    const type = ENEMY_KEYS[ti];
    if (!type) continue;
    seen.add(id);
    let e = NET.mirror.get(id);
    if (!e) {
      if (fl & 1) continue;
      e = spawnEnemy(type, 0, new THREE.Vector3(x / 10, 0, z / 10));
      e.id = id; e.mirror = true; e.buf = [];
      e.facing = f / 100; e.char.root.rotation.y = e.facing;
      if (!(fl & 128)) { e.spawnT = 0; e.char.root.scale.setScalar(1); }
      else for (let i = 0; i < 16; i++) sparks.emit(x / 10, 1 + Math.random() * 2, z / 10, (Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5, 0.6, 0.5, COL.purple, 2, 1);
      NET.mirror.set(id, e);
    }
    bufPush(e.buf, t, [x / 10, z / 10, y / 10, f / 100]);
    e.netFl = fl;
    const hostHp = hp / 1000 * e.maxHp;
    if (hostHp < (e.hostHp ?? e.maxHp) - 0.5 && G.time - (e.lastHit || -10) > 0.15) e.char.flash(0.06);
    e.hostHp = hostHp;
    if (G.time - (e.lastHit || -10) > 0.6 || hostHp < e.hp) e.hp = hostHp;
    e.phased = !!(fl & 4); e.shielded = !!(fl & 8);
    if ((fl & 1) && e.alive) killEnemy(e, false, true);
  }
  for (const [id, e] of NET.mirror) {
    if (seen.has(id)) continue;
    if (e.alive) killEnemy(e, false, true);
    NET.mirror.delete(id);
  }
}

const ESMP = [0, 0, 0, 0];
function updateMirrorEnemies(dt) {
  const list = G.enemies;
  const t = nowS() - INTERP;
  for (let i = list.length - 1; i >= 0; i--) {
    const e = list[i];
    const ch = e.char;
    if (e.state === 'dying') {
      e.dieT += dt;
      ch.pose(dt, 0, -1);
      ch.updateFlash(dt, 0);
      if (e.def.fly) { e.pos.y = Math.max(0.3, e.pos.y - dt * 6); ch.root.position.y = e.pos.y; }
      if (e.dieT > 1.3) ch.root.position.y -= dt * 1.4;
      if (e.dieT > 2.5) { removeEnemy(e); list.splice(i, 1); NET.mirror.delete(e.id); }
      continue;
    }
    if (e.spawnT > 0) {
      e.spawnT -= dt;
      ch.root.scale.setScalar(clamp(1 - e.spawnT / 0.7, 0.01, 1));
      if (e.spawnT <= 0) ch.root.scale.setScalar(1);
    }
    const fl = e.netFl || 0;
    if (e.burn) {
      e.burn.t -= dt;
      damageEnemy(e, e.burn.dps * dt, { src: 'weapon', quiet: true });
      if (e.burn.t <= 0) e.burn = null;
    }
    if (e.burn || (fl & 32)) { if (Math.random() < dt * 14) sparks.emit(e.pos.x + (Math.random() - 0.5) * 0.5, e.pos.y + Math.random() * e.height, e.pos.z + (Math.random() - 0.5) * 0.5, 0, 2, 0, 0.4, 0.35, COL.fire, -1); }
    if (e.chill) { e.chill.t -= dt; if (e.chill.t <= 0) e.chill = null; }
    if ((e.chill || (fl & 64)) && Math.random() < dt * 6) sparks.emit(e.pos.x, e.pos.y + Math.random() * e.height, e.pos.z, 0, 0.5, 0, 0.5, 0.2, COL.ice, 1);
    const px = e.pos.x, pz = e.pos.z;
    if (bufSample(e.buf, t, ESMP, [3])) { e.pos.set(ESMP[0], ESMP[2], ESMP[1]); e.facing = ESMP[3]; }
    const v = Math.hypot(e.pos.x - px, e.pos.z - pz) / Math.max(dt, 1e-3);
    e.speedNow += (Math.min(9, v) - e.speedNow) * Math.min(1, dt * 8);
    if (e.def.phase) { const want = e.phased ? 0.18 : 0.7; if (e.lastOp !== want) { e.lastOp = want; for (const m of ch.mats) m.opacity = want; } }
    let attackPhase = -1;
    if (fl & 2) { e.atkAnim = (e.atkAnim || 0) + dt / Math.min(0.9, e.def.rate * 0.8); if (e.atkAnim >= 1) e.atkAnim = 0; attackPhase = e.atkAnim; }
    else e.atkAnim = 0;
    const statusCol = (fl & 32) || e.burn ? 0x5a2000 : (fl & 64) || e.chill ? 0x2a7aa8 : (fl & 16) ? 0x6a0000 : (fl & 8) ? 0x0a3a6a : 0;
    ch.updateFlash(dt, statusCol);
    if (e.spawnT <= 0) {
      const clip = ch.actions && ch.actions.Punch ? ch.actions.Punch.getClip() : null;
      ch.pose(dt, e.speedNow, attackPhase, null, { attackSpeed: clip ? clip.duration / Math.max(0.4, e.def.rate) : 1 });
    } else ch.pose(dt, 0, -1);
    if (e.def.explode && Math.random() < dt * 3) sfx.beep();
    ch.root.position.set(e.pos.x, e.pos.y, e.pos.z);
    ch.root.rotation.y = e.facing;
    updateHpBar(e);
  }
}

function guestFollow(dt, hs, t, fresh) {
  if (!hs) return;
  NET.wave = Math.max(1, hs.w | 0);
  const hostPlaying = ['countdown', 'fight', 'cleared'].includes(hs.ph);
  const idle = G.state === 'shop' || G.state === 'menu' || (G.state === 'playing' && G.phase === 'results');
  if (hostPlaying && idle && hs.run !== NET.guestRun) {
    NET.guestRun = hs.run;
    NET.lastWave = NET.wave;
    NET.hurtSeen = hs.hu | 0;
    for (const id of ['how', 'settings', 'coop', 'confirm']) if ($(id)) hideModal(id);
    for (const e of G.enemies) removeEnemy(e);
    G.enemies.length = 0;
    NET.mirror.clear();
    clearGhosts();
    startWave(true);
    return;
  }
  if (G.state !== 'playing' || hs.run !== NET.guestRun) return;
  if (!['countdown', 'fight', 'cleared'].includes(G.phase)) return;
  if (hostPlaying) {
    if (NET.wave !== NET.lastWave) { NET.lastWave = NET.wave; startWave(false); }
    G.phase = hs.ph;
    if (hs.ph === 'countdown') G.phaseT = hs.pt / 10;
    if (hs.ph === 'cleared' && !player.alive) respawnPlayer();
    G.houseMax = hs.hm || G.houseMax;
    if (hs.hh < G.houseHp - 0.5) {
      world.house.flash = 1;
      if (G.time - (NET.houseSnd || 0) > 0.25) { NET.houseSnd = G.time; world.domeHit(); sfx.houseHit(); }
    }
    G.houseHp = hs.hh;
    if (fresh) {
      guestSyncStructures(hs);
      guestSyncEnemies(hs.e, t);
      const q = hs.q | 0, up = Array.isArray(hs.up) ? hs.up : [];
      G.queue = Array.from({ length: q }, (_, i) => up[i] && ENEMY_KEYS[up[i][0]] ? { type: ENEMY_KEYS[up[i][0]], portal: up[i][1] | 0 } : { type: 'husk', portal: 0 });
    }
    const hu = hs.hu | 0;
    if (hu > NET.hurtSeen) { hurtPlayer(hu - NET.hurtSeen); NET.hurtSeen = hu; }
    else NET.hurtSeen = hu;
    // guest-side regen that belongs to the house
    NET.regenT = (NET.regenT || 0) + dt;
    if (NET.regenT >= 1) { NET.regenT = 0; if (G.phase === 'fight') healHouse((HS.perks.has('basekit') ? 6 : 0) + 5 * PS.count('repair')); }
  } else {
    G.failReason = hs.fr === 'player' ? 'player' : hs.fr === 'quit' ? 'quit' : 'house';
    G.phase = 'failed';
    G.phaseT = 3;
    sfx.defeat();
    showBanner(G.failReason === 'house' ? 'HOUSE DESTROYED' : 'TEAM DEFEATED', 'Back to base to swap gear and try again', 'red', 2.8);
    input.setEnabled(false);
  }
}

function updateGuestWave(dt) {
  if (G.phase === 'fight') {
    const upcoming = G.queue.slice(0, 4).map(s => s.portal);
    for (const pt of world.portals) {
      const idx = upcoming.indexOf(pt.index);
      pt.warnTarget = idx === 0 ? 1 : idx > 0 ? 0.55 : 0;
      pt.laneShow = idx >= 0 ? (idx === 0 ? 1 : 0.5) : 0;
    }
  } else if (G.phase === 'cleared') for (const pt of world.portals) { pt.warnTarget = 0; pt.laneShow = 0; }
  if (G.phase === 'failed') {
    G.phaseT -= dt;
    if (G.phaseT <= 0) showResults();
  }
}

function syncCoins(hs) {
  if (!hs) return;
  const co = hs.co | 0;
  if (NET.coinsSeen === null || co < NET.coinsSeen) { NET.coinsSeen = co; return; }
  if (co > NET.coinsSeen) {
    const d = co - NET.coinsSeen;
    NET.coinsSeen = co;
    save.coins += d;
    if (G.state === 'playing') G.runCoins += d;
    NET.coinDirty = true;
  }
}

let coopStatusKey = '';
function updateNet(dt) {
  if (!net.active) { if (NET.avatar) removeAvatar(); NET.remote = null; if (ghostProj.size || ghostCoins.size) clearGhosts(); return; }
  const pr = net.poll(dt);
  const linked = net.linked;
  const t = nowS();
  if (linked && !NET.wasLinked) { toast(net.role === 'host' ? 'Your friend joined!' : 'Connected to the host!'); sfx.levelUp(false); NET.coinsSeen = null; fxSeen = 0; rqSeen = 0; NET.lastP = null; }
  if (!linked && NET.wasLinked) {
    toast(net.role === 'host' ? 'Your friend left' : 'Lost the host');
    clearGhosts();
    if (isGuest() && G.state === 'playing' && ['countdown', 'fight', 'cleared'].includes(G.phase)) {
      G.failReason = 'left'; G.phase = 'failed'; G.phaseT = 1.5; input.setEnabled(false);
    }
  }
  NET.wasLinked = linked;
  if (linked) {
    // presence objects are frozen and only replaced when they change
    const fresh = pr !== NET.lastP;
    NET.lastP = pr;
    const playing = G.state === 'playing';
    if (fresh && pr.p) avatarNewSnap(pr.p, t);
    if (net.role === 'host') {
      if (fresh) hostReceive(pr);
      if (playing && G.phase === 'fight' && !player.alive && !(NET.remote && NET.remote.alive)) failWave('player');
    } else {
      syncCoins(pr.s);
      guestFollow(dt, pr.s, t, fresh);
      if (fresh && G.state === 'playing') syncGhostCoins(pr.cn, t);
    }
    updateAvatar(dt, pr.p, t);
    if (G.state === 'playing') {
      if (fresh) { fxPlay(pr.fx); syncGhostProj(pr.pj, t); syncGhostClouds(pr.cl); }
      updateGhostProj(t - INTERP);
      updateGhostClouds(dt);
      updateGhostCoins(t - INTERP, dt);
    } else if (ghostProj.size || ghostCoins.size || ghostClouds.length) clearGhosts();
  } else { removeAvatar(); NET.remote = null; }
  if (NET.coinDirty && G.time - (NET.coinSaveT || 0) > 3) { NET.coinDirty = false; NET.coinSaveT = G.time; writeSave(); }
  sendNet();
  const key = `${net.role}|${net.code}|${linked}|${G.state}|${net.connected()}`;
  if (key !== coopStatusKey) { coopStatusKey = key; renderCoop(); syncShopCoop(); }
  if (G.state === 'playing') {
    const R = NET.remote;
    setText('coopHud', linked ? `${isGuest() ? 'Host' : 'Friend'}: ${R ? (R.alive ? R.hp + '%' : 'DOWN') : 'at base'}` : 'Partner disconnected');
  }
}

function syncShopCoop() {
  const guest = isGuest();
  $('buildBtn').classList.toggle('hidden', guest);
  $('startWaveBtn').disabled = guest;
  if (guest) $('startWaveBtn').textContent = net.linked ? 'HOST STARTS THE WAVE' : 'FINDING HOST…';
  else if (G.state === 'shop') $('startWaveBtn').textContent = `START WAVE ${save.wave}`;
  $('shopCoopBtn').classList.toggle('on', net.active);
  $('shopCoopBtn').classList.toggle('linked', net.linked);
  $('coopHud').classList.toggle('hidden', !net.active);
}

function renderCoop() {
  const b = $('coopBody');
  if (!b) return;
  let html;
  if (!net.available) {
    html = `<p class="coop-msg">Two player works in the online version of the game. Open the game from its claude.ai link (not a downloaded file), then tap <b>2 PLAYER</b> again.</p>
      <p class="coop-small">Your friend needs access to the same link. Share it from the Share menu.</p>`;
  } else if (!net.role) {
    html = `<p class="coop-msg">Play together! One player hosts and sends a code, the other joins with it.</p>
      <button id="coopHost" class="btn btn-play">HOST A GAME</button>
      <div class="coop-join"><input id="coopCode" maxlength="4" placeholder="CODE" autocomplete="off" autocapitalize="characters" spellcheck="false"><button id="coopJoin" class="btn btn-build">JOIN</button></div>
      <p class="coop-small">Both players open this same game link. You each use your own hero, gun and pet, and you both earn the coins.</p>`;
  } else if (net.role === 'host') {
    html = `<p class="coop-msg">Send this code to your friend:</p>
      <div class="coop-code" id="coopCodeBig">${net.code}</div>
      <button id="coopCopy" class="btn btn-ghost small">Copy code</button>
      <p class="coop-status ${net.linked ? 'ok' : ''}">${net.linked ? 'Friend connected! Press START WAVE to play together.' : net.connected() ? 'Waiting for your friend to join…' : 'Connecting…'}</p>
      <p class="coop-small">They open this game's link, tap <b>2 PLAYER</b>, type the code and tap JOIN. You run the base, the build and the waves.</p>
      <button id="coopLeave" class="btn btn-ghost small">Stop hosting</button>`;
  } else {
    html = `<p class="coop-msg">Joining game <b>${net.code}</b></p>
      <p class="coop-status ${net.linked ? 'ok' : ''}">${net.linked ? 'Connected! The host will start the wave.' : net.connected() ? 'Looking for the host… (make sure the code is right and they are hosting)' : 'Connecting…'}</p>
      <button id="coopLeave" class="btn btn-ghost small">Leave</button>`;
  }
  b.innerHTML = html;
  const on = (id, fn) => { const el = $(id); if (el) el.addEventListener('click', () => { sfx.click(); fn(); }); };
  on('coopHost', () => { net.host(); resetNetState(); renderCoop(); syncShopCoop(); });
  on('coopJoin', () => {
    const c = ($('coopCode').value || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (c.length !== 4) { toast('Codes are 4 letters'); return; }
    net.join(c); resetNetState(); renderCoop(); syncShopCoop();
    if (G.state === 'menu') goToShop();
  });
  on('coopLeave', () => leaveCoop());
  on('coopCopy', () => {
    const txt = `Join my Holdout game! Open the game link, tap 2 PLAYER and enter code: ${net.code}`;
    try { navigator.clipboard.writeText(txt).then(() => toast('Code copied'), () => toast(`Code: ${net.code}`)); } catch (_) { toast(`Code: ${net.code}`); }
  });
  const inp = $('coopCode');
  if (inp) inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') $('coopJoin').click(); });
}

function resetNetState() {
  NET.dmgOut.clear(); NET.applied.clear(); NET.mirror.clear();
  NET.hurtOut = 0; NET.hurtSeen = 0; NET.coinsSeen = null; NET.guestRun = -1; NET.wasLinked = false;
}

function leaveCoop() {
  const wasGuest = isGuest();
  net.leave();
  resetNetState();
  removeAvatar(); NET.remote = null;
  if (wasGuest && NET.usingHostBase) { NET.usingHostBase = false; NET.structKey = ''; structures.loadFrom(save.structures); structures.resetForWave(wallMult()); }
  if (wasGuest && G.state === 'playing' && ['countdown', 'fight', 'cleared'].includes(G.phase)) failWave('quit');
  renderCoop(); syncShopCoop();
}

function openCoop() {
  renderCoop();
  showModal('coop');
}

// ---------------------------------------------------------------- main loop
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, clock.getDelta());
  if (G.state === 'loading') return;
  if (G.state !== 'paused') {
    G.time += dt;
    updateNet(dt);
    world.update(dt);
    if (G.state === 'playing') {
      if (input.consume('pausePressed')) pauseGame();
      else {
        if (G.phase === 'countdown' || G.phase === 'fight' || G.phase === 'cleared') updatePlayer(dt);
        else { player.char.pose(dt, 0, -1, null, { cheer: G.phase === 'cleared' || G.phase === 'results' }); player.char.updateFlash(dt, 0); }
        updateWave(dt);
        updatePet(dt);
        if (isGuest()) updateMirrorEnemies(dt); else updateEnemies(dt);
        updateStructures(dt);
        updateRockets(dt);
        updateGlobs(dt);
        updateGrenades(dt);
        updateClouds(dt);
        processNovas();
        updateCoins(dt, G.phase === 'cleared');
        updateHud();
        if (G.houseHp / G.houseMax < 0.4 && Math.random() < dt * 8) {
          smoke.emit((Math.random() - 0.5) * world.houseHalf.x * 2, (world.houseHeight || 6) * 0.8, (Math.random() - 0.5) * world.houseHalf.z * 2, 0, 1.5, 0, 2, 1.2, COL.smoke, -0.3, 0.5, 2);
        }
      }
    } else {
      player.char.pose(dt, 0, -1);
      player.char.updateFlash(dt, 0);
      structures.update(dt);
      if (G.state !== 'loading') updatePet(dt);
      if (G.state === 'shop' && player.char.current === 'Wave' && !player.char.actions.Wave.isRunning()) player.char.play('Idle', 0.3);
    }
    sparks.update(dt);
    smoke.update(dt);
    tracers.update(dt);
    bolts.update(dt);
    rings.update(dt);
    dmgNums.update(dt, window.innerWidth, window.innerHeight);
    updateCamera(dt);
  }
  dynamicResolution(dt); // resize (if needed) before drawing so the canvas is never shown cleared
  if (composer) composer.render(); else renderer.render(scene, camera);
}

function dynamicResolution(dt) {
  if (save.settings.quality !== 'auto' || G.state === 'loading' || G.state === 'paused') return;
  G.dynT += dt; G.dynFrames++;
  if (G.dynT < (G.dynChecks > 3 ? 3 : 1.5)) return;
  G.dynChecks = (G.dynChecks || 0) + 1;
  const fps = G.dynFrames / G.dynT;
  G.dynT = 0; G.dynFrames = 0;
  if (fps < 45 && pixelRatio > 0.7) { pixelRatio = Math.max(0.7, pixelRatio - 0.15); resize(); G.slowStreak = 0; }
  else if (fps < 38) {
    // already at the lowest resolution: drop the expensive effects one at a time
    G.slowStreak = (G.slowStreak || 0) + 1;
    if (G.slowStreak >= 2 && composer) { composer = null; G.slowStreak = 0; }
    else if (G.slowStreak >= 2 && renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; world.sun.castShadow = false; scene.traverse(o => { if (o.material) o.material.needsUpdate = true; }); G.slowStreak = 0; }
  } else if (fps > 57 && pixelRatio < Q.pr && (G.upT = (G.upT || 0) + 1) >= 2) { G.upT = 0; pixelRatio = Math.min(Q.pr, pixelRatio + 0.125); resize(); }
}

// ---------------------------------------------------------------- boot
function showFatal(msg) {
  const el = $('loadText');
  if (el) { el.textContent = msg; el.style.color = '#ff9aa3'; }
  toast(msg.slice(0, 140));
}
window.addEventListener('error', (e) => showFatal('Error: ' + (e.message || 'unknown')));
window.addEventListener('unhandledrejection', (e) => { const m = String(e.reason && e.reason.message || e.reason || ''); if (!/fullscreen|orientation|lock|play\(\)|not_granted|permission/i.test(m)) showFatal('Error: ' + m); });

async function boot() {
  resize();
  bindUi();
  try {
    await loadModels((f) => { $('loadFill').style.width = (f * 90).toFixed(0) + '%'; });
  } catch (err) {
    console.error(err);
    showFatal('Could not load the game files. ' + (err && err.message ? err.message : ''));
    return;
  }
  world = buildWorld(scene, { shadows: Q.shadows, shadowSize: Q.shadowSize, low: Q.name === 'low', quality: Q.name });
  world.onHouseChange = () => {
    houseBox.min.set(-world.houseHalf.x + 0.2, 0, -world.houseHalf.z + 0.2);
    houseBox.max.set(world.houseHalf.x - 0.2, world.houseHeight || 7, world.houseHalf.z - 0.2);
  };
  world.onHouseChange();
  structures = new Structures(scene, { shadows: Q.shadows });
  structures.loadFrom(save.structures);
  buildMode = new BuildMode({
    scene, camera, canvas, structures, sfx,
    getHouseHalf: () => world.houseHalf,
    onPlace: (p, err) => {
      if (!p) { sfx.deny(); toast(err); return; }
      if (save.coins < p.piece.cost) { sfx.deny(); toast('Not enough coins'); return; }
      save.coins -= p.piece.cost;
      const s = structures.add(p.piece.id, p.i, p.j, p.rot);
      structures.resetForWave(wallMult());
      sfx.place();
      for (let i = 0; i < 10; i++) smoke.emit(s.x + (Math.random() - 0.5) * 2, 0.3, s.z + (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 1, (Math.random() - 0.5) * 2, 0.6, 0.6, COL.dust, 0, 1, 1);
      save.structures = structures.serialize();
      writeSave();
      renderBuildPalette(); updateBuildHud();
    },
  });
  $('loadFill').style.width = '100%';
  applyUpgradesToWorld();
  refreshAllWeapons();
  setupHeroModel();
  resetPlayer();
  setupPet();
  updateThumbs();
  try { renderer.compile(scene, camera); } catch (e) { /* not critical */ }
  frame();
  setTimeout(() => { openMenu(); initCloud(); }, 200);
}

boot();

// debugging helpers
window.__game = {
  G, player, input, camera, renderer, scene, THREE, get world() { return world; }, get structures() { return structures; },
  killAll: () => { G.queue.length = 0; G.enemies.forEach(e => e.alive && killEnemy(e)); },
  net, NET, curWave, hurtPlayer, ghostProj, ghostCoins, sendSize: () => NET.lastSize,
  save: () => save, pet, startWave, spawnEnemy, goToShop, enterBuild, exitBuild, useAbility, setupHeroModel, setupPet, equipWeapon, refreshHero,
  addXpTo: (kind, id, n) => { const r = kind === 'hero' ? save.heroes[id] : save.weapons[id]; const from = r.level; addXp(r, n); onLevel(kind, kind === 'hero' ? heroById(id).name : weaponById(id).name, from, r.level); },
};
