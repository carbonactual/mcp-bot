const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html','utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));
const sw = fs.readFileSync('sw.js','utf8');

test('CIBN deployment has installable web-app metadata',()=>{
  assert.match(html,/rel="manifest"/);
  assert.match(html,/apple-mobile-web-app-capable/);
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.start_url,'/?source=pwa');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length>=2);
});

test('CIBN deployment registers the service worker',()=>{
  assert.match(html,/navigator.serviceWorker.register('\/sw.js')/);
  assert.match(sw,/addEventListener('install'/);
  assert.match(sw,/addEventListener('fetch'/);
  assert.match(sw,/offline.html/);
  assert.match(sw,//api//);
});

test('CIBN deployment persists and resumes ABBA session identity',()=>{
  assert.match(html,/cibn_abba_session_id/);
  assert.match(html,/action:'resume'/);
  assert.match(html,/session_id:sessionId/);
  assert.match(html,/localStorage/);
});
