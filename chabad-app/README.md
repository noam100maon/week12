# Chabad Path

A mobile-first app for learning a Chabad Jewish life, one lesson at a time. It's a static site with no build step. Progress is saved in the browser (localStorage).

## Run it
Open `index.html` through any static server, for example `python3 -m http.server` in this folder. You can also deploy the folder to Netlify or GitHub Pages. On your phone, use "Add to Home Screen" to install it; it works offline after the first load.

## Edit content
- `data/content.js`: modules, lessons, the placement quiz, and extra glossary terms. The schema is at the top of the file. To build out a module, replace its stub lessons with full lessons and set `built: true`.
- `data/reference.js`: the Rebbeim, the Chabad calendar, the brachos lookup, and the 39 melachos.
- After changing files, bump `VERSION` in `sw.js` so installed copies refresh their offline cache.

## Features
- Placement quiz: 3 questions per module, which set your level and mark intro lessons as tested out.
- Check-in at the start of each lesson on the previous lesson's "Do it today".
- Spaced repetition (SM-2 style), a question of the day, and a "go deeper" set after a perfect quiz.
- Practice tracker for Chitas, Rambam, and Do It Today, plus a streak counter.
- Questions notebook, a searchable glossary, reference pages, and JSON backup export/import.
