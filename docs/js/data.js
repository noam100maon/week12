// Game data: rarities & leveling, weapons, heroes, enemies, build pieces, waves and saving.

export const SAVE_KEY = 'holdout_save_v1';
export const MAX_LEVEL = 160;

// ---------------------------------------------------------------- rarity & levels
export const RARITIES = [
  { id: 'common', name: 'Common', min: 1, css: '#c3c7d1', hex: 0xc3c7d1 },
  { id: 'uncommon', name: 'Uncommon', min: 25, css: '#5fe07c', hex: 0x3fd35e },
  { id: 'rare', name: 'Rare', min: 50, css: '#4db0ff', hex: 0x2f95ff },
  { id: 'epic', name: 'Epic', min: 80, css: '#bd6bff', hex: 0xa447ff },
  { id: 'legendary', name: 'Legendary', min: 110, css: '#ffa23a', hex: 0xff8a1a },
  { id: 'mythic', name: 'Mythic', min: 140, css: '#ffe066', hex: 0xffcf2e },
];

export function rarityIndex(level) {
  let r = 0;
  for (let i = 0; i < RARITIES.length; i++) if (level >= RARITIES[i].min) r = i;
  return r;
}
export function rarityOf(level) { return RARITIES[rarityIndex(level)]; }

// XP needed to go from `level` to `level + 1`.
export function xpToNext(level) { return Math.round(10 + 6 * Math.pow(level, 1.5)); }

// Adds XP to a {level, xp} record. Returns the list of levels reached.
export function addXp(rec, amount) {
  const gained = [];
  if (rec.level >= MAX_LEVEL) return gained;
  rec.xp += amount;
  while (rec.level < MAX_LEVEL && rec.xp >= xpToNext(rec.level)) {
    rec.xp -= xpToNext(rec.level);
    rec.level++;
    gained.push(rec.level);
  }
  if (rec.level >= MAX_LEVEL) rec.xp = 0;
  return gained;
}

// ---------------------------------------------------------------- abilities
// Generic ability effects shared by weapons. `v` holds the tuning values.
export const ABILITY_INFO = {
  crit: (v) => `${Math.round(v.chance * 100)}% chance to deal double damage.`,
  burn: (v) => `Sets enemies on fire for ${v.dur}s (${Math.round(v.f * 100)}% damage per second).`,
  freeze: (v) => `Chills enemies, slowing them ${Math.round(v.slow * 100)}% for ${v.dur}s.`,
  chain: (v) => `Lightning jumps to ${v.n} nearby enemies for ${Math.round(v.f * 100)}% damage.`,
  explode: (v) => `Hits explode for ${Math.round(v.f * 100)}% damage in a ${v.r}m radius.`,
  pierce: (v) => `Shots pierce through ${v.n} extra enem${v.n > 1 ? 'ies' : 'y'}.`,
  multishot: (v) => `Fires ${v.n} extra projectile${v.n > 1 ? 's' : ''} per shot.`,
  executioner: (v) => `+${Math.round(v.f * 100)}% damage to enemies below 35% health.`,
  vampire: (v) => `Heals you for ${Math.round(v.f * 100)}% of damage dealt.`,
  orbital: (v) => `Every ${v.every}th hit calls a storm bolt for ${Math.round(v.f * 100)}% damage.`,
  nova: (v) => `Kills explode for ${Math.round(v.f * 100)}% damage in a ${v.r}m radius.`,
  rapid: (v) => `+${Math.round(v.f * 100)}% fire rate.`,
  bigmag: (v) => `+${Math.round(v.f * 100)}% magazine size.`,
};

