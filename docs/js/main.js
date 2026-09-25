import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
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
  if (q === 'medium') return { name: 'medium', pr: Math.min(dpr, 1.5), aa: true, shadows: true, shadowSize: 1024, bloom: true, samples: 2 };
  return { name: 'high', pr: Math.min(dpr, 2), aa: true, shadows: true, shadowSize: 2048, bloom: true, samples: 4 };
}
const Q = qualityProfile(save.settings.quality);
let pixelRatio = Q.pr;
setShadowMode(Q.shadows);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: Q.aa && !Q.bloom, powerPreference: 'high-performance' });
renderer.setPixelRatio(pixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = Q.shadows;
renderer.shadowMap.type = Q.name === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 700);
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.45;

let composer = null, bloomPass = null;
if (Q.bloom) {
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: Q.samples });
  composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
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
  coin: C(0xffe070), wood: C(0x9a6b43), white: C(0xffffff), blue: C(0x6fdcff), red: C(0xff5a4a), dust: C(0x9c8a72), green: C(0x7dff8a), acid: C(0x9dff3a),
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
  queue: [], spawnT: 0, enemies: [], coins: [], rockets: [], globs: [], grenades: [],
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
const waveScale = () => Math.sqrt(waveHpMult(save.wave));

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
  world.house.setTier(houseTier(save.wave));
  G.houseMax = houseMaxHp(save.wave);
  refreshHero();
}

function wallMult() {
  let m = 1 + 0.08 * (save.wave - 1);
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
  if (def.model === 'robot') ch = new RobotChar({ color: 0x3d8bff, height: 2.0, eyes: 0x3ce0ff });
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
  if (player.gun) player.gunHolder.remove(player.gun);
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
    const ch = h.model === 'robot' ? new RobotChar({ color: 0x3d8bff, height: 2, eyes: 0x3ce0ff }) : new KenneyChar(h.model, { height: 1.85 });
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
    const big = heroDef().model === 'robot';
    const off = (camera.aspect < 1 ? V1.set(0.35, big ? 0.8 : 0.6, big ? 5.4 : 4.6) : big ? V1.set(0.85, 0.55, 4.2) : V1.set(0.62, 0.32, 3.4)).applyQuaternion(camState.q);
    let dist = off.length();
    const dir = V2.copy(off).divideScalar(dist);
    RAY.set(pivot, dir);
    const hit = RAY.intersectBox(houseBox, V3);
    if (hit) dist = Math.max(0.9, pivot.distanceTo(hit) - 0.3);
    camera.position.copy(pivot).addScaledVector(dir, dist);
    if (camera.position.y < 0.4) camera.position.y = 0.4;
    camera.quaternion.copy(camState.q);
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
  player.pos.set(0, 0, world.houseHalf.z + 4);
  player.vel.set(0, 0, 0);
  player.yaw = Math.PI; player.pitch = -0.1; player.facing = 0;
  refreshHero();
  player.hp = player.maxHp;
  player.alive = true;
  player.lastHurt = -10;
  player.reloadT = 0; player.fireCd = 0; player.swapT = 0; player.bloom = 0;
  player.abilityCd = 0; player.charges = HS.perks.has('doubledash') ? 2 : 1;
  player.shieldT = 0; player.boostT = 0; player.adrenalineT = 0; player.dashT = 0; player.rebootUsed = false;
  const ch = player.char;
  ch.dead = false; ch.deadT = 0; ch.body.rotation.set(0, 0, 0); ch.body.position.set(0, 0, 0);
  if (ch.play) { ch.current = null; ch.mixer.stopAllAction(); ch.play('Idle', 0.1); }
  ch.root.position.copy(player.pos);
  ch.root.rotation.y = player.facing;
  player.gunHolder.visible = true;
}

