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
  {
    id: 'revolver', name: 'Revolver', desc: 'Six heavy shots. Huge headshots.', cost: 500, dmg: 62, rate: 1.7, mag: 6, reload: 1.9, spread: 0.006, pellets: 1, range: 80, headMult: 2.6, sound: 'sniper', recoil: 0.04, model: 'blaster', modelScale: 0.36, stretch: 1.2, tint: 0x9a8a70,
    abilities: [
      { key: 'crit', name: 'Hot Hand', v: { chance: 0.2 } },
      { key: 'pierce', name: 'Magnum Rounds', v: { n: 1 } },
      { key: 'executioner', name: 'Dead Eye', v: { f: 1.2 } },
      { key: 'explode', name: 'Dynamite Slugs', v: { r: 2.2, f: 0.5 } },
      { key: 'chain', name: 'Thunder Six', v: { n: 3, f: 0.6 } },
    ],
  },
  {
    id: 'burst', name: 'Burst Rifle', desc: 'Fires tight 3-round bursts.', cost: 1000, dmg: 17, rate: 3.2, mag: 30, reload: 1.7, spread: 0.012, pellets: 3, range: 85, sound: 'rifle', recoil: 0.018, model: 'blaster-a', modelScale: 0.34, tint: 0x7ab0ff,
    abilities: [
      { key: 'rapid', name: 'Trigger Discipline', v: { f: 0.2 } },
      { key: 'crit', name: 'Grouping', v: { chance: 0.15 } },
      { key: 'chain', name: 'Shock Burst', v: { n: 2, f: 0.4 } },
      { key: 'bigmag', name: 'Drum Mag', v: { f: 0.5 } },
      { key: 'orbital', name: 'Triple Strike', v: { every: 18, f: 7, r: 3.5 } },
    ],
  },
  {
    id: 'flamer', name: 'Flamethrower', desc: 'Short-range fire stream that burns everything.', cost: 1300, dmg: 5, rate: 14, mag: 80, reload: 2.4, spread: 0.07, pellets: 2, range: 13, sound: 'smg', recoil: 0.002, model: 'blaster-repeater', modelScale: 0.4, stretch: 1.3, tint: 0xff8a3a, flame: true,
    base: [{ key: 'burn', v: { f: 0.6, dur: 3 } }],
    abilities: [
      { key: 'bigmag', name: 'Big Tank', v: { f: 0.5 } },
      { key: 'rapid', name: 'Pressure Valve', v: { f: 0.25 } },
      { key: 'explode', name: 'Fireballs', v: { r: 1.8, f: 0.3 } },
      { key: 'vampire', name: 'Soul Fire', v: { f: 0.02 } },
      { key: 'nova', name: 'Inferno', v: { r: 4, f: 1.4 } },
    ],
  },
  {
    id: 'freezeray', name: 'Freeze Ray', desc: 'Icy beam that slows enemies to a crawl.', cost: 1700, dmg: 9, rate: 9, mag: 40, reload: 2, spread: 0.01, pellets: 1, range: 45, sound: 'smg', recoil: 0.003, model: 'blaster', modelScale: 0.4, stretch: 1.3, tint: 0x9fe8ff, beamColor: 0x9fe8ff,
    base: [{ key: 'freeze', v: { slow: 0.45, dur: 2 } }],
    abilities: [
      { key: 'rapid', name: 'Cold Snap', v: { f: 0.2 } },
      { key: 'pierce', name: 'Ice Lance', v: { n: 1 } },
      { key: 'executioner', name: 'Shatter Point', v: { f: 1.0 } },
      { key: 'chain', name: 'Frost Arc', v: { n: 2, f: 0.5 } },
      { key: 'nova', name: 'Absolute Zero', v: { r: 4, f: 1.2 } },
    ],
  },
  {
    id: 'tesla', name: 'Tesla Gun', desc: 'Lightning jumps between enemies.', cost: 2100, dmg: 22, rate: 3, mag: 20, reload: 2, spread: 0.01, pellets: 1, range: 40, sound: 'sniper', recoil: 0.01, model: 'blaster-repeater', modelScale: 0.38, tint: 0xb0d8ff, beamColor: 0xbfe6ff,
    base: [{ key: 'chain', v: { n: 3, f: 0.6 } }],
    abilities: [
      { key: 'rapid', name: 'Capacitors', v: { f: 0.2 } },
      { key: 'chain', name: 'Overload', v: { n: 2, f: 0.5 } },
      { key: 'freeze', name: 'Stun Field', v: { slow: 0.4, dur: 1.5 } },
      { key: 'bigmag', name: 'Battery Pack', v: { f: 0.6 } },
      { key: 'orbital', name: 'Thunderstorm', v: { every: 15, f: 6, r: 4 } },
    ],
  },
  {
    id: 'dbarrel', name: 'Double Barrel', desc: 'Two shells, devastating point blank.', cost: 2300, dmg: 14, rate: 1.6, mag: 2, reload: 1.6, spread: 0.09, pellets: 12, range: 24, sound: 'shotgun', recoil: 0.07, model: 'blaster', modelScale: 0.44, stretch: 1.6, tint: 0x6a4a3a,
    abilities: [
      { key: 'bigmag', name: 'Third Barrel', v: { f: 0.5 } },
      { key: 'burn', name: 'Incendiary Shells', v: { f: 0.25, dur: 3 } },
      { key: 'executioner', name: 'Coup de Grace', v: { f: 1.0 } },
      { key: 'explode', name: 'Frag Shells', v: { r: 2, f: 0.3 } },
      { key: 'vampire', name: 'Bloodlust', v: { f: 0.02 } },
    ],
  },
  {
    id: 'crossbow', name: 'Crossbow', desc: 'Silent bolts that pierce 3 enemies.', cost: 2800, dmg: 95, rate: 1.2, mag: 8, reload: 2, spread: 0, pellets: 1, range: 110, pierce: 3, headMult: 2.2, sound: 'pistol', recoil: 0.02, model: 'blaster-a', modelScale: 0.34, stretch: 0.9, tint: 0x8a6a3a, beamColor: 0xe8d8a0,
    abilities: [
      { key: 'pierce', name: 'Broadheads', v: { n: 2 } },
      { key: 'freeze', name: 'Frost Bolts', v: { slow: 0.4, dur: 2 } },
      { key: 'explode', name: 'Explosive Tips', v: { r: 2.5, f: 0.5 } },
      { key: 'multishot', name: 'Twin Bolts', v: { n: 1 } },
      { key: 'nova', name: 'Hunter\'s Mark', v: { r: 4, f: 1.3 } },
    ],
  },
  {
    id: 'minigun', name: 'Minigun', desc: 'A wall of bullets. Huge magazine.', cost: 3400, dmg: 11, rate: 18, mag: 150, reload: 3.6, spread: 0.045, pellets: 1, range: 70, sound: 'smg', recoil: 0.003, model: 'blaster-repeater', modelScale: 0.46, stretch: 1.5, tint: 0x5a5a60,
    abilities: [
      { key: 'crit', name: 'Hot Barrels', v: { chance: 0.12 } },
      { key: 'burn', name: 'Tracer Belt', v: { f: 0.25, dur: 2 } },
      { key: 'vampire', name: 'Leech Belt', v: { f: 0.015 } },
      { key: 'pierce', name: 'AP Belt', v: { n: 1 } },
      { key: 'orbital', name: 'Bullet Hell', v: { every: 40, f: 8, r: 4 } },
    ],
  },
  {
    id: 'glauncher', name: 'Grenade Launcher', desc: 'Lobbed grenades that bounce into crowds.', cost: 3800, dmg: 120, rate: 1.4, mag: 6, reload: 2.6, spread: 0.01, pellets: 1, range: 60, splash: 4, projectile: true, lob: true, sound: 'rocket', recoil: 0.05, model: 'tube', tint: 0x4a6a3a,
    abilities: [
      { key: 'bigmag', name: 'Bandolier', v: { f: 0.5 } },
      { key: 'burn', name: 'Fire Grenades', v: { f: 0.25, dur: 3 } },
      { key: 'multishot', name: 'Double Tap', v: { n: 1 } },
      { key: 'freeze', name: 'Cryo Grenades', v: { slow: 0.5, dur: 3 } },
      { key: 'nova', name: 'Carpet Bomb', v: { r: 5, f: 1 } },
    ],
  },
  {
    id: 'railgun', name: 'Railgun', desc: 'Pierces every enemy in a line.', cost: 5200, dmg: 260, rate: 0.6, mag: 4, reload: 2.8, spread: 0, pellets: 1, range: 160, pierce: 99, headMult: 2, sound: 'sniper', recoil: 0.08, model: 'blaster-a', modelScale: 0.42, stretch: 1.6, tint: 0x3a5a8a, beamColor: 0x6fdcff, beamWidth: 0.16,
    abilities: [
      { key: 'rapid', name: 'Quick Charge', v: { f: 0.3 } },
      { key: 'chain', name: 'Ion Arc', v: { n: 3, f: 0.5 } },
      { key: 'freeze', name: 'Cryo Rail', v: { slow: 0.5, dur: 3 } },
      { key: 'executioner', name: 'Annihilate', v: { f: 1.0 } },
      { key: 'orbital', name: 'Satellite Link', v: { every: 6, f: 3, r: 4 } },
    ],
  },
  {
    id: 'plasma', name: 'Plasma Cannon', desc: 'Glowing plasma orbs that blow up.', cost: 6500, dmg: 140, rate: 1.5, mag: 8, reload: 2.4, spread: 0.006, pellets: 1, range: 100, splash: 3.6, projectile: true, sound: 'rocket', recoil: 0.04, model: 'tube', tint: 0x7a3aff, plasma: true,
    base: [{ key: 'chain', v: { n: 2, f: 0.3 } }],
    abilities: [
      { key: 'rapid', name: 'Overcharge', v: { f: 0.25 } },
      { key: 'burn', name: 'Plasma Burn', v: { f: 0.3, dur: 3 } },
      { key: 'multishot', name: 'Split Orb', v: { n: 1 } },
      { key: 'bigmag', name: 'Fusion Core', v: { f: 0.5 } },
      { key: 'nova', name: 'Supernova', v: { r: 6, f: 1.5 } },
    ],
  },
  {
    id: 'laser', name: 'Laser Rifle', desc: 'Fast red beams that pierce two enemies.', cost: 7200, dmg: 17, rate: 8, mag: 40, reload: 1.8, spread: 0.004, pellets: 1, range: 75, pierce: 2, sound: 'rifle', recoil: 0.006, model: 'blaster-a', modelScale: 0.36, stretch: 1.2, tint: 0xff5a5a, beamColor: 0xff3a3a, beamWidth: 0.06,
    abilities: [
      { key: 'rapid', name: 'Focus Lens', v: { f: 0.2 } },
      { key: 'burn', name: 'Searing Beam', v: { f: 0.25, dur: 2 } },
      { key: 'pierce', name: 'Refraction', v: { n: 2 } },
      { key: 'crit', name: 'Overheat', v: { chance: 0.15 } },
      { key: 'orbital', name: 'Orbital Laser', v: { every: 20, f: 8, r: 4 } },
    ],
  },
  {
    id: 'shockshot', name: 'Shock Shotgun', desc: 'Every pellet arcs lightning to another enemy.', cost: 7800, dmg: 12, rate: 1.4, mag: 8, reload: 2.1, spread: 0.07, pellets: 8, range: 26, sound: 'shotgun', recoil: 0.06, model: 'blaster', modelScale: 0.42, stretch: 1.3, tint: 0x6fb8ff, beamColor: 0x9fd8ff,
    base: [{ key: 'chain', v: { n: 1, f: 0.5 } }],
    abilities: [
      { key: 'bigmag', name: 'Capacitor Shells', v: { f: 0.5 } },
      { key: 'freeze', name: 'Stun Pellets', v: { slow: 0.4, dur: 1.2 } },
      { key: 'chain', name: 'Storm Shells', v: { n: 2, f: 0.4 } },
      { key: 'executioner', name: 'Overcharge', v: { f: 0.8 } },
      { key: 'nova', name: 'Thunderclap', v: { r: 4, f: 1.2 } },
    ],
  },
  {
    id: 'acid', name: 'Acid Launcher', desc: 'Lobs acid that leaves a burning puddle.', cost: 8400, dmg: 60, rate: 1.3, mag: 6, reload: 2.4, spread: 0.01, pellets: 1, range: 55, splash: 3, projectile: true, lob: true, pool: true, sound: 'rocket', recoil: 0.04, model: 'tube', tint: 0x6aff3a,
    abilities: [
      { key: 'bigmag', name: 'Big Canisters', v: { f: 0.5 } },
      { key: 'freeze', name: 'Sticky Goo', v: { slow: 0.45, dur: 2.5 } },
      { key: 'multishot', name: 'Double Splash', v: { n: 1 } },
      { key: 'vampire', name: 'Leech Acid', v: { f: 0.02 } },
      { key: 'nova', name: 'Meltdown', v: { r: 5, f: 1.2 } },
    ],
  },
  {
    id: 'cluster', name: 'Cluster Bomb', desc: 'Rockets burst into five extra explosions.', cost: 9200, dmg: 110, rate: 0.9, mag: 4, reload: 2.8, spread: 0.01, pellets: 1, range: 90, splash: 3.5, projectile: true, cluster: true, sound: 'rocket', recoil: 0.07, model: 'tube', tint: 0xff9a3a,
    abilities: [
      { key: 'bigmag', name: 'Extra Tubes', v: { f: 0.5 } },
      { key: 'burn', name: 'Napalm', v: { f: 0.3, dur: 3 } },
      { key: 'multishot', name: 'Twin Rockets', v: { n: 1 } },
      { key: 'rapid', name: 'Autoloader', v: { f: 0.3 } },
      { key: 'nova', name: 'Chain Reaction', v: { r: 5, f: 1.2 } },
    ],
  },
  {
    id: 'gatlaser', name: 'Gatling Laser', desc: 'A storm of green laser bolts.', cost: 10000, dmg: 8, rate: 22, mag: 200, reload: 3.8, spread: 0.035, pellets: 1, range: 65, sound: 'smg', recoil: 0.002, model: 'blaster-repeater', modelScale: 0.46, stretch: 1.5, tint: 0x5aff8a, beamColor: 0x5aff8a,
    abilities: [
      { key: 'crit', name: 'Hot Coils', v: { chance: 0.12 } },
      { key: 'pierce', name: 'Phase Bolts', v: { n: 1 } },
      { key: 'burn', name: 'Plasma Burn', v: { f: 0.2, dur: 2 } },
      { key: 'vampire', name: 'Energy Siphon', v: { f: 0.012 } },
      { key: 'orbital', name: 'Laser Rain', v: { every: 45, f: 9, r: 4 } },
    ],
  },
  {
    id: 'ripsaw', name: 'Ripsaw Launcher', desc: 'Spinning saw blades cut through 8 enemies and make them bleed.', cost: 11000, dmg: 75, rate: 1.5, mag: 10, reload: 2.4, spread: 0, pellets: 1, range: 50, pierce: 8, sound: 'sniper', recoil: 0.03, model: 'blaster-a', modelScale: 0.4, stretch: 1.1, tint: 0xffb040, beamColor: 0xffb040, beamWidth: 0.2,
    base: [{ key: 'burn', v: { f: 0.3, dur: 3 } }],
    abilities: [
      { key: 'rapid', name: 'Sharpened', v: { f: 0.2 } },
      { key: 'executioner', name: 'Lacerate', v: { f: 1.0 } },
      { key: 'multishot', name: 'Twin Blades', v: { n: 1 } },
      { key: 'vampire', name: 'Bloodletter', v: { f: 0.02 } },
      { key: 'nova', name: 'Shrapnel Storm', v: { r: 4, f: 1.3 } },
    ],
  },
  {
    id: 'blackhole', name: 'Black Hole Gun', desc: 'Opens a black hole that sucks enemies in and crushes them.', cost: 13000, dmg: 70, rate: 0.6, mag: 3, reload: 3, spread: 0.005, pellets: 1, range: 70, splash: 3, projectile: true, plasma: true, vortex: true, sound: 'rocket', recoil: 0.05, model: 'tube', tint: 0x5a2aa0,
    abilities: [
      { key: 'bigmag', name: 'Singularity Core', v: { f: 0.5 } },
      { key: 'freeze', name: 'Time Dilation', v: { slow: 0.5, dur: 2 } },
      { key: 'rapid', name: 'Quick Collapse', v: { f: 0.3 } },
      { key: 'chain', name: 'Event Horizon', v: { n: 3, f: 0.5 } },
      { key: 'nova', name: 'Supermassive', v: { r: 6, f: 1.5 } },
    ],
  },
  {
    id: 'seeker', name: 'Seeker Missiles', desc: 'Homing missiles lock onto the enemy you aim at.', cost: 14500, dmg: 80, rate: 2.6, mag: 12, reload: 2.8, spread: 0.02, pellets: 1, range: 100, splash: 2.6, projectile: true, homing: true, sound: 'rocket', recoil: 0.03, model: 'tube', tint: 0xd0d8e0,
    abilities: [
      { key: 'multishot', name: 'Swarm Pods', v: { n: 1 } },
      { key: 'bigmag', name: 'Missile Rack', v: { f: 0.5 } },
      { key: 'burn', name: 'Thermite', v: { f: 0.25, dur: 3 } },
      { key: 'multishot', name: 'Salvo', v: { n: 1 } },
      { key: 'nova', name: 'Carpet Strike', v: { r: 5, f: 1.2 } },
    ],
  },
  {
    id: 'cryo', name: 'Cryo Cannon', desc: 'Frozen shells that freeze everything they hit.', cost: 16000, dmg: 95, rate: 1.1, mag: 6, reload: 2.5, spread: 0.01, pellets: 1, range: 60, splash: 4, projectile: true, lob: true, sound: 'rocket', recoil: 0.05, model: 'tube', tint: 0x9fe8ff,
    base: [{ key: 'freeze', v: { slow: 0.7, dur: 3 } }],
    abilities: [
      { key: 'bigmag', name: 'Cold Storage', v: { f: 0.5 } },
      { key: 'executioner', name: 'Shatter', v: { f: 1.2 } },
      { key: 'multishot', name: 'Hailstorm', v: { n: 1 } },
      { key: 'chain', name: 'Frost Link', v: { n: 3, f: 0.4 } },
      { key: 'nova', name: 'Ice Age', v: { r: 6, f: 1.4 } },
    ],
  },
  {
    id: 'antimat', name: 'Anti-Materiel Rifle', desc: 'Massive rounds that pierce 3 enemies and explode.', cost: 18000, dmg: 420, rate: 0.5, mag: 5, reload: 3, spread: 0, pellets: 1, range: 180, pierce: 3, headMult: 2.5, scope: true, sound: 'sniper', recoil: 0.1, model: 'blaster-a', modelScale: 0.46, stretch: 1.8, tint: 0x4a4a42, beamColor: 0xffe08a, beamWidth: 0.14,
    base: [{ key: 'explode', v: { r: 1.8, f: 0.3 } }],
    abilities: [
      { key: 'rapid', name: 'Bolt Action+', v: { f: 0.25 } },
      { key: 'pierce', name: 'Tungsten Core', v: { n: 3 } },
      { key: 'crit', name: 'Marksman', v: { chance: 0.25 } },
      { key: 'executioner', name: 'Headhunter', v: { f: 1.2 } },
      { key: 'orbital', name: 'Kinetic Strike', v: { every: 4, f: 3, r: 5 } },
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
  const ab = (w.base || []).concat(activeAbilities(w.abilities, level));
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
  {
    id: 'luna', name: 'Luna', role: 'Gunslinger', model: 'skater-female', cost: 2600,
    passive: '+15% fire rate with every gun.',
    active: { name: 'Bullet Storm', cd: 18, desc: 'For 6s: no ammo used and +50% fire rate.' },
    perks: [
      { key: 'reload', name: 'Speed Loader', desc: '+20% reload speed.' },
      { key: 'deadeye', name: 'Dead Eye', desc: '+15% crit chance.' },
      { key: 'longstorm', name: 'Endless Storm', desc: 'Bullet Storm lasts 9s.' },
      { key: 'ricochet', name: 'Ricochet', desc: 'Shots pierce 1 extra enemy.' },
      { key: 'highnoon', name: 'High Noon', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'zed', name: 'Zed', role: 'Undead', model: 'zombie-2', cost: 3200,
    passive: 'Heal for 3% of all damage you deal.',
    active: { name: 'Plague Burst', cd: 14, desc: 'Release a toxic cloud that eats enemies for 5s.' },
    perks: [
      { key: 'leech', name: 'Blood Leech', desc: 'Lifesteal doubled.' },
      { key: 'plague', name: 'Virulent', desc: 'Plague cloud damage +60%.' },
      { key: 'rot', name: 'Rot Touch', desc: 'Your weapon hits make enemies burn.' },
      { key: 'horde', name: 'Horde Cloud', desc: 'Plague cloud is 50% bigger.' },
      { key: 'undying', name: 'Undying', desc: 'Once per wave, get back up with 50% health.' },
    ],
  },
  {
    id: 'titan', name: 'Titan', role: 'Heavy', model: 'robot', color: 0xd0473a, cost: 4000,
    passive: '+20% health and +10% weapon damage.',
    active: { name: 'Missile Barrage', cd: 16, desc: 'Fire 8 homing missiles at enemies near your crosshair.' },
    perks: [
      { key: 'plating', name: 'Reactive Armor', desc: '+20% max health.' },
      { key: 'payload', name: 'Big Payload', desc: 'Missiles deal +50% damage.' },
      { key: 'absorb', name: 'Blast Shielding', desc: 'Take 15% less damage.' },
      { key: 'salvo', name: 'Full Salvo', desc: 'Fire 14 missiles.' },
      { key: 'warmachine', name: 'Juggernaut', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'blaze', name: 'Blaze', role: 'Pyro', model: 'survivor-male', tint: 0xff9a7a, glow: 0x4a1000, cost: 5000,
    passive: 'Your hits have a 20% chance to set enemies on fire.',
    active: { name: 'Flame Nova', cd: 12, desc: 'Explode in a ring of fire that burns everything around you.' },
    perks: [
      { key: 'hotter', name: 'Hotter Flames', desc: 'Burns deal double damage.' },
      { key: 'firewalk', name: 'Fire Walk', desc: 'Leave burning ground for 5s after Flame Nova.' },
      { key: 'reload', name: 'Quick Hands', desc: '+20% reload speed.' },
      { key: 'bignova', name: 'Inferno', desc: 'Flame Nova radius +50%.' },
      { key: 'warmachine', name: 'Burning Rage', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'frosty', name: 'Frost', role: 'Cryo', model: 'survivor-female', tint: 0xb8e8ff, glow: 0x0a3050, cost: 5500,
    passive: 'Enemies near you (6m) are slowed 25%.',
    active: { name: 'Blizzard', cd: 14, desc: 'Freeze every enemy around you almost solid for 3s.' },
    perks: [
      { key: 'deepfreeze', name: 'Deep Freeze', desc: 'Blizzard lasts 5s.' },
      { key: 'shatter', name: 'Shatter', desc: '+40% damage to frozen enemies.' },
      { key: 'vital', name: 'Frost Armor', desc: '+25% max health.' },
      { key: 'bigblizzard', name: 'Whiteout', desc: 'Blizzard radius +50%.' },
      { key: 'warmachine', name: 'Cold Blooded', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'volt', name: 'Volt', role: 'Storm Caller', model: 'cyborg-female', tint: 0xfff07a, glow: 0x3a3000, cost: 6000,
    passive: 'Every 6th hit zaps 2 extra enemies.',
    active: { name: 'Chain Storm', cd: 13, desc: 'Lightning leaps between up to 10 enemies.' },
    perks: [
      { key: 'morechains', name: 'Conductor', desc: 'Chain Storm hits 16 enemies.' },
      { key: 'static', name: 'Static Field', desc: 'Nearby enemies take shock damage.' },
      { key: 'overcharge', name: 'Overcharge', desc: 'Chain Storm damage +60%.' },
      { key: 'reload', name: 'Capacitor', desc: '+20% reload speed.' },
      { key: 'warmachine', name: 'High Voltage', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'ranger', name: 'Ranger', role: 'Archer', model: 'male', tint: 0xa8e08a, glow: 0x0a2a00, cost: 6500,
    passive: '+25% damage to enemies more than 25m away.',
    active: { name: 'Arrow Rain', cd: 15, desc: 'Rain 16 explosive arrows where you aim.' },
    perks: [
      { key: 'morearrows', name: 'Volley', desc: 'Arrow Rain fires 26 arrows.' },
      { key: 'deadeye', name: 'Eagle Eye', desc: '+15% crit chance.' },
      { key: 'lightfeet', name: 'Light Feet', desc: '+10% move speed.' },
      { key: 'poison', name: 'Poison Tips', desc: 'Arrows poison enemies.' },
      { key: 'warmachine', name: 'Hunter', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'brick', name: 'Brick', role: 'Guardian', model: 'robot', color: 0x8a939e, cost: 7000,
    passive: '+40% health and 10% damage reduction.',
    active: { name: 'Fortress', cd: 16, desc: 'For 6s take 70% less damage and pull every enemy nearby to you.' },
    perks: [
      { key: 'plating', name: 'Heavy Plating', desc: '+20% max health.' },
      { key: 'longfort', name: 'Stronghold', desc: 'Fortress lasts 9s.' },
      { key: 'thornskin', name: 'Thorn Skin', desc: 'Enemies that hit you take damage.' },
      { key: 'absorb', name: 'Bulwark', desc: 'Take 15% less damage.' },
      { key: 'ironwill', name: 'Protector', desc: 'The house takes 15% less damage.' },
    ],
  },
  {
    id: 'shadow', name: 'Shade', role: 'Assassin', model: 'skater-male', tint: 0x8a7ab8, glow: 0x1a0a3a, cost: 7500,
    passive: '+30% crit damage and 10% crit chance.',
    active: { name: 'Vanish', cd: 15, desc: 'Turn invisible for 5s: enemies lose you and every shot crits.' },
    perks: [
      { key: 'longvanish', name: 'Ghost', desc: 'Vanish lasts 8s.' },
      { key: 'lightfeet', name: 'Shadow Step', desc: '+10% move speed.' },
      { key: 'critblades', name: 'Assassinate', desc: '+20% crit chance.' },
      { key: 'reload', name: 'Sleight of Hand', desc: '+20% reload speed.' },
      { key: 'warmachine', name: 'Deadly', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'gizmo', name: 'Gizmo', role: 'Engineer', model: 'survivor-male', tint: 0xffc07a, glow: 0x2a1a00, cost: 8000,
    passive: 'Your buildings deal +25% damage and have +25% health.',
    active: { name: 'Overclock', cd: 18, desc: 'Repair every building 40% and double their fire rate for 8s.' },
    perks: [
      { key: 'rebuild', name: 'Rebuild', desc: 'Overclock also rebuilds destroyed buildings.' },
      { key: 'overclock', name: 'Tuned Up', desc: 'Traps and turrets +30% damage.' },
      { key: 'fortify', name: 'Reinforce', desc: 'Buildings +30% health.' },
      { key: 'basekit', name: 'Handyman', desc: 'The house repairs 6 HP/s.' },
      { key: 'longclock', name: 'Overdrive', desc: 'Overclock lasts 14s.' },
    ],
  },
  {
    id: 'sage', name: 'Sage', role: 'Druid', model: 'survivor-female', tint: 0x9aff9a, glow: 0x0a3a0a, cost: 8500,
    passive: 'Heal 1% max health per second.',
    active: { name: 'Healing Grove', cd: 20, desc: 'For 8s heal 6% per second, heal your partner and the house.' },
    perks: [
      { key: 'lifeline', name: 'Deep Roots', desc: 'Double health regeneration.' },
      { key: 'thorngrove', name: 'Thorn Grove', desc: 'The grove damages enemies inside it.' },
      { key: 'vital', name: 'Evergreen', desc: '+25% max health.' },
      { key: 'biggrove', name: 'Wild Growth', desc: 'Grove radius +50%.' },
      { key: 'miracle', name: 'Rebirth', desc: 'Grove rebuilds destroyed walls.' },
    ],
  },
  {
    id: 'ace', name: 'Ace', role: 'Pilot', model: 'skater-female', tint: 0xffb0b0, glow: 0x3a0a0a, cost: 9000,
    passive: '+20% damage against flying enemies.',
    active: { name: 'Air Strike', cd: 16, desc: 'Call a bomber that carpet bombs a line where you aim.' },
    perks: [
      { key: 'morebombs', name: 'Heavy Bomber', desc: 'Air Strike drops 14 bombs.' },
      { key: 'napalm', name: 'Napalm', desc: 'Bombs set the ground on fire.' },
      { key: 'reload', name: 'Hot Reload', desc: '+20% reload speed.' },
      { key: 'deadeye', name: 'Top Gun', desc: '+15% crit chance.' },
      { key: 'warmachine', name: 'Ace Pilot', desc: '+25% weapon damage.' },
    ],
  },
  {
    id: 'hex', name: 'Hex', role: 'Witch', model: 'zombie-1', tint: 0xc08aff, glow: 0x2a0a4a, cost: 10000,
    passive: 'Cursed enemies drop 30% more coins.',
    active: { name: 'Curse', cd: 14, desc: 'Curse enemies where you aim: they take +50% damage and are slowed for 8s.' },
    perks: [
      { key: 'bigcurse', name: 'Mass Curse', desc: 'Curse radius +50%.' },
      { key: 'doom', name: 'Doom', desc: 'Cursed enemies take +80% damage instead.' },
      { key: 'leech', name: 'Soul Drain', desc: 'Heal from damage to cursed enemies.' },
      { key: 'plague', name: 'Wither', desc: 'Cursed enemies take damage over time.' },
      { key: 'warmachine', name: 'Dark Power', desc: '+25% weapon damage.' },
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
  if (h.id === 'titan') hp *= 1.2;
  if (h.id === 'brick') hp *= 1.4;
  if (perks.has('plating')) hp *= 1.2;
  if (perks.has('vital')) hp *= 1.25;
  let speed = 1;
  if (h.id === 'nova') speed *= 1.2;
  if (perks.has('lightfeet')) speed *= 1.1;
  let dmg = 1 + 0.002 * L;
  if (h.id === 'rex') dmg *= 1.15;
  if (h.id === 'titan') dmg *= 1.1;
  if (perks.has('warmachine')) dmg *= 1.25;
  if (perks.has('highnoon')) dmg *= 1.25;
  let regen = h.id === 'doc' ? 3 : 0.5 + 0.02 * L;
  if (h.id === 'sage') regen += hp * 0.01;
  if (perks.has('lifeline')) regen *= 2;
  return {
    hp: Math.round(hp), speed, dmg, regen,
    power: 1 + 0.025 * L,      // active ability strength
    armor: (perks.has('absorb') ? 0.15 : 0) + (h.id === 'brick' ? 0.1 : 0),
    coinMult: (h.id === 'skye' ? 1.25 : 1) * (perks.has('treasure') ? 1.15 : 1),
    magnet: 5 + (h.id === 'skye' ? 4 : 0) + (perks.has('magnet') ? 4 : 0),
    perks,
  };
}

// ---------------------------------------------------------------- pets (level by use, like heroes)
export const PET_INFO = {
  wall: () => 'Repairs walls faster.',
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
  { id: 'bunny', name: 'Hops', model: 'pet-bunny', cost: 500, kind: 'collector', dmg: 7, rate: 1.8, speed: 13, range: 10, color: 0xffc0d8, desc: 'Super fast. Hops around grabbing coins for you.', perks: ['magnet', 'swift', 'coins', 'frenzy', 'swift'] },
  { id: 'pig', name: 'Truffles', model: 'pet-pig', cost: 800, kind: 'collector', dmg: 9, rate: 1.4, speed: 10, range: 10, color: 0xff9ab0, desc: 'Sniffs out treasure: more coins from every kill.', perks: ['coins', 'coins', 'magnet', 'power', 'coins'] },
  { id: 'crab', name: 'Pinchy', model: 'pet-crab', cost: 1000, kind: 'melee', dmg: 14, rate: 1.5, speed: 9, desc: 'Pinches everything around it.', perks: ['splash', 'guard', 'power', 'frenzy', 'double'] },
  { id: 'monkey', name: 'Bongo', model: 'pet-monkey', cost: 1300, kind: 'ranged', dmg: 13, rate: 1.6, speed: 11, range: 16, color: 0xffe066, desc: 'Throws bananas that bounce between enemies.', perks: ['chain', 'frenzy', 'power', 'double', 'chain'] },
  { id: 'caterpillar', name: 'Wiggles', model: 'pet-caterpillar', cost: 1600, kind: 'ranged', dmg: 10, rate: 1.5, speed: 7, range: 14, color: 0x9dff3a, desc: 'Spits goo that burns enemies over time.', perks: ['burn', 'power', 'splash', 'frenzy', 'burn'] },
  { id: 'beaver', name: 'Chompers', model: 'pet-beaver', cost: 1900, kind: 'builder', dmg: 10, rate: 1, speed: 9, desc: 'Repairs your walls during waves and rebuilds broken ones.', perks: ['repair', 'guard', 'repair', 'heal', 'power'] },
  { id: 'cow', name: 'Moo', model: 'pet-cow', cost: 2100, kind: 'support', dmg: 10, rate: 1, speed: 8, desc: 'Fresh milk: big heals for you.', perks: ['heal', 'heal', 'guard', 'repair', 'heal'] },
  { id: 'fish', name: 'Bubbles', model: 'pet-fish', cost: 2400, kind: 'ranged', fly: 1.6, dmg: 11, rate: 2, speed: 10, range: 15, color: 0x7fd8ff, desc: 'Floats beside you blowing freezing bubbles.', perks: ['freeze', 'frenzy', 'double', 'power', 'chain'] },
  { id: 'hog', name: 'Tusk', model: 'pet-hog', cost: 2800, kind: 'melee', dmg: 30, rate: 0.9, speed: 12, desc: 'Charges enemies with brutal tusk hits.', perks: ['power', 'crit', 'splash', 'power', 'frenzy'] },
  { id: 'polar', name: 'Blizzard', model: 'pet-polar', cost: 3000, kind: 'melee', dmg: 26, rate: 1.1, speed: 10, desc: 'Polar bear. Its swipes freeze enemies.', perks: ['freeze', 'power', 'splash', 'guard', 'crit'] },
  { id: 'giraffe', name: 'Stretch', model: 'pet-giraffe', cost: 3300, kind: 'ranged', dmg: 22, rate: 1, speed: 9, range: 26, color: 0xffd08a, desc: 'Spots and spits at enemies from very far away.', perks: ['power', 'crit', 'double', 'frenzy', 'chain'] },
  { id: 'koala', name: 'Eucalyptus', model: 'pet-koala', cost: 3600, kind: 'support', dmg: 10, rate: 1, speed: 8, desc: 'Sleepy but powerful: heals you and fixes the house fast.', perks: ['repair', 'heal', 'repair', 'guard', 'repair'] },
  { id: 'deer', name: 'Antlers', model: 'pet-deer', cost: 3900, kind: 'melee', dmg: 24, rate: 1.2, speed: 13, desc: 'Graceful and fast. You move faster too.', perks: ['swift', 'power', 'swift', 'crit', 'double'] },
  { id: 'elephant', name: 'Trunk', model: 'pet-elephant', cost: 4800, kind: 'roar', dmg: 32, rate: 0.9, speed: 9, desc: 'Stomps the ground, crushing and slowing every enemy nearby.', perks: ['roar', 'power', 'guard', 'roar', 'splash'] },
  { id: 'lion', name: 'King', model: 'pet-lion', cost: 4200, kind: 'roar', dmg: 26, rate: 1, speed: 10, desc: 'Bites, and roars to damage and slow every enemy nearby.', perks: ['roar', 'power', 'guard', 'freeze', 'roar'] },
  { id: 'inferno', name: 'Inferno', model: 'pet-fox', tint: 0xff7a4a, glow: 0x6a1a00, cost: 5200, kind: 'melee', dmg: 30, rate: 1.4, speed: 12, desc: 'A fox made of flame. Every bite burns.', perks: ['burn', 'power', 'splash', 'burn', 'frenzy'] },
  { id: 'glacier', name: 'Glacier', model: 'pet-penguin', tint: 0xaef0ff, glow: 0x0a3a5a, cost: 5400, kind: 'ranged', dmg: 20, rate: 1.4, speed: 9, range: 20, color: 0x9fe8ff, desc: 'Penguin king. Hurls ice that freezes enemies.', perks: ['freeze', 'power', 'splash', 'double', 'freeze'] },
  { id: 'thunderbee', name: 'Zapper', model: 'pet-bee', tint: 0xfff06a, glow: 0x6a5a00, cost: 5800, kind: 'ranged', fly: 2.2, dmg: 16, rate: 2.4, speed: 13, range: 18, color: 0xfff06a, desc: 'Electric bee. Its stings chain lightning.', perks: ['chain', 'frenzy', 'chain', 'power', 'double'] },
  { id: 'shadowcat', name: 'Nightpaw', model: 'pet-cat', tint: 0x6a5a9a, glow: 0x2a0a4a, cost: 6200, kind: 'melee', dmg: 36, rate: 1.3, speed: 14, desc: 'Shadow cat. Deadly critical strikes.', perks: ['crit', 'power', 'swift', 'crit', 'double'] },
  { id: 'goldpig', name: 'Midas', model: 'pet-pig', tint: 0xffd24a, glow: 0x5a4000, cost: 6600, kind: 'collector', dmg: 14, rate: 1.6, speed: 12, range: 14, color: 0xffd24a, desc: 'Golden pig. Tons more coins from everything.', perks: ['coins', 'coins', 'magnet', 'coins', 'coins'] },
  { id: 'crystaldeer', name: 'Prism', model: 'pet-deer', tint: 0xaff4ff, glow: 0x1a5a6a, cost: 7000, kind: 'support', dmg: 14, rate: 1, speed: 12, desc: 'Crystal deer. Heals you and shields you from damage.', perks: ['heal', 'guard', 'heal', 'guard', 'heal'] },
  { id: 'robodog', name: 'Robo-Rex', model: 'pet-dog', tint: 0xa8b4c0, glow: 0x003a5a, cost: 7600, kind: 'ranged', dmg: 26, rate: 2, speed: 11, range: 24, color: 0xff3a3a, desc: 'Robot dog with laser eyes.', perks: ['power', 'double', 'frenzy', 'chain', 'power'] },
  { id: 'phoenix', name: 'Phoenix', model: 'pet-chick', tint: 0xff9a4a, glow: 0x7a2a00, cost: 8200, kind: 'ranged', fly: 2.4, dmg: 24, rate: 1.8, speed: 13, range: 20, color: 0xff7a2a, desc: 'Fire bird. Rains burning feathers on enemies.', perks: ['burn', 'splash', 'power', 'double', 'burn'] },
  { id: 'mechaphant', name: 'Mammoth', model: 'pet-elephant', tint: 0x9aa6b4, glow: 0x002a4a, cost: 9000, kind: 'roar', dmg: 40, rate: 0.9, speed: 9, desc: 'Armored mecha elephant. Earth-shaking stomps.', perks: ['roar', 'power', 'guard', 'roar', 'splash'] },
  { id: 'ghostbunny', name: 'Boo', model: 'pet-bunny', tint: 0xdff4ff, glow: 0x2a4a6a, ghost: true, cost: 9500, kind: 'builder', dmg: 18, rate: 1.2, speed: 13, desc: 'Ghost bunny. Phases through walls to repair and rebuild everything fast.', perks: ['repair', 'guard', 'repair', 'heal', 'repair'] },
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
  { id: 'thorn', name: 'Thorn Wall', kind: 'wall', cost: 180, hp: 1400, thorns: 0.6, color: '#7aa84a', desc: 'Spiked wall: enemies that hit it get hurt.' },
  { id: 'spikes', name: 'Spike Trap', kind: 'trap', cost: 80, hp: 400, dps: 34, color: '#d8dee6', desc: 'Hurts enemies walking over it.' },
  { id: 'freeze', name: 'Freeze Trap', kind: 'trap', cost: 100, hp: 400, dps: 10, slow: 0.55, color: '#7fe3ff', desc: 'Slows enemies a lot.' },
  { id: 'flame', name: 'Flame Trap', kind: 'trap', cost: 140, hp: 400, dps: 18, burn: true, color: '#ff8a3a', desc: 'Sets enemies on fire as they cross it.' },
  { id: 'heal', name: 'Healing Pad', kind: 'pad', cost: 200, hp: 500, heal: 12, color: '#6dff9a', desc: 'Stand on it to heal 12 HP/s.' },
  { id: 'turret', name: 'Turret Tower', kind: 'turret', cost: 250, hp: 700, dmg: 12, rate: 3, range: 24, color: '#3cc8ff', desc: 'Shoots enemies in range.' },
  { id: 'tesla', name: 'Tesla Coil', kind: 'turret', style: 'tesla', cost: 380, hp: 650, dmg: 16, rate: 1.4, range: 14, chain: 4, color: '#9fd8ff', desc: 'Zaps up to 4 nearby enemies at once.' },
  { id: 'mortar', name: 'Mortar Tower', kind: 'turret', style: 'mortar', cost: 450, hp: 800, dmg: 55, rate: 0.5, range: 40, splash: 4, color: '#ffc02e', desc: 'Long range, explosive splash.' },
  { id: 'flak', name: 'Flak Cannon', kind: 'turret', style: 'flak', cost: 420, hp: 750, dmg: 40, rate: 1.2, range: 34, splash: 3, airOnly: true, color: '#ff7a5a', desc: 'Anti-air: shreds flying enemies with airburst shells.' },
  { id: 'laser', name: 'Laser Tower', kind: 'turret', style: 'laser', cost: 600, hp: 700, dmg: 9, rate: 10, range: 22, color: '#ff4dd2', desc: 'Continuous laser beam. Melts one target.' },
  { id: 'sniper', name: 'Sniper Tower', kind: 'turret', style: 'sniper', cost: 700, hp: 650, dmg: 150, rate: 0.45, range: 60, color: '#b48cff', desc: 'Huge single shots at the toughest enemy in range.' },
];
export const MAX_BUILD_LEVEL = 10;
// Each upgrade makes a piece tougher and stronger.
export function pieceLevelMult(level) { return 1 + 0.3 * (level - 1); }
export function pieceHp(piece, level = 1) { return Math.round((piece.hp || 400) * (1 + 0.45 * (level - 1))); }
export function upgradeCost(piece, level) { return Math.round(piece.cost * (0.6 + 0.4 * level) * Math.pow(1.12, level - 1)); }
export function sellValue(piece, level) { let v = piece.cost; for (let l = 1; l < level; l++) v += Math.round(upgradeCost(piece, l) * 0.5); return v; }
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
  crawler: { name: 'Crawler', model: 'zombie-2', hp: 20, speed: 5.2, dmg: 5, rate: 0.7, height: 1.15, radius: 0.35, coins: 3, reach: 0.8, minWave: 3, weight: 3, tint: 0xbfa0a0, fast: true },
  berserker: { name: 'Berserker', model: 'zombie-2', hp: 80, speed: 3.1, dmg: 14, rate: 1, height: 2.0, radius: 0.5, coins: 9, reach: 1.0, minWave: 5, weight: 2, tint: 0xff8a7a, glow: 0x300000, enrage: true },
  splitter: { name: 'Splitter', model: 'zombie-1', hp: 70, speed: 2.6, dmg: 10, rate: 1.1, height: 2.0, radius: 0.5, coins: 8, reach: 1.0, minWave: 5, weight: 2, tint: 0xc9a0ff, glow: 0x1a0a40, split: { type: 'crawler', n: 3 } },
  frost: { name: 'Frost Husk', model: 'zombie-1', hp: 60, speed: 2.7, dmg: 10, rate: 1.1, height: 1.95, radius: 0.5, coins: 7, reach: 1.0, minWave: 6, weight: 2, tint: 0xb0f0ff, glow: 0x0a3050, slowOnHit: true },
  leaper: { name: 'Leaper', model: 'zombie-2', hp: 48, speed: 4.6, dmg: 9, rate: 0.9, height: 1.8, radius: 0.45, coins: 7, reach: 1.0, minWave: 7, weight: 2, tint: 0x8aff9a, leap: true, fast: true },
  pyro: { name: 'Pyro Husk', model: 'zombie-2', hp: 65, speed: 2.9, dmg: 11, rate: 1.1, height: 1.95, radius: 0.5, coins: 8, reach: 1.0, minWave: 8, weight: 2, tint: 0xffb070, glow: 0x5a1a00, burnOnHit: true, deathFire: 2.8 },
  juggernaut: { name: 'Juggernaut', model: 'zombie-1', hp: 520, speed: 1.6, dmg: 32, rate: 1.7, height: 2.8, radius: 0.85, coins: 24, reach: 1.4, minWave: 8, weight: 1, tint: 0x9a8070, armor: 0.3, wallMult: 2.5 },
  bomber: { name: 'Bomber Drone', model: 'drone', hp: 55, speed: 3.6, dmg: 22, rate: 2.6, height: 1.4, radius: 0.7, coins: 10, reach: 1, minWave: 8, weight: 1.5, ranged: 6, fly: 6.5, bomb: true, tint: 0xff9a7a },
  toxic: { name: 'Toxic Husk', model: 'zombie-1', hp: 55, speed: 2.8, dmg: 9, rate: 1.1, height: 1.95, radius: 0.5, coins: 8, reach: 1.0, minWave: 9, weight: 2, tint: 0x9aff4a, glow: 0x1a4000, deathCloud: 3.5 },
  phantom: { name: 'Phantom', model: 'zombie-2', hp: 58, speed: 3.2, dmg: 12, rate: 1, height: 1.95, radius: 0.5, coins: 9, reach: 1.0, minWave: 9, weight: 1.5, tint: 0xa88aff, glow: 0x2a1060, blink: 6 },
  siege: { name: 'Siege Husk', model: 'zombie-1', hp: 140, speed: 2.4, dmg: 18, rate: 1.3, height: 2.2, radius: 0.6, coins: 11, reach: 1.1, minWave: 9, weight: 1.5, tint: 0xc0a060, wallMult: 5, wallHunter: true },
  knight: { name: 'Iron Knight', model: 'robot', hp: 160, speed: 2.3, dmg: 18, rate: 1.3, height: 2.3, radius: 0.6, coins: 14, reach: 1.1, minWave: 10, weight: 1.5, color: 0xa6b0bc, armor: 0.5 },
  sniper: { name: 'Sharpshooter', model: 'cyborg-female', hp: 50, speed: 2.4, dmg: 24, rate: 3.6, height: 1.95, radius: 0.5, coins: 11, reach: 1.0, minWave: 10, weight: 1.2, tint: 0x8aa0b0, glow: 0x401010, ranged: 26, beam: 0xff3050 },
  troll: { name: 'Troll', model: 'zombie-1', hp: 200, speed: 2.2, dmg: 20, rate: 1.4, height: 2.5, radius: 0.7, coins: 14, reach: 1.2, minWave: 11, weight: 1.2, tint: 0x70a070, regen: 0.06 },
  howler: { name: 'Howler', model: 'zombie-2', hp: 70, speed: 2.8, dmg: 10, rate: 1.1, height: 2.0, radius: 0.5, coins: 10, reach: 1.0, minWave: 11, weight: 1.2, tint: 0xffd070, glow: 0x3a2a00, hasteAura: 9 },
  ghost: { name: 'Ghost', model: 'zombie-1', hp: 60, speed: 3.0, dmg: 11, rate: 1.1, height: 1.95, radius: 0.5, coins: 10, reach: 1.0, minWave: 12, weight: 1.2, tint: 0xe8f4ff, glow: 0x304060, phase: true },
  swarm: { name: 'Swarm Bot', model: 'drone', hp: 18, speed: 7, dmg: 28, rate: 1, height: 0.7, radius: 0.35, coins: 4, reach: 0.9, minWave: 12, weight: 2, fly: 2.4, explode: 2.6, tint: 0xffe066 },
  necro: { name: 'Necromancer', model: 'cyborg-female', hp: 90, speed: 2.4, dmg: 8, rate: 1.5, height: 2.0, radius: 0.5, coins: 16, reach: 1.0, minWave: 13, weight: 1, tint: 0x7a4aa0, glow: 0x3a0a5a, summon: 'crawler', keepAway: 15 },
  bulwark: { name: 'Bulwark', model: 'robot', hp: 180, speed: 2.1, dmg: 14, rate: 1.4, height: 2.4, radius: 0.65, coins: 16, reach: 1.1, minWave: 14, weight: 1, color: 0x3cc8ff, emissive: 0x0a3a5a, shieldAura: 9 },
  mech: { name: 'Rocket Mech', model: 'robot', hp: 220, speed: 1.9, dmg: 26, rate: 3, height: 2.7, radius: 0.75, coins: 20, reach: 1.2, minWave: 15, weight: 1, color: 0x6a7a3a, widen: 1.15, ranged: 18, rocket: true },
  goblin: { name: 'Loot Goblin', model: 'zombie-2', hp: 90, speed: 5.4, dmg: 0, rate: 1, height: 1.4, radius: 0.4, coins: 70, reach: 1.0, minWave: 4, weight: 0.5, tint: 0xffe066, glow: 0x5a4000, goblin: true },
  queen: { name: 'Hive Queen', model: 'cyborg-female', hp: 2600, speed: 1.7, dmg: 45, rate: 2.2, height: 5.2, radius: 1.4, coins: 220, reach: 2.2, minWave: 10, weight: 0, tint: 0xb070ff, glow: 0x5a0a8a, boss: true, ranged: 16, summon: 'swarm', wallMult: 3 },
  // ---- flyers & mist monsters
  wasp: { name: 'Wasp Drone', model: 'drone', hp: 24, speed: 8.5, dmg: 7, rate: 0.7, height: 0.8, radius: 0.4, coins: 4, reach: 1.0, minWave: 5, weight: 3, fly: 2.2, tint: 0xffd23a, fast: true },
  taker: { name: 'Taker', model: 'drone', hp: 70, speed: 6.5, dmg: 16, rate: 1.2, height: 1.3, radius: 0.6, coins: 10, reach: 1.1, minWave: 8, weight: 2, fly: 2.6, tint: 0x5a2a7a, glow: 0x3a0a5a, fast: true, hunter: true },
  mender: { name: 'Mender Drone', model: 'drone', hp: 60, speed: 3.8, dmg: 5, rate: 1.6, height: 1.2, radius: 0.6, coins: 11, reach: 1, minWave: 10, weight: 1.2, fly: 5.5, tint: 0x6dff9a, healer: true, keepAway: 14 },
  emp: { name: 'EMP Drone', model: 'drone', hp: 75, speed: 4, dmg: 8, rate: 1.6, height: 1.3, radius: 0.6, coins: 12, reach: 1, minWave: 11, weight: 1.2, fly: 5, tint: 0x7ad0ff, towerHunter: true, ranged: 12, skills: [{ type: 'emp', every: 5, r: 9, t: 3 }] },
  stormray: { name: 'Storm Ray', model: 'drone', hp: 90, speed: 4.4, dmg: 14, rate: 2, height: 1.6, radius: 0.8, coins: 13, reach: 1, minWave: 12, weight: 1.5, fly: 6, tint: 0x6ae8ff, ranged: 16, beam: 0x7fd0ff },
  gunship: { name: 'Gunship', model: 'gunship', hp: 260, speed: 3.2, dmg: 26, rate: 2.6, height: 1.6, radius: 1.2, coins: 20, reach: 1, minWave: 11, weight: 1, fly: 7, ranged: 22, rocket: true, towerHunter: true },
  bombardier: { name: 'Bombardier', model: 'gunship', hp: 320, speed: 3, dmg: 30, rate: 2.2, height: 2, radius: 1.4, coins: 22, reach: 1, minWave: 15, weight: 0.8, fly: 8, ranged: 6, bomb: true, tint: 0x6a3a3a },
  carrier: { name: 'Swarm Carrier', model: 'drone', hp: 300, speed: 2.6, dmg: 10, rate: 2, height: 2.6, radius: 1.3, coins: 24, reach: 1, minWave: 14, weight: 0.8, fly: 7.5, tint: 0xffa03a, summon: 'wasp', keepAway: 18 },
  raider: { name: 'Sky Raider', model: 'ship', hp: 380, speed: 2.6, dmg: 24, rate: 2.8, height: 2.4, radius: 1.6, coins: 26, reach: 1, minWave: 16, weight: 0.8, fly: 6.5, ranged: 20, rocket: true },
  flinger: { name: 'Flinger', model: 'zombie-1', hp: 170, speed: 2.1, dmg: 10, rate: 3.2, height: 2.8, radius: 0.75, coins: 16, reach: 1.2, minWave: 9, weight: 1.2, tint: 0xa88a6a, glow: 0x2a1a00, ranged: 22, fling: 'husk' },
  mistblaster: { name: 'Mist Blaster', model: 'zombie-2', hp: 190, speed: 2.2, dmg: 18, rate: 2.6, height: 2.5, radius: 0.7, coins: 18, reach: 1.1, minWave: 12, weight: 1, tint: 0xb08aff, glow: 0x4a1a8a, ranged: 28, beam: 0xc07aff, ramp: 0.25 },
  // ---- bosses (one appears every 5th wave, later two or three at once)
  smasherBoss: { name: 'Mist Smasher', model: 'zombie-1', hp: 3600, speed: 2.3, dmg: 70, rate: 2, height: 6, radius: 1.8, coins: 200, reach: 2.6, minWave: 15, weight: 0, tint: 0x7a5aa0, glow: 0x3a0a6a, boss: true, wallMult: 6, wallHunter: true, skills: [{ type: 'slam', every: 4, r: 7 }] },
  gunshipBoss: { name: 'Gunship Titan', model: 'gunship', hp: 2800, speed: 2.6, dmg: 40, rate: 2.2, height: 4, radius: 2.4, coins: 220, reach: 2, minWave: 20, weight: 0, fly: 9, boss: true, ranged: 26, rocket: true, towerHunter: true, tint: 0x3a4a2a, skills: [{ type: 'barrage', every: 6, n: 8, towers: true }, { type: 'emp', every: 9, r: 14, t: 4 }] },
  frostBoss: { name: 'Frost Colossus', model: 'zombie-1', hp: 3500, speed: 1.9, dmg: 60, rate: 2.2, height: 5.8, radius: 1.7, coins: 220, reach: 2.5, minWave: 25, weight: 0, tint: 0xbff0ff, glow: 0x0a4a7a, boss: true, wallMult: 3, slowOnHit: true, skills: [{ type: 'frost', every: 7, r: 12 }] },
  infernoBoss: { name: 'Inferno Golem', model: 'robot', hp: 3900, speed: 1.9, dmg: 65, rate: 2, height: 5.6, radius: 1.8, coins: 240, reach: 2.5, minWave: 30, weight: 0, color: 0xff5a1a, emissive: 0x8a2000, widen: 1.3, boss: true, wallMult: 3, burnOnHit: true, deathFire: 7, skills: [{ type: 'fireRing', every: 6, r: 9 }] },
  galleonBoss: { name: 'Sky Galleon', model: 'ship', hp: 4200, speed: 1.6, dmg: 45, rate: 3, height: 7, radius: 3.2, coins: 260, reach: 2, minWave: 35, weight: 0, fly: 9.5, boss: true, ranged: 32, rocket: true, wallMult: 3, summon: 'raider', summonN: 1, summonEvery: 16, skills: [{ type: 'barrage', every: 5, n: 10 }] },
  plagueBoss: { name: 'Plague Mother', model: 'cyborg-female', hp: 3400, speed: 2, dmg: 45, rate: 2, height: 5.2, radius: 1.5, coins: 240, reach: 2.2, minWave: 40, weight: 0, tint: 0x8aff6a, glow: 0x1a5a00, boss: true, ranged: 16, summon: 'toxic', deathCloud: 8, skills: [{ type: 'clouds', every: 5, n: 3 }] },
  thunderBoss: { name: 'Thunder Titan', model: 'cyborg-female', hp: 3700, speed: 2.1, dmg: 50, rate: 2, height: 5.4, radius: 1.5, coins: 260, reach: 2.2, minWave: 45, weight: 0, tint: 0xfff07a, glow: 0x5a4a00, boss: true, ranged: 20, beam: 0xfff07a, skills: [{ type: 'lightning', every: 4, n: 6 }] },
  reaperBoss: { name: 'Void Reaper', model: 'zombie-2', hp: 3300, speed: 2.8, dmg: 70, rate: 1.8, height: 5, radius: 1.4, coins: 260, reach: 2.4, minWave: 50, weight: 0, tint: 0x3a2a5a, glow: 0x5a0aaa, boss: true, phase: true, blink: 10, skills: [{ type: 'pull', every: 8, r: 16 }] },
  mechaBoss: { name: 'Mecha Overlord', model: 'robot', hp: 4600, speed: 1.7, dmg: 75, rate: 2.2, height: 6.5, radius: 2, coins: 300, reach: 2.8, minWave: 55, weight: 0, color: 0x9aa4b0, emissive: 0x2a0000, widen: 1.35, boss: true, wallMult: 4, skills: [{ type: 'shield', every: 12, frac: 0.35 }, { type: 'barrage', every: 7, n: 10, towers: true }] },
  hiveBoss: { name: 'Hive Carrier', model: 'drone', hp: 3400, speed: 2, dmg: 40, rate: 2, height: 5, radius: 2.6, coins: 280, reach: 2, minWave: 60, weight: 0, fly: 10, tint: 0xff7a2a, glow: 0x6a2000, boss: true, ranged: 24, beam: 0xff7a2a, summon: 'wasp', summonN: 5, summonEvery: 6, skills: [{ type: 'barrage', every: 8, n: 6 }] },
  boss: { name: 'Storm King', model: 'robot', hp: 1900, speed: 1.9, dmg: 60, rate: 1.8, height: 5.8, radius: 1.6, coins: 160, reach: 2.4, minWave: 5, weight: 0, color: 0x8b45e0, emissive: 0x4a1080, widen: 1.2, boss: true, wallMult: 3 },
};

export function waveHpMult(n) { return (1 + 0.24 * (n - 1)) * Math.pow(1.045, Math.max(0, n - 10)); }
export function waveDmgMult(n) { return (1 + 0.1 * (n - 1)) * Math.pow(1.012, Math.max(0, n - 10)); }
export function waveCoinMult(n) { return 1 + 0.08 * (n - 1); }
export function waveBonus(n) { return 25 + 12 * n; }
export function isBossWave(n) { return n % 5 === 0; }
export function portalCount(n) { return Math.min(4, 1 + Math.floor((n - 1) / 2)); }

// Deterministic wave recipe so the preview warning matches the real wave.
function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export const BOSS_ORDER = ['boss', 'queen', 'smasherBoss', 'gunshipBoss', 'frostBoss', 'infernoBoss', 'galleonBoss', 'plagueBoss', 'thunderBoss', 'reaperBoss', 'mechaBoss', 'hiveBoss'];
export function buildWave(n) {
  const r = rng(n * 7919 + 17);
  const total = 8 + Math.floor(n * 3.3 + Math.pow(Math.max(0, n - 10), 1.25));
  const types = Object.entries(ENEMIES).filter(([, d]) => d.weight > 0 && d.minWave <= n);
  // the husk share shrinks as more types unlock
  const weights = types.map(([k, d]) => (k === 'husk' ? d.weight + Math.max(0, 8 - n) : d.weight));
  const sum = weights.reduce((a, b) => a + b, 0);
  const list = [];
  for (let i = 0; i < total; i++) {
    let x = r() * sum, t = 'husk';
    for (let k = 0; k < types.length; k++) { x -= weights[k]; if (x <= 0) { t = types[k][0]; break; } }
    // elites: tougher, glowing, richer versions that show up more and more
    const elite = n >= 6 && r() < Math.min(0.28, (n - 5) * 0.014);
    list.push({ type: t, a: r() * Math.PI * 2, elite }); // spawn angle around the storm
  }
  if (isBossWave(n)) {
    const bosses = 1 + Math.floor(n / 20);
    const pool = BOSS_ORDER.filter(k => ENEMIES[k].minWave <= n);
    for (let b = 0; b < bosses; b++) {
      // the newest boss for this wave first, then earlier ones
      const left = pool.filter(x => !list.some(e => e.type === x));
      const k = b === 0 ? BOSS_ORDER[(n / 5 - 1) % BOSS_ORDER.length] : (left.length ? left : pool)[Math.floor(r() * (left.length || pool.length))];
      list.splice(Math.floor(list.length * (0.3 + 0.3 * b)), 0, { type: ENEMIES[k].minWave <= n ? k : 'boss', a: r() * Math.PI * 2 });
    }
  }
  return list;
}

export function waveSummary(n) {
  const list = buildWave(n);
  const counts = {};
  for (const s of list) counts[s.type] = (counts[s.type] || 0) + 1;
  return { total: list.length, counts };
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