// ---------------------------------------------------------------- weapons
// Each weapon unlocks one ability at every new rarity (Uncommon → Mythic).
export const WEAPONS = [
  {
    id: 'pistol', name: 'Pistol', desc: 'Reliable sidearm.', cost: 0, dmg: 18, rate: 3.4, mag: 12, reload: 1.1, spread: 0.012, pellets: 1, range: 70, sound: 'pistol', recoil: 0.012, model: 'blaster', modelScale: 0.34,
    abilities: [
      { key: 'crit', name: 'Lucky Shot', v: { chance: 0.15 } },
      { key: 'burn', name: 'Incendiary Rounds', v: { f: 0.35, dur: 3 } },
      { key: 'chain', name: 'Arc Bullets', v: { n: 2, f: 0.5 } },
      { key: 'executioner', name: 'Finisher', v: { f: 1.0 } },
      { key: 'multishot', name: 'Twin Fang', v: { n: 1 } },
    ],
  },
  {
    id: 'smg', name: 'SMG', desc: 'Sprays bullets fast.', cost: 300, dmg: 10, rate: 11, mag: 35, reload: 1.6, spread: 0.035, pellets: 1, range: 55, sound: 'smg', recoil: 0.006, model: 'blaster-repeater', modelScale: 0.34,
    abilities: [
      { key: 'rapid', name: 'Hair Trigger', v: { f: 0.2 } },
      { key: 'freeze', name: 'Cryo Rounds', v: { slow: 0.35, dur: 2 } },
      { key: 'vampire', name: 'Leech Rounds', v: { f: 0.03 } },
      { key: 'chain', name: 'Storm Chain', v: { n: 2, f: 0.4 } },
      { key: 'orbital', name: 'Storm Call', v: { every: 25, f: 6, r: 3.5 } },
    ],
  },
  {
    id: 'shotgun', name: 'Shotgun', desc: 'Huge close-range burst.', cost: 750, dmg: 12, rate: 1.3, mag: 6, reload: 2.0, spread: 0.075, pellets: 8, range: 32, sound: 'shotgun', recoil: 0.05, model: 'blaster', modelScale: 0.42, stretch: 1.45,
    abilities: [
      { key: 'bigmag', name: 'Extended Tube', v: { f: 0.5 } },
      { key: 'burn', name: "Dragon's Breath", v: { f: 0.25, dur: 3 } },
      { key: 'freeze', name: 'Frost Blast', v: { slow: 0.4, dur: 2.5 } },
      { key: 'explode', name: 'Blast Shells', v: { r: 2.2, f: 0.35 } },
      { key: 'nova', name: 'Chain Reaction', v: { r: 4, f: 1.5 } },
    ],
  },
  {
    id: 'rifle', name: 'Assault Rifle', desc: 'Accurate full-auto power.', cost: 1500, dmg: 24, rate: 7.5, mag: 30, reload: 1.8, spread: 0.016, pellets: 1, range: 90, sound: 'rifle', recoil: 0.01, model: 'blaster-a', modelScale: 0.36,
    abilities: [
      { key: 'crit', name: 'Marksman', v: { chance: 0.2 } },
      { key: 'pierce', name: 'Armor Piercing', v: { n: 1 } },
      { key: 'burn', name: 'Tracer Fire', v: { f: 0.3, dur: 3 } },
      { key: 'explode', name: 'HE Rounds', v: { r: 2.5, f: 0.4 } },
      { key: 'orbital', name: 'Orbital Strike', v: { every: 20, f: 8, r: 4 } },
    ],
  },
  {
    id: 'sniper', name: 'Sniper', desc: 'Pierces through 4 enemies.', cost: 2600, dmg: 150, rate: 0.9, mag: 5, reload: 2.4, spread: 0.0, pellets: 1, range: 150, pierce: 4, headMult: 2.5, sound: 'sniper', recoil: 0.06, model: 'blaster-a', modelScale: 0.4, stretch: 1.35, scope: true,
    abilities: [
      { key: 'executioner', name: 'Headhunter', v: { f: 1.0 } },
      { key: 'chain', name: 'Arc Rail', v: { n: 3, f: 0.5 } },
      { key: 'freeze', name: 'Frozen Heart', v: { slow: 0.5, dur: 3 } },
      { key: 'nova', name: 'Shatter', v: { r: 4, f: 1.0 } },
      { key: 'multishot', name: 'Trinity', v: { n: 2 } },
    ],
  },
  {
    id: 'rocket', name: 'Rocket Launcher', desc: 'Explosive splash damage.', cost: 4500, dmg: 170, rate: 0.8, mag: 3, reload: 2.8, spread: 0.004, pellets: 1, range: 120, splash: 4.8, projectile: true, sound: 'rocket', recoil: 0.07, model: 'tube',
    abilities: [
      { key: 'bigmag', name: 'Extra Rack', v: { f: 0.67 } },
      { key: 'freeze', name: 'Cryo Warhead', v: { slow: 0.5, dur: 3 } },
      { key: 'burn', name: 'Napalm', v: { f: 0.2, dur: 4 } },
      { key: 'multishot', name: 'Cluster Salvo', v: { n: 2 } },
      { key: 'nova', name: 'Apocalypse', v: { r: 5, f: 1.2 } },
    ],
  },
];

