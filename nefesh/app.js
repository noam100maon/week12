/* ==========================================================================
   Nefesh — habit system
   State lives in localStorage. No network, no accounts.
   ========================================================================== */

const KEY  = 'nefesh.v2';
const OLD  = 'nefesh.v1';
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ---------------------------------------------------------------- content */

const QUOTES = [
  ['You do not rise to the level of your goals. You fall to the level of your systems.','James Clear'],
  ['Every action you take is a vote for the type of person you wish to become.','James Clear'],
  ['Habits are the compound interest of self-improvement.','James Clear'],
  ['Never miss twice. Missing once is an accident; missing twice is the start of a new habit.','James Clear'],
  ['You should be far more concerned with your current trajectory than with your current results.','James Clear'],
  ['Standardise before you optimise. You cannot improve a habit that does not exist.','James Clear'],
  ['The most effective form of motivation is progress.','James Clear'],
  ['Motivation is overrated; environment often matters more.','James Clear'],
  ['We are what we repeatedly do. Excellence, then, is not an act but a habit.','Will Durant'],
  ['The chains of habit are too light to be felt until they are too heavy to be broken.','Warren Buffett'],
  ['First we make our habits, then our habits make us.','John Dryden'],
  ['Make it so easy you cannot say no.','Leo Babauta'],
];

const MODELS = [
  ['The plateau of latent potential','Results lag effort. The valley of disappointment is the stretch where the work is real but invisible — and where most people quit.'],
  ['The 1% improvement curve','1.01³⁶⁵ ≈ 37.8 against 0.99³⁶⁵ ≈ 0.03. Tiny daily deltas compound into a difference of two orders of magnitude.'],
  ['The two-minute rule','Scale the habit down until it takes two minutes. You are not trying to do the thing — you are mastering the act of showing up.'],
  ['The Goldilocks zone','Motivation peaks at roughly 4% beyond your current ability. Too easy is boring; too hard is discouraging.'],
  ['The habit loop','Cue, craving, response, reward. Change the cue or the friction and the loop reroutes.'],
];

const ANCHORS = ['Morning coffee','Brushing teeth','Lunch','Shutting the laptop','Waking up','Getting home','Dinner plates cleared'];
const ACTIONS = ['Read 1 page','Do 1 push-up','Write 2 sentences','Take 3 breaths','Sketch 1 idea','Walk to the corner','Drink a glass of water'];

const BUNDLES = [
  ['Mindset','The Focused Reader','a Reader','Read 1 page','Morning coffee','Open the book'],
  ['Fitness','The Consistent Runner','a Runner','Put on shoes and step outside','Waking up','Shoes on, nothing more'],
  ['Focus','The Daily Writer','a Writer','Write 2 sentences','Shutting the laptop','One sentence'],
  ['Calm','The Mindful Builder','someone calm and present','Take 3 breaths','Brushing teeth','One breath'],
];

const BOOKS = [
  ['atomic','Atomic Habits','James Clear'],
  ['power','The Power of Habit','Charles Duhigg'],
  ['tiny','Tiny Habits','BJ Fogg'],
  ['deep','Deep Work','Cal Newport'],
  ['4dx','The 4 Disciplines of Execution','McChesney, Covey & Huling'],
];

const FRICTION = [['big','Too big'],['timing','Bad timing'],['forgot','Forgot'],['energy','Low energy']];

const INFO = {
  habits:      ['Daily habits','Each habit is an implementation intention: after a cue you already have, you do something small enough that refusing feels silly. Ticking one casts a vote for the identity attached to it.'],
  goals:       ['Goals','A goal is a one-off outcome you still touch daily. It counts towards today’s total but it is the habit underneath that moves it.'],
  models:      ['Mental models','Five ideas that explain why a system beats willpower. Read one when the work feels pointless — that feeling is usually the plateau, not failure.'],
  sim:         ['Implementation simulator','Habit stacking in miniature: pick something you already do without thinking, attach the smallest possible version of what you want to do, and let the old habit carry the new one.'],
  bundles:     ['Identity bundles','A starting kit. Each bundle pairs an identity with the two-minute habit that votes for it, already anchored to a common cue. You can edit everything after importing.'],
  vault:       ['Wisdom vault','Everything you have starred — quotes and books — collected in one place so the good lines do not scroll away.'],
  momentum:    ['System momentum','A single read on the system rather than any one day. 60% is your completion rate over the selected range, 25% is your best current streak measured against three weeks, and 15% is how many of your habits are active at all.'],
  consistency: ['Consistency','The seven-day rolling average of identity points — one point per completion. The rolling window smooths single bad days so you can see the trend underneath them.'],
  votes:       ['Votes cast','Every completion is one vote for the identity behind the habit. The tally is not a score; it is evidence about who you have been lately.'],
};

