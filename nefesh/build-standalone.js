/* Inlines styles.css and app.js into a single self-contained nefesh.html.
   Usage: node nefesh/build-standalone.js */

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const out = path.join(dir, '..', 'nefesh.html');

const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css  = fs.readFileSync(path.join(dir, 'styles.css'), 'utf8');
const js   = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

// </script> inside a string literal would close the tag early
const safeJs = js.replace(/<\/script/gi, '<\\/script');

// Replacer FUNCTIONS, not strings: a string replacement would read $$, $&, $`
// and $1 in the file contents as substitution patterns and mangle the code.
const bundled = html
  .replace('<link rel="stylesheet" href="styles.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script src="app.js"></script>', () => `<script>\n${safeJs}\n</script>`);

if (bundled.includes('href="styles.css"') || bundled.includes('src="app.js"')) {
  throw new Error('a reference was left unresolved — check the tags in index.html');
}
if (!bundled.includes(css) || !bundled.includes(safeJs)) {
  throw new Error('the inlined source does not match the original byte for byte');
}

fs.writeFileSync(out, bundled);
console.log(`${path.relative(process.cwd(), out)} — ${(bundled.length / 1024).toFixed(0)} KB`);
