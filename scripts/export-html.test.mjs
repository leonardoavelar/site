import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { Script } from 'node:vm';
import { JSDOM } from 'jsdom';

const html = await readFile(new URL('../dist/offline/site.html', import.meta.url), 'utf8');
const { document } = new JSDOM(html).window;

test('exports a standalone document without external resources or a base URL', () => {
  assert.equal(document.documentElement.lang, 'pt-BR');
  assert.ok(document.querySelector('app-root'));
  assert.equal(
    document.querySelectorAll(
      'base, script[src], link[rel="stylesheet"], link[rel="preload"], link[rel="modulepreload"]',
    ).length,
    0,
  );
  assert.match(document.querySelector('link[rel="icon"]').href, /^data:image\/x-icon;base64,/);
  assert.ok(document.querySelector('style')?.textContent.length > 1000);
  for (const style of document.querySelectorAll('style')) {
    assert.doesNotMatch(style.textContent, /@import\b/i);
    for (const [, url] of style.textContent.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) {
      assert.match(url, /^(data:|#)/);
    }
  }
});

test('bundles the application as one inline classic script, without module imports', () => {
  const scripts = document.querySelectorAll('script:not([type="text/plain"])');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].hasAttribute('type'), false);
  assert.ok(scripts[0].textContent.length > 100000);
  assert.doesNotThrow(() => new Script(scripts[0].textContent));
  assert.doesNotMatch(scripts[0].textContent, /\bimport\s*\(/);
});

test('preserves third-party license notices inside the HTML', () => {
  const licenses = document.querySelector('#third-party-licenses');
  assert.equal(licenses?.getAttribute('type'), 'text/plain');
  assert.match(licenses.textContent, /MIT/);
});
