// Game data: weapons, upgrades, enemies, waves and save handling.

export const SAVE_KEY = 'holdout_save_v1';

export const WEAPONS = [
  { id: 'pistol', name: 'Pistol', desc: 'Reliable sidearm.', cost: 0, dmg: 16, rate: 3.2, mag: 12, reload: 1.1, spread: 0.012, pellets: 1, range: 70, upBase: 35, sound: 'pistol', recoil: 0.012,
    look: { body: 0x3b4450, accent: 0xff9a3c, len: 0.42, barrel: 0.18, thick: 0.13 } },
  { id: 'smg', name: 'SMG', desc: 'Sprays bullets fast.', cost: 300, dmg: 10, rate: 11, mag: 35, reload: 1.6, spread: 0.035, pellets: 1, range: 55, upBase: 70, sound: 'smg', recoil: 0.006,
    look: { body: 0x2d3a2e, accent: 0x7cff6b, len: 0.6, barrel: 0.2, thick: 0.14, mag: true } },
  { id: 'shotgun', name: 'Shotgun', desc: 'Huge close-range burst.', cost: 750, dmg: 12, rate: 1.3, mag: 6, reload: 2.0, spread: 0.075, pellets: 8, range: 32, upBase: 110, sound: 'shotgun', recoil: 0.05,
    look: { body: 0x5a3a24, accent: 0xffd23c, len: 0.85, barrel: 0.5, thick: 0.15, pump: true } },
  { id: 'rifle', name: 'Assault Rifle', desc: 'Accurate full-auto power.', cost: 1500, dmg: 24, rate: 7.5, mag: 30, reload: 1.8, spread: 0.016, pellets: 1, range: 90, upBase: 160, sound: 'rifle', recoil: 0.01,
    look: { body: 0x23272e, accent: 0x3cc8ff, len: 0.95, barrel: 0.35, thick: 0.15, mag: true, stock: true } },
  { id: 'sniper', name: 'Sniper', desc: 'Pierces through 4 enemies.', cost: 2600, dmg: 150, rate: 0.9, mag: 5, reload: 2.4, spread: 0.0, pellets: 1, range: 150, pierce: 4, headMult: 2.5, upBase: 240, sound: 'sniper', recoil: 0.06,
    look: { body: 0x1f2a36, accent: 0xb56bff, len: 1.25, barrel: 0.6, thick: 0.13, stock: true, scope: true } },
  { id: 'rocket', name: 'Rocket Launcher', desc: 'Explosive splash damage.', cost: 4500, dmg: 170, rate: 0.8, mag: 3, reload: 2.8, spread: 0.004, pellets: 1, range: 120, splash: 4.8, projectile: true, upBase: 330, sound: 'rocket', recoil: 0.07,
    look: { body: 0x4a5a2a, accent: 0xff4b3c, len: 1.15, barrel: 0.0, thick: 0.26, tube: true } },
];

export const WEAPON_UPGRADES = [
  { key: 'dmg', name: 'Damage', max: 10, mult: 1.0 },
  { key: 'rate', name: 'Fire Rate', max: 8, mult: 1.15 },
  { key: 'mag', name: 'Magazine', max: 6, mult: 0.8 },
  { key: 'reload', name: 'Reload Speed', max: 6, mult: 0.75 },
];

export function weaponById(id) { return WEAPONS.find(w => w.id === id); }

export function weaponStats(w, lv) {
  return {
    dmg: w.dmg * (1 + 0.24 * lv.dmg),
    rate: w.rate * (1 + 0.09 * lv.rate),
    mag: Math.max(1, Math.round(w.mag * (1 + 0.2 * lv.mag))),
    reload: w.reload * Math.pow(0.88, lv.reload),
  };
}

export function weaponUpgradeCost(w, key, lvl) {
  const u = WEAPON_UPGRADES.find(x => x.key === key);
  return Math.round(w.upBase * u.mult * Math.pow(1.5, lvl) / 5) * 5;
}

export const HOUSE_UPGRADES = [
  { key: 'hp', name: 'Reinforced Walls', desc: 'More house health. Upgrades the look of your house too.', max: 15, base: 60, growth: 1.42, value: l => 600 + 240 * l, fmt: v => `${v} HP` },
  { key: 'armor', name: 'Armor Plating', desc: 'The house takes less damage.', max: 10, base: 110, growth: 1.5, value: l => l * 5, fmt: v => `-${v}% dmg` },
  { key: 'regen', name: 'Repair Bots', desc: 'The house repairs itself during waves.', max: 10, base: 90, growth: 1.45, value: l => l * 3, fmt: v => `${v} HP/s` },
  { key: 'fence', name: 'Barricades', desc: 'A fence ring enemies must smash through first.', max: 12, base: 120, growth: 1.45, value: l => (l ? 160 + 140 * (l - 1) : 0), fmt: v => (v ? `${v} HP each` : 'None') },
  { key: 'turrets', name: 'Auto Turrets', desc: 'Turrets on the house corners shoot enemies.', max: 4, costs: [250, 600, 1100, 1800], value: l => l, fmt: v => `${v} / 4` },
  { key: 'tdmg', name: 'Turret Power', desc: 'More turret damage and fire rate.', max: 12, base: 110, growth: 1.45, value: l => Math.round(9 * (1 + 0.32 * l)), fmt: v => `${v} dmg`, requires: 'turrets' },
  { key: 'spikes', name: 'Spike Traps', desc: 'Spikes on the enemy lanes hurt and slow them.', max: 12, base: 150, growth: 1.45, value: l => (l ? 22 + 20 * (l - 1) : 0), fmt: v => (v ? `${v} dps` : 'None') },
];

