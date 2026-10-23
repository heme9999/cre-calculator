import { assertCocResults } from '../lib/coc-assertion.mjs';

const mode = process.argv[2];

const validSample = {
  cocReturn: '7.55%',
  capRate: '8.11%',
  totalInvested: '$756,000',
  cashFlow: '$57,048',
  comparison: 'Year-1 cash yield is lower than unleveraged Cap Rate (8.11%)',
};

if (mode === 'coc-mismatch') {
  // CoC return value does not match expected
  assertCocResults(validSample, {
    cocReturn: '99.99%',
  });
} else if (mode === 'cash-flow-mismatch') {
  // Cash flow value does not match expected
  assertCocResults(validSample, {
    cashFlow: '$999,999',
  });
} else if (mode === 'missing-result') {
  // A required result is missing from actual output
  const incompleteSample = {
    cocReturn: '7.55%',
    capRate: '8.11%',
    // totalInvested missing
    cashFlow: '$57,048',
    comparison: 'Year-1 cash yield is lower than unleveraged Cap Rate (8.11%)',
  };
  assertCocResults(incompleteSample, {});
} else {
  console.error(`Unknown negative fixture mode: ${mode}`);
  process.exit(2);
}
