// Base / shop screen: weapons, house and hero upgrades.
import {
  WEAPONS, WEAPON_UPGRADES, weaponStats, weaponUpgradeCost,
  HOUSE_UPGRADES, HERO_UPGRADES, upgradeCost,
} from './data.js';

export function drawGunIcon(canvas, w, locked = false) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const cw = canvas.clientWidth || canvas.width, ch = canvas.clientHeight || canvas.height;
  canvas.width = cw * dpr; canvas.height = ch * dpr;
  const g = canvas.getContext('2d');
  g.scale(dpr, dpr);
  const L = w.look;
  const hex = (n) => '#' + n.toString(16).padStart(6, '0');
  const body = locked ? '#3b3458' : hex(L.body), acc = locked ? '#554c7a' : hex(L.accent);
  const len = Math.min(1, (L.len + L.barrel) / 1.6);
  const total = cw * (0.45 + 0.5 * len);
  const x0 = (cw - total) / 2, cy = ch * 0.42, th = ch * 0.22 * (L.thick / 0.15);
  g.lineJoin = 'round';
  g.fillStyle = body;
  const bodyLen = total * (L.len / (L.len + L.barrel || 1));
  if (L.tube) {
    g.fillRect(x0, cy - th * 0.7, total, th * 1.4);
    g.fillStyle = acc; g.fillRect(x0 + total - 6, cy - th * 0.8, 6, th * 1.6);
    g.fillRect(x0 + total * 0.35, cy + th * 0.7, 6, th * 1.3);
    g.fillStyle = body; g.fillRect(x0 + total * 0.5, cy + th * 0.7, 6, th * 1.1);
  } else {
    g.fillRect(x0, cy - th / 2, bodyLen, th);
    g.fillRect(x0 + bodyLen, cy - th * 0.22, total - bodyLen, th * 0.44);
    g.fillRect(x0 + bodyLen * 0.12, cy, th * 0.7, th * 1.6);
    if (L.mag) { g.fillStyle = acc; g.fillRect(x0 + bodyLen * 0.5, cy + th / 2, th * 0.55, th * 1.2); }
    if (L.stock) { g.fillStyle = body; g.fillRect(x0 - th * 1.2, cy - th * 0.35, th * 1.3, th * 0.9); }
    if (L.scope) { g.fillStyle = acc; g.fillRect(x0 + bodyLen * 0.3, cy - th * 1.1, bodyLen * 0.45, th * 0.5); }
    if (L.pump) { g.fillStyle = acc; g.fillRect(x0 + bodyLen, cy + th * 0.1, (total - bodyLen) * 0.4, th * 0.4); }
    g.fillStyle = acc; g.fillRect(x0, cy - th / 2, bodyLen, th * 0.18);
  }
}

function pips(lv, max) {
  let s = '<div class="pips">';
  for (let i = 0; i < max; i++) s += `<i class="${i < lv ? 'on' : ''}"></i>`;
  return s + '</div>';
}

function coin(n) { return `<span class="coin-ico"></span>${n.toLocaleString()}`; }