/* ------------------------------------------------------------------ state */

const blank = () => ({
  v: 2,
  profile: { name: '' },
  habits: [],
  log: {},
  vault: { quotes: [], books: [] },
  ack: [],
  reflections: [],
  quoteIndex: null,
});

function migrate(old) {
  const s = blank();
  const byId = Object.fromEntries((old.identities || []).map(i => [i.id, i.text]));
  s.habits = (old.habits || []).map(h => ({
    id: h.id, name: h.name,
    identity: byId[h.identity] || '',
    anchor: h.stack || '', time: '', tiny: h.tiny || '',
    steps: [], days: h.days || [0,1,2,3,4,5,6],
    kind: 'habit', created: h.created || todayISO(),
  }));
  Object.entries(old.log || {}).forEach(([date, day]) => {
    s.log[date] = {};
    Object.keys(day).forEach(id => { s.log[date][id] = { done: true, steps: [] }; });
  });
  return s;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...blank(), ...JSON.parse(raw) };
    const old = localStorage.getItem(OLD);
    if (old) return migrate(JSON.parse(old));
  } catch { /* fall through to a clean slate */ }
  return blank();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
}

let state = load();
let range = 30;

/* ------------------------------------------------------------------ dates */

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => iso(new Date());
const parseISO = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
const shift = (s, n) => { const d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); };
const weekday = s => parseISO(s).getDay();

const today = todayISO();

