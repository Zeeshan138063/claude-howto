// Usage: node resources/diagrams/build.cjs [name ...]
// Generates src/<name>.html from specs.cjs and renders <name>.png. With no names, builds all.
const fs = require('fs');
const path = require('path');
const { render, launch } = require('./render.cjs');
const specs = require('./specs.cjs');

const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800'
  + '&family=JetBrains+Mono:wght@500;600;700&display=swap';

function page(spec) {
  return `<!doctype html>
<html><head><meta charset="utf-8">
<title>${spec.name}</title>
<link href="${FONTS}" rel="stylesheet">
<link href="../lib/theme.css" rel="stylesheet">
</head><body>
<script>window.SPEC = ${JSON.stringify(spec, null, 2)};</script>
<script src="../lib/diagram.js"></script>
</body></html>
`;
}

(async () => {
  const only = process.argv.slice(2);
  const unknown = only.filter((n) => !specs.some((s) => s.name === n));
  if (unknown.length) {
    console.error(`Unknown diagram: ${unknown.join(', ')}`);
    process.exit(1);
  }
  const browser = await launch();
  for (const spec of specs) {
    if (only.length && !only.includes(spec.name)) continue;
    const src = path.join(__dirname, 'src', `${spec.name}.html`);
    const out = path.join(__dirname, `${spec.name}.png`);
    fs.writeFileSync(src, page(spec));
    await render(browser, src, out);
    console.log(`Rendered ${spec.name}.png`);
  }
  await browser.close();
})();
