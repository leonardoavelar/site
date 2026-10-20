import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist', 'offline');
const browser = resolve(output, 'browser');
const dom = new JSDOM(await readFile(resolve(browser, 'index.html'), 'utf8'));
const { document } = dom.window;
const assetLoaders = Object.fromEntries(
  ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.otf'].map(
    (extension) => [extension, 'dataurl'],
  ),
);

for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
  const result = await build({
    entryPoints: [resolve(browser, link.getAttribute('href'))],
    bundle: true,
    write: false,
    minify: true,
    loader: assetLoaders,
  });
  const style = document.createElement('style');
  style.textContent = result.outputFiles[0].text.replace(/<\/style/gi, '<\\/style');
  if (link.hasAttribute('media')) style.setAttribute('media', link.getAttribute('media'));
  link.replaceWith(style);
}

const scripts = [...document.querySelectorAll('script[src]')];
if (!scripts.length) throw new Error('O build Angular nao contem scripts para exportar.');

const bundle = await build({
  stdin: {
    contents: scripts
      .map((script) => `import ${JSON.stringify(resolve(browser, script.getAttribute('src')))};`)
      .join('\n'),
    resolveDir: browser,
  },
  bundle: true,
  splitting: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  minify: true,
  legalComments: 'inline',
  write: false,
});
if (bundle.outputFiles.length !== 1) {
  throw new Error('O empacotamento gerou recursos externos inesperados.');
}
for (const script of scripts) script.remove();
const script = document.createElement('script');
script.textContent = bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
document.body.append(script);

for (const link of document.querySelectorAll('link[rel="icon"]')) {
  const icon = await readFile(resolve(browser, link.getAttribute('href')));
  link.setAttribute('href', `data:${link.getAttribute('type')};base64,${icon.toString('base64')}`);
}
document
  .querySelectorAll('base, link[rel="modulepreload"], link[rel="preload"]')
  .forEach((element) => element.remove());

const licenses = document.createElement('script');
licenses.type = 'text/plain';
licenses.id = 'third-party-licenses';
licenses.textContent = (
  await readFile(resolve(dirname(browser), '3rdpartylicenses.txt'), 'utf8')
).replace(/<\/script/gi, '<\\/script');
document.body.append(licenses);

const destination = resolve(output, 'site.html');
await writeFile(destination, dom.serialize(), 'utf8');
console.log(`HTML autocontido gerado em: ${destination}`);