function prettyDate(s) {
  return parseISO(s).toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
}
function shortDate(s) {
  return parseISO(s).toLocaleDateString(undefined, { month:'short', day:'numeric' });
}
function greeting() {
  const h = new Date().getHours();
  return h < 5 ? 'Still up' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

/* ------------------------------------------------------------ habit logic */

const uid = () => Math.random().toString(36).slice(2, 10);
const scheduled = (h, d) => h.days.includes(weekday(d)) && d >= h.created;
const entry = (h, d) => (state.log[d] || {})[h.id] || null;
const isDone = (h, d) => Boolean(entry(h, d) && entry(h, d).done);

function writeEntry(h, d, patch) {
  const day = (state.log[d] ||= {});
  const cur = day[h.id] || { done: false, steps: [] };
  const next = { ...cur, ...patch };
  if (!next.done && !next.miss && !(next.steps || []).some(Boolean)) delete day[h.id];
  else day[h.id] = next;
  if (!Object.keys(day).length) delete state.log[d];
  save();
}

function toggleHabit(h, d) {
  const on = !isDone(h, d);
  writeEntry(h, d, { done: on, miss: on ? undefined : (entry(h, d) || {}).miss });
  return on;
}

function toggleStep(h, d, i) {
  const steps = [...((entry(h, d) || {}).steps || [])];
  steps[i] = !steps[i];
  const all = h.steps.length > 0 && h.steps.every((_, k) => steps[k]);
  writeEntry(h, d, { steps, done: all ? true : (entry(h, d) || {}).done || false });
}

/** Consecutive scheduled days completed, counting back from `from`.
    A scheduled day still ahead of us today does not break the run. */
function streak(h, from = today) {
  let n = 0, day = from;
  for (let i = 0; i < 500; i++) {
    if (day < h.created) break;
    if (scheduled(h, day)) {
      if (isDone(h, day)) n++;
      else if (day !== today) break;
    }
    day = shift(day, -1);
  }
  return n;
}

/** The previous scheduled day was missed — the never-miss-twice trigger. */
function missedLast(h, d = today) {
  let day = shift(d, -1);
  for (let i = 0; i < 90; i++) {
    if (day < h.created) return false;
    if (scheduled(h, day)) return !isDone(h, day);
    day = shift(day, -1);
  }
  return false;
}

function firstDate() {
  const dates = [...state.habits.map(h => h.created), ...Object.keys(state.log)].sort();
  return dates[0] || today;
}

function rangeDates(days) {
  const start = days ? shift(today, -(days - 1)) : firstDate();
  const out = [];
  for (let d = start; d <= today; d = shift(d, 1)) out.push(d);
  return out;
}

function windowStats(h, dates) {
  let hit = 0, due = 0;
  dates.forEach(d => { if (scheduled(h, d)) { due++; if (isDone(h, d)) hit++; } });
  return { hit, due, rate: due ? hit / due : 0 };
}

const votes = h => Object.values(state.log).reduce((n, day) => n + (day[h.id]?.done ? 1 : 0), 0);
const pointsOn = d => Object.values(state.log[d] || {}).filter(e => e.done).length;

/** Days where a habit was missed last time and completed anyway the next time. */
function rescued() {
  let n = 0;
  state.habits.forEach(h => {
    rangeDates(0).forEach(d => { if (isDone(h, d) && missedLast(h, d)) n++; });
  });
  return n;
}

function momentum(dates) {
  if (!state.habits.length) return { pct: 0, rate: 0, best: 0, active: 0 };
  const tot = state.habits.reduce((a, h) => {
    const w = windowStats(h, dates);
    return { hit: a.hit + w.hit, due: a.due + w.due };
  }, { hit: 0, due: 0 });
  const rate   = tot.due ? tot.hit / tot.due : 0;
  const best   = state.habits.reduce((m, h) => Math.max(m, streak(h)), 0);
  const active = state.habits.filter(h => windowStats(h, dates).hit > 0).length / state.habits.length;
  const pct = Math.round(100 * (0.60 * rate + 0.25 * Math.min(1, best / 21) + 0.15 * active));
  return { pct, rate, best, active };
}

/** 7-day rolling mean of daily identity points, over `dates`. */
function rolling(dates) {
  return dates.map(d => {
    let sum = 0;
    for (let i = 0; i < 7; i++) sum += pointsOn(shift(d, -i));
    return sum / 7;
  });
}

function identities() {
  const map = new Map();
  state.habits.forEach(h => {
    const label = (h.identity || '').trim();
    if (!label) return;
    map.set(label, (map.get(label) || 0) + votes(h));
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

const MILESTONES = [10, 25, 50, 100, 250, 500, 1000];
function dueMilestone() {
  const total = Object.values(state.log).reduce((n, d) => n + Object.values(d).filter(e => e.done).length, 0);
  const reached = MILESTONES.filter(m => total >= m);
  const last = reached[reached.length - 1];
  return last && !state.ack.includes(last) ? last : null;
}

/* ----------------------------------------------------------------- helpers */

const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function icon(id, size = 16, cls) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', size); svg.setAttribute('height', size);
  if (cls) svg.setAttribute('class', cls);
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#' + id);
  svg.append(use);
  return svg;
}
const checkMark = () => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  p.setAttribute('points', '3,8.5 6.5,12 13,4.5');
  p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
  svg.append(p);
  return svg;
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2100);
}

function haptic(ms = 8) { if (navigator.vibrate) navigator.vibrate(ms); }

/* ------------------------------------------------------------------ sheets */

let openSheet = null;
function sheet(id) {
  if (openSheet) openSheet.classList.remove('on');
  openSheet = $(id);
  openSheet.classList.add('on');
  $('#scrim').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  if (openSheet) openSheet.classList.remove('on');
  openSheet = null;
  $('#scrim').classList.remove('on');
  document.body.style.overflow = '';
}
$('#scrim').onclick = closeSheet;
$$('[data-close]').forEach(b => b.onclick = closeSheet);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

$$('[data-info]').forEach(b => b.onclick = () => {
  const [title, body] = INFO[b.dataset.info];
  $('#info-title').textContent = title;
  $('#info-body').textContent = body;
  sheet('#sheet-info');
});

/* ======================================================== RENDER — HOME === */

function renderHome() {
  $('#greet').textContent = state.profile.name
    ? `${greeting()}, ${state.profile.name}` : greeting();
  $('#home-title').textContent = 'Today';

  const habits = state.habits.filter(h => h.kind !== 'goal' && scheduled(h, today));
  const goals  = state.habits.filter(h => h.kind === 'goal'  && scheduled(h, today));
  const all    = [...habits, ...goals];
  const done   = all.filter(h => isDone(h, today)).length;
  const pct    = all.length ? Math.round((done / all.length) * 100) : 0;

  $('#focus-count').textContent = all.length
    ? `${done} of ${all.length} today`
    : 'Nothing scheduled';
  $('#focus-pct').textContent = pct + '%';
  $('#focus-bar').style.width = pct + '%';

  const risk = all.filter(h => !isDone(h, today) && missedLast(h));
  $('#focus-meta').textContent = !all.length
    ? 'Add one habit. One is a system; ten is a wish.'
    : risk.length ? `Never miss twice — ${risk.map(h => h.name).join(', ')} slipped last time.`
    : done === all.length ? 'Every vote in. The day is closed.'
    : `${state.habits.length} ${state.habits.length === 1 ? 'habit' : 'habits'} · ${goals.length} ${goals.length === 1 ? 'goal' : 'goals'}`;

  paintList($('#habit-list'), habits, 'No habits due today.');
  $('#goals-sec').hidden = goals.length === 0;
  paintList($('#goal-list'), goals, null);
}

function paintList(ul, items, emptyText) {
  ul.textContent = '';
  if (!items.length) {
    if (emptyText) ul.append(el('li', 'card empty', emptyText));
    return;
  }
  items.forEach(h => ul.append(habitCard(h)));
}

const openSteps = new Set();   // habits whose step list is expanded

function habitCard(h) {
  const on = isDone(h, today);
  const e  = entry(h, today) || {};
  const li = el('li', 'card habit' + (on ? ' done' : ''));
  li.style.marginTop = '10px';

  const top = el('div', 'habit-top');

  const check = el('button', 'check');
  check.setAttribute('aria-pressed', String(on));
  check.setAttribute('aria-label', (on ? 'Mark incomplete: ' : 'Mark complete: ') + h.name);
  check.append(checkMark());
  check.onclick = () => {
    const nowOn = toggleHabit(h, today);
    haptic(nowOn ? 12 : 6);
    if (nowOn && h.identity) toast(`A vote for ${h.identity}`);
    render();
  };

  const body = el('div', 'habit-body');
  body.append(el('div', 'habit-name', h.name));

  const meta = el('div', 'habit-meta');
  if (h.anchor) meta.append(el('span', null, `After ${h.anchor.toLowerCase()}`));
  if (h.time)   meta.append(el('span', null, formatTime(h.time)));
  if (h.steps.length) {
    const n = h.steps.filter((_, i) => (e.steps || [])[i]).length;
    meta.append(el('span', null, `${n}/${h.steps.length} steps`));
  }
  const st = streak(h);
  if (st > 1) meta.append(el('span', null, `${st}-day streak`));
  if (meta.childElementCount) body.append(meta);

  const acts = el('div', 'habit-acts');
  if (h.tiny) {
    const chip = el('button', 'chip ghost', `Low energy → ${h.tiny}`);
    chip.onclick = () => {
      if (!isDone(h, today)) { toggleHabit(h, today); haptic(12); toast('Counted. Showing up is the habit.'); render(); }
    };
    acts.append(chip);
  }
  if (h.steps.length) {
    const t = el('button', 'chip', openSteps.has(h.id) ? 'Hide steps' : 'Show steps');
    t.onclick = () => {
      const open = openSteps.has(h.id);
      if (open) openSteps.delete(h.id); else openSteps.add(h.id);
      stepsBox.hidden = open;
      t.textContent = open ? 'Show steps' : 'Hide steps';
      haptic(6);
    };
    acts.append(t);
  }
  const edit = el('button', 'chip', 'Edit');
  edit.onclick = () => openHabitForm(h);
  acts.append(edit);
  body.append(acts);

  const stepsBox = el('div', 'steps');
  stepsBox.hidden = !openSteps.has(h.id);
  h.steps.forEach((txt, i) => {
    const doneStep = Boolean((e.steps || [])[i]);
    const row = el('button', 'step' + (doneStep ? ' done' : ''));
    const c = el('span', 'check sm');
    c.setAttribute('aria-pressed', String(doneStep));
    c.append(checkMark());
    row.append(c, el('span', 'step-txt', txt));
    row.onclick = () => { toggleStep(h, today, i); haptic(6); render(); };
    stepsBox.append(row);
  });
  if (h.steps.length) body.append(stepsBox);

  top.append(check, body);
  li.append(top);

  if (!on && missedLast(h)) li.append(frictionBox(h));
  return li;
}

function frictionBox(h) {
  const box = el('div', 'friction');
  box.append(el('p', 'friction-q', 'What got in the way?'));
  const row = el('div', 'friction-row');
  const logged = (entry(h, shift(today, -1)) || {}).miss;
  FRICTION.forEach(([code, label]) => {
    const c = el('button', 'chip' + (logged === code ? ' on' : ''), label);
    c.onclick = () => {
      let day = shift(today, -1);
      for (let i = 0; i < 90 && !scheduled(h, day); i++) day = shift(day, -1);
      writeEntry(h, day, { miss: code });
      haptic(6);
      toast(code === 'big' ? 'Shrink it. Try the low-energy version today.'
          : code === 'timing' ? 'Move the anchor, not the willpower.'
          : code === 'forgot' ? 'Make the cue louder — put it in your path.'
          : 'Low energy is what the two-minute version is for.');
      render();
    };
    row.append(c);
  });
  box.append(row);
  return box;
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const d = new Date(); d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* ===================================================== RENDER — INSPIRE === */

function currentQuote() {
  if (state.quoteIndex == null) state.quoteIndex = new Date().getDate() % QUOTES.length;
  return state.quoteIndex % QUOTES.length;
}

function renderInspire() {
  const qi = currentQuote();
  const [text, who] = QUOTES[qi];
  $('#q-text').textContent = `“${text}”`;
  $('#q-who').textContent = '— ' + who;
  const saved = state.vault.quotes.includes(qi);
  $('#q-star-ico').classList.toggle('star-on', saved);
  $('#q-star-ico').setAttribute('fill', saved ? 'currentColor' : 'none');
  $('#q-star-ico').setAttribute('stroke', 'currentColor');
  $('#q-star-ico').setAttribute('stroke-width', '1.6');
  $('#q-star-lab').textContent = saved ? 'Saved' : 'Save';

  const models = $('#models');
  models.textContent = '';
  MODELS.forEach(([t, d]) => {
    const tile = el('div', 'tile');
    tile.append(el('h3', null, t), el('p', 'num', d));
    models.append(tile);
  });

  renderSim();

  const bundles = $('#bundles');
  bundles.textContent = '';
  BUNDLES.forEach(([kicker, title, identity, action, anchor, tiny]) => {
    const card = el('div', 'bundle');
    card.append(el('span', 'kicker', kicker), el('h3', null, title), el('p', 'what', action));
    const added = state.habits.some(x => x.name === action);
    const btn = el('button', 'btn sm', added ? 'Added' : 'Add · one tap');
    btn.style.width = '100%';
    if (added) btn.disabled = true;
    btn.onclick = () => {
      state.habits.push({
        id: uid(), name: action, identity, anchor, time: '', tiny,
        steps: [], days: [0,1,2,3,4,5,6], kind: 'habit', created: today,
      });
      save(); haptic(12); toast(`${title} added`); render();
    };
    card.append(btn);
    bundles.append(card);
  });

  const books = $('#books');
  books.textContent = '';
  BOOKS.forEach(([id, title, author]) => {
    const saved = state.vault.books.includes(id);
    const row = el('button', 'row tap');
    const main = el('span', 'row-main');
    main.append(el('span', 'row-title', title), el('span', 'row-sub', author));
    const star = icon('i-star', 17);
    star.setAttribute('fill', saved ? 'currentColor' : 'none');
    star.setAttribute('stroke', 'currentColor');
    star.setAttribute('stroke-width', '1.6');
    star.style.color = saved ? 'var(--ink)' : 'var(--ink-25)';
    row.append(main, star);
    row.onclick = () => {
      const i = state.vault.books.indexOf(id);
      if (i < 0) { state.vault.books.push(id); toast('Saved to the vault'); }
      else state.vault.books.splice(i, 1);
      save(); haptic(6); render();
    };
    books.append(row);
  });

  renderVault();
}

let sim = { anchor: null, action: null };

function renderSim() {
  const pool = (node, items, key) => {
    node.textContent = '';
    items.forEach(v => {
      const c = el('button', 'chip' + (sim[key] === v ? ' on' : ''), v);
      c.onclick = () => { sim[key] = sim[key] === v ? null : v; haptic(6); renderSim(); };
      node.append(c);
    });
  };
  pool($('#sim-anchors'), ANCHORS, 'anchor');
  pool($('#sim-actions'), ACTIONS, 'action');

  const a = $('#slot-anchor'), b = $('#slot-action');
  a.textContent = sim.anchor || 'Anchor';
  b.textContent = sim.action || 'Micro-action';
  a.classList.toggle('filled', Boolean(sim.anchor));
  b.classList.toggle('filled', Boolean(sim.action));

  const out = $('#sim-out');
  if (sim.anchor && sim.action) {
    out.textContent = '';
    out.append(document.createTextNode('After '));
    out.append(el('b', null, sim.anchor.toLowerCase()));
    out.append(document.createTextNode(', I will '));
    out.append(el('b', null, sim.action.toLowerCase()));
    out.append(document.createTextNode('.'));
    $('#sim-import').disabled = false;
  } else {
    out.textContent = 'Your stack will read back to you here.';
    $('#sim-import').disabled = true;
  }
}

$('#sim-import').onclick = () => {
  if (!sim.anchor || !sim.action) return;
  state.habits.push({
    id: uid(), name: sim.action, identity: '', anchor: sim.anchor, time: '',
    tiny: sim.action, steps: [], days: [0,1,2,3,4,5,6], kind: 'habit', created: today,
  });
  save(); haptic(12); toast('Stack imported');
  sim = { anchor: null, action: null };
  render();
};

function renderVault() {
  const { quotes, books } = state.vault;
  const n = quotes.length + books.length;
  $('#vault-count').textContent = n ? `· ${n}` : '· empty';
  const body = $('#vault-body');
  body.textContent = '';
  if (!n) {
    body.append(el('p', 'empty', 'Star a quote or a book and it lands here.'));
    return;
  }
  quotes.forEach(i => {
    const q = QUOTES[i];
    if (!q) return;
    const d = el('div', 'saved-quote');
    d.append(document.createTextNode(`“${q[0]}”`));
    d.append(el('div', 't-foot dim', '— ' + q[1]));
    body.append(d);
  });
  books.forEach(id => {
    const b = BOOKS.find(x => x[0] === id);
    if (!b) return;
    const row = el('div', 'row saved-book');
    const main = el('span', 'row-main');
    main.append(el('span', 'row-title', b[1]), el('span', 'row-sub', b[2]));
    row.append(main);
    body.append(row);
  });
}

$('#q-star').onclick = () => {
  const qi = currentQuote();
  const i = state.vault.quotes.indexOf(qi);
  if (i < 0) { state.vault.quotes.push(qi); toast('Saved to the vault'); }
  else state.vault.quotes.splice(i, 1);
  save(); haptic(6); renderInspire();
};

$('#q-next').onclick = () => {
  state.quoteIndex = (currentQuote() + 1) % QUOTES.length;
  save(); haptic(6);
  const card = $('#q-text');
  card.style.opacity = '0';
  setTimeout(() => { renderInspire(); card.style.opacity = '1'; }, 130);
};
$('#q-text').style.transition = 'opacity .13s ease';

$('#vault-toggle').onclick = () => {
  const v = $('#vault');
  const open = v.classList.toggle('vault-open');
  $('#vault-toggle').setAttribute('aria-expanded', String(open));
  haptic(6);
};

/* ===================================================== RENDER — RESULTS === */

function renderResults() {
  const ids = identities();
  $('#becoming').textContent = ids.length
    ? 'Becoming ' + ids.slice(0, 3).map(i => i[0]).join(', ')
    : 'Becoming';

  const dates = rangeDates(range);
  const m = momentum(dates);
  $('#momentum').textContent = m.pct + '%';
  $('#momentum-bar').style.width = m.pct + '%';
  $('#momentum-note').textContent = state.habits.length
    ? `${Math.round(m.rate * 100)}% completion · best run ${m.best} ${m.best === 1 ? 'day' : 'days'}`
    : 'Add a habit and this starts to mean something.';

  /* consistency */
  const series = rolling(dates);
  drawSpark(series);
  $('#spark-a').textContent = shortDate(dates[0]);
  $('#spark-b').textContent = shortDate(dates[dates.length - 1]);

  const prior = rolling(rangeDates(range ? range * 2 : 0).slice(0, dates.length));
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const d = mean(series) - mean(prior);
  const badge = $('#delta');
  const rounded = Math.round(d * 10) / 10;
  badge.textContent = (rounded > 0 ? '+' : '') + rounded.toFixed(1) + ' pts';
  badge.classList.toggle('up', rounded > 0);

  /* breakdown */
  const bd = $('#breakdown');
  bd.textContent = '';
  if (!state.habits.length) bd.append(el('p', 'empty', 'Nothing to break down yet.'));
  state.habits.forEach(h => {
    const w = windowStats(h, dates);
    const row = el('button', 'row tap');
    const main = el('span', 'row-main');
    main.append(el('span', 'row-title', h.name),
                el('span', 'row-sub', h.identity || 'no identity attached'));
    const right = el('span', 't-sub dim');
    right.style.fontVariantNumeric = 'tabular-nums';
    right.textContent = w.due ? `${Math.round(w.rate * 100)}%` : '—';
    row.append(main, right, icon('i-chev', 13, 'chev'));
    row.onclick = () => openHabitForm(h);
    bd.append(row);
  });

  /* portfolio */
  const pf = $('#portfolio');
  pf.textContent = '';
  if (!ids.length) pf.append(el('p', 'empty', 'Attach an identity to a habit to start a tally.'));
  ids.forEach(([label, n]) => {
    const c = el('div', 'pf');
    c.append(el('b', null, String(n)), el('span', null, `votes for ${label}`));
    pf.append(c);
  });

  /* rescued */
  const r = rescued();
  $('#rescued-card').hidden = r === 0;
  $('#rescued-n').textContent = r;

  /* milestone */
  const ms = dueMilestone();
  $('#medal').hidden = !ms;
  if (ms) {
    $('#medal-title').textContent = `${ms} votes cast`;
    $('#medal-note').textContent = 'Not a trophy — evidence. This is who you have been lately.';
    $('#medal-ack').onclick = () => { state.ack.push(ms); save(); haptic(12); render(); };
  }

  const last = state.reflections[state.reflections.length - 1];
  $('#reflect-note').textContent = last
    ? `Last reflection ${shortDate(last.date)}. Five minutes keeps a system honest.`
    : 'Five minutes on Sunday keeps a system honest.';
}

function drawSpark(series) {
  const svg = $('#spark');
  svg.textContent = '';
  const W = 300, H = 76, pad = 4;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  if (series.length < 2) {
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    t.setAttribute('x', W / 2); t.setAttribute('y', H / 2 + 4);
    t.setAttribute('text-anchor', 'middle'); t.setAttribute('class', 'axis');
    t.textContent = 'Not enough history yet';
    svg.append(t);
    return;
  }
  const max = Math.max(1, ...series);
  const x = i => pad + (i / (series.length - 1)) * (W - pad * 2);
  const y = v => H - pad - (v / max) * (H - pad * 2);
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('class', 'area');
  area.setAttribute('d', `${line} L${x(series.length - 1).toFixed(1)} ${H - pad} L${x(0).toFixed(1)} ${H - pad} Z`);

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'line');
  path.setAttribute('d', line);
  path.setAttribute('vector-effect', 'non-scaling-stroke');

  svg.append(area, path);
}

/* range segmented control */
function moveThumb() {
  const seg = $('#range');
  const on = seg.querySelector('button.on');
  if (!on) return;
  $('#range-thumb').style.width = on.offsetWidth + 'px';
  $('#range-thumb').style.transform = `translateX(${on.offsetLeft - 2}px)`;
}
$('#range').querySelectorAll('button').forEach(b => b.onclick = () => {
  $('#range').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  range = Number(b.dataset.days);
  haptic(6); moveThumb(); renderResults();
});
window.addEventListener('resize', moveThumb);

/* ================================================================== FORMS = */

DAYS.forEach((d, i) => {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" name="day" value="${i}"><span>${d[0]}${d[1]}</span>`;
  $('#daypick').append(label);
});

let editingId = null;
const habitForm = $('#habit-form');

function openHabitForm(h) {
  editingId = h ? h.id : null;
  $('#habit-form-title').textContent = h ? 'Edit habit' : 'New habit';
  $('#delete-habit').hidden = !h;

  const dl = $('#identity-options');
  dl.textContent = '';
  [...new Set(state.habits.map(x => x.identity).filter(Boolean))]
    .forEach(v => dl.append(new Option(v)));

  habitForm.name.value     = h ? h.name : '';
  habitForm.identity.value = h ? h.identity : '';
  habitForm.time.value     = h ? h.time : '';
  habitForm.anchor.value   = h ? h.anchor : '';
  habitForm.tiny.value     = h ? h.tiny : '';
  habitForm.steps.value    = h ? h.steps.join(', ') : '';
  habitForm.kind.value     = h ? h.kind : 'habit';

  const days = h ? h.days : [0,1,2,3,4,5,6];
  habitForm.querySelectorAll('input[name=day]').forEach(cb => {
    cb.checked = days.includes(Number(cb.value));
  });

  sheet('#sheet-habit');
  setTimeout(() => habitForm.name.focus(), 320);
}

habitForm.addEventListener('submit', e => {
  e.preventDefault();
  const days = [...habitForm.querySelectorAll('input[name=day]:checked')].map(c => Number(c.value));
  const data = {
    name: habitForm.name.value.trim(),
    identity: habitForm.identity.value.trim(),
    time: habitForm.time.value,
    anchor: habitForm.anchor.value.trim(),
    tiny: habitForm.tiny.value.trim(),
    steps: habitForm.steps.value.split(',').map(s => s.trim()).filter(Boolean),
    kind: habitForm.kind.value,
    days: days.length ? days : [0,1,2,3,4,5,6],
  };
  if (!data.name) return;

  if (editingId) Object.assign(state.habits.find(x => x.id === editingId), data);
  else state.habits.push({ id: uid(), created: today, ...data });

  save(); haptic(12); closeSheet(); render();
  toast(editingId ? 'Saved' : 'Habit added');
});

$('#delete-habit').onclick = () => {
  const h = state.habits.find(x => x.id === editingId);
  if (!h || !confirm(`Delete “${h.name}” and its history?`)) return;
  state.habits = state.habits.filter(x => x.id !== editingId);
  Object.keys(state.log).forEach(d => {
    delete state.log[d][h.id];
    if (!Object.keys(state.log[d]).length) delete state.log[d];
  });
  save(); closeSheet(); render(); toast('Deleted');
};

$('#add-habit').onclick = () => openHabitForm(null);

/* reflection */
$('#open-reflect').onclick = () => {
  const dates = rangeDates(7);
  const m = momentum(dates);
  $('#reflect-lead').textContent =
    `Last seven days: ${Math.round(m.rate * 100)}% completion across ${state.habits.length} ${state.habits.length === 1 ? 'habit' : 'habits'}.`;
  $('#r-well').value = ''; $('#r-friction').value = ''; $('#r-next').value = '';
  sheet('#sheet-reflect');
};

$('#reflect-form').addEventListener('submit', e => {
  e.preventDefault();
  state.reflections.push({
    date: today,
    well: $('#r-well').value.trim(),
    friction: $('#r-friction').value.trim(),
    next: $('#r-next').value.trim(),
  });
  save(); haptic(12); closeSheet(); render(); toast('Reflection saved');
});

/* settings */
$('#open-settings').onclick = () => {
  $('#s-name').value = state.profile.name;
  sheet('#sheet-settings');
};
$('#s-name').addEventListener('input', e => {
  state.profile.name = e.target.value.trim().slice(0, 24);
  save(); renderHome();
});

$('#s-export').onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nefesh-${today}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Exported');
};
$('#s-import').onclick = () => $('#import-file').click();
$('#import-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.habits)) throw new Error('bad file');
    state = { ...blank(), ...data };
    save(); render(); closeSheet(); toast('Imported');
  } catch { toast('That file is not a Nefesh export'); }
  e.target.value = '';
});
$('#s-reset').onclick = () => {
  if (!confirm('Erase every habit, day of history and saved item?')) return;
  state = blank();
  save(); render(); closeSheet(); toast('Erased');
};

/* ================================================================== TABS == */

const TITLES = { home: 'Today', inspire: 'Inspire', results: 'Results' };
let tab = 'home';

function show(name) {
  tab = name;
  $$('.tabbtn').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  $$('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + name));
  $('#navbar-title').textContent = TITLES[name];
  window.scrollTo({ top: 0 });
  haptic(6);
  if (name === 'results') requestAnimationFrame(moveThumb);
}
$$('.tabbtn').forEach(b => b.onclick = () => show(b.dataset.tab));

/* collapsing large title */
const onScroll = () => {
  const view = $('#v-' + tab);
  const title = view.querySelector('.t-large');
  if (!title) return;
  const past = title.getBoundingClientRect().bottom < 44 + 8;
  $('#navbar').classList.toggle('show', past);
};
window.addEventListener('scroll', onScroll, { passive: true });

/* ================================================================== BOOT == */

function render() {
  renderHome();
  renderInspire();
  renderResults();
  onScroll();
}

render();
requestAnimationFrame(moveThumb);
