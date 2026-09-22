# Nefesh

A black-and-white habit system built on the ideas in *Atomic Habits*.
No build step, no dependencies, no accounts: open `index.html` and it runs.

## Run it

```
open nefesh/index.html          # or: npx http-server nefesh
```

On iOS, Share → **Add to Home Screen** installs it as a standalone app.

## Three tabs

**Home** — today's habits and goals against a single completion bar. Every
habit carries its anchor ("after I pour my coffee"), its time, an optional
step list, and a low-energy version that still counts. Miss a habit and the
next time it comes due it asks *what got in the way?* — too big, bad timing,
forgot, low energy — so the miss becomes data instead of guilt.

**Inspire** — a quote you can star, five mental models, an implementation
simulator that stacks an anchor you already have against a micro-action small
enough to be boring, four identity bundles that import in one tap, a reading
list, and a wisdom vault holding everything you starred.

**Results** — system momentum over 7/30/90/365 days or all time, a seven-day
rolling consistency curve with its delta against the prior period, per-habit
completion, votes cast per identity, days rescued by not missing twice,
milestones, and a weekly reflection.

Momentum is 60% completion rate over the range, 25% best current streak
measured against three weeks, 15% how many habits are active at all.

## Design

Grayscale on a grouped-white background. Metrics follow Apple's HIG: the iOS
text styles (Large Title 34 / Body 17, 11pt floor), 44pt minimum tap targets,
a 49pt tab row sitting on the home-indicator safe-area inset, translucent
bars, and the iOS sheet curve `cubic-bezier(.32,.72,0,1)` on every transition.
`-apple-system` picks up real SF Pro and its Display/Text optical switch.
True squircles are applied through `corner-shape` where the engine supports
it (Chromium 139+); tuned `border-radius` carries Safari and Firefox.

State lives in `localStorage`, migrating any data from the previous version.
Export and import JSON from Settings.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup, icon sprite, sheets |
| `styles.css` | Design system |
| `app.js` | State, habit maths, rendering |
