// Usage: node resources/diagrams/render.cjs <src.html> <out.png>
const fs = require('fs');
const os = require('os');
const path = require('path');

function loadPuppeteer() {
  try {
    return require('puppeteer');
  } catch {
    const npxDir = path.join(os.homedir(), '.npm', '_npx');
    const hit = fs.existsSync(npxDir) && fs.readdirSync(npxDir)
      .map((d) => path.join(npxDir, d, 'node_modules', 'puppeteer'))
      .find((p) => fs.existsSync(p));
    if (!hit) {
      console.error('puppeteer not found. Run once: npx -y puppeteer browsers install chrome');
      process.exit(1);
    }
    return require(hit);
  }
}

async function render(browser, src, out) {
  const page = await browser.newPage();
  await page.setViewport({ width: 2400, height: 800, deviceScaleFactor: 2 });
  await page.goto(`file://${path.resolve(src)}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  const width = await page.evaluate(() => document.body.offsetWidth);
  await page.setViewport({ width, height: 800, deviceScaleFactor: 2 });
  await page.waitForFunction(() => window.__diagramReady !== false);
  const frame = await page.$('.wrap');
  await frame.screenshot({ path: path.resolve(out) });
  await page.close();
}

async function launch() {
  return loadPuppeteer().launch({ headless: 'new' });
}

module.exports = { render, launch };

if (require.main === module) {
  (async () => {
    const [src, out] = process.argv.slice(2);
    if (!src || !out) {
      console.error('Usage: node render.cjs <src.html> <out.png>');
      process.exit(1);
    }
    const browser = await launch();
    await render(browser, src, out);
    await browser.close();
    console.log(`Rendered ${out}`);
  })();
}
