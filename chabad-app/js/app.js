/* Chabad Path: app logic. Vanilla JS, no build step. */
(function () {
  "use strict";

  const C = window.CONTENT;
  const R = window.REFERENCE;
  const BR = window.BRACHOS;
  const KEY = "chabadpath.v1";
  const app = document.getElementById("app");

  /* ---------------- Storage ---------------- */
  const blank = () => ({
    v: 1, onboarded: false, placement: {}, lessons: {}, srs: {}, practice: {},
    checkins: {}, notebook: [], qotd: null, activity: {}, reviewLog: {},
    settings: { stage: 1, theme: "auto" }
  });
  let storageOk = true;
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      return Object.assign(blank(), JSON.parse(raw));
    } catch (e) { storageOk = false; return blank(); }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storageOk = false; }
  }

  /* ---------------- Dates ---------------- */
  const pad = n => String(n).padStart(2, "0");
  const dkey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => dkey();
  const addDays = (key, n) => { const [y, m, d] = key.split("-").map(Number); return dkey(new Date(y, m - 1, d + n)); };
  function hebDate(d = new Date()) {
    try { return new Intl.DateTimeFormat("en-u-ca-hebrew", { day: "numeric", month: "long", year: "numeric" }).format(d); }
    catch (e) { return ""; }
  }
  const civDate = (d = new Date()) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  /* ---------------- Helpers ---------------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = app) => root.querySelector(sel);
  const $$ = (sel, root = app) => Array.from(root.querySelectorAll(sel));
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }
  function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function markActive(kind) {
    const k = today();
    S.activity[k] = S.activity[k] || {};
    S.activity[k][kind] = (S.activity[k][kind] || 0) + 1;
    save();
  }

  /* ---------------- Content index ---------------- */
  const modules = C.modules;
  const moduleNum = {}; modules.forEach((m, i) => moduleNum[m.id] = i);
  const allLessons = [];            // built lessons in course order
  const lessonById = {};
  const qIndex = {};                // qid -> { q, lesson, module, deeper }
  modules.forEach(m => m.lessons.forEach(l => {
    const built = m.built && l.teach;
    lessonById[l.id] = { lesson: l, module: m, built: !!built };
    if (built) {
      allLessons.push(l);
      (l.quiz || []).forEach(q => qIndex[q.id] = { q, lesson: l, module: m, deeper: false });
      (l.deeper || []).forEach(q => qIndex[q.id] = { q, lesson: l, module: m, deeper: true });
    }
  }));
  const moduleOf = lid => lessonById[lid] && lessonById[lid].module;

  const LS = id => S.lessons[id] || {};
  const isDone = id => !!LS(id).done;
  const isSkipped = id => !!LS(id).skipped && !LS(id).done;
  function nextLesson() { return allLessons.find(l => !isDone(l.id) && !isSkipped(l.id)); }
  function isUnlocked(id) {
    const idx = allLessons.findIndex(l => l.id === id);
    if (idx <= 0) return true;
    return allLessons.slice(0, idx).every(l => isDone(l.id) || isSkipped(l.id)) || !!LS(id).jumped;
  }
  function level(mid) { return (S.placement[mid] || {}).level || null; }
  function moduleStats(m) {
    const built = m.lessons.filter(l => lessonById[l.id].built);
    const done = built.filter(l => isDone(l.id));
    const scored = done.filter(l => LS(l.id).total);
    const avg = scored.length ? scored.reduce((a, l) => a + LS(l.id).score / LS(l.id).total, 0) / scored.length : null;
    return { built: built.length, done: done.length, skipped: built.filter(l => isSkipped(l.id)).length, avg };
  }

  /* ---------------- Spaced repetition (SM-2 style) ---------------- */
  function srsUpdate(qid, correct) {
    const e = S.srs[qid] || { reps: 0, interval: 0, ease: 2.5, due: today(), lapses: 0, seen: 0, right: 0 };
    const m = qIndex[qid] && qIndex[qid].module;
    const foundation = m && level(m.id) === "Foundation";
    e.seen += 1; e.last = today();
    if (correct) {
      e.right += 1; e.reps += 1;
      if (e.reps === 1) e.interval = foundation ? 1 : 2;
      else if (e.reps === 2) e.interval = foundation ? 3 : 5;
      else e.interval = Math.round(e.interval * e.ease);
      e.ease = Math.min(2.8, e.ease + 0.05);
    } else {
      e.reps = 0; e.lapses += 1; e.interval = 1; e.ease = Math.max(1.3, e.ease - 0.2);
    }
    e.due = addDays(today(), e.interval);
    S.srs[qid] = e;
    save();
  }
  function dueList() {
    const t = today();
    return Object.keys(S.srs)
      .filter(id => qIndex[id] && S.srs[id].due <= t)
      .sort((a, b) => (S.srs[b].lapses - S.srs[a].lapses) || S.srs[a].due.localeCompare(S.srs[b].due));
  }
  function weakList(n = 10) {
    return Object.keys(S.srs).filter(id => qIndex[id])
      .sort((a, b) => (S.srs[b].lapses - S.srs[a].lapses) || (S.srs[a].ease - S.srs[b].ease) || S.srs[a].last.localeCompare(S.srs[b].last))
      .slice(0, n);
  }

  /* ---------------- Streak ---------------- */
  function activeOn(k) {
    const a = S.activity[k]; if (!a) return false;
    return !!(a.lesson || a.qotd || (a.review || 0) >= 3 || a.practice);
  }
  function streak() {
    let k = today(), n = 0;
    if (!activeOn(k)) k = addDays(k, -1);
    while (activeOn(k)) { n++; k = addDays(k, -1); }
    return n;
  }
  function renderStreak() {
    const n = streak();
    document.getElementById("streakPill").textContent = n ? `${n} day${n === 1 ? "" : "s"}` : "";
  }

  /* ---------------- Question rendering ---------------- */
  const TYPE_LABEL = { mc: "Multiple choice", tf: "True or false", bracha: "What bracha?", scenario: "Scenario", recall: "Open recall" };
  function optionsFor(q) { if (q.t === "tf") return ["True", "False"]; if (q.t === "bracha") return q.o || BR; return q.o; }
  function correctIndex(q) { if (q.t === "tf") return q.a ? 0 : 1; return q.a; }

  /* Renders a question into el. onDone(correct) is called after the user
     has seen the explanation and pressed the continue button. */
  function renderQuestion(el, q, opts, onDone) {
    opts = opts || {};
    const cont = opts.cont || "Next";
    const head = `<div class="row between"><span class="q-type">${TYPE_LABEL[q.t] || ""}</span>${opts.counter ? `<span class="small muted">${opts.counter}</span>` : ""}</div>
      <div class="q-text">${esc(q.q)}</div>`;
    if (q.t === "recall") {
      el.innerHTML = `${head}
        <textarea id="rc" placeholder="Type your answer from memory, then check."></textarea>
        <div class="btn-row"><button class="btn" id="rcShow">Check answer</button></div>
        <div id="rcOut"></div>`;
      $("#rcShow", el).onclick = () => {
        $("#rcShow", el).parentElement.remove();
        $("#rc", el).readOnly = true;
        $("#rcOut", el).innerHTML = `<div class="model"><b>Model answer</b><br>${esc(q.model)}</div>
          ${q.x ? `<p class="small muted" style="margin-top:10px">${esc(q.x)}</p>` : ""}
          <p class="small" style="margin:12px 0 0">Be honest. Did your answer contain the key points?</p>
          <div class="btn-row"><button class="btn soft" data-g="0">I missed it</button><button class="btn" data-g="1">I had it</button></div>`;
        $$("[data-g]", el).forEach(b => b.onclick = () => onDone(b.dataset.g === "1"));
      };
      return;
    }
    const os = optionsFor(q);
    const cls = q.t === "tf" ? "tf" : (q.t === "bracha" && !q.o ? "brachos" : "");
    // Shuffle option order (except true/false and the fixed brachos grid) so position gives nothing away.
    const order = os.map((_, i) => i);
    if (q.t === "mc" || q.t === "scenario" || (q.t === "bracha" && q.o)) {
      for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    }
    el.innerHTML = `${head}<div class="opts ${cls}">${order.map(i => `<button class="opt" data-i="${i}">${esc(os[i])}</button>`).join("")}</div><div id="fb"></div>`;
    $$(".opt", el).forEach(b => b.onclick = () => {
      const pick = Number(b.dataset.i), ci = correctIndex(q), ok = pick === ci;
      $$(".opt", el).forEach(x => { const i = Number(x.dataset.i); x.disabled = true; if (i === ci) x.classList.add("right"); else if (i === pick) x.classList.add("wrong"); });
      $("#fb", el).innerHTML = `<div class="feedback ${ok ? "right" : "wrong"}"><b>${ok ? "Correct." : `Wrong. The answer is: ${esc(os[ci])}.`}</b>${esc(q.x || "")}</div>
        <div class="btn-row"><button class="btn" id="qNext">${esc(cont)}</button></div>`;
      $("#qNext", el).onclick = () => onDone(ok);
      $("#qNext", el).focus();
    });
  }

  /* ---------------- Router ---------------- */
  const TAB_ROUTES = { "": "home", learn: "learn", review: "review", tracker: "tracker", more: "more" };
  function setChrome(title, { back = false, tabs = true, tab = null } = {}) {
    document.getElementById("topTitle").textContent = title;
    document.getElementById("backBtn").hidden = !back;
    document.getElementById("tabbar").classList.toggle("hide", !tabs);
    document.body.classList.toggle("no-tabs", !tabs);
    $$("#tabbar a", document).forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
    renderStreak();
  }
  document.getElementById("backBtn").onclick = () => { if (history.length > 1) history.back(); else location.hash = "#/"; };

  function route() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/");
    const [p0, p1] = parts;
    window.scrollTo(0, 0);
    if (!S.onboarded && p0 !== "onboarding" && p0 !== "settings") { location.replace("#/onboarding"); return; }
    switch (p0) {
      case "": return viewHome();
      case "onboarding": return viewOnboarding();
      case "learn": return viewLearn();
      case "lesson": return viewLesson(p1);
      case "review": return viewReview(p1);
      case "tracker": return viewTracker();
      case "more": return viewMore();
      case "notebook": return viewNotebook();
      case "glossary": return viewGlossary();
      case "ref": return viewRef(p1);
      case "settings": return viewSettings();
      default: location.replace("#/");
    }
  }
  window.addEventListener("hashchange", route);

  /* ================================================================
     HOME
     ================================================================ */
  function viewHome() {
    setChrome("Chabad Path", { tab: "home" });
    const nl = nextLesson();
    const due = dueList().length;
    const doneCount = allLessons.filter(l => isDone(l.id)).length;
    const pending = pendingCheckin();
    const needs = allLessons.filter(l => LS(l.id).needsReview);
    const d = new Date();
    app.innerHTML = `
      <div class="date-line">${esc(hebDate(d))}</div>
      <div class="small muted">${esc(civDate(d))}. The Hebrew date changes at nightfall.</div>
      ${storageOk ? "" : `<div class="card flat flag">Your browser is blocking storage. Progress will not be saved.</div>`}

      ${nl ? `<div class="card">
        <div class="eyebrow">${esc(moduleOf(nl.id).title)}</div>
        <h2>${esc(nl.title)}</h2>
        <p class="muted small">${nl.minutes || 5} min lesson${pending ? ". Starts with a check-in on yesterday's action." : ""}</p>
        <a class="btn block" href="#/lesson/${nl.id}">${LS(nl.id).started ? "Continue lesson" : "Start lesson"}</a>
      </div>` : `<div class="card"><h2>All built lessons done</h2><p class="muted">New modules are added one at a time. Keep your reviews going in the meantime.</p></div>`}

      <div class="grid2">
        <a class="stat" href="#/review" style="text-decoration:none;color:inherit"><b>${due}</b><span>review question${due === 1 ? "" : "s"} due</span></a>
        <div class="stat"><b>${doneCount}<span class="muted" style="font-size:1rem"> / ${allLessons.length}</span></b><span>lessons done</span></div>
      </div>

      ${needs.length ? `<div class="card flat"><div class="eyebrow">Needs review</div>
        <p class="small">You scored under 70% on: ${needs.map(l => `<a href="#/lesson/${l.id}">${esc(l.title)}</a>`).join(", ")}. Redo the quiz or run a review.</p></div>` : ""}

      <div class="card" id="qotd"></div>

      <div class="card">
        <div class="row between"><h3 style="margin:0">Today's practice</h3><a class="small" href="#/tracker">Tracker</a></div>
        <div id="homePractice"></div>
      </div>

      <div class="card flat">
        <h3>Question for Zalmy?</h3>
        <div class="row"><input type="text" id="quickQ" placeholder="Write it before you forget it"><button class="btn" id="quickQBtn" style="flex:none">Save</button></div>
      </div>`;
    renderQotd($("#qotd"));
    renderPracticeChecks($("#homePractice"), true);
    $("#quickQBtn").onclick = () => {
      const v = $("#quickQ").value.trim(); if (!v) return;
      addNote(v, "Zalmy"); $("#quickQ").value = ""; toast("Saved to your notebook.");
    };
  }

  function renderQotd(el) {
    const t = today();
    const pool = Object.keys(S.srs).filter(id => qIndex[id]);
    if (!pool.length) {
      el.innerHTML = `<div class="eyebrow">Question of the day</div><p class="muted small" style="margin:0">Unlocks after your first lesson. It pulls from everything you've learned.</p>`;
      return;
    }
    if (!S.qotd || S.qotd.date !== t || !qIndex[S.qotd.qid]) {
      const due = dueList();
      const qid = due.length ? due[hashStr(t) % due.length] : pool[hashStr(t) % pool.length];
      S.qotd = { date: t, qid, result: null }; save();
    }
    const { qid, result } = S.qotd;
    const q = qIndex[qid].q;
    if (result !== null) {
      el.innerHTML = `<div class="eyebrow">Question of the day</div>
        <p style="margin:0 0 6px">${esc(q.q)}</p>
        <span class="badge ${result ? "good" : "bad"}">${result ? "Answered correctly" : "Missed: it will come back in review"}</span>`;
      return;
    }
    el.innerHTML = `<div class="eyebrow">Question of the day</div><div id="qotdQ"></div>`;
    renderQuestion($("#qotdQ", el), q, { cont: "Done" }, ok => {
      srsUpdate(qid, ok); S.qotd.result = ok; markActive("qotd"); renderQotd(el); renderStreak();
    });
  }

  /* ================================================================
     ONBOARDING / PLACEMENT
     ================================================================ */
  let OB = null;
  function viewOnboarding() {
    setChrome("Placement", { tabs: false, back: S.onboarded });
    if (!OB) {
      app.innerHTML = `
        <div class="card">
          <div class="eyebrow">Before you start</div>
          <h1>Placement quiz</h1>
          <p>This quiz has 3 questions for each of the ${modules.length} modules, ${modules.length * 3} in total. Your score in each module sets your starting point:</p>
          <ul class="small">
            <li><b>3 of 3: Advanced.</b> Intro lessons are marked as tested out. You can still open them.</li>
            <li><b>2 of 3: Review.</b> Standard pace.</li>
            <li><b>0 or 1 of 3: Foundation.</b> Review questions come back sooner.</li>
          </ul>
          <p class="small muted">Don't guess to look good. A wrong guess places you too high. If you don't know an answer, use "Skip module".</p>
          <button class="btn block" id="obStart">Start</button>
        </div>`;
      $("#obStart").onclick = () => { OB = { mi: 0, qi: 0, scores: {} }; viewOnboarding(); };
      return;
    }
    if (OB.mi >= modules.length) return finishOnboarding();
    const m = modules[OB.mi];
    const qs = C.placement[m.id] || [];
    if (OB.qi >= qs.length) { OB.mi++; OB.qi = 0; return viewOnboarding(); }
    const total = modules.reduce((a, mm) => a + (C.placement[mm.id] || []).length, 0);
    const doneQ = modules.slice(0, OB.mi).reduce((a, mm) => a + (C.placement[mm.id] || []).length, 0) + OB.qi;
    app.innerHTML = `
      <div class="bar" style="margin-top:8px"><i style="width:${Math.round(doneQ / total * 100)}%"></i></div>
      <div class="row between" style="margin-top:12px"><div class="eyebrow" style="margin:0">Module ${OB.mi + 1} of ${modules.length}: ${esc(m.title)}</div></div>
      <div class="card" id="obQ"></div>
      <button class="linkish small" id="obSkip">Skip module (I don't know this area)</button>`;
    OB.scores[m.id] = OB.scores[m.id] || { score: 0, of: qs.length };
    renderQuestion($("#obQ"), qs[OB.qi], { counter: `${OB.qi + 1} / ${qs.length}` }, ok => {
      if (ok) OB.scores[m.id].score++;
      OB.qi++; viewOnboarding();
    });
    $("#obSkip").onclick = () => { OB.scores[m.id] = { score: 0, of: qs.length, skipped: true }; OB.mi++; OB.qi = 0; viewOnboarding(); };
  }
  function levelFor(score, of) { if (score >= of) return "Advanced"; if (score >= of - 1) return "Review"; return "Foundation"; }
  function finishOnboarding() {
    Object.entries(OB.scores).forEach(([mid, s]) => {
      const lvl = levelFor(s.score, s.of);
      S.placement[mid] = { score: s.score, of: s.of, level: lvl, skipped: !!s.skipped, date: today() };
      const m = modules[moduleNum[mid]];
      m.lessons.forEach(l => {
        if (!lessonById[l.id].built) return;
        const st = S.lessons[l.id] || {};
        if (lvl === "Advanced" && l.intro && !st.done) st.skipped = true;
        if (lvl !== "Advanced" && st.skipped && !st.done) delete st.skipped;
        S.lessons[l.id] = st;
      });
    });
    S.onboarded = true; save();
    const rows = modules.map(m => {
      const p = S.placement[m.id];
      const cls = p.level === "Advanced" ? "good" : p.level === "Review" ? "gold" : "bad";
      return `<li class="row between"><span>${esc(m.title)}</span><span class="badge ${cls}">${p.skipped ? "Skipped" : p.score + "/" + p.of} ${p.level}</span></li>`;
    }).join("");
    OB = null;
    setChrome("Placement results", { tabs: false });
    app.innerHTML = `<div class="card"><h1>Your starting point</h1>
      <p class="small muted">This decides which lessons can be skipped and how often review questions come back. You can retake it from Settings.</p>
      <ul class="list">${rows}</ul>
      <a class="btn block" href="#/" style="margin-top:12px">Go to today</a></div>`;
  }

  /* ================================================================
     LEARN (module map)
     ================================================================ */
  function viewLearn() {
    setChrome("Learn", { tab: "learn" });
    const nl = nextLesson();
    app.innerHTML = modules.map((m, i) => {
      const st = moduleStats(m);
      const p = S.placement[m.id];
      const lvlBadge = p ? `<span class="badge ${p.level === "Advanced" ? "good" : p.level === "Review" ? "gold" : "bad"}">${p.level}</span>` : "";
      let adapt = "";
      if (m.built && st.done >= 2 && st.avg !== null) {
        if (st.avg >= 0.9) adapt = `<span class="badge good">Strong: deeper set open</span>`;
        else if (st.avg < 0.6) adapt = `<span class="badge bad">Struggling: review added</span>`;
      }
      const open = m.built && (m.id === (nl && moduleOf(nl.id).id) || i === 0);
      const lessons = m.lessons.map(l => {
        const b = lessonById[l.id].built;
        if (!b) return `<li><div class="locked"><span class="dot"></span><span class="t">${esc(l.title)}</span><span class="small">Soon</span></div></li>`;
        const done = isDone(l.id), sk = isSkipped(l.id), unl = isUnlocked(l.id);
        const isNext = nl && nl.id === l.id;
        const s = LS(l.id);
        const right = done ? `<span class="small muted">${s.total ? s.score + "/" + s.total : ""}</span>` : sk ? `<span class="badge">Tested out</span>` : !unl ? `<span class="small muted">Locked</span>` : "";
        return `<li><a href="#/lesson/${l.id}" class="${!unl && !done ? "locked" : ""}">
          <span class="dot ${done ? "done" : sk ? "skip" : isNext ? "next" : ""}">${done ? "✓" : ""}</span>
          <span class="t">${esc(l.title)}</span>${right}</a></li>`;
      }).join("");
      const extra = m.built && st.done ? `<div style="padding:0 16px 12px" class="btn-row">
          <a class="btn soft" href="#/review/${m.id}">Review module</a>
          ${st.avg !== null && st.avg >= 0.9 ? `<a class="btn ghost" href="#/review/deep-${m.id}">Go deeper</a>` : ""}</div>` : "";
      return `<div class="card module">
        <div class="module-head" data-m="${m.id}">
          <div class="module-num">${i}</div>
          <div style="flex:1">
            <h3>${esc(m.title)}</h3>
            <div class="small muted">${esc(m.subtitle || "")}</div>
            <div class="chips" style="margin:6px 0 0">${m.built ? `<span class="badge">${st.done}/${st.built} done</span>` : `<span class="badge">Coming soon</span>`} ${lvlBadge} ${adapt}</div>
          </div>
        </div>
        <div class="mbody ${open ? "" : "hidden"}"><ul class="lesson-list">${lessons}</ul>${extra}</div>
      </div>`;
    }).join("");
    $$(".module-head").forEach(h => h.onclick = () => h.nextElementSibling.classList.toggle("hidden"));
  }

  /* ================================================================
     LESSON
     ================================================================ */
  let L = null;
  function pendingCheckin() {
    const t = today();
    const cands = allLessons.filter(l => isDone(l.id) && LS(l.id).doneAt && LS(l.id).doneAt < t && !S.checkins[l.id]);
    if (!cands.length) return null;
    cands.sort((a, b) => LS(b.id).doneAt.localeCompare(LS(a.id).doneAt));
    return cands[0];
  }

  function viewLesson(id) {
    const entry = lessonById[id];
    if (!entry) { location.replace("#/learn"); return; }
    const { lesson: l, module: m, built } = entry;
    setChrome(m.title, { back: true, tabs: false });
    if (!built) {
      app.innerHTML = `<div class="card"><h2>${esc(l.title)}</h2><p class="muted">This lesson isn't built yet. Modules are added one at a time.</p><a class="btn ghost" href="#/learn">Back to modules</a></div>`;
      return;
    }
    if (!isUnlocked(id) && !isDone(id) && !(L && L.id === id)) {
      app.innerHTML = `<div class="card"><div class="eyebrow">Locked</div><h2>${esc(l.title)}</h2>
        <p>Lessons unlock in order. You can jump ahead, but the earlier lessons stay in your queue.</p>
        <div class="btn-row"><a class="btn ghost" href="#/learn">Back</a><button class="btn" id="jump">Jump ahead</button></div></div>`;
      $("#jump").onclick = () => { S.lessons[id] = Object.assign(LS(id), { jumped: true }); save(); viewLesson(id); };
      return;
    }
    if (!L || L.id !== id) {
      const ci = pendingCheckin();
      L = { id, step: ci && ci.id !== id ? "checkin" : "teach", checkin: ci ? ci.id : null, qi: 0, results: [], deeper: false, di: 0, dres: [] };
      S.lessons[id] = Object.assign(LS(id), { started: true }); save();
    }
    renderLessonStep(l, m);
  }

  const STEP_ORDER = ["checkin", "teach", "terms", "quiz", "deeper", "reflect", "finish"];
  function renderLessonStep(l, m) {
    const stepsShown = ["teach", "terms", "quiz", "reflect", "finish"];
    const curIdx = stepsShown.indexOf(L.step === "deeper" ? "quiz" : L.step === "checkin" ? "teach" : L.step);
    const bar = `<div class="steps">${stepsShown.map((s, i) => `<i class="${i <= curIdx ? "on" : ""}"></i>`).join("")}</div>`;
    const head = `${bar}<div class="eyebrow" style="margin-top:8px">${esc(m.title)}</div><h1>${esc(l.title)}</h1>`;
    const go = step => { L.step = step; window.scrollTo(0, 0); renderLessonStep(l, m); };

    if (L.step === "checkin") {
      const pl = lessonById[L.checkin].lesson;
      app.innerHTML = `${head}<div class="card"><div class="eyebrow">Check-in</div>
        <h3>Did you do the action from "${esc(pl.title)}"?</h3>
        <p class="muted">${esc(pl.doToday)}</p>
        <div class="opts"><button class="opt" data-c="yes">Yes, did it</button><button class="opt" data-c="partly">Partly</button><button class="opt" data-c="no">No</button></div>
        <div id="ciOut"></div></div>`;
      $$("[data-c]").forEach(b => b.onclick = () => {
        const v = b.dataset.c; S.checkins[L.checkin] = v; logPractice("doToday", v === "yes", addDays(today(), -1)); save();
        const msg = v === "yes" ? "Logged." : v === "partly" ? "Logged as partial. Finish it today if you can." : "Logged. It's still worth doing; it's on today's tracker.";
        $("#ciOut").innerHTML = `<p class="small" style="margin-top:12px">${msg}</p><button class="btn block" id="ciGo">Continue to lesson</button>`;
        $$("[data-c]").forEach(x => x.disabled = true);
        $("#ciGo").onclick = () => go("teach");
      });
      return;
    }

    if (L.step === "teach") {
      app.innerHTML = `${head}<div class="card teach">${l.teach}
        <div class="source"><b>Source:</b> ${esc(l.source)}</div></div>
        <div class="btn-row"><button class="btn soft" id="saveQ">Save a question</button><button class="btn" id="nx">Terms</button></div>`;
      $("#nx").onclick = () => go("terms");
      $("#saveQ").onclick = () => promptNote(`(${l.title}) `);
      return;
    }

    if (L.step === "terms") {
      app.innerHTML = `${head}<div class="card"><h3>Terms</h3><ul class="terms">${(l.terms || []).map(t => `
        <li><div class="tt"><b>${esc(t.t)}</b><span class="he">${esc(t.h)}</span></div><div class="small muted">${esc(t.m)}</div></li>`).join("")}</ul></div>
        <div class="btn-row"><button class="btn soft" id="bk">Back</button><button class="btn" id="nx">Start quiz (${l.quiz.length})</button></div>`;
      $("#bk").onclick = () => go("teach");
      $("#nx").onclick = () => { L.qi = 0; L.results = []; go("quiz"); };
      return;
    }

    if (L.step === "quiz") {
      if (L.qi >= l.quiz.length) {
        const score = L.results.filter(Boolean).length, total = l.quiz.length, pct = score / total;
        const perfect = score === total && (l.deeper || []).length;
        const verdict = pct === 1 ? "Perfect score." : pct >= 0.7 ? "Solid. The ones you missed will come back in review." : "Under 70%. The missed questions are scheduled for tomorrow. Reread the teaching before moving on.";
        app.innerHTML = `${head}<div class="card center"><div class="eyebrow">Quiz result</div>
          <div style="font-family:var(--serif);font-size:2.4rem;font-weight:600">${score} / ${total}</div>
          <p>${verdict}</p>
          ${pct < 0.7 ? `<button class="btn ghost block" id="reteach" style="margin-bottom:8px">Reread the teaching</button>` : ""}
          ${perfect ? `<button class="btn soft block" id="deep" style="margin-bottom:8px">Go deeper (${l.deeper.length} harder questions)</button>` : ""}
          <button class="btn block" id="nx">Continue</button></div>`;
        const s = LS(l.id);
        s.score = score; s.total = total; s.attempts = (s.attempts || 0) + 1; s.needsReview = pct < 0.7;
        S.lessons[l.id] = s; save();
        if ($("#reteach")) $("#reteach").onclick = () => go("teach");
        if ($("#deep")) $("#deep").onclick = () => { L.di = 0; L.dres = []; go("deeper"); };
        $("#nx").onclick = () => go("reflect");
        return;
      }
      app.innerHTML = `${head}<div class="card" id="qq"></div>`;
      const q = l.quiz[L.qi];
      renderQuestion($("#qq"), q, { counter: `${L.qi + 1} / ${l.quiz.length}` }, ok => {
        L.results.push(ok); srsUpdate(q.id, ok); L.qi++; window.scrollTo(0, 0); renderLessonStep(l, m);
      });
      return;
    }

    if (L.step === "deeper") {
      if (L.di >= l.deeper.length) {
        const sc = L.dres.filter(Boolean).length;
        app.innerHTML = `${head}<div class="card center"><div class="eyebrow">Deeper set</div>
          <div style="font-family:var(--serif);font-size:2rem;font-weight:600">${sc} / ${l.deeper.length}</div>
          <p class="small muted">These are now in your review rotation too.</p>
          <button class="btn block" id="nx">Continue</button></div>`;
        $("#nx").onclick = () => go("reflect");
        return;
      }
      app.innerHTML = `${head}<div class="card" id="qq"></div>`;
      const q = l.deeper[L.di];
      renderQuestion($("#qq"), q, { counter: `Deeper ${L.di + 1} / ${l.deeper.length}` }, ok => {
        L.dres.push(ok); srsUpdate(q.id, ok); L.di++; window.scrollTo(0, 0); renderLessonStep(l, m);
      });
      return;
    }

    if (L.step === "reflect") {
      app.innerHTML = `${head}<div class="card"><div class="eyebrow">Reflection</div>
        <h3 style="font-weight:500">${esc(l.reflect)}</h3>
        <textarea id="rf" placeholder="A few honest lines. Only you see this.">${esc(LS(l.id).reflection || "")}</textarea></div>
        <div class="btn-row"><button class="btn" id="nx">Continue</button></div>`;
      $("#nx").onclick = () => { S.lessons[l.id] = Object.assign(LS(l.id), { reflection: $("#rf").value }); save(); go("finish"); };
      return;
    }

    if (L.step === "finish") {
      const s = LS(l.id);
      const first = !s.done;
      if (first) { s.done = true; s.doneAt = today(); delete s.skipped; S.lessons[l.id] = s; markActive("lesson"); save(); }
      const nxt = nextLesson();
      app.innerHTML = `${head}
        <div class="card"><div class="eyebrow">Do it today</div><p style="margin:0">${esc(l.doToday)}</p>
          <p class="small muted" style="margin:8px 0 0">The next lesson starts by asking whether you did it.</p></div>
        <div class="card sayit"><div class="eyebrow">Say it</div>
          <div class="phrase">${esc(l.sayIt.phrase)}</div>
          ${l.sayIt.h ? `<div class="he" style="margin-bottom:6px">${esc(l.sayIt.h)}</div>` : ""}
          <p style="margin:0 0 6px"><b>Meaning:</b> ${esc(l.sayIt.meaning)}</p>
          <p style="margin:0"><b>When:</b> ${esc(l.sayIt.when)}</p></div>
        <div class="btn-row"><a class="btn soft" href="#/">Home</a>${nxt ? `<a class="btn" href="#/lesson/${nxt.id}">Next lesson</a>` : `<a class="btn" href="#/learn">Modules</a>`}</div>`;
      L = null;
      renderStreak();
    }
  }

  /* ================================================================
     REVIEW
     ================================================================ */
  let RV = null;
  function viewReview(arg) {
    setChrome("Review", { tab: "review", back: !!arg, tabs: !RV || RV.done });
    if (RV && RV.arg === (arg || "") && !RV.done) return renderReviewQ();
    const due = dueList();
    if (arg) {
      let ids = [];
      if (arg.startsWith("deep-")) {
        const mid = arg.slice(5);
        ids = Object.keys(qIndex).filter(id => qIndex[id].module.id === mid && qIndex[id].deeper);
      } else {
        ids = Object.keys(qIndex).filter(id => qIndex[id].module.id === arg && !qIndex[id].deeper && isDone(qIndex[id].lesson.id));
        ids.sort((a, b) => ((S.srs[b] || {}).lapses || 0) - ((S.srs[a] || {}).lapses || 0));
      }
      startReview(ids.slice(0, 20), arg);
      return;
    }
    const seen = Object.keys(S.srs).filter(id => qIndex[id]).length;
    const upcoming = Object.values(S.srs).filter(e => e.due > today()).map(e => e.due).sort()[0];
    app.innerHTML = `
      <div class="card"><div class="eyebrow">Spaced repetition</div>
        <h1>${due.length} due</h1>
        <p class="small muted">Questions you get wrong come back tomorrow. Ones you get right come back at growing intervals: 2 days, then 5, then longer.</p>
        ${due.length ? `<button class="btn block" id="go">Start review (${Math.min(due.length, 20)})</button>` :
          seen ? `<p class="small">Nothing due.${upcoming ? ` Next due: ${esc(upcoming)}.` : ""}</p><button class="btn ghost block" id="weak">Drill your 10 weakest anyway</button>` :
          `<p class="small">Finish a lesson and its questions enter the rotation.</p>`}
      </div>
      <div class="grid2">
        <div class="stat"><b>${seen}</b><span>questions in rotation</span></div>
        <div class="stat"><b>${Object.values(S.srs).filter(e => e.lapses > 0).length}</b><span>missed at least once</span></div>
      </div>`;
    if ($("#go")) $("#go").onclick = () => { startReview(due.slice(0, 20), ""); };
    if ($("#weak")) $("#weak").onclick = () => { startReview(weakList(10), ""); };
  }
  function startReview(ids, arg) {
    if (!ids.length) { app.innerHTML = `<div class="empty">No questions available here yet.</div>`; return; }
    RV = { arg, queue: ids.slice(), requeued: {}, n: 0, right: 0, total: ids.length, done: false };
    setChrome("Review", { back: true, tabs: false });
    renderReviewQ();
  }
  function renderReviewQ() {
    if (!RV.queue.length) {
      RV.done = true;
      setChrome("Review", { tab: "review", back: !!RV.arg });
      app.innerHTML = `<div class="card center"><div class="eyebrow">Review done</div>
        <div style="font-family:var(--serif);font-size:2.2rem;font-weight:600">${RV.right} / ${RV.n}</div>
        <p class="small muted">First-try accuracy. Missed questions are scheduled for tomorrow.</p>
        <a class="btn block" href="#/">Home</a></div>`;
      RV = null;
      return;
    }
    const qid = RV.queue.shift();
    const info = qIndex[qid];
    app.innerHTML = `<div class="small muted" style="margin-top:10px">${esc(info.lesson.title)}</div><div class="card" id="rq"></div>
      <div class="small muted center">${RV.queue.length} left</div>`;
    renderQuestion($("#rq"), info.q, {}, ok => {
      if (!RV.requeued[qid]) { RV.n++; if (ok) RV.right++; srsUpdate(qid, ok); markActive("review"); }
      if (!ok && !RV.requeued[qid]) { RV.requeued[qid] = true; RV.queue.push(qid); }
      window.scrollTo(0, 0); renderReviewQ();
    });
  }

  /* ================================================================
     PRACTICE TRACKER
     ================================================================ */
  const PRACTICE = [
    { k: "tanya", t: "Tanya", d: "Today's Chitas portion", stage: 1 },
    { k: "tehillim", t: "Tehillim", d: "Today's portion (by day of month)", stage: 1 },
    { k: "chumash", t: "Chumash", d: "Today's aliyah, with Rashi when you can", stage: 2 },
    { k: "rambam", t: "Rambam", d: "One chapter, or Sefer HaMitzvos", stage: 3 },
    { k: "doToday", t: "Do It Today", d: "", stage: 1 }
  ];
  function logPractice(k, val, day = today()) {
    S.practice[day] = S.practice[day] || {};
    S.practice[day][k] = val;
    if (val) { S.activity[day] = S.activity[day] || {}; S.activity[day].practice = 1; }
    save();
  }
  function latestDoToday() {
    const done = allLessons.filter(l => isDone(l.id)).sort((a, b) => (LS(b.id).doneAt || "").localeCompare(LS(a.id).doneAt || ""));
    return done[0] || null;
  }
  function renderPracticeChecks(el, compact) {
    const t = today(); const p = S.practice[t] || {};
    const stage = S.settings.stage || 1;
    const ld = latestDoToday();
    const items = PRACTICE.filter(it => it.stage <= stage || p[it.k]);
    el.innerHTML = items.map(it => {
      const desc = it.k === "doToday" ? (ld ? ld.doToday : "Finish a lesson to get your first action.") : it.d;
      return `<label class="check"><input type="checkbox" data-k="${it.k}" ${p[it.k] ? "checked" : ""} ${it.k === "doToday" && !ld ? "disabled" : ""}>
        <span class="t"><b>${it.t}</b><br><span class="small muted">${esc(compact && desc.length > 90 ? desc.slice(0, 88) + "..." : desc)}</span></span></label>`;
    }).join("") + (stage < 3 ? `<p class="small muted" style="margin:8px 0 0">Plan stage ${stage} of 3. Add more in the Tracker once this is steady.</p>` : "");
    $$("input[data-k]", el).forEach(cb => cb.onchange = () => {
      logPractice(cb.dataset.k, cb.checked);
      if (cb.dataset.k === "doToday" && ld && cb.checked) { S.checkins[ld.id] = "yes"; save(); }
      renderStreak();
    });
  }
  function viewTracker() {
    setChrome("Tracker", { tab: "tracker" });
    const t = today();
    const days = []; for (let i = 27; i >= 0; i--) days.push(addDays(t, -i));
    const cnt = k => days.slice(-7).filter(d => (S.practice[d] || {})[k]).length;
    let best = 0, run = 0;
    Object.keys(S.activity).sort().forEach((k, i, arr) => {
      if (!activeOn(k)) return;
      run = (i && arr[i - 1] === addDays(k, -1) && activeOn(arr[i - 1])) ? run + 1 : 1; best = Math.max(best, run);
    });
    const stage = S.settings.stage || 1;
    app.innerHTML = `
      <div class="grid2" style="margin-top:12px">
        <div class="stat"><b>${streak()}</b><span>day streak</span></div>
        <div class="stat"><b>${best}</b><span>best streak</span></div>
      </div>
      <div class="card"><h3>Today</h3><div id="pc"></div></div>
      <div class="card"><h3>Last 4 weeks</h3>
        <div class="days">${days.map(d => {
          const p = S.practice[d] || {}; const n = ["tanya", "tehillim", "chumash", "rambam", "doToday"].filter(k => p[k]).length + (activeOn(d) ? 1 : 0);
          return `<div class="day ${n >= 3 ? "l2" : n ? "l1" : ""} ${d === t ? "today" : ""}">${Number(d.slice(8))}</div>`;
        }).join("")}</div>
        <p class="small muted" style="margin:10px 0 0">Darker means more of your plan was done that day.</p></div>
      <div class="card"><h3>This week</h3>
        <ul class="list small">${PRACTICE.map(it => `<li class="row between"><span>${it.t}</span><b>${cnt(it.k)} / 7</b></li>`).join("")}</ul></div>
      <div class="card"><h3>Your Chitas and Rambam plan</h3>
        <p class="small muted">You said you have about 10 minutes a night. Start small, keep it daily, then add.</p>
        <div class="chips">${[1, 2, 3].map(s => `<button class="chip ${stage === s ? "on" : ""}" data-s="${s}">Stage ${s}</button>`).join("")}</div>
        <p class="small">${stage === 1 ? "<b>Stage 1:</b> the daily Tanya portion (a few minutes) and the daily Tehillim portion (the Tehillim divided by day of the month). Move up after 3 steady weeks." :
          stage === 2 ? "<b>Stage 2:</b> Stage 1, plus the daily Chumash aliyah. Add Rashi when you can." :
          "<b>Stage 3:</b> the full Chitas plus Rambam. Choose one chapter a day or Sefer HaMitzvos; three chapters is the full cycle. Ask Zalmy which track fits your seder."}</p>
        <p class="small muted" style="margin:0">Module 9 covers what these are and why the Rebbe asked for them.</p></div>`;
    renderPracticeChecks($("#pc"));
    $$("[data-s]").forEach(b => b.onclick = () => { S.settings.stage = Number(b.dataset.s); save(); viewTracker(); });
  }

  /* ================================================================
     MORE / NOTEBOOK / GLOSSARY / REFERENCE / SETTINGS
     ================================================================ */
  function viewMore() {
    setChrome("More", { tab: "more" });
    const open = S.notebook.filter(n => !n.answered).length;
    app.innerHTML = `
      <div class="card menu">
        <a href="#/notebook">Questions notebook ${open ? `<span class="badge gold">${open} open</span>` : ""}</a>
        <a href="#/glossary">Glossary</a>
      </div>
      <div class="eyebrow" style="margin:18px 0 0">Reference</div>
      <div class="card menu">
        <a href="#/ref/rebbeim">The 7 Rebbeim</a>
        <a href="#/ref/calendar">Chabad calendar</a>
        <a href="#/ref/brachos">Brachos lookup</a>
        <a href="#/ref/melachos">The 39 melachos</a>
      </div>
      <div class="card menu"><a href="#/settings">Settings and backup</a></div>
      <p class="small muted center">When a question needs a real person, ask Zalmy or a rav at Mayanot.</p>`;
  }

  function addNote(text, tag) {
    S.notebook.unshift({ id: Date.now().toString(36), text, tag: tag || "Zalmy", created: today(), answered: false, answer: "" });
    save();
  }
  function promptNote(prefix) {
    const v = window.prompt("Your question (saved to the notebook):", prefix || "");
    if (v && v.trim()) { addNote(v.trim(), "Zalmy"); toast("Saved to your notebook."); }
  }
  let nbFilter = "open";
  function viewNotebook() {
    setChrome("Questions notebook", { back: true, tab: "more" });
    const TAGS = ["Zalmy", "Rav", "Farbrengen", "Other"];
    const list = S.notebook.filter(n => nbFilter === "all" || (nbFilter === "open" ? !n.answered : n.answered));
    app.innerHTML = `
      <div class="card">
        <textarea id="nbText" placeholder="What do you want to ask?"></textarea>
        <div class="chips" id="nbTags">${TAGS.map((t, i) => `<button class="chip ${i === 0 ? "on" : ""}" data-t="${t}">Ask ${t === "Farbrengen" ? "at a farbrengen" : t === "Other" ? "later" : t}</button>`).join("")}</div>
        <button class="btn block" id="nbAdd">Save question</button>
      </div>
      <div class="chips">${["open", "answered", "all"].map(f => `<button class="chip ${nbFilter === f ? "on" : ""}" data-f="${f}">${f[0].toUpperCase() + f.slice(1)}</button>`).join("")}</div>
      ${list.length ? `<div class="card"><ul class="list">${list.map(n => `
        <li data-id="${n.id}">
          <div class="row between"><span class="badge ${n.answered ? "good" : "gold"}">${esc(n.tag)}</span><span class="small muted">${esc(n.created)}</span></div>
          <p style="margin:6px 0">${esc(n.text)}</p>
          ${n.answered ? `<div class="model small"><b>Answer:</b> ${esc(n.answer)}</div>` : ""}
          <div class="row" style="gap:14px;margin-top:6px">
            ${n.answered ? "" : `<button class="linkish small" data-a="answer">Log answer</button>`}
            <button class="linkish small" data-a="del" style="color:var(--bad)">Delete</button>
          </div>
        </li>`).join("")}</ul></div>` : `<div class="empty">No ${nbFilter === "all" ? "" : nbFilter + " "}questions.</div>`}`;
    let tag = "Zalmy";
    $$("#nbTags .chip").forEach(c => c.onclick = () => { $$("#nbTags .chip").forEach(x => x.classList.remove("on")); c.classList.add("on"); tag = c.dataset.t; });
    $("#nbAdd").onclick = () => { const v = $("#nbText").value.trim(); if (!v) return; addNote(v, tag); viewNotebook(); };
    $$("[data-f]").forEach(c => c.onclick = () => { nbFilter = c.dataset.f; viewNotebook(); });
    $$("[data-a]").forEach(b => b.onclick = () => {
      const id = b.closest("li").dataset.id; const n = S.notebook.find(x => x.id === id);
      if (b.dataset.a === "del") { if (confirm("Delete this question?")) { S.notebook = S.notebook.filter(x => x.id !== id); save(); viewNotebook(); } return; }
      const ans = prompt("What was the answer, and who gave it?"); if (ans === null) return;
      n.answered = true; n.answer = ans.trim(); save(); viewNotebook();
    });
  }

  function glossaryEntries() {
    const out = []; const seen = {};
    const add = (t, h, m, src) => { const k = t.toLowerCase(); if (seen[k]) return; seen[k] = 1; out.push({ t, h, m, src }); };
    allLessons.forEach(l => (l.terms || []).forEach(x => add(x.t, x.h, x.m, l.title)));
    (C.glossaryExtra || []).forEach(x => add(x.t, x.h, x.m, ""));
    R.melachos.forEach(g => g.items.forEach(x => add(x.n, x.h, `Melacha: ${x.m}. Example: ${x.ex}`, "39 melachos")));
    return out.sort((a, b) => a.t.localeCompare(b.t));
  }
  function viewGlossary() {
    setChrome("Glossary", { back: true, tab: "more" });
    const all = glossaryEntries();
    app.innerHTML = `<input type="search" id="gq" placeholder="Search ${all.length} terms (English, Hebrew, or meaning)" style="margin-top:12px">
      <div class="card"><ul class="terms" id="gl"></ul></div>`;
    const draw = q => {
      q = (q || "").toLowerCase().trim();
      const list = all.filter(e => !q || e.t.toLowerCase().includes(q) || (e.h || "").includes(q) || e.m.toLowerCase().includes(q));
      $("#gl").innerHTML = list.length ? list.map(e => `<li><div class="tt"><b>${esc(e.t)}</b><span class="he">${esc(e.h)}</span></div>
        <div class="small">${esc(e.m)}</div>${e.src ? `<div class="small muted">From: ${esc(e.src)}</div>` : ""}</li>`).join("") : `<li class="muted">No match. Add it to your notebook and ask.</li>`;
    };
    draw(""); $("#gq").oninput = e => draw(e.target.value);
  }

  function viewRef(which) {
    if (which === "rebbeim") {
      setChrome("The 7 Rebbeim", { back: true, tab: "more" });
      app.innerHTML = `<p class="small muted" style="margin-top:12px">The Baal Shem Tov founded the Chassidic movement, and his successor was the Maggid of Mezritch. The Alter Rebbe, a student of the Maggid, founded Chabad.</p>` +
        R.rebbeim.map(r => `<div class="card"><div class="row" style="align-items:flex-start">
          <div class="module-num">${r.n}</div><div style="flex:1">
          <h3 style="margin:2px 0">${esc(r.name)}</h3><div class="small muted">${esc(r.full)} <span class="he">${esc(r.h)}</span></div></div></div>
          <p class="kv" style="margin-top:10px"><b>Born</b>${esc(r.born)}</p>
          <p class="kv"><b>Passed</b>${esc(r.passed)}</p>
          <p class="small" style="margin-top:8px">${esc(r.contribution)}</p>
          <details class="ref"><summary>Story <span class="muted">+</span></summary><p class="small">${esc(r.story)}</p></details></div>`).join("");
      return;
    }
    if (which === "calendar") {
      setChrome("Chabad calendar", { back: true, tab: "more" });
      app.innerHTML = `<div class="card">${R.calendar.map(c => `<details class="ref"><summary><span>${esc(c.name)}</span><span class="muted small">${esc(c.d)}</span></summary>
        <p class="small" style="margin:0 0 4px">${esc(c.what)}</p><p class="small muted" style="margin:0"><b>Marked by:</b> ${esc(c.marked)}</p></details>`).join("")}</div>`;
      return;
    }
    if (which === "brachos") {
      setChrome("Brachos lookup", { back: true, tab: "more" });
      app.innerHTML = `<input type="search" id="bq" placeholder="Search a food" style="margin-top:12px">
        <div class="card" id="bl"></div><p class="small muted">${esc(R.brachosNote)}</p>`;
      const draw = q => {
        q = (q || "").toLowerCase().trim();
        const list = R.brachos.filter(b => !q || b.f.toLowerCase().includes(q));
        $("#bl").innerHTML = list.length ? list.map(b => `<div class="brachah-row"><div>${esc(b.f)}</div>
          <div><div class="r">${esc(b.r)}</div><div class="a">after: ${esc(b.a)}</div></div>${b.note ? `<div class="note">${esc(b.note)}</div>` : ""}</div>`).join("")
          : `<p class="muted small">Not listed. Save it as a question for Zalmy.</p>`;
      };
      draw(""); $("#bq").oninput = e => draw(e.target.value);
      return;
    }
    if (which === "melachos") {
      setChrome("The 39 melachos", { back: true, tab: "more" });
      let n = 0;
      app.innerHTML = `<p class="small muted" style="margin-top:12px">${esc(R.melachosIntro)}</p>` + R.melachos.map(g => `<div class="card">
        <h3>${esc(g.g)} <span class="badge">${g.items.length}</span></h3><p class="small muted">${esc(g.why)}</p>
        ${g.items.map(x => { n++; return `<details class="ref"><summary><span>${n}. ${esc(x.n)} <span class="he muted">${esc(x.h)}</span></span><span class="small muted">${esc(x.m)}</span></summary>
          <p class="small" style="margin:0"><b>Example:</b> ${esc(x.ex)}</p></details>`; }).join("")}</div>`).join("") +
        `<p class="small muted">The full rules, and what counts as a toladah (derivative), are in Module Shabbos. For real cases, ask a rav.</p>`;
      return;
    }
    location.replace("#/more");
  }

  function applyTheme() {
    const t = S.settings.theme || "auto";
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
  }
  function viewSettings() {
    setChrome("Settings", { back: true, tab: "more", tabs: S.onboarded });
    app.innerHTML = `
      <div class="card"><h3>Theme</h3><div class="chips">${["auto", "light", "dark"].map(t => `<button class="chip ${S.settings.theme === t ? "on" : ""}" data-th="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}</div></div>
      <div class="card"><h3>Backup</h3>
        <p class="small muted">Progress lives only in this browser. Export a backup now and then, especially before clearing your browser or switching phones.</p>
        <div class="btn-row"><button class="btn soft" id="exp">Export</button><button class="btn soft" id="imp">Import</button></div>
        <input type="file" id="impFile" accept="application/json" class="hidden"></div>
      <div class="card"><h3>Placement</h3>
        <p class="small muted">Retaking the quiz resets your module levels. Lessons you've finished stay finished.</p>
        <button class="btn ghost block" id="retake">Retake placement quiz</button></div>
      <div class="card"><h3>Reset</h3><button class="btn danger block" id="reset">Erase all progress</button></div>`;
    $$("[data-th]").forEach(b => b.onclick = () => { S.settings.theme = b.dataset.th; save(); applyTheme(); viewSettings(); });
    $("#exp").onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `chabad-path-backup-${today()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $("#imp").onclick = () => $("#impFile").click();
    $("#impFile").onchange = e => {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = () => { try { const d = JSON.parse(r.result); if (!d || d.v !== 1) throw 0; S = Object.assign(blank(), d); save(); toast("Backup restored."); applyTheme(); location.hash = "#/"; } catch (err) { toast("That file isn't a valid backup."); } };
      r.readAsText(f);
    };
    $("#retake").onclick = () => { OB = null; location.hash = "#/onboarding"; };
    $("#reset").onclick = () => { if (confirm("Erase all progress? This can't be undone.")) { S = blank(); save(); applyTheme(); location.hash = "#/onboarding"; } };
  }

  /* ---------------- Boot ---------------- */
  applyTheme();
  route();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
