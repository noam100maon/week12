# Nefesh

A black-and-white habit tracker built on the ideas in *Atomic Habits* by James Clear.
No build step, no accounts, no network: open `index.html` and it runs.

## Run it

```
open nefesh/index.html          # or: npx http-server nefesh
```

## What it does

**Today** — the habits scheduled for the current weekday, each with its cue, its
habit stack and its two-minute version. Tick one and it casts a vote. A
*never miss twice* banner appears when a habit was missed the last time it was
due, so the miss does not become the new habit. Arrows step back through
earlier days to fill in a forgotten check.

**Habits** — create and edit habits as implementation intentions. Each one
carries the four laws: a cue (obvious), an identity it votes for (attractive),
a two-minute version (easy) and a reward (satisfying). Habits can be *build* or
*break*, and can run on any subset of weekdays.

**Identity** — "I am the type of person who…". Attach habits to an identity and
every completion is counted as a vote for it. Behaviour change starts with who
you want to be, not what you want to achieve.

**Review** — a thirty-day grid per habit, completion rates, longest run, and the
four laws as a reference. Days before a habit existed are not counted as misses.

Data lives in `localStorage` on the device. Export and import JSON from the
Review tab to move it or back it up.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Markup and the habit dialog |
| `styles.css` | Grayscale design system |
| `app.js` | State, streak maths, rendering |
