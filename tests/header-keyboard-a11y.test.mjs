import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

test('Header calculators dropdown accessibility attributes in static HTML', () => {
  const enHtmlPath = path.resolve(process.cwd(), 'out/en/index.html');
  assert.ok(fs.existsSync(enHtmlPath), 'out/en/index.html must exist');
  const html = fs.readFileSync(enHtmlPath, 'utf-8');

  // 1. Verify Trigger Button WAI-ARIA attributes
  assert.match(html, /aria-haspopup=[\"\']menu[\"\']/, 'Button must have aria-haspopup="menu"');
  assert.match(html, /aria-controls=[\"\']calculators-navigation[\"\']/, 'Button must control calculators-navigation');
  assert.match(html, /aria-expanded=[\"\']false[\"\']/, 'Button must default to aria-expanded="false"');

  // 2. Verify Menu Container has role="menu"
  assert.match(html, /id=[\"\']calculators-navigation[\"\'][^>]*role=[\"\']menu[\"\']|role=[\"\']menu[\"\'][^>]*id=[\"\']calculators-navigation[\"\']/, 'Dropdown must have role="menu"');

  // 3. Verify Menu items have role="menuitem"
  const menuItemMatches = html.match(/role=[\"\']menuitem[\"\']/g);
  assert.ok(menuItemMatches && menuItemMatches.length >= 8, `Expected at least 8 menuitems, found ${menuItemMatches?.length}`);

  // 4. Verify all 8 core calculators are present in the dropdown
  const expectedCalculators = [
    '/en/calculators/cap-rate/',
    '/en/calculators/noi/',
    '/en/calculators/cash-on-cash/',
    '/en/calculators/loan-payment/',
    '/en/calculators/dscr/',
    '/en/calculators/1031-exchange/',
    '/en/calculators/lease-vs-buy/',
    '/en/calculators/break-even-ratio/',
  ];

  for (const calc of expectedCalculators) {
    assert.ok(html.includes(`href="${calc}"`), `Dropdown must include ${calc}`);
  }
});