function updatePlayer(dt) {
  const ch = player.char;
  if (!player.alive) { ch.pose(dt, 0, -1); ch.updateFlash(dt, 0); return; }
  input.update();
  const sens = save.settings.sens * (input.isTouch ? 0.0055 : 0.0032);
  player.yaw -= input.lookDX * sens;
  player.pitch = clamp(player.pitch - input.lookDY * sens, -0.8, 0.6);
  input.lookDX = input.lookDY = 0;

  const speed = 6.8 * HS.speed * (1 + 0.08 * PS.count('swift'));
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
  ch.updateFlash(dt, player.shieldT > 0 ? 0x2a70c0 : 0);
  if (player.ring) player.ring.material.opacity = 0.45 + 0.3 * Math.sin(G.time * 3);

  if (G.time - player.lastHurt > 3) player.hp = Math.min(player.maxHp, player.hp + HS.regen * dt);
  player.hp = Math.min(player.maxHp, player.hp + 2 * PS.count('heal') * dt);
  player.shieldT = Math.max(0, player.shieldT - dt);
  player.boostT = Math.max(0, player.boostT - dt);
  player.adrenalineT = Math.max(0, player.adrenalineT - dt);
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
function attachGun(aiming, pitch) {
  const ch = player.char;
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
          if (!e.def.boss && !e.def.fly) { e.pos.x += (e.pos.x - player.pos.x) / (d || 1) * 3; e.pos.z += (e.pos.z - player.pos.z) / (d || 1) * 3; }
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
        const s = structures.add('turret', 0, 0, 0, true);
        s.x = x; s.z = z; s.mesh.position.set(x, 0, z); s.life = 20; s.hx = s.hz = 0.6;
        s.mesh.scale.setScalar(0.7);
        for (let i = 0; i < 16; i++) sparks.emit(x, 1, z, (Math.random() - 0.5) * 5, Math.random() * 4, (Math.random() - 0.5) * 5, 0.5, 0.35, COL.blue, 6);
      }
      break;
    }
    case 'doc': {
      player.hp = Math.min(player.maxHp, player.hp + player.maxHp * 0.4);
      G.houseHp = Math.min(G.houseMax, G.houseHp + G.houseMax * 0.1);
      rings.spawn(player.pos, 10, 0x6dff9a, 0.8);
      sfx.heal();
      if (HS.perks.has('boost')) player.boostT = 6;
      if (HS.perks.has('fieldmedic') || HS.perks.has('miracle')) {
        for (const s of structures.list) {
          if (s.piece.kind !== 'wall') continue;
          if (!s.alive && HS.perks.has('miracle')) structures.revive(s);
          else if (s.alive && HS.perks.has('fieldmedic')) structures.revive(s);
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
  pet.target = null; pet.cd = 0.5; pet.atkT = -1; pet.roarCd = 6; pet.healCd = 4; pet.speedNow = 0;
  pet.char.root.position.copy(pet.pos);
}

function petDamage(e, dmg, point) {
  const def = petDef();
  if (PS.perks.has('crit') && Math.random() < 0.25) dmg *= 3;
  damageEnemy(e, dmg, { point, src: 'ability', pet: true });
  if (e.alive) {
    if (PS.perks.has('burn')) e.burn = { dps: dmg * 0.4, t: 3 };
    if (PS.perks.has('freeze') || def.id === 'penguin') e.chill = { slow: 0.4, t: 2 };
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
  if (inFight && (def.kind === 'melee' || def.kind === 'roar')) {
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
      G.houseHp = Math.min(G.houseMax, G.houseHp + G.houseMax * 0.02);
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
      for (const e of G.enemies) if (e.alive && e.spawnT <= 0 && e.pos.distanceTo(pet.pos) < r) { petDamage(e, power * 1.2, new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.5, e.pos.z)); e.chill = { slow: 0.5, t: 2.5 }; }
    }
  }
  // collector: pull coins near the pet too
  if (def.kind === 'collector') for (const c of G.coins) if (c.state !== 'fly' && c.t > 0.4 && c.mesh.position.distanceTo(pet.pos) < 6 + 5 * PS.count('magnet')) c.state = 'fly';

  // melee hit timing
  if (pet.atkT >= 0) {
    pet.atkT += dt * 3;
    attackPhase = pet.atkT;
    if ((def.kind === 'melee' || def.kind === 'roar') && pet.target && !pet.hitDone && pet.atkT >= 0.5) {
      pet.hitDone = true;
      const t = pet.target;
      const pt = new THREE.Vector3(t.pos.x, t.pos.y + t.height * 0.4, t.pos.z);
      petDamage(t, power, pt);
      if (PS.perks.has('double')) { const o = petTargets(12).find(x => x !== t); if (o) petDamage(o, power * 0.7, new THREE.Vector3(o.pos.x, o.pos.y + o.height * 0.4, o.pos.z)); }
      sfx.hit(false);
    }
    if (pet.atkT >= 1) { pet.atkT = -1; pet.hitDone = false; }
  }
  if (!goal && !(pet.atkT >= 0 && (def.kind === 'melee' || def.kind === 'roar'))) {
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
  pet.char.pose(dt, pet.speedNow, attackPhase, null, { dance: G.phase === 'cleared' });
  pet.char.updateFlash(dt, 0);
}

// ---------------------------------------------------------------- collisions
function collideWorld(p, r, isPlayer) {
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
  structures.collide(p, r);
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
    if (!e.alive || e.spawnT > 0) continue;
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
  player.ammo[w.id]--;
  const rateMult = player.adrenalineT > 0 ? 1.3 : 1;
  player.fireCd = 1 / (st.rate * rateMult);
  player.lastShot = G.time;
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
  fl.scale.setScalar(0.45 + Math.random() * 0.35 + (w.pellets > 1 ? 0.35 : 0));
  const ri = player.gun.userData.rarity;
  const tracerCol = ri > 0 ? RARITIES[ri].hex : 0xffe08a;
  fl.material.color.setHex(ri > 0 ? tracerCol : 0xffe0a0);
  for (let i = 0; i < 3; i++) sparks.emit(muzzle.x, muzzle.y, muzzle.z, dir.x * 4 + (Math.random() - 0.5) * 2, dir.y * 4 + Math.random(), dir.z * 4 + (Math.random() - 0.5) * 2, 0.12, 0.3, COL.fire);

  const abilities = st.abilities;
  const extra = abilities.filter(a => a.key === 'multishot').reduce((s, a) => s + a.v.n, 0);
  const extraPierce = abilities.filter(a => a.key === 'pierce').reduce((s, a) => s + a.v.n, 0);
  const dmgBase = st.dmg * HS.dmg * (player.boostT > 0 ? 1.3 : 1);

  if (w.projectile) {
    for (let k = 0; k <= extra; k++) {
      const d = dir.clone();
      if (k > 0) { d.x += (Math.random() - 0.5) * 0.12; d.y += Math.random() * 0.05; d.z += (Math.random() - 0.5) * 0.12; d.normalize(); }
      const tEnd = worldHitT(ray.origin, d, w.range);
      const hits = raycastEnemies(ray.origin, d, tEnd).filter(h => h.t > minT);
      const aimPoint = ray.origin.clone().addScaledVector(d, hits.length ? hits[0].t : tEnd);
      spawnRocket(muzzle, aimPoint, dmgBase * (k > 0 ? 0.6 : 1), w.splash, tracerCol);
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
    if (p < 4 || Math.random() < 0.4) tracers.spawn(muzzle, end, w.id === 'sniper' && ri === 0 ? 0xc89bff : tracerCol, w.id === 'sniper' ? 0.08 : 0.045, w.id === 'sniper' ? 0.2 : 0.07);
    if (!hitEnemy && endT < w.range - 0.1) {
      for (let k = 0; k < 4; k++) sparks.emit(end.x, end.y + 0.05, end.z, (Math.random() - 0.5) * 3, Math.random() * 3, (Math.random() - 0.5) * 3, 0.25, 0.16, COL.spark, 9);
      smoke.emit(end.x, end.y + 0.1, end.z, 0, 0.5, 0, 0.5, 0.35, COL.dust, 0, 1, 1.5);
    }
  }
}

// Applies weapon abilities on a hit.
function weaponHit(e, dmg, head, point, abilities, fromExplosion = false) {
  let crit = head;
  let critChance = HS.perks.has('critblades') ? 0.2 : 0;
  for (const a of abilities) if (a.key === 'crit') critChance += a.v.chance;
  if (Math.random() < critChance) { dmg *= 2; crit = true; }
  for (const a of abilities) if (a.key === 'executioner' && e.hp / e.maxHp < 0.35) dmg *= 1 + a.v.f;
  damageEnemy(e, dmg, { point, head: crit, src: 'weapon' });
  if (e.alive) {
    for (const a of abilities) {
      if (a.key === 'burn') e.burn = { dps: dmg * a.v.f, t: a.v.dur };
      if (a.key === 'freeze') e.chill = { slow: a.v.slow, t: a.v.dur };
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

function spawnRocket(from, to, dmg, splash, color) {
  const mesh = new THREE.Group();
  const bodyM = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 8), new THREE.MeshStandardMaterial({ color: 0x6a7a3a }));
  bodyM.rotation.x = Math.PI / 2;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 8), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1 }));
  tip.rotation.x = Math.PI / 2; tip.position.z = 0.37;
  mesh.add(bodyM, tip);
  mesh.position.copy(from);
  mesh.lookAt(to);
  scene.add(mesh);
  G.rockets.push({ mesh, vel: to.clone().sub(from).normalize().multiplyScalar(42), dmg, splash, life: 3 });
}

