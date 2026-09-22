/* Nefesh — a habit system built on the ideas in Atomic Habits.
   Everything lives in localStorage; nothing is sent anywhere. */

const KEY = 'nefesh.v1';
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const QUOTES = [
  ['You do not rise to the level of your goals. You fall to the level of your systems.'],
  ['Every action you take is a vote for the type of person you wish to become.'],
  ['Habits are the compound interest of self-improvement.'],
  ['Never miss twice. Missing once is an accident; missing twice is the start of a new habit.'],
  ['You should be far more concerned with your current trajectory than with your current results.'],
  ['The most effective form of motivation is progress.'],
  ['Standardise before you optimise. You cannot improve a habit that does not exist.'],
];

/* ---------- state ---------- */

const blank = () => ({ habits: [], identities: [], log: {} });

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (!raw || typeof raw !== 'object') return blank();
    return { ...blank(), ...raw };
  } catch {
    return blank();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage may be unavailable (private mode); the session still works */
  }
}

let state = load();
let cursor = today();          // the day being viewed
let editingId = null;

/* ---------- dates ---------- */

function today() {
  return iso(new Date());
}

function iso(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parse(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function shift(s, n) {
  const d = parse(s);
  d.setDate(d.getDate() + n);
  return iso(d);
}

function weekday(s) {
  return parse(s).getDay();
}

function pretty(s) {
  return parse(s).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

/* ---------- habit helpers ---------- */

const uid = () => Math.random().toString(36).slice(2, 10);

const scheduled = (h, date) => h.days.includes(weekday(date));

const isDone = (h, date) => Boolean(state.log[date] && state.log[date][h.id]);

function setDone(h, date, on) {
  if (!state.log[date]) state.log[date] = {};
  if (on) state.log[date][h.id] = 1;
  else delete state.log[date][h.id];
  if (!Object.keys(state.log[date]).length) delete state.log[date];
  save();
}

/** Consecutive scheduled days, ending at `from`, that were completed.
    A scheduled day still ahead of us today does not break the streak. */
function streak(h, from = today()) {
  let n = 0;
  let day = from;
  for (let i = 0; i < 400; i++) {
    if (h.created && day < h.created) break;
    if (scheduled(h, day)) {
      if (isDone(h, day)) n++;
      else if (day !== today()) break;
    }
    day = shift(day, -1);
  }
  return n;
}

function longest(h) {
  const days = Object.keys(state.log).sort();
  if (!days.length) return 0;
  let best = 0, run = 0, day = h.created && h.created > days[0] ? h.created : days[0];
  const end = today();
  while (day <= end) {
    if (scheduled(h, day)) {
      if (isDone(h, day)) { run++; best = Math.max(best, run); }
      else if (day !== end) run = 0;
    }
    day = shift(day, 1);
  }
  return best;
}

/** True when the last scheduled day before `date` was missed — the "never miss twice" flag. */
function missedLast(h, date) {
  let day = shift(date, -1);
  for (let i = 0; i < 60; i++) {
    if (h.created && day < h.created) return false;
    if (scheduled(h, day)) return !isDone(h, day);
    day = shift(day, -1);
  }
  return false;
}

function window30(h) {
  let hit = 0, due = 0;
  const cells = [];
  for (let i = 29; i >= 0; i--) {
    const day = shift(today(), -i);
    // days before the habit existed are not misses
    if (!scheduled(h, day) || (h.created && day < h.created)) cells.push('na');
    else { due++; if (isDone(h, day)) { hit++; cells.push('on'); } else cells.push('off'); }
  }
  return { hit, due, cells };
}

function votes(h) {
  return Object.values(state.log).reduce((n, d) => n + (d[h.id] ? 1 : 0), 0);
}

/* ---------- rendering ---------- */

const $ = sel => document.querySelector(sel);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function render() {
  renderToday();
  renderHabits();
  renderIdentities();
  renderReview();
}

/* -- today -- */

function renderToday() {
  const list = $('#today-list');
  list.textContent = '';

  const due = state.habits.filter(h => scheduled(h, cursor));
  const done = due.filter(h => isDone(h, cursor)).length;

  $('#day-label').textContent = cursor === today() ? 'Today' : pretty(cursor).split(',')[0];
  $('#day-sub').textContent = pretty(cursor);
  $('#day-next').disabled = cursor >= today();

  $('#s-done').textContent = `${done}/${due.length}`;
  $('#s-votes').textContent = Object.values(state.log).reduce((n, d) => n + Object.keys(d).length, 0);

  const best = state.habits.reduce((m, h) => Math.max(m, streak(h)), 0);
  $('#s-streak').textContent = best;

  const totals = state.habits.reduce((a, h) => {
    const w = window30(h);
    return { hit: a.hit + w.hit, due: a.due + w.due };
  }, { hit: 0, due: 0 });
  $('#s-rate').textContent = totals.due ? Math.round((totals.hit / totals.due) * 100) + '%' : '0%';

  $('#today-empty').hidden = due.length > 0;

  const alerts = $('#alerts');
  alerts.textContent = '';
  const atRisk = due.filter(h => !isDone(h, cursor) && missedLast(h, cursor));
  if (atRisk.length) {
    const a = el('div', 'alert');
    a.append(el('b', null, 'Never miss twice. '));
    a.append(document.createTextNode(
      `${atRisk.map(h => h.name).join(', ')} slipped last time. Do the two-minute version and keep the chain alive.`
    ));
    alerts.append(a);
  }

  due.sort((a, b) => Number(isDone(a, cursor)) - Number(isDone(b, cursor)));
  due.forEach(h => list.append(todayItem(h)));

  const q = QUOTES[parse(cursor).getDate() % QUOTES.length];
  const quote = $('#quote');
  quote.textContent = q[0];
  quote.append(el('cite', null, 'James Clear, Atomic Habits'));
}

function todayItem(h) {
  const on = isDone(h, cursor);
  const li = el('li', 'item' + (on ? ' done' : ''));

  const btn = el('button', 'check');
  btn.setAttribute('aria-pressed', String(on));
  btn.setAttribute('aria-label', (on ? 'Mark incomplete: ' : 'Mark complete: ') + h.name);
  btn.innerHTML = '<svg viewBox="0 0 16 16"><polyline points="3,8.5 6.5,12 13,4.5"/></svg>';
  btn.onclick = () => { setDone(h, cursor, !isDone(h, cursor)); render(); };

  const body = el('div', 'item-body');
  const name = el('div', 'item-name');
  if (h.kind === 'break') name.append(el('span', 'badge break', 'Break'));
  name.append(document.createTextNode(h.name));
  body.append(name);

  const meta = el('div', 'item-meta');
  if (h.stack) meta.append(el('span', null, `After I ${h.stack}`));
  if (h.cue) meta.append(el('span', null, h.cue));
  if (h.tiny) meta.append(el('span', null, `2-min: ${h.tiny}`));
  if (meta.childElementCount) body.append(meta);

  const side = el('div', 'item-side');
  side.append(el('b', null, streak(h)));
  side.append(document.createTextNode('streak'));

  li.append(btn, body, side);
  return li;
}

/* -- habits -- */

function renderHabits() {
  const list = $('#habit-list');
  list.textContent = '';
  $('#habits-empty').hidden = state.habits.length > 0;

  state.habits.forEach(h => {
    const w = window30(h);
    const card = el('li', 'card');

    const head = el('div', 'card-head');
    const left = el('div');
    const title = el('div', 'card-title');
    if (h.kind === 'break') title.append(el('span', 'badge break', 'Break'));
    title.append(document.createTextNode(h.name));
    left.append(title);
    const ident = state.identities.find(i => i.id === h.identity);
    left.append(el('div', 'card-sub',
      (ident ? `A vote for: ${ident.text} · ` : '') + dayLabel(h.days)));
    const right = el('div', 'item-side');
    right.append(el('b', null, streak(h)));
    right.append(document.createTextNode('streak'));
    head.append(left, right);

    const rows = el('dl', 'card-rows');
    addRow(rows, 'Cue', h.cue);
    addRow(rows, 'Stack', h.stack && `After I ${h.stack}`);
    addRow(rows, '2-minute', h.tiny);
    addRow(rows, 'Reward', h.reward);
    addRow(rows, 'Last 30', w.due ? `${w.hit} of ${w.due} · best run ${longest(h)}` : 'Not yet due');

    const acts = el('div', 'card-acts');
    const edit = el('button', 'mini', 'Edit');
    edit.onclick = () => openDialog(h);
    const del = el('button', 'mini', 'Delete');
    del.onclick = () => {
      if (!confirm(`Delete "${h.name}" and its history?`)) return;
      state.habits = state.habits.filter(x => x.id !== h.id);
      Object.keys(state.log).forEach(d => {
        delete state.log[d][h.id];
        if (!Object.keys(state.log[d]).length) delete state.log[d];
      });
      save(); render();
    };
    acts.append(edit, del);

    card.append(head, rows, acts);
    list.append(card);
  });
}

function addRow(dl, label, value) {
  if (!value) return;
  const row = el('div');
  row.append(el('dt', null, label), el('dd', null, value));
  dl.append(row);
}

function dayLabel(days) {
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && [1, 2, 3, 4, 5].every(d => days.includes(d))) return 'Weekdays';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  return days.slice().sort().map(d => DAYS[d]).join(' · ');
}

/* -- identity -- */

function renderIdentities() {
  const list = $('#identity-list');
  list.textContent = '';
  $('#identity-empty').hidden = state.identities.length > 0;

  state.identities.forEach(i => {
    const linked = state.habits.filter(h => h.identity === i.id);
    const count = linked.reduce((n, h) => n + votes(h), 0);

    const card = el('li', 'card');
    const head = el('div', 'card-head');
    const left = el('div');
    left.append(el('div', 'card-title', `I am the type of person who ${i.text}`));
    left.append(el('div', 'card-sub',
      linked.length ? linked.map(h => h.name).join(' · ') : 'No habits attached yet'));
    const right = el('div', 'votes');
    right.append(document.createTextNode(count));
    right.append(el('small', null, count === 1 ? 'vote' : 'votes'));
    head.append(left, right);

    const acts = el('div', 'card-acts');
    const del = el('button', 'mini', 'Delete');
    del.onclick = () => {
      state.identities = state.identities.filter(x => x.id !== i.id);
      state.habits.forEach(h => { if (h.identity === i.id) h.identity = ''; });
      save(); render();
    };
    acts.append(del);

    card.append(head, acts);
    list.append(card);
  });
}

/* -- review -- */

function renderReview() {
  const box = $('#grids');
  box.textContent = '';

  if (!state.habits.length) {
    box.append(el('p', 'empty', 'Add a habit and the evidence will collect here.'));
    return;
  }

  state.habits.forEach(h => {
    const w = window30(h);
    const block = el('div', 'grid-block');
    const head = el('div', 'grid-head');
    head.append(el('b', null, h.name));
    head.append(el('span', null,
      w.due ? `${Math.round((w.hit / w.due) * 100)}% · ${w.hit}/${w.due}` : 'not yet due'));
    const grid = el('div', 'grid');
    w.cells.forEach((c, idx) => {
      const cell = el('div', 'cell ' + c);
      cell.title = `${shift(today(), -(29 - idx))} — ${c === 'on' ? 'done' : c === 'off' ? 'missed' : 'not scheduled'}`;
      grid.append(cell);
    });
    block.append(head, grid);
    box.append(block);
  });

  const legend = el('div', 'legend');
  [['on', 'done'], ['off', 'missed'], ['na', 'not scheduled']].forEach(([cls, label]) => {
    const item = el('span');
    item.append(el('i', cls), document.createTextNode(label));
    legend.append(item);
  });
  box.append(legend);
}

/* ---------- dialog ---------- */

const dialog = $('#habit-dialog');
const form = $('#habit-form');

DAYS.forEach((d, i) => {
  const label = document.createElement('label');
  label.innerHTML = `<input type="checkbox" name="day" value="${i}"><span>${d}</span>`;
  $('#daypick').append(label);
});

function openDialog(h) {
  editingId = h ? h.id : null;
  $('#dialog-title').textContent = h ? 'Edit habit' : 'New habit';

  const sel = form.identity;
  sel.textContent = '';
  sel.append(new Option('—', ''));
  state.identities.forEach(i => sel.append(new Option(i.text, i.id)));

  form.name.value = h ? h.name : '';
  form.kind.value = h ? h.kind : 'build';
  form.identity.value = h ? h.identity || '' : '';
  form.cue.value = h ? h.cue : '';
  form.stack.value = h ? h.stack : '';
  form.tiny.value = h ? h.tiny : '';
  form.reward.value = h ? h.reward : '';

  const days = h ? h.days : [0, 1, 2, 3, 4, 5, 6];
  form.querySelectorAll('input[name=day]').forEach(cb => {
    cb.checked = days.includes(Number(cb.value));
  });

  dialog.showModal();
  form.name.focus();
}

form.addEventListener('submit', e => {
  if (e.submitter && e.submitter.value === 'cancel') return;

  const days = [...form.querySelectorAll('input[name=day]:checked')].map(cb => Number(cb.value));
  const data = {
    name: form.name.value.trim(),
    kind: form.kind.value,
    identity: form.identity.value,
    cue: form.cue.value.trim(),
    stack: form.stack.value.trim(),
    tiny: form.tiny.value.trim(),
    reward: form.reward.value.trim(),
    days: days.length ? days : [0, 1, 2, 3, 4, 5, 6],
  };
  if (!data.name) return;

  if (editingId) {
    const h = state.habits.find(x => x.id === editingId);
    Object.assign(h, data);
  } else {
    state.habits.push({ id: uid(), created: today(), ...data });
  }
  save();
  render();
});

$('#new-habit').onclick = () => openDialog(null);

/* ---------- identity form ---------- */

$('#identity-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#identity-input');
  const text = input.value.trim();
  if (!text) return;
  state.identities.push({ id: uid(), text });
  input.value = '';
  save();
  render();
});

/* ---------- navigation ---------- */

function show(view) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.view === view));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + view));
}

document.querySelectorAll('[data-view]').forEach(t => t.onclick = () => show(t.dataset.view));
document.querySelectorAll('[data-goto]').forEach(b => b.onclick = () => show(b.dataset.goto));

$('#day-prev').onclick = () => { cursor = shift(cursor, -1); render(); };
$('#day-next').onclick = () => { if (cursor < today()) { cursor = shift(cursor, 1); render(); } };

/* ---------- data ---------- */

$('#export').onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `nefesh-${today()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
};

$('#import').onclick = () => $('#import-file').click();

$('#import-file').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.habits)) throw new Error('bad file');
    state = { ...blank(), ...data };
    save();
    render();
  } catch {
    alert('That file could not be read as a Nefesh export.');
  }
  e.target.value = '';
});

$('#reset').onclick = () => {
  if (!confirm('Erase every habit, identity and day of history?')) return;
  state = blank();
  save();
  render();
};

/* ---------- go ---------- */

render();
