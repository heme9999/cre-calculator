/**
 * SEO & Financial Semantic Validator for Break-Even Ratio (BER) & Break-Even Occupancy (BEO).
 *
 * Ensures BER is not equated with or confused with occupancy, and validates proper pairing.
 */

export function isBadBerOccupancy(text) {
  if (!text || typeof text !== 'string') return false;

  const normalized = text.replace(/\s+/g, ' ').trim();

  // 1. Strict formula violations (regardless of sentence context)
  if (/(?:100%|1)\s*-\s*BER\b/i.test(normalized) || /\bBER\s*-\s*(?:100%|1)\b/i.test(normalized)) {
    return true;
  }
  if (/100%\s*减去?\s*(?:BER|收支平衡比率)/i.test(normalized)) {
    return true;
  }

  // 2. Split into sentences/clauses by punctuation
  const clauses = normalized.split(/[。！？!?;\n]+/).map(s => s.trim()).filter(Boolean);

  for (const clause of clauses) {
    const hasBer = /\bBER\b/i.test(clause) || /Break-Even Ratio/i.test(clause) || /收支平衡比率/.test(clause);
    const hasOccupancy = /\boccupancy\b/i.test(clause) || /入住率/.test(clause) || /出租率/.test(clause);

    if (!hasBer && !hasOccupancy) continue;

    // Direct reverse equating: "occupancy is BER", "入住率就是 BER", "出租率等于 BER", "minimum occupancy equals BER"
    if (/(?:minimum\s+|required\s+)?occupancy(?:\s+percentage)?\s+(?:is|equals|means|represents)\s+(?:the\s+)?BER\b/i.test(clause)) {
      return true;
    }
    if (/(?:入住率|出租率)\s*(?:就是|等于|即为|为|代表)\s*(?:the\s+)?BER/i.test(clause)) {
      return true;
    }

    if (hasBer && hasOccupancy) {
      // Sub-clause split by comma to distinguish "BER is burden ratio, not occupancy"
      const subClauses = clause.split(/[,，]+/).map(s => s.trim()).filter(Boolean);

      let foundAffirmativeEquating = false;
      let hasClarifyingNegation = false;

      for (const sub of subClauses) {
        // Check for clarifying negation in this sub-clause
        const isEnglishNegated = /(?:not|never|neither|nor|rather than|instead of)\s+(?:an?\s+|the\s+)?(?:minimum\s+|required\s+)?occupancy/i.test(sub) ||
                                 /\bBER\b\s+(?:is\s+not|isn't|does\s+not|doesn't|cannot)\s+(?:an?\s+|the\s+)?(?:minimum\s+|required\s+)?occupancy/i.test(sub) ||
                                 /\bBER\b\s+(?:is\s+not|isn't|does\s+not|doesn't)\s+(?:equal\s+to\s+)?(?:the\s+)?(?:minimum\s+|required\s+)?occupancy/i.test(sub);

        const isChineseNegated = /(?:不是|不等于|并非|不代表|不同于)(?:[^\w\u4e00-\u9fa5]{0,5})(?:最低|实际|所需|保本)?(?:入住率|出租率)/.test(sub) ||
                                 /切勿将\s*BER\s*与\s*BEO/i.test(sub);

        if (isEnglishNegated || isChineseNegated) {
          hasClarifyingNegation = true;
          continue;
        }

        // Check for affirmative equating in this sub-clause
        const isEnglishAffirmative = /\bBER\b(?:\s+\w+){0,3}\s+(?:is|represents|means|measures|equals|calculates)\s+(?:an?\s+|the\s+)?(?:minimum\s+|required\s+)?occupancy\b/i.test(sub) ||
                                     /\bBER\b\s+occupancy\b/i.test(sub);

        const isChineseAffirmative = /(?:BER|收支平衡比率)\s*(?:就是|是|表示|代表|等于|为)(?:[^\w\u4e00-\u9fa5]{0,5})(?:最低|实际|所需|保本)?(?:入住率|出租率)/.test(sub);

        if (isEnglishAffirmative || isChineseAffirmative) {
          foundAffirmativeEquating = true;
        }
      }

      if (foundAffirmativeEquating) {
        return true;
      }
      if (!hasClarifyingNegation) {
        // If it mentions both BER and occupancy without clarifying negation, check if BEO is the subject
        const hasBeo = /\bBEO\b/i.test(clause) || /Break-Even Occupancy/i.test(clause) || /盈亏入住率/.test(clause);
        if (!hasBeo) {
          return true;
        }
      }
    }
  }

  return false;
}

export const invalidSamples = [
  'BER is the minimum occupancy required to break even.',
  'BER 是物业需要维持的最低入住率。',
  'Break-Even Occupancy = 100% - BER.',
  '100% - BER',
  '1 - BER',
  'BER is occupancy',
  'BER is an occupancy percentage',
  'BER is the minimum occupancy',
  'BER represents required occupancy',
  'occupancy is BER',
  'minimum occupancy equals BER',
  'BER 是入住率',
  'BER 是出租率',
  'BER 是最低入住率',
  'BER 表示最低出租率',
  '入住率就是 BER',
  '出租率等于 BER'
];

export const validSamples = [
  'BER is a burden ratio, not an occupancy percentage.',
  'BER is not the minimum occupancy required to break even.',
  'BER 是收入负担比率，不是入住率。',
  'BER 不等于最低出租率。',
  'BEO estimates required occupancy using GPI.',
  '盈亏入住率 BEO 使用 GPI 估算。'
];

export function runSemanticSelfTest() {
  for (let i = 0; i < invalidSamples.length; i++) {
    const sample = invalidSamples[i];
    if (!isBadBerOccupancy(sample)) {
      throw new Error(`Semantic validator self-test failed: invalid sample was NOT rejected: "${sample}"`);
    }
  }

  for (let i = 0; i < validSamples.length; i++) {
    const sample = validSamples[i];
    if (isBadBerOccupancy(sample)) {
      throw new Error(`Semantic validator self-test failed: valid sample was falsely rejected: "${sample}"`);
    }
  }

  console.log('Semantic validation logic self-test passed');
  return true;
}
