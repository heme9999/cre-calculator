/**
 * Shared assertion logic for Cash-on-Cash calculator results.
 * Used by both live browser test scenarios and isolated negative fixture tests.
 */
export function assertCocResults(actual, expected) {
  if (!actual) {
    throw new Error('Assertion failed: actual results object is missing');
  }
  const requiredKeys = ['cocReturn', 'capRate', 'totalInvested', 'cashFlow', 'comparison'];
  for (const k of requiredKeys) {
    if (actual[k] === undefined || actual[k] === null || actual[k] === '') {
      throw new Error(`Assertion failed: required result [${k}] is missing or empty`);
    }
  }

  if (expected.cocReturn !== undefined && actual.cocReturn !== expected.cocReturn) {
    throw new Error(`Assertion failed: CoC Return mismatch. Expected ${expected.cocReturn}, got ${actual.cocReturn}`);
  }
  if (expected.capRate !== undefined && actual.capRate !== expected.capRate) {
    throw new Error(`Assertion failed: Cap Rate mismatch. Expected ${expected.capRate}, got ${actual.capRate}`);
  }
  if (expected.totalInvested !== undefined && actual.totalInvested !== expected.totalInvested) {
    throw new Error(`Assertion failed: Total Cash Invested mismatch. Expected ${expected.totalInvested}, got ${actual.totalInvested}`);
  }
  if (expected.cashFlow !== undefined && actual.cashFlow !== expected.cashFlow) {
    throw new Error(`Assertion failed: Cash Flow mismatch. Expected ${expected.cashFlow}, got ${actual.cashFlow}`);
  }
  if (expected.comparisonContains !== undefined && !actual.comparison.includes(expected.comparisonContains)) {
    throw new Error(`Assertion failed: Comparison text mismatch. Expected text containing "${expected.comparisonContains}", got "${actual.comparison}"`);
  }
  if (expected.comparisonMustNotContain !== undefined) {
    for (const badStr of expected.comparisonMustNotContain) {
      if (actual.comparison.includes(badStr)) {
        throw new Error(`Assertion failed: Comparison text must not contain "${badStr}", but got "${actual.comparison}"`);
      }
    }
  }
}
