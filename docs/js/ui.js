// Base screen: heroes, weapons (level by use, rarity abilities) and house upgrades.
import {
  WEAPONS, weaponStats, HEROES, heroStats, PETS, petStats, PET_INFO, PET_PERK_NAMES, houseTier, houseMaxHp, ENEMIES,
  RARITIES, rarityIndex, rarityOf, xpToNext, MAX_LEVEL, ABILITY_INFO, waveSummary, isBossWave,
} from './data.js';
import { COMPASS } from './world.js';

const coin = (n) => `<span class="coin-ico"></span>${n.toLocaleString()}`;

function levelBlock(rec) {
  const lv = rec ? rec.level : 1;
  const r = rarityOf(lv);
  const pct = !rec ? 0 : lv >= MAX_LEVEL ? 100 : Math.round(rec.xp / xpToNext(lv) * 100);
  const next = RARITIES[rarityIndex(lv) + 1];
  return `<div class="lvblock"><span class="rpill" style="--rc:${r.css}">${r.name}</span><span class="lvtxt">Level <b>${lv}</b> / ${MAX_LEVEL}</span>
    <div class="xpbar big"><i style="width:${pct}%;background:${r.css}"></i></div>
    <span class="lvnext">${lv >= MAX_LEVEL ? 'Max level!' : next ? `${next.name} at level ${next.min}` : 'Mythic reached'} · levels up as you use it</span></div>`;
}

function abilityList(list, level, kind) {
  const ri = rarityIndex(level);
  return `<div class="ablist">${list.map((a, i) => {
    const r = RARITIES[i + 1];
    const on = i < ri;
    const desc = kind === 'weapon' ? ABILITY_INFO[a.key](a.v) : kind === 'pet' ? PET_INFO[a]() + (list.indexOf(a) !== i ? ' Stacks!' : '') : a.desc;
    const name = kind === 'pet' ? PET_PERK_NAMES[a] : a.name;
    return `<div class="ab ${on ? 'on' : ''}" style="--rc:${r.css}"><span class="abr">${r.name} · Lv ${r.min}</span><b>${name}</b><span>${desc}</span></div>`;
  }).join('')}</div>`;
}

export class Shop {
  constructor(game) {
    this.game = game;
    this.tab = 'heroes';
    this.selHero = null;
    this.selWeapon = null;
    this.el = document.getElementById('tabContent');
    document.querySelectorAll('#shop .tab').forEach(t => {
      t.addEventListener('click', () => {
        this.game.sfx.click();
        this.tab = t.dataset.tab;
        this.el.scrollTop = 0;
        this.render();
      });
    });
    this.el.addEventListener('click', (e) => this.onClick(e));
  }

  onClick(e) {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const g = this.game, s = g.save;
    const act = b.dataset.act, key = b.dataset.key;
    if (act === 'selHero') { g.sfx.click(); this.selHero = key; this.render(); return; }
    if (act === 'selWeapon') { g.sfx.click(); this.selWeapon = key; this.render(); return; }
    if (act === 'selPet') { g.sfx.click(); this.selPet = key; this.render(); return; }
    if (act === 'buyPet') {
      const p = PETS.find(x => x.id === key);
      if (!g.spend(p.cost)) return;
      s.pets[p.id] = { owned: true, level: 1, xp: 0 };
      s.pet = p.id;
      g.toast(`${p.name} adopted!`);
    } else if (act === 'usePet') {
      g.sfx.click();
      s.pet = key;
      g.toast(`${PETS.find(x => x.id === key).name} is coming along`);
    } else
    if (act === 'buyHero') {
      const h = HEROES.find(x => x.id === key);
      if (!g.spend(h.cost)) return;
      s.heroes[h.id] = { owned: true, level: 1, xp: 0 };
      s.hero = h.id;
      g.toast(`${h.name} joined your squad!`);
    } else if (act === 'useHero') {
      g.sfx.click();
      s.hero = key;
      g.toast(`${HEROES.find(x => x.id === key).name} selected`);
    } else if (act === 'buyWeapon') {
      const w = WEAPONS.find(x => x.id === key);
      if (!g.spend(w.cost)) return;
      s.weapons[w.id] = { owned: true, level: 1, xp: 0 };
      s.equipped = w.id;
      g.toast(`${w.name} unlocked!`);
    } else if (act === 'equip') {
      g.sfx.click();
      s.equipped = key;
      g.toast(`${WEAPONS.find(x => x.id === key).name} equipped`);
    }
    g.onShopChange();
    this.render();
  }

  render() {
    const s = this.game.save;
    document.querySelectorAll('#shop .tab').forEach(x => x.classList.toggle('active', x.dataset.tab === this.tab));
    document.getElementById('shopCoins').textContent = s.coins.toLocaleString();
    document.getElementById('shopWave').textContent = `· Next: Wave ${s.wave}`;
    document.getElementById('startWaveBtn').textContent = `START WAVE ${s.wave}`;
    this.renderPreview();
    if (this.tab === 'heroes') this.renderHeroes();
    else if (this.tab === 'weapons') this.renderWeapons();
    else if (this.tab === 'pets') this.renderPets();
    else this.renderBase();
  }