function updateRockets(dt) {
  for (let i = G.rockets.length - 1; i >= 0; i--) {
    const r = G.rockets[i];
    r.life -= dt;
    const p = r.mesh.position;
    let boom = r.life <= 0;
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
    smoke.emit(p.x, p.y, p.z, (Math.random() - 0.5) * 0.4, 0.4, (Math.random() - 0.5) * 0.4, 0.6, 0.45, COL.smoke, 0, 1, 2);
    sparks.emit(p.x, p.y, p.z, -r.vel.x * 0.05, -r.vel.y * 0.05, -r.vel.z * 0.05, 0.15, 0.4, COL.fire);
    if (boom) {
      explode(p.clone(), r.dmg, r.splash, { src: 'weapon' });
      scene.remove(r.mesh);
      r.mesh.traverse(o => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
      G.rockets.splice(i, 1);
    }
  }
}

function explode(pos, dmg, radius, opts = {}) {
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
  if (def.model === 'drone') return new DroneChar({ height: def.height });
  return new KenneyChar(def.model, { height: def.height, tint: def.tint || null, glow: def.glow || null, zombie: def.model.startsWith('zombie') });
}

let shieldGeo = null;
function spawnEnemy(type, portalIndex, at = null) {
  const def = ENEMIES[type];
  const n = save.wave;
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
    burn: null, chill: null, healT: 2 + Math.random() * 2, summonT: 8,
  };
  if (!def.boss) e.hpBar = makeHpBar(char.root, def.height + 0.35 + (def.fly ? 0.3 : 0));
  G.enemies.push(e);
  sfx.portal();
  if (!at) for (let i = 0; i < 16; i++) sparks.emit(pos.x, 1 + Math.random() * 2, pos.z, (Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5, 0.6, 0.5, COL.purple, 2, 1);
  if (def.boss) {
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
  let blocked = false;
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
  if (e.def.explode && byPlayer) explode(c, e.dmg * 0.8, e.def.explode, { src: 'weapon', noAbilities: true, color: COL.spark, exclude: e });
  if (e.def.boss) { G.shake = 0.6; explode(c, 0, 1); }
}

function removeEnemy(e) {
  scene.remove(e.char.root);
  e.char.dispose();
  if (e.hpBar) { e.hpBar.bg.material.dispose(); e.hpBar.fill.material.dispose(); }
}

const TP = new THREE.Vector3();
function updateEnemies(dt) {
  const list = G.enemies;
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
    ch.updateFlash(dt, statusCol);

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
    if (e.def.boss) {
      e.summonT -= dt;
      if (e.summonT <= 0) {
        e.summonT = 11;
        for (let k = 0; k < 3; k++) {
          const a = Math.random() * TAU;
          spawnEnemy(k === 2 && save.wave >= 10 ? 'runner' : 'husk', 0, new THREE.Vector3(e.pos.x + Math.cos(a) * 3, 0, e.pos.z + Math.sin(a) * 3));
        }
        rings.spawn(e.pos, 6, 0xb070ff, 0.6);
      }
    }
    if (e.def.explode && Math.random() < dt * 3) sfx.beep();

    // target selection
    const dpx = player.pos.x - e.pos.x, dpz = player.pos.z - e.pos.z;
    const dp = Math.hypot(dpx, dpz);
    const aggro = e.def.boss ? 9 : e.def.fast ? 8 : e.def.ranged ? e.def.ranged * 0.8 : 6.5;
    let targetKind;
    if (player.alive && dp < aggro && (player.shieldT <= 0 || e.def.boss)) { TP.set(player.pos.x, 0, player.pos.z); targetKind = 'player'; }
    else { housePoint(e.pos.x, e.pos.z, TP); TP.y = 0; targetKind = 'house'; }
    let dx = TP.x - e.pos.x, dz = TP.z - e.pos.z;
    const dist = Math.hypot(dx, dz) || 0.001;
    const reach = e.def.reach + (targetKind === 'player' ? player.radius : 0) + e.radius * 0.6;
    const stopAt = e.def.ranged ? e.def.ranged : e.def.keepAway && targetKind === 'house' ? e.def.keepAway : reach;

    let attackTarget = null;
    if (e.wall && e.wall.alive && !e.def.fly && dist > stopAt) attackTarget = e.wall;
    else e.wall = null;
    if (!attackTarget && dist <= stopAt) attackTarget = e.def.keepAway && targetKind === 'house' ? 'idle' : targetKind;

    let moveSpeed = 0;
    if (!attackTarget) {
      const spd = e.speed * slow * dt;
      const nx = e.pos.x + dx / dist * spd, nz = e.pos.z + dz / dist * spd;
      const wall = e.def.fly ? null : structures.wallAt(nx, nz, e.radius * 0.8);
      if (wall) { e.wall = wall; attackTarget = wall; }
      else { e.pos.x = nx; e.pos.z = nz; moveSpeed = e.speed * slow; }
      e.facing = lerpAngle(e.facing, Math.atan2(dx, dz), Math.min(1, dt * 6));
    }
    if (attackTarget && attackTarget !== 'idle') {
      if (attackTarget !== 'player' && attackTarget !== 'house') { dx = attackTarget.x - e.pos.x; dz = attackTarget.z - e.pos.z; }
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
      collideWorld(a.pos, a.radius, false);
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
    const hp = housePoint(c.x, c.z, V2);
    if (Math.hypot(hp.x - c.x, hp.z - c.z) < def.explode) hurtHouse(e.dmg, c);
    for (const s of structures.list) if (s.alive && s.piece.kind !== 'trap' && Math.hypot(s.x - c.x, s.z - c.z) < def.explode + 0.5) hitStructure(s, e.dmg * 1.5);
    killEnemy(e, false, true);
    return;
  }
  if (def.ranged) {
    const target = t === 'player' ? player.pos.clone().setY(1) : t === 'house' ? housePoint(e.pos.x, e.pos.z, new THREE.Vector3()).setY(2) : new THREE.Vector3(t.x, 1.3, t.z);
    const from = new THREE.Vector3(e.pos.x, e.pos.y + e.height * 0.8, e.pos.z);
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
    if (d < (e.def.ranged || e.def.reach + player.radius + e.radius + 0.7) + 1) hurtPlayer(dmg);
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

function spitGlob(from, to, e, t) {
  sfx.spit();
  const T = 0.9;
  const vel = to.clone().sub(from).divideScalar(T);
  vel.y += 0.5 * 18 * T;
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshStandardMaterial({ color: 0x9dff3a, emissive: 0x4aff1a, emissiveIntensity: 1.2 }));
  mesh.position.copy(from);
  scene.add(mesh);
  G.globs.push({ mesh, vel, dmg: e.dmg, target: t, life: 2 });
}

function updateGlobs(dt) {
  for (let i = G.globs.length - 1; i >= 0; i--) {
    const g = G.globs[i];
    g.vel.y -= 18 * dt;
    g.mesh.position.addScaledVector(g.vel, dt);
    g.life -= dt;
    if (Math.random() < 0.6) sparks.emit(g.mesh.position.x, g.mesh.position.y, g.mesh.position.z, 0, 0, 0, 0.3, 0.2, COL.acid);
    const p = g.mesh.position;
    const hitHouse = houseBox.containsPoint(p);
    const wall = structures.wallAt(p.x, p.z, 0.2);
    if (p.y <= 0.1 || hitHouse || (wall && p.y < 2.6) || g.life <= 0) {
      for (let k = 0; k < 10; k++) sparks.emit(p.x, Math.max(0.2, p.y), p.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.4, 0.3, COL.acid, 8);
      if (Math.hypot(player.pos.x - p.x, player.pos.z - p.z) < 1.8 && p.y < 2.5) hurtPlayer(g.dmg);
      const hp = housePoint(p.x, p.z, V2);
      if (hitHouse || Math.hypot(hp.x - p.x, hp.z - p.z) < 1.2) hurtHouse(g.dmg, p);
      if (wall && wall.alive) hitStructure(wall, g.dmg);
      scene.remove(g.mesh);
      g.mesh.geometry.dispose();
      G.globs.splice(i, 1);
    }
  }
}

function hurtPlayer(dmg) {
  if (!player.alive || G.phase !== 'fight') return;
  if (player.shieldT > 0) { rings.spawn(player.pos, 1.5, 0x5cb8ff, 0.25); return; }
  dmg *= (1 - HS.armor) * Math.pow(0.9, PS.count('guard'));
  player.hp -= dmg;
  player.lastHurt = G.time;
  G.shake = Math.max(G.shake, 0.25);
  sfx.hurt();
  player.char.flash(0.08);
  const v = $('vignette');
  v.style.transition = 'none'; v.style.opacity = 1;
  requestAnimationFrame(() => { v.style.transition = 'opacity .6s'; v.style.opacity = player.hp / player.maxHp < 0.3 ? 0.5 : 0; });
  if (player.hp <= 0) {
    if (HS.perks.has('reboot') && !player.rebootUsed) {
      player.rebootUsed = true;
      player.hp = player.maxHp * 0.5;
      player.shieldT = 2;
      rings.spawn(player.pos, 6, 0x5cb8ff, 0.7);
      showBanner('REBOOT', 'Bolt is back online!', 'gold', 1.5);
      return;
    }
    player.hp = 0;
    player.alive = false;
    player.gunHolder.visible = false;
    player.char.die();
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
  const tm = trapMult();
  for (const s of [...structures.list]) {
    if (!s.alive) continue;
    if (s.temporary) {
      s.life -= dt;
      if (s.life <= 0) { structures.removeStructure(s); for (let i = 0; i < 12; i++) sparks.emit(s.x, 1, s.z, (Math.random() - 0.5) * 4, Math.random() * 3, (Math.random() - 0.5) * 4, 0.4, 0.3, COL.blue, 6); continue; }
    }
    const p = s.piece;
    if (p.kind === 'trap') {
      let hit = false;
      for (const e of G.enemies) {
        if (!e.alive || e.spawnT > 0 || e.def.fly) continue;
        if (Math.abs(e.pos.x - s.x) < 1.1 + e.radius * 0.4 && Math.abs(e.pos.z - s.z) < 1.1 + e.radius * 0.4) {
          damageEnemy(e, p.dps * tm * dt, { src: 'trap', quiet: true });
          if (p.slow) { e.trapSlow = Math.min(e.trapSlow, 1 - p.slow); if (Math.random() < dt * 5) sparks.emit(e.pos.x, 0.4, e.pos.z, 0, 1, 0, 0.5, 0.25, COL.ice, 0); }
          else { e.trapSlow = Math.min(e.trapSlow, 0.75); if (Math.random() < dt * 6) sparks.emit(e.pos.x, 0.3, e.pos.z, (Math.random() - 0.5) * 2, 2, (Math.random() - 0.5) * 2, 0.3, 0.2, COL.blood, 8); }
          hit = true;
        }
      }
      if (hit && !p.slow) s.pop = 1;
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
      if (s.cooldown <= 0 && G.phase === 'fight') {
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
    const tx = player.pos.x - p.x, ty = player.pos.y + 1 - p.y, tz = player.pos.z - p.z;
    const d = Math.hypot(tx, ty, tz);
    if (c.state !== 'fly' && c.t > 0.4 && player.alive && (d < magnet || collectAll)) c.state = 'fly';
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
  for (const list of [G.rockets, G.globs, G.grenades]) { for (const r of list) scene.remove(r.mesh); list.length = 0; }
  G.novaQueue.length = 0;
  sparks.clear(); smoke.clear(); tracers.clear(); dmgNums.clear(); bolts.clear(); rings.clear();
  for (const pt of world.portals) { pt.warnTarget = 0; pt.laneShow = 0; }
}

// A run starts at the base and keeps going wave after wave until you (or the house) fall.
function startWave(fresh = true) {
  const n = save.wave;
  if (fresh) {
    clearArena();
    applyUpgradesToWorld();
    structures.resetForWave(wallMult());
    G.houseHp = G.houseMax;
    resetPlayer();
    setupPet();
    resetPet();
    equipWeapon(save.equipped, true);
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
    if (player.char.play) player.char.play('Idle', 0.2);
  }
  refillAmmo();
  updateWeaponHud(true);
  G.queue = buildWave(n);
  G.spawnT = 0;
  G.hitCount = 0;
  G.houseLastHit = -10;
  world.setActivePortals(portalCount(n));
  const sum = waveSummary(n);
  for (const pt of world.portals) { pt.laneShow = sum.portals.includes(pt.index) ? 1 : 0; pt.warnTarget = pt.laneShow; }
  G.state = 'playing';
  G.phase = 'countdown';
  G.phaseT = fresh ? 4 : 5;
  G.lastCount = 6;
  showScreen(null);
  $('hud').classList.remove('hidden');
  $('touch').classList.toggle('hidden', !input.isTouch);
  $('bossWrap').classList.add('hidden');
  input.setEnabled(true);
  $('waveLabel').textContent = `WAVE ${n}`;
  const from = sum.portals.map(i => COMPASS[i]).join(', ');
  showBanner(`WAVE ${n}`, `${sum.total} enemies incoming from ${from}`, isBossWave(n) ? 'red' : '', 3.2);
  sfx.waveStart();
  updateHud(true);
  updateHeroHud();
  checkRotate();
  writeSave(true);
  if (fresh) {
    $('desktopHint').classList.toggle('hidden', input.isTouch);
    if (!input.isTouch) setTimeout(() => $('desktopHint').classList.add('hidden'), 7000);
  }
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
  G.phaseT = 3.2;
  const bonus = waveBonus(save.wave);
  save.coins += bonus;
  G.runCoins += bonus;
  save.wave++;
  save.best = Math.max(save.best, save.wave);
  writeSave(true);
  sfx.victory();
  showBanner(`WAVE ${save.wave - 1} CLEARED!`, `+${bonus} coins · next wave coming up`, 'gold', 2.6);
  if (player.char.play) player.char.play('Dance', 0.3);
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
  for (const c of G.coins) { save.coins += c.value; G.runCoins += c.value; scene.remove(c.mesh); }
  G.coins.length = 0;
  writeSave(true);
  const cleared = save.wave - G.run.startWave;
  $('resTitle').textContent = `WAVE ${save.wave} FAILED`;
  $('resSub').textContent = cleared > 0
    ? `You cleared ${cleared} wave${cleared > 1 ? 's' : ''} this run. You keep every coin and all XP. Swap gear and retry wave ${save.wave}!`
    : `You keep every coin and all XP. Swap your gear, build defenses and retry wave ${save.wave}!`;
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
}

// ---------------------------------------------------------------- edit mode
function enterBuild() {
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
  } else $('bossWrap').classList.add('hidden');
  updateOffscreen();
  drawMinimap();
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
  click('startWaveBtn', () => { if (input.isTouch) requestFullscreen(); startWave(); });
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
      if (input.consume('pausePressed')) pauseGame();
      else {
        if (G.phase === 'countdown' || G.phase === 'fight') updatePlayer(dt);
        else { player.char.pose(dt, 0, -1, null, { cheer: G.phase === 'cleared' || G.phase === 'results' }); player.char.updateFlash(dt, 0); }
        updateWave(dt);
        updatePet(dt);
        updateEnemies(dt);
        updateStructures(dt);
        updateRockets(dt);
        updateGlobs(dt);
        updateGrenades(dt);
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
  if (composer) composer.render(); else renderer.render(scene, camera);
  dynamicResolution(dt);
}

function dynamicResolution(dt) {
  if (save.settings.quality !== 'auto' || G.state !== 'playing') return;
  G.dynT += dt; G.dynFrames++;
  if (G.dynT < 2) return;
  const fps = G.dynFrames / G.dynT;
  G.dynT = 0; G.dynFrames = 0;
  if (fps < 45 && pixelRatio > 0.7) { pixelRatio = Math.max(0.7, pixelRatio - 0.15); resize(); G.slowStreak = 0; }
  else if (fps < 38) {
    // already at the lowest resolution: drop the expensive effects one at a time
    G.slowStreak = (G.slowStreak || 0) + 1;
    if (G.slowStreak >= 2 && composer) { composer = null; G.slowStreak = 0; }
    else if (G.slowStreak >= 2 && renderer.shadowMap.enabled) { renderer.shadowMap.enabled = false; world.sun.castShadow = false; scene.traverse(o => { if (o.material) o.material.needsUpdate = true; }); G.slowStreak = 0; }
  } else if (fps > 58 && pixelRatio < Q.pr) { pixelRatio = Math.min(Q.pr, pixelRatio + 0.1); resize(); }
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
  world = buildWorld(scene, { shadows: Q.shadows, shadowSize: Q.shadowSize, low: Q.name === 'low' });
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
  save: () => save, pet, startWave, spawnEnemy, goToShop, enterBuild, exitBuild, useAbility,
  addXpTo: (kind, id, n) => { const r = kind === 'hero' ? save.heroes[id] : save.weapons[id]; const from = r.level; addXp(r, n); onLevel(kind, kind === 'hero' ? heroById(id).name : weaponById(id).name, from, r.level); },
};