export function weaponById(id) { return WEAPONS.find(w => w.id === id); }

// Active abilities for a given level (one per rarity above Common).
export function activeAbilities(list, level) {
  const r = rarityIndex(level);
  return list.slice(0, r);
}

export function weaponStats(w, level) {
  const L = level - 1;
  const ab = activeAbilities(w.abilities, level);
  let rate = w.rate * (1 + 0.004 * L);
  let mag = w.mag * (1 + 0.005 * L);
  for (const a of ab) {
    if (a.key === 'rapid') rate *= 1 + a.v.f;
    if (a.key === 'bigmag') mag *= 1 + a.v.f;
  }
  return {
    dmg: w.dmg * (1 + 0.035 * L) * (1 + 0.1 * rarityIndex(level)),
    rate,
    mag: Math.max(1, Math.round(mag)),
    reload: w.reload * Math.max(0.6, 1 - 0.0025 * L),
    abilities: ab,
  };
}

// ---------------------------------------------------------------- heroes
export const HEROES = [
  {
    id: 'rex', name: 'Rex', role: 'Soldier', model: 'survivor-male', cost: 0,
    passive: '+15% weapon damage.',
    active: { name: 'Frag Grenade', cd: 9, desc: 'Throw a grenade that explodes on impact.' },
    perks: [
      { key: 'reload', name: 'Quick Hands', desc: '+20% reload speed.' },
      { key: 'bigboom', name: 'Bigger Boom', desc: 'Grenade radius +50%.' },
      { key: 'adrenaline', name: 'Adrenaline', desc: '+30% fire rate for 4s after a kill.' },
      { key: 'cluster', name: 'Cluster Frag', desc: 'Grenades split into 3 bomblets.' },
      { key: 'warmachine', name: 'War Machine', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'bolt', name: 'Bolt', role: 'Tank', model: 'robot', cost: 400,
    passive: '+30% max health.',
    active: { name: 'Overshield', cd: 20, desc: 'Become invulnerable for 4s and release a shockwave.' },
    perks: [
      { key: 'plating', name: 'Heavy Plating', desc: '+20% max health.' },
      { key: 'absorb', name: 'Shock Absorbers', desc: 'Take 15% less damage.' },
      { key: 'static', name: 'Static Field', desc: 'Enemies near you take constant shock damage.' },
      { key: 'reboot', name: 'Reboot', desc: 'Once per wave, revive with 50% health.' },
      { key: 'titan', name: 'Titan Core', desc: 'Overshield lasts 7s and heals 30%.' },
    ],
  },
  {
    id: 'nova', name: 'Nova', role: 'Ninja', model: 'survivor-female', cost: 700,
    passive: '+20% move speed.',
    active: { name: 'Shadow Dash', cd: 6, desc: 'Dash forward, slicing enemies in your path.' },
    perks: [
      { key: 'lightfeet', name: 'Light Feet', desc: '+10% move speed.' },
      { key: 'blades', name: 'Blade Trail', desc: 'Dash damage +100%.' },
      { key: 'secondwind', name: 'Second Wind', desc: 'Dashing heals 12% health.' },
      { key: 'doubledash', name: 'Double Dash', desc: 'Dash has 2 charges.' },
      { key: 'critblades', name: 'Killer Instinct', desc: '+20% crit chance with every weapon.' },
    ],
  },
  {
    id: 'cyra', name: 'Cyra', role: 'Constructor', model: 'cyborg-female', cost: 1000,
    passive: 'Structures +30% health. House takes 10% less damage.',
    active: { name: 'Deploy Turret', cd: 18, desc: 'Drop an auto-turret for 20s.' },
    perks: [
      { key: 'basekit', name: 'B.A.S.E. Kit', desc: 'House repairs 6 HP/s during waves.' },
      { key: 'overclock', name: 'Overclocked', desc: 'Traps and turrets deal +30% damage.' },
      { key: 'twin', name: 'Twin Deploy', desc: 'Deploy 2 turrets at once.' },
      { key: 'fortify', name: 'Fortify', desc: 'Structures +30% more health.' },
      { key: 'ironwill', name: 'Iron Will', desc: 'House takes 15% less damage.' },
    ],
  },
  {
    id: 'doc', name: 'Doc', role: 'Medic', model: 'male', cost: 1400,
    passive: 'Regenerate 3 HP/s.',
    active: { name: 'Heal Pulse', cd: 16, desc: 'Heal 40% health and repair the house 10%.' },
    perks: [
      { key: 'vital', name: 'Vitality', desc: '+25% max health.' },
      { key: 'fieldmedic', name: 'Field Medic', desc: 'Heal Pulse also fully repairs walls.' },
      { key: 'boost', name: 'Adrenal Boost', desc: 'Heal Pulse grants +30% damage for 6s.' },
      { key: 'lifeline', name: 'Lifeline', desc: 'Regeneration doubled.' },
      { key: 'miracle', name: 'Miracle', desc: 'Heal Pulse rebuilds destroyed walls.' },
    ],
  },
  {
    id: 'skye', name: 'Skye', role: 'Outlander', model: 'skater-male', cost: 2000,
    passive: '+25% coins and +4m coin magnet.',
    active: { name: 'Lightning Rod', cd: 12, desc: 'Strike up to 5 enemies near your crosshair.' },
    perks: [
      { key: 'treasure', name: 'Treasure Hunter', desc: '+15% more coins.' },
      { key: 'overcharge', name: 'Overcharge', desc: 'Lightning damage +60%.' },
      { key: 'magnet', name: 'Magnet Field', desc: '+4m coin magnet.' },
      { key: 'chainstorm', name: 'Chain Storm', desc: 'Lightning hits 9 enemies.' },
      { key: 'jackpot', name: 'Jackpot', desc: 'Kills have a 10% chance to drop triple coins.' },
    ],
  },
];

export function heroById(id) { return HEROES.find(h => h.id === id); }

export function heroPerks(h, level) { return activeAbilities(h.perks, level); }

export function heroStats(h, level) {
  const L = level - 1;
  const perks = new Set(heroPerks(h, level).map(p => p.key));
  let hp = 100 * (1 + 0.01 * L);
  if (h.id === 'bolt') hp *= 1.3;
  if (perks.has('plating')) hp *= 1.2;
  if (perks.has('vital')) hp *= 1.25;
  let speed = 1;
  if (h.id === 'nova') speed *= 1.2;
  if (perks.has('lightfeet')) speed *= 1.1;
  let dmg = 1 + 0.002 * L;
  if (h.id === 'rex') dmg *= 1.15;
  if (perks.has('warmachine')) dmg *= 1.25;
  let regen = h.id === 'doc' ? 3 : 0.5 + 0.02 * L;
  if (perks.has('lifeline')) regen *= 2;
  return {
    hp: Math.round(hp), speed, dmg, regen,
    power: 1 + 0.025 * L,      // active ability strength
    armor: perks.has('absorb') ? 0.15 : 0,
    coinMult: (h.id === 'skye' ? 1.25 : 1) * (perks.has('treasure') ? 1.15 : 1),
    magnet: 5 + (h.id === 'skye' ? 4 : 0) + (perks.has('magnet') ? 4 : 0),
    perks,
  };
}

// ---------------------------------------------------------------- pets (level by use, like heroes)
export const PET_INFO = {
  power: () => '+35% pet damage.',
  frenzy: () => '+30% pet attack speed.',
  burn: () => 'Attacks set enemies on fire.',
  freeze: () => 'Attacks chill and slow enemies.',
  splash: () => 'Attacks also hit enemies nearby.',
  chain: () => 'Attacks arc lightning to 2 more enemies.',
  magnet: () => '+5m coin magnet.',
  coins: () => '+12% coins.',
  guard: () => 'You take 10% less damage.',
  repair: () => 'The house repairs 5 HP/s.',
  heal: () => 'Heals you 2 HP/s.',
  double: () => 'Attacks hit a second enemy.',
  crit: () => '25% chance for triple damage.',
  swift: () => 'You move 8% faster.',
  roar: () => 'Roar more often and wider.',
};

export const PET_PERK_NAMES = {
  power: 'Power Up', frenzy: 'Frenzy', burn: 'Fire Bite', freeze: 'Frost Bite', splash: 'Splash Attack', chain: 'Static Shock',
  magnet: 'Coin Magnet', coins: 'Treasure Nose', guard: 'Bodyguard', repair: 'Handy Paws', heal: 'Healing Hug',
  double: 'Double Trouble', crit: 'Lucky Strike', swift: 'Zoomies', roar: 'Mighty Roar',
};

export const PETS = [
  { id: 'chick', name: 'Nugget', model: 'pet-chick', cost: 0, kind: 'melee', dmg: 8, rate: 1.4, speed: 9, desc: 'A brave little chick that pecks nearby enemies.', perks: ['frenzy', 'power', 'coins', 'crit', 'double'] },
  { id: 'dog', name: 'Biscuit', model: 'pet-dog', cost: 350, kind: 'melee', dmg: 16, rate: 1.2, speed: 10, desc: 'Loyal dog that chases down enemies and bites.', perks: ['power', 'frenzy', 'guard', 'crit', 'splash'] },
  { id: 'cat', name: 'Whiskers', model: 'pet-cat', cost: 600, kind: 'melee', dmg: 11, rate: 2.2, speed: 11, desc: 'Lightning-fast pounces that shred enemies.', perks: ['crit', 'frenzy', 'swift', 'power', 'double'] },
  { id: 'penguin', name: 'Frosty', model: 'pet-penguin', cost: 900, kind: 'ranged', dmg: 12, rate: 1.1, speed: 8, range: 16, color: 0x9fe8ff, desc: 'Throws snowballs that slow enemies.', perks: ['freeze', 'power', 'frenzy', 'splash', 'double'] },
  { id: 'bee', name: 'Buzz', model: 'pet-bee', cost: 1200, kind: 'ranged', fly: 1.8, dmg: 9, rate: 2.6, speed: 11, range: 14, color: 0xffd23c, desc: 'Flying stinger that zaps enemies from the air.', perks: ['frenzy', 'chain', 'power', 'double', 'crit'] },
  { id: 'panda', name: 'Bamboo', model: 'pet-panda', cost: 1500, kind: 'support', dmg: 10, rate: 1, speed: 8, desc: 'Heals you and repairs the house.', perks: ['heal', 'repair', 'guard', 'power', 'heal'] },
  { id: 'parrot', name: 'Rio', model: 'pet-parrot', cost: 1800, kind: 'collector', fly: 2.2, dmg: 10, rate: 1.6, speed: 12, range: 12, color: 0xff6b3a, desc: 'Grabs coins from far away and pecks enemies.', perks: ['magnet', 'coins', 'frenzy', 'coins', 'power'] },
  { id: 'fox', name: 'Ember', model: 'pet-fox', cost: 2400, kind: 'melee', dmg: 20, rate: 1.3, speed: 11, desc: 'Fire fox. Its bites burn.', perks: ['burn', 'power', 'splash', 'frenzy', 'chain'] },
  { id: 'tiger', name: 'Stripes', model: 'pet-tiger', cost: 3200, kind: 'melee', dmg: 34, rate: 0.9, speed: 10, desc: 'Huge claw swipes that hit everything around.', perks: ['splash', 'power', 'crit', 'frenzy', 'burn'] },
  { id: 'lion', name: 'King', model: 'pet-lion', cost: 4200, kind: 'roar', dmg: 26, rate: 1, speed: 10, desc: 'Bites, and roars to damage and slow every enemy nearby.', perks: ['roar', 'power', 'guard', 'freeze', 'roar'] },
];
export function petById(id) { return PETS.find(p => p.id === id); }

export function petStats(p, level) {
  const L = level - 1;
  const perks = activeAbilities(p.perks, level);
  const count = (k) => perks.filter(x => x === k).length;
  return {
    dmg: p.dmg * (1 + 0.035 * L) * (1 + 0.1 * rarityIndex(level)) * Math.pow(1.35, count('power')),
    rate: p.rate * Math.pow(1.3, count('frenzy')),
    perks: new Set(perks),
    count,
  };
}

// The house grows automatically as you reach higher waves.
export function houseTier(wave) { return wave >= 35 ? 3 : wave >= 20 ? 2 : wave >= 10 ? 1 : 0; }
export function houseMaxHp(wave) { return Math.round(700 * (1 + 0.14 * (wave - 1))); }

// ---------------------------------------------------------------- build pieces
export const BUILD_PIECES = [
  { id: 'wood', name: 'Wood Wall', kind: 'wall', cost: 25, hp: 350, color: '#b47a45', desc: 'Cheap wall. Blocks enemies.' },
  { id: 'stone', name: 'Brick Wall', kind: 'wall', cost: 60, hp: 900, color: '#b5553e', desc: 'Sturdy brick wall.' },
  { id: 'metal', name: 'Metal Wall', kind: 'wall', cost: 140, hp: 2200, color: '#8a98a8', desc: 'Toughest wall.' },
  { id: 'spikes', name: 'Spike Trap', kind: 'trap', cost: 80, dps: 34, color: '#d8dee6', desc: 'Hurts enemies walking over it.' },
  { id: 'freeze', name: 'Freeze Trap', kind: 'trap', cost: 100, dps: 10, slow: 0.55, color: '#7fe3ff', desc: 'Slows enemies a lot.' },
  { id: 'turret', name: 'Turret Tower', kind: 'turret', cost: 250, dmg: 12, rate: 3, range: 24, color: '#3cc8ff', desc: 'Shoots enemies in range.' },
];
export const MAX_STRUCTURES = 48;
export const CELL = 2;

// ---------------------------------------------------------------- enemies
export const ENEMIES = {
  husk: { name: 'Husk', model: 'zombie-1', hp: 45, speed: 2.9, dmg: 9, rate: 1.1, height: 1.9, radius: 0.5, coins: 4, reach: 1.0, minWave: 1, weight: 10 },
  runner: { name: 'Runner', model: 'zombie-2', hp: 26, speed: 6.0, dmg: 6, rate: 0.8, height: 1.75, radius: 0.45, coins: 4, reach: 0.9, minWave: 2, weight: 5, tint: 0xffe2a8, fast: true },
  spitter: { name: 'Spitter', model: 'zombie-1', hp: 38, speed: 2.5, dmg: 11, rate: 2.4, height: 1.85, radius: 0.5, coins: 6, reach: 1.0, minWave: 3, weight: 4, tint: 0x9dff7a, ranged: 13, glow: 0x3aff3a },
  exploder: { name: 'Exploder', model: 'robot', hp: 30, speed: 4.4, dmg: 70, rate: 1, height: 1.4, radius: 0.45, coins: 6, reach: 0.9, minWave: 4, weight: 3, color: 0xffc42e, emissive: 0x6a3a00, explode: 3.8 },
  brute: { name: 'Smasher', model: 'robot', hp: 240, speed: 2.1, dmg: 28, rate: 1.6, height: 3.2, radius: 0.95, coins: 16, reach: 1.5, minWave: 5, weight: 2, color: 0xd0473a, widen: 1.3, wallMult: 2 },
  drone: { name: 'Storm Drone', model: 'drone', hp: 40, speed: 4.2, dmg: 7, rate: 1.4, height: 1.2, radius: 0.6, coins: 7, reach: 1, minWave: 6, weight: 3, ranged: 15, fly: 4.5 },
  shielder: { name: 'Riot Husk', model: 'zombie-2', hp: 90, speed: 2.4, dmg: 12, rate: 1.2, height: 1.95, radius: 0.55, coins: 9, reach: 1.0, minWave: 7, weight: 2, tint: 0x9fb4d0, shield: true },
  warden: { name: 'Warden', model: 'cyborg-female', hp: 75, speed: 2.6, dmg: 8, rate: 1.5, height: 1.95, radius: 0.5, coins: 12, reach: 1.0, minWave: 9, weight: 1.5, tint: 0xd8a8ff, healer: true, keepAway: 12 },
  boss: { name: 'Storm King', model: 'robot', hp: 1900, speed: 1.9, dmg: 60, rate: 1.8, height: 5.8, radius: 1.6, coins: 160, reach: 2.4, minWave: 5, weight: 0, color: 0x8b45e0, emissive: 0x4a1080, widen: 1.2, boss: true, wallMult: 3 },
};

export function waveHpMult(n) { return (1 + 0.2 * (n - 1)) * Math.pow(1.035, Math.max(0, n - 15)); }
export function waveDmgMult(n) { return 1 + 0.09 * (n - 1); }
export function waveCoinMult(n) { return 1 + 0.08 * (n - 1); }
export function waveBonus(n) { return 25 + 12 * n; }
export function isBossWave(n) { return n % 5 === 0; }
export function portalCount(n) { return Math.min(4, 1 + Math.floor((n - 1) / 2)); }

// Deterministic wave recipe so the preview warning matches the real wave.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function buildWave(n) {
  const r = rng(n * 7919 + 17);
  const total = 6 + Math.floor(n * 2.6);
  const types = Object.entries(ENEMIES).filter(([, d]) => d.weight > 0 && d.minWave <= n);
  // the husk share shrinks as more types unlock
  const weights = types.map(([k, d]) => (k === 'husk' ? d.weight + Math.max(0, 8 - n) : d.weight));
  const sum = weights.reduce((a, b) => a + b, 0);
  const portals = portalCount(n);
  const list = [];
  for (let i = 0; i < total; i++) {
    let x = r() * sum, t = 'husk';
    for (let k = 0; k < types.length; k++) { x -= weights[k]; if (x <= 0) { t = types[k][0]; break; } }
    list.push({ type: t, portal: Math.floor(r() * portals) });
  }
  if (isBossWave(n)) {
    const bosses = 1 + Math.floor(n / 20);
    for (let b = 0; b < bosses; b++) list.splice(Math.floor(list.length * (0.35 + 0.3 * b)), 0, { type: 'boss', portal: b % portals });
  }
  return list;
}

export function waveSummary(n) {
  const list = buildWave(n);
  const counts = {};
  const portals = new Set();
  for (const s of list) { counts[s.type] = (counts[s.type] || 0) + 1; portals.add(s.portal); }
  return { total: list.length, counts, portals: [...portals].sort() };
}

// ---------------------------------------------------------------- save
export function defaultSave() {
  return {
    v: 2, t: 0, wave: 1, best: 1, coins: 150, kills: 0,
    weapons: { pistol: { owned: true, level: 1, xp: 0 } },
    equipped: 'pistol',
    heroes: { rex: { owned: true, level: 1, xp: 0 } },
    hero: 'rex',
    pets: { chick: { owned: true, level: 1, xp: 0 } },
    pet: 'chick',
    structures: [],
    settings: { sens: 1, sound: true, autofire: null, quality: 'auto' },
  };
}

function merge(base, extra) {
  if (!extra || typeof extra !== 'object') return base;
  for (const k of Object.keys(extra)) {
    if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k])) base[k] = merge(base[k], extra[k]);
    else base[k] = extra[k];
  }
  return base;
}