  renderPreview() {
    const s = this.game.save;
    const sum = waveSummary(s.wave);
    const types = Object.entries(sum.counts).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span class="echip ${k === 'boss' ? 'boss' : ''}">${ENEMIES[k].name} ×${n}</span>`).join('');
    document.getElementById('shopTip').innerHTML = `<span class="warnico">⚠</span> <b>${sum.total}</b> enemies from <b>${sum.portals.map(i => COMPASS[i]).join(', ')}</b>${isBossWave(s.wave) ? ' · <b class="bossw">BOSS WAVE</b>' : ''}<div class="echips">${types}</div>`;
  }

  thumb(key) { return this.game.thumbs[this.game.thumbs[key]] || this.game.thumbs[key] || ''; }

  renderHeroes() {
    const s = this.game.save;
    const sel = HEROES.find(h => h.id === (this.selHero || s.hero)) || HEROES[0];
    const rec = s.heroes[sel.id];
    let h = '<div class="chiplist">';
    for (const x of HEROES) {
      const o = s.heroes[x.id];
      const r = rarityOf(o ? o.level : 1);
      h += `<button class="chip ${x.id === sel.id ? 'sel' : ''} ${o ? '' : 'locked'}" style="--rc:${o ? r.css : '#5a5378'}" data-act="selHero" data-key="${x.id}">
        ${s.hero === x.id ? '<span class="tag eq ico ico-check"></span>' : o ? '' : '<span class="tag ico ico-lock"></span>'}
        <img src="${this.thumb('hero_' + x.id)}" alt=""><span class="cname">${x.name}</span><span class="csub">${o ? 'Lv ' + o.level : x.role}</span></button>`;
    }
    h += '</div>';
    const st = heroStats(sel, rec ? rec.level : 1);
    let btn;
    if (!rec) btn = `<button class="buy ${s.coins >= sel.cost ? '' : 'cant'}" data-act="buyHero" data-key="${sel.id}">RECRUIT ${coin(sel.cost)}</button>`;
    else if (s.hero === sel.id) btn = '<button class="buy equipped">SELECTED</button>';
    else btn = `<button class="buy equip" data-act="useHero" data-key="${sel.id}">PLAY AS ${sel.name.toUpperCase()}</button>`;
    h += `<div class="detail">
      <div class="card head" style="--rc:${rarityOf(rec ? rec.level : 1).css}"><img class="big" src="${this.thumb('hero_' + sel.id)}" alt="">
        <div class="info"><h3>${sel.name} <small>${sel.role}</small></h3>${levelBlock(rec)}
          <div class="wstats"><span>HEALTH <b>${st.hp}</b></span><span>SPEED <b>${Math.round(st.speed * 100)}%</b></span><span>DAMAGE <b>${Math.round(st.dmg * 100)}%</b></span><span>ABILITY POWER <b>${Math.round(st.power * 100)}%</b></span></div>
        </div>${btn}</div>
      <div class="card"><h4>Ability · ${sel.active.name} <small>${sel.active.cd}s cooldown</small></h4><p>${sel.active.desc}</p><h4>Passive</h4><p>${sel.passive}</p></div>
      <div class="card"><h4>Rarity perks</h4>${abilityList(sel.perks, rec ? rec.level : 1, 'hero')}</div>
    </div>`;
    this.el.innerHTML = h;
  }

  renderWeapons() {
    const s = this.game.save;
    const sel = WEAPONS.find(w => w.id === (this.selWeapon || s.equipped)) || WEAPONS[0];
    const rec = s.weapons[sel.id];
    let h = '<div class="chiplist">';
    for (const x of WEAPONS) {
      const o = s.weapons[x.id];
      const r = rarityOf(o ? o.level : 1);
      h += `<button class="chip wide ${x.id === sel.id ? 'sel' : ''} ${o ? '' : 'locked'}" style="--rc:${o ? r.css : '#5a5378'}" data-act="selWeapon" data-key="${x.id}">
        ${s.equipped === x.id ? '<span class="tag eq ico ico-check"></span>' : o ? '' : '<span class="tag ico ico-lock"></span>'}
        <img src="${this.thumb('weapon_' + x.id)}" alt=""><span class="cname">${x.name}</span><span class="csub">${o ? `Lv ${o.level}` : coin(x.cost)}</span></button>`;
    }
    h += '</div>';
    const lv = rec ? rec.level : 1;
    const st = weaponStats(sel, lv);
    const dmgTxt = sel.pellets > 1 ? `${Math.round(st.dmg)}×${sel.pellets}` : Math.round(st.dmg);
    let btn;
    if (!rec) btn = `<button class="buy ${s.coins >= sel.cost ? '' : 'cant'}" data-act="buyWeapon" data-key="${sel.id}">UNLOCK ${coin(sel.cost)}</button>`;
    else if (s.equipped === sel.id) btn = '<button class="buy equipped">EQUIPPED</button>';
    else btn = `<button class="buy equip" data-act="equip" data-key="${sel.id}">EQUIP</button>`;
    h += `<div class="detail">
      <div class="card head" style="--rc:${rarityOf(lv).css}"><img class="big gun" src="${this.thumb('weapon_' + sel.id)}" alt="">
        <div class="info"><h3>${sel.name}</h3><p>${sel.desc} Swap between all your guns during a wave.</p>${levelBlock(rec)}
          <div class="wstats"><span>DMG <b>${dmgTxt}</b></span><span>RATE <b>${st.rate.toFixed(1)}/s</b></span><span>MAG <b>${st.mag}</b></span><span>RELOAD <b>${st.reload.toFixed(2)}s</b></span>${sel.splash ? `<span>SPLASH <b>${sel.splash}m</b></span>` : ''}${sel.pierce ? `<span>PIERCE <b>${sel.pierce}</b></span>` : ''}</div>
        </div>${btn}</div>
      <div class="card"><h4>Rarity abilities <small>Every new rarity adds one</small></h4>${abilityList(sel.abilities, lv, 'weapon')}</div>
    </div>`;
    this.el.innerHTML = h;
  }

  renderPets() {
    const s = this.game.save;
    const sel = PETS.find(p => p.id === (this.selPet || s.pet)) || PETS[0];
    const rec = s.pets[sel.id];
    let h = '<div class="chiplist">';
    for (const x of PETS) {
      const o = s.pets[x.id];
      const r = rarityOf(o ? o.level : 1);
      h += `<button class="chip ${x.id === sel.id ? 'sel' : ''} ${o ? '' : 'locked'}" style="--rc:${o ? r.css : '#5a5378'}" data-act="selPet" data-key="${x.id}">
        ${s.pet === x.id ? '<span class="tag eq ico ico-check"></span>' : o ? '' : '<span class="tag ico ico-lock"></span>'}
        <img src="${this.thumb('pet_' + x.id)}" alt=""><span class="cname">${x.name}</span><span class="csub">${o ? 'Lv ' + o.level : coin(x.cost)}</span></button>`;
    }
    h += '</div>';
    const lv = rec ? rec.level : 1;
    const st = petStats(sel, lv);
    const role = { melee: 'Fighter', ranged: 'Shooter', support: 'Healer', collector: 'Collector', roar: 'Brawler' }[sel.kind];
    let btn;
    if (!rec) btn = `<button class="buy ${s.coins >= sel.cost ? '' : 'cant'}" data-act="buyPet" data-key="${sel.id}">ADOPT ${coin(sel.cost)}</button>`;
    else if (s.pet === sel.id) btn = '<button class="buy equipped">WITH YOU</button>';
    else btn = `<button class="buy equip" data-act="usePet" data-key="${sel.id}">BRING ${sel.name.toUpperCase()}</button>`;
    h += `<div class="detail">
      <div class="card head" style="--rc:${rarityOf(lv).css}"><img class="big" src="${this.thumb('pet_' + sel.id)}" alt="">
        <div class="info"><h3>${sel.name} <small>${role}</small></h3><p>${sel.desc}</p>${levelBlock(rec)}
          <div class="wstats">${sel.kind === 'support' ? '<span>HEALS <b>8% / 5s</b></span>' : `<span>DMG <b>${Math.round(st.dmg)}</b></span><span>ATTACKS <b>${st.rate.toFixed(1)}/s</b></span>`}${sel.fly ? '<span><b>FLIES</b></span>' : ''}</div>
        </div>${btn}</div>
      <div class="card"><h4>Rarity perks <small>Pets level up with you</small></h4>${abilityList(sel.perks, lv, 'pet')}</div>
    </div>`;
    this.el.innerHTML = h;
  }

  renderBase() {
    const s = this.game.save;
    const tier = ['Bungalow', 'Family Home', 'Two-Story House', 'Fortified Home'][houseTier(s.wave)];
    const next = [10, 20, 35].find(w => w > s.wave);
    let h = `<div class="card buildcta"><div><h3>Edit your base</h3><p>Build walls, spike traps, freeze traps and turret towers around the house. Enemies must smash through walls to reach it. ${s.structures.length} built. Walls and traps get stronger every wave.</p></div><button class="buy equip" id="buildBtn2">EDIT BASE</button></div>
      <div class="cards">
        <div class="card"><h3>Your house</h3><p>The house grows stronger on its own as you reach higher waves.</p>
          <div class="stat"><span>${tier}</span><b>${houseMaxHp(s.wave).toLocaleString()} HP</b></div>
          <p>${next ? `Upgrades to the next house at wave ${next}.` : 'Fully upgraded!'}</p></div>
        <div class="card"><h3>Your run</h3><p>Waves continue automatically. Your gun, hero and pet stay locked in until you fall, then you come back here.</p>
          <div class="stat"><span>Best wave cleared</span><b>${Math.max(0, s.best - 1)}</b></div>
          <div class="stat"><span>Enemies defeated</span><b>${s.kills.toLocaleString()}</b></div></div>
      </div>`;
    this.el.innerHTML = h;
    document.getElementById('buildBtn2').addEventListener('click', () => document.getElementById('buildBtn').click());
  }
}