export class Shop {
  constructor(game) {
    this.game = game;
    this.tab = 'weapons';
    this.sel = game.save.equipped;
    this.el = document.getElementById('tabContent');
    document.querySelectorAll('#shop .tab').forEach(t => {
      t.addEventListener('click', () => {
        this.game.sfx.click();
        this.tab = t.dataset.tab;
        document.querySelectorAll('#shop .tab').forEach(x => x.classList.toggle('active', x === t));
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
    if (act === 'sel') {
      g.sfx.click();
      this.sel = key;
      this.render();
      return;
    }
    if (act === 'buyWeapon') {
      const w = WEAPONS.find(x => x.id === key);
      if (!g.spend(w.cost)) return;
      s.weapons[w.id] = { owned: true, lv: { dmg: 0, rate: 0, mag: 0, reload: 0 } };
      s.equipped = w.id;
      g.toast(`${w.name} unlocked!`);
    } else if (act === 'equip') {
      g.sfx.click();
      s.equipped = key;
      g.toast(`${WEAPONS.find(x => x.id === key).name} equipped`);
    } else if (act === 'wup') {
      const w = WEAPONS.find(x => x.id === this.sel);
      const lv = s.weapons[w.id].lv;
      const u = WEAPON_UPGRADES.find(x => x.key === key);
      if (lv[key] >= u.max) return;
      if (!g.spend(weaponUpgradeCost(w, key, lv[key]))) return;
      lv[key]++;
    } else if (act === 'house' || act === 'hero') {
      const list = act === 'house' ? HOUSE_UPGRADES : HERO_UPGRADES;
      const u = list.find(x => x.key === key);
      const obj = s[act];
      if (obj[key] >= u.max) return;
      if (!g.spend(upgradeCost(u, obj[key]))) return;
      obj[key]++;
    }
    g.onShopChange();
    this.render();
  }

  render() {
    const s = this.game.save;
    document.getElementById('shopCoins').textContent = s.coins.toLocaleString();
    document.getElementById('shopWave').textContent = `· Next: Wave ${s.wave}`;
    document.getElementById('startWaveBtn').textContent = `START WAVE ${s.wave}`;
    const tip = document.getElementById('shopTip');
    tip.textContent = this.tip();
    if (this.tab === 'weapons') this.renderWeapons();
    else this.renderUpgrades(this.tab === 'house' ? HOUSE_UPGRADES : HERO_UPGRADES, this.tab);
  }

  tip() {
    const s = this.game.save;
    if (s.wave % 5 === 0) return 'Boss wave! A Storm King is coming. Shoot its head.';
    if (s.house.fence === 0 && s.wave >= 3) return 'Tip: Barricades stop enemies before they reach the house.';
    if (s.house.turrets === 0 && s.coins >= 250) return 'Tip: Auto Turrets help defend while you fight elsewhere.';
    return 'Coins you collect are kept even if you fail a wave.';
  }

  renderWeapons() {
    const s = this.game.save;
    const w = WEAPONS.find(x => x.id === this.sel) || WEAPONS[0];
    const owned = s.weapons[w.id]?.owned;
    let h = '<div class="weapon-list">';
    for (const x of WEAPONS) {
      const o = s.weapons[x.id]?.owned;
      const tag = s.equipped === x.id ? '<span class="tag eq ico ico-check"></span>' : (o ? '' : '<span class="tag ico ico-lock"></span>');
      h += `<button class="wchip ${x.id === w.id ? 'sel' : ''} ${o ? '' : 'locked'}" data-act="sel" data-key="${x.id}">${tag}<canvas data-gun="${x.id}" data-locked="${o ? 0 : 1}"></canvas>${x.name}</button>`;
    }
    h += '</div>';
    const lv = owned ? s.weapons[w.id].lv : { dmg: 0, rate: 0, mag: 0, reload: 0 };
    const st = weaponStats(w, lv);
    const dmgTxt = w.pellets > 1 ? `${Math.round(st.dmg)}×${w.pellets}` : Math.round(st.dmg);
    let btn;
    if (!owned) btn = `<button class="buy ${s.coins >= w.cost ? '' : 'cant'}" data-act="buyWeapon" data-key="${w.id}">UNLOCK ${coin(w.cost)}</button>`;
    else if (s.equipped === w.id) btn = `<button class="buy equipped">EQUIPPED</button>`;
    else btn = `<button class="buy equip" data-act="equip" data-key="${w.id}">EQUIP</button>`;
    h += `<div class="wdetail"><div class="card head"><canvas data-gun="${w.id}" data-locked="0"></canvas><div class="info"><h3>${w.name}</h3><p>${w.desc}${owned ? ' All owned guns can be swapped in battle.' : ''}</p>
      <div class="wstats"><span>DMG <b>${dmgTxt}</b></span><span>RATE <b>${st.rate.toFixed(1)}/s</b></span><span>MAG <b>${st.mag}</b></span><span>RELOAD <b>${st.reload.toFixed(2)}s</b></span>${w.splash ? '<span>SPLASH <b>' + w.splash + 'm</b></span>' : ''}${w.pierce ? '<span>PIERCE <b>' + w.pierce + '</b></span>' : ''}</div></div>${btn}</div>`;
    if (owned) {
      for (const u of WEAPON_UPGRADES) {
        const l = lv[u.key];
        const cur = weaponStats(w, lv), nxt = weaponStats(w, { ...lv, [u.key]: Math.min(u.max, l + 1) });
        const f = {
          dmg: v => Math.round(v.dmg) + (w.pellets > 1 ? '×' + w.pellets : ''),
          rate: v => v.rate.toFixed(1) + '/s',
          mag: v => v.mag,
          reload: v => v.reload.toFixed(2) + 's',
        }[u.key];
        const maxed = l >= u.max;
        const cost = maxed ? 0 : weaponUpgradeCost(w, u.key, l);
        h += `<div class="card"><h3>${u.name}</h3>${pips(l, u.max)}
          <div class="stat"><span>${f(cur)}</span>${maxed ? '' : `<b>→ ${f(nxt)}</b>`}</div>
          ${maxed ? '<button class="buy maxed">MAXED</button>' : `<button class="buy ${s.coins >= cost ? '' : 'cant'}" data-act="wup" data-key="${u.key}">UPGRADE ${coin(cost)}</button>`}</div>`;
      }
    }
    h += '</div>';
    this.el.innerHTML = h;
    this.el.querySelectorAll('canvas[data-gun]').forEach(c => drawGunIcon(c, WEAPONS.find(x => x.id === c.dataset.gun), c.dataset.locked === '1'));
  }

  renderUpgrades(list, kind) {
    const s = this.game.save;
    const obj = s[kind];
    let h = '<div class="cards">';
    for (const u of list) {
      const l = obj[u.key];
      const maxed = l >= u.max;
      const locked = u.requires && !obj[u.requires];
      const cost = maxed ? 0 : upgradeCost(u, l);
      let btn;
      if (maxed) btn = '<button class="buy maxed">MAXED</button>';
      else if (locked) btn = '<button class="buy cant">Needs Auto Turrets</button>';
      else btn = `<button class="buy ${s.coins >= cost ? '' : 'cant'}" data-act="${kind}" data-key="${u.key}">${l === 0 ? 'BUY' : 'UPGRADE'} ${coin(cost)}</button>`;
      h += `<div class="card"><h3>${u.name}</h3><p>${u.desc}</p>${pips(l, u.max)}
        <div class="stat"><span>${u.fmt(u.value(l))}</span>${maxed ? '' : `<b>→ ${u.fmt(u.value(l + 1))}</b>`}</div>${btn}</div>`;
    }
    h += '</div>';
    this.el.innerHTML = h;
  }
}