// Upgrades an old (v1) save: keeps wave, coins and unlocked guns; refunds old gun upgrades as levels.
function migrate(raw) {
  if (!raw || raw.v === 2) return raw;
  const out = { wave: raw.wave || 1, best: raw.best || 1, coins: raw.coins || 0, kills: raw.kills || 0, settings: raw.settings, weapons: {}, equipped: raw.equipped || 'pistol' };
  for (const [id, w] of Object.entries(raw.weapons || {})) {
    if (!w.owned) continue;
    const ups = Object.values(w.lv || {}).reduce((a, b) => a + b, 0);
    out.weapons[id] = { owned: true, level: Math.min(24, 1 + ups * 2), xp: 0 };
  }
  return out;
}

export function parseSave(json) {
  try {
    const raw = typeof json === 'string' ? JSON.parse(json) : json;
    const s = merge(defaultSave(), migrate(raw));
    if (!s.weapons.pistol) s.weapons.pistol = { owned: true, level: 1, xp: 0 };
    if (!s.heroes.rex) s.heroes.rex = { owned: true, level: 1, xp: 0 };
    if (!s.pets || !s.pets.chick) s.pets = Object.assign({ chick: { owned: true, level: 1, xp: 0 } }, s.pets || {});
    if (!s.pets[s.pet]?.owned) s.pet = 'chick';
    delete s.house;
    if (!s.weapons[s.equipped]?.owned) s.equipped = 'pistol';
    if (!s.heroes[s.hero]?.owned) s.hero = 'rex';
    if (!Array.isArray(s.structures)) s.structures = [];
    return s;
  } catch (e) { return null; }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) { const s = parseSave(raw); if (s) return s; }
  } catch (e) { /* storage unavailable */ }
  return defaultSave();
}

export function writeLocal(s) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
}