export const HERO_UPGRADES = [
  { key: 'hp', name: 'Vitality', desc: 'More hero health.', max: 12, base: 50, growth: 1.45, value: l => 100 + 25 * l, fmt: v => `${v} HP` },
  { key: 'regen', name: 'Nano Heal', desc: 'Heal over time during waves.', max: 8, base: 80, growth: 1.5, value: l => l * 1.5, fmt: v => `${v} HP/s` },
  { key: 'speed', name: 'Agility', desc: 'Move faster.', max: 6, base: 70, growth: 1.55, value: l => 1 + 0.07 * l, fmt: v => `${Math.round(v * 100)}%` },
  { key: 'magnet', name: 'Coin Magnet', desc: 'Pull coins from further away.', max: 8, base: 40, growth: 1.45, value: l => 4 + 1.75 * l, fmt: v => `${v.toFixed(1)} m` },
];

export function upgradeCost(u, lvl) {
  if (u.costs) return u.costs[lvl];
  return Math.round(u.base * Math.pow(u.growth, lvl) / 5) * 5;
}

export const ENEMIES = {
  husk: { name: 'Husk', hp: 45, speed: 3.0, dmg: 9, rate: 1.1, height: 2.1, radius: 0.55, color: 0x86b35e, coins: 4, anim: 'Walking', animSpeed: 1.15, reach: 1.2, widen: 1 },
  runner: { name: 'Runner', hp: 28, speed: 6.2, dmg: 6, rate: 0.8, height: 1.75, radius: 0.45, color: 0xe8b93a, coins: 4, anim: 'Running', animSpeed: 1.1, reach: 1.1, widen: 0.9 },
  brute: { name: 'Brute', hp: 230, speed: 2.1, dmg: 28, rate: 1.6, height: 3.2, radius: 0.95, color: 0xd0473a, coins: 16, anim: 'Walking', animSpeed: 0.8, reach: 1.6, widen: 1.3 },
  boss: { name: 'Storm King', hp: 1900, speed: 1.9, dmg: 60, rate: 1.8, height: 5.8, radius: 1.6, color: 0x8b45e0, coins: 160, anim: 'Walking', animSpeed: 0.65, reach: 2.4, widen: 1.2, emissive: 0x4a1080 },
};

export function waveHpMult(n) { return (1 + 0.2 * (n - 1)) * Math.pow(1.035, Math.max(0, n - 15)); }
export function waveDmgMult(n) { return 1 + 0.09 * (n - 1); }
export function waveCoinMult(n) { return 1 + 0.08 * (n - 1); }
export function waveBonus(n) { return 25 + 12 * n; }
export function isBossWave(n) { return n % 5 === 0; }

export function buildWave(n) {
  const list = [];
  const total = 6 + Math.floor(n * 2.6);
  const runnerP = n >= 3 ? Math.min(0.35, 0.1 + n * 0.02) : 0;
  const bruteP = n >= 4 ? Math.min(0.22, 0.04 + n * 0.012) : 0;
  for (let i = 0; i < total; i++) {
    const r = Math.random();
    let t = 'husk';
    if (r < runnerP) t = 'runner';
    else if (r > 1 - bruteP) t = 'brute';
    list.push(t);
  }
  if (isBossWave(n)) {
    const bosses = 1 + Math.floor(n / 20);
    for (let b = 0; b < bosses; b++) list.splice(Math.floor(list.length * (0.35 + 0.3 * b)), 0, 'boss');
  }
  return list;
}

export function defaultSave() {
  return {
    v: 1, wave: 1, best: 1, coins: 0, kills: 0,
    weapons: { pistol: { owned: true, lv: { dmg: 0, rate: 0, mag: 0, reload: 0 } } },
    equipped: 'pistol',
    house: { hp: 0, armor: 0, regen: 0, fence: 0, turrets: 0, tdmg: 0, spikes: 0 },
    hero: { hp: 0, regen: 0, speed: 0, magnet: 0 },
    settings: { sens: 1, sound: true, autofire: null, quality: 'auto' },
  };
}

function merge(base, extra) {
  if (!extra || typeof extra !== 'object') return base;
  for (const k of Object.keys(extra)) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) base[k] = merge(base[k], extra[k]);
    else base[k] = extra[k];
  }
  return base;
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return merge(defaultSave(), JSON.parse(raw));
  } catch (e) { /* storage unavailable */ }
  return defaultSave();
}

export function writeSave(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}
