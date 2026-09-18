const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync(require.resolve('../index.html'), 'utf8');

test('CIBN page consumes canonical catalog endpoint for timetable rules', () => {
  assert.match(html, /CATALOG_API=.*\/api\/cibn-catalog/);
  assert.match(html, /id="mcpSchedule"/);
  assert.match(html, /id="mcpSelectionRules"/);
  assert.match(html, /loadCibnCatalog\(\)/);
});

test('CIBN page does not retain a second hard-coded MCP timetable', () => {
  assert.equal((html.match(/MF301 · MF302/g) || []).length, 0);
  assert.equal((html.match(/MF401 · MF403/g) || []).length, 0);
  assert.equal((html.match(/MF404/g) || []).length, 1);
});
