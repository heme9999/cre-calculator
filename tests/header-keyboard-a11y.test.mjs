import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

test('Header calculators disclosure navigation accessibility attributes in static HTML (EN & ZH)', () => {
  for (const locale of ['en', 'zh']) {
    const htmlPath = path.resolve(process.cwd(), `out/${locale}/index.html`);
    assert.ok(fs.existsSync(htmlPath), `out/${locale}/index.html must exist`);
    const html = fs.readFileSync(htmlPath, 'utf-8');

    // 1. Native trigger button retains aria-expanded="false" and aria-controls="calculators-navigation"
    assert.match(html, /aria-controls=["']calculators-navigation["']/, `Button must control calculators-navigation (${locale})`);
    assert.match(html, /aria-expanded=["']false["']/, `Button must default to aria-expanded="false" (${locale})`);

    // 2. Must NOT use menu/menuitem roles or aria-haspopup="menu"
    assert.doesNotMatch(html, /aria-haspopup=["']menu["']/, `Button must NOT have aria-haspopup="menu" (${locale})`);
    assert.doesNotMatch(html, /role=["']menu["']/, `Dropdown must NOT have role="menu" (${locale})`);
    assert.doesNotMatch(html, /role=["']menuitem["']/, `Dropdown links must NOT have role="menuitem" (${locale})`);

    // 3. Closed links in initial static HTML must not be in focus order (tabindex="-1" and invisible)
    const navMatch = html.match(/id=["']calculators-navigation["'][^>]*>([\s\S]*?)<\/div>/);
    assert.ok(navMatch, `#calculators-navigation container must exist (${locale})`);
    const navInner = navMatch[1];
    const linkMatches = navInner.match(/<a\s[^>]*>/g) || [];
    assert.equal(linkMatches.length, 8, `Expected 8 calculator links inside #calculators-navigation (${locale})`);
    for (const linkTag of linkMatches) {
      assert.match(linkTag, /tabindex=["']-1["']/, `Closed disclosure link must have tabindex="-1" (${locale}): ${linkTag}`);
    }

    // 4. Verify all 8 core calculators are present in the dropdown
    const expectedCalculators = [
      `/${locale}/calculators/cap-rate/`,
      `/${locale}/calculators/noi/`,
      `/${locale}/calculators/cash-on-cash/`,
      `/${locale}/calculators/loan-payment/`,
      `/${locale}/calculators/dscr/`,
      `/${locale}/calculators/1031-exchange/`,
      `/${locale}/calculators/lease-vs-buy/`,
      `/${locale}/calculators/break-even-ratio/`,
    ];

    for (const calc of expectedCalculators) {
      assert.ok(navInner.includes(`href="${calc}"`), `Dropdown must include ${calc}`);
    }
  }
});
