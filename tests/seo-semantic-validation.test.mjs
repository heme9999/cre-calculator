import test from 'node:test';
import assert from 'node:assert';
import {
  isBadBerOccupancy,
  invalidSamples,
  validSamples,
  runSemanticSelfTest
} from '../scripts/lib/seo-semantic-validation.mjs';

test('isBadBerOccupancy rejects all invalid semantic samples', () => {
  for (const sample of invalidSamples) {
    const isBad = isBadBerOccupancy(sample);
    assert.strictEqual(
      isBad,
      true,
      `Expected invalid sample to be flagged as bad: "${sample}"`
    );
  }
});

test('isBadBerOccupancy allows all valid semantic samples and clarifications', () => {
  for (const sample of validSamples) {
    const isBad = isBadBerOccupancy(sample);
    assert.strictEqual(
      isBad,
      false,
      `Expected valid sample to NOT be flagged as bad: "${sample}"`
    );
  }
});

test('runSemanticSelfTest executes successfully without throwing', () => {
  assert.strictEqual(runSemanticSelfTest(), true);
});
