import { calculateLoanDetails, PaymentType } from './loanCalculations';

export interface DealAnalyzerInput {
  purchasePrice: number;
  closingCostsPercent: number; // e.g. 2%
  grossPotentialIncome: number;
  vacancyRate: number; // e.g. 5%
  operatingExpenses: number;
  downPaymentPercent: number; // e.g. 25%
  interestRate: number; // e.g. 6.5%
  amortizationYears: number; // e.g. 25
  paymentType: PaymentType; // 'installment' | 'principal'
  hasBalloon: boolean;
  balloonYears: number;
}

export const DEFAULT_DEAL_INPUT: DealAnalyzerInput = {
  purchasePrice: 2800000,
  closingCostsPercent: 2.0,
  grossPotentialIncome: 336000,
  vacancyRate: 5.0,
  operatingExpenses: 92000,
  downPaymentPercent: 25.0,
  interestRate: 6.5,
  amortizationYears: 25,
  paymentType: 'installment',
  hasBalloon: false,
  balloonYears: 5,
};

export type HealthStatus = 'green' | 'yellow' | 'red';

export interface SingleScenarioResult {
  purchasePrice: number;
  closingCosts: number;
  grossPotentialIncome: number;
  vacancyLoss: number;
  egi: number;
  operatingExpenses: number;
  noi: number;
  capRate: number;
  downPayment: number;
  totalCashInvested: number;
  loanAmount: number;
  monthlyPayment: number;
  annualDebtService: number;
  cashOnCashReturn: number;
  dscr: number;
  breakEvenRatio: number;
  breakEvenOccupancy: number;
  balloonBalance: number;
  balloonPercentage: number;
  healthStatus: HealthStatus;
  healthTitle: string;
  healthDesc: string;
}

export interface DealAnalyzerFullResult {
  base: SingleScenarioResult;
  stress: SingleScenarioResult;
}

export function calculateSingleScenario(input: DealAnalyzerInput, locale: string): SingleScenarioResult {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';
  const purchasePrice = Math.max(0, input.purchasePrice);
  const closingCosts = purchasePrice * (Math.max(0, input.closingCostsPercent) / 100);
  const grossPotentialIncome = Math.max(0, input.grossPotentialIncome);
  const vacancyRate = Math.max(0, input.vacancyRate);
  const vacancyLoss = grossPotentialIncome * (vacancyRate / 100);
  const egi = Math.max(0, grossPotentialIncome - vacancyLoss);
  const operatingExpenses = Math.max(0, input.operatingExpenses);
  const noi = egi - operatingExpenses;

  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  const downPaymentPercent = Math.max(0, input.downPaymentPercent);
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const totalCashInvested = downPayment + closingCosts;

  const loanAmount = Math.max(0, purchasePrice - downPayment);

  // Reuse calculateLoanDetails from loanCalculations.ts
  const loanRes = calculateLoanDetails({
    loanAmount,
    interestRate: input.interestRate,
    amortizationYears: input.amortizationYears,
    balloonYears: input.balloonYears,
    hasBalloon: input.hasBalloon,
    paymentType: input.paymentType,
  });

  const monthlyPayment = loanRes.monthlyPayment;
  const annualDebtService = loanRes.firstYearDebtService;

  const netCashFlow = noi - annualDebtService;
  const cashOnCashReturn = totalCashInvested > 0 ? (netCashFlow / totalCashInvested) * 100 : 0;

  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  // Break-Even Ratio is calculated against Effective Gross Income (EGI)
  const breakEvenRatio = egi > 0 ? ((operatingExpenses + annualDebtService) / egi) * 100 : 0;
  // Break-Even Occupancy is calculated against Gross Potential Income (GPI)
  const breakEvenOccupancy = grossPotentialIncome > 0 ? ((operatingExpenses + annualDebtService) / grossPotentialIncome) * 100 : 0;

  // Determine Health Status (Illustrative heuristic benchmark, not universal lender criteria)
  let healthStatus: HealthStatus = 'green';
  let healthTitle = isZh
    ? '示例评估：稳健区间'
    : isEs
    ? 'Regla Ilustrativa: Margen Estable'
    : isPt
    ? 'Regra Demonstrativa: Margem Segura'
    : 'Illustrative Rule: Stable Cushion';
  let healthDesc = isZh
    ? '符合本站示例风险规则（测算假定 DSCR ≥ 1.25x 且 Break-Even Ratio ≤ 85%）。实际贷款审批门槛因贷方机构、贷款产品、增信担保及物业类型而异。'
    : isEs
    ? 'Cumple con la regla de riesgo ilustrativa (referencia: DSCR ≥ 1.25x y BER ≤ 85%). Los criterios bancarios reales varían según la entidad, producto y tipo de activo.'
    : isPt
    ? 'Atende ao critério de risco ilustrativo (referência: DSCR ≥ 1.25x e BER ≤ 85%). Critérios bancários reais variam conforme a instituição, linha de crédito e tipo de imóvel.'
    : 'Meets this tool\'s illustrative risk rule (modeled benchmark: DSCR ≥ 1.25x & BER ≤ 85%). Actual lender underwriting criteria vary widely by institution, loan program, and asset profile.';

  if (dscr < 1.0 || breakEvenRatio > 90) {
    healthStatus = 'red';
    healthTitle = isZh
      ? '示例评估：风险预警'
      : isEs
      ? 'Regla Ilustrativa: Señales de Alerta'
      : isPt
      ? 'Regra Demonstrativa: Sinais de Alerta'
      : 'Illustrative Rule: Warning Signs';
    healthDesc = isZh
      ? '触碰本站示例风险红线：DSCR < 1.0x（经营现金流不足以偿债）或收支平衡比率 > 90%（抗空置缓冲极薄）。实际贷款门槛与违约判定需结合具体借贷合同约定。'
      : isEs
      ? 'Activa criterios de riesgo ilustrativos: DSCR < 1.0x (déficit de flujo de caja) o Punto de Equilibrio (BER) > 90% (margen muy estrecho ante vacancia). Los términos reales dependen del contrato de préstamo.'
      : isPt
      ? 'Ativa critérios de risco demonstrativos: DSCR < 1.0x (déficit de fluxo de caixa) ou Ponto de Equilíbrio (BER) > 90% (margem muito estreita contra vacância). Termos reais dependem do contrato de financiamento.'
      : 'Triggers illustrative risk criteria: DSCR < 1.0x (cash flow shortfall) or Break-Even Ratio > 90% (thin cushion against vacancy). Actual underwriting and default terms depend on specific loan contracts.';
  } else if (dscr < 1.25 || breakEvenRatio > 85) {
    healthStatus = 'yellow';
    healthTitle = isZh
      ? '示例评估：临界警戒'
      : isEs
      ? 'Regla Ilustrativa: Umbral Crítico'
      : isPt
      ? 'Regra Demonstrativa: Limite de Atenção'
      : 'Illustrative Rule: Near Thresholds';
    healthDesc = isZh
      ? '接近本站示例警戒区间（DSCR 1.0-1.25x 或 Break-Even Ratio 85%-90%）。实际是否需要追加首付或设立偿债储备金取决于具体贷方与承销方案。'
      : isEs
      ? 'Se acerca al rango de precaución ilustrativo (DSCR 1.0-1.25x o BER 85%-90%). El requerimiento de capital adicional o reservas depende del prestamista.'
      : isPt
      ? 'Aproxima-se da faixa de cautela demonstrativa (DSCR 1.0-1.25x ou BER 85%-90%). A exigência de capital adicional ou reservas depende do credor.'
      : 'Approaches illustrative caution range (DSCR 1.0-1.25x or BER 85%-90%). Whether additional equity or debt service reserves are required depends on specific lender guidelines.';
  }

  return {
    purchasePrice,
    closingCosts,
    grossPotentialIncome,
    vacancyLoss,
    egi,
    operatingExpenses,
    noi,
    capRate,
    downPayment,
    totalCashInvested,
    loanAmount,
    monthlyPayment,
    annualDebtService,
    cashOnCashReturn,
    dscr,
    breakEvenRatio,
    breakEvenOccupancy,
    balloonBalance: loanRes.balloonBalance,
    balloonPercentage: loanRes.balloonPercentage,
    healthStatus,
    healthTitle,
    healthDesc,
  };
}

export function calculateDealAnalysis(input: DealAnalyzerInput, locale: string): DealAnalyzerFullResult {
  const base = calculateSingleScenario(input, locale);

  const stressInput: DealAnalyzerInput = {
    ...input,
    vacancyRate: input.vacancyRate + 5, // +5 percentage points
    interestRate: input.interestRate + 1.0, // +100 bps (1%)
  };

  const stress = calculateSingleScenario(stressInput, locale);

  return { base, stress };
}

export const DEAL_SHARE_SCHEMA_VERSION = '1';

function parseBoundedNumber(
  raw: string | null,
  min: number,
  max: number,
  fallback: number,
  allowZero: boolean = true
): number {
  if (raw === null || raw.trim() === '') return fallback;
  const num = Number(raw);
  if (!Number.isFinite(num)) return fallback;
  if (!allowZero && num <= 0) return fallback;
  if (num < min || num > max) return fallback;
  return num;
}

export function sanitizeDealAnalyzerInput(
  candidate: Partial<DealAnalyzerInput>,
  fallback: DealAnalyzerInput = DEFAULT_DEAL_INPUT
): DealAnalyzerInput {
  const purchasePrice =
    typeof candidate.purchasePrice === 'number' &&
    Number.isFinite(candidate.purchasePrice) &&
    candidate.purchasePrice > 0 &&
    candidate.purchasePrice <= 1_000_000_000
      ? candidate.purchasePrice
      : fallback.purchasePrice;

  const closingCostsPercent =
    typeof candidate.closingCostsPercent === 'number' &&
    Number.isFinite(candidate.closingCostsPercent) &&
    candidate.closingCostsPercent >= 0 &&
    candidate.closingCostsPercent <= 50
      ? candidate.closingCostsPercent
      : fallback.closingCostsPercent;

  const grossPotentialIncome =
    typeof candidate.grossPotentialIncome === 'number' &&
    Number.isFinite(candidate.grossPotentialIncome) &&
    candidate.grossPotentialIncome >= 0 &&
    candidate.grossPotentialIncome <= 500_000_000
      ? candidate.grossPotentialIncome
      : fallback.grossPotentialIncome;

  const vacancyRate =
    typeof candidate.vacancyRate === 'number' &&
    Number.isFinite(candidate.vacancyRate) &&
    candidate.vacancyRate >= 0 &&
    candidate.vacancyRate <= 100
      ? candidate.vacancyRate
      : fallback.vacancyRate;

  const operatingExpenses =
    typeof candidate.operatingExpenses === 'number' &&
    Number.isFinite(candidate.operatingExpenses) &&
    candidate.operatingExpenses >= 0 &&
    candidate.operatingExpenses <= 500_000_000
      ? candidate.operatingExpenses
      : fallback.operatingExpenses;

  const downPaymentPercent =
    typeof candidate.downPaymentPercent === 'number' &&
    Number.isFinite(candidate.downPaymentPercent) &&
    candidate.downPaymentPercent >= 0 &&
    candidate.downPaymentPercent <= 100
      ? candidate.downPaymentPercent
      : fallback.downPaymentPercent;

  const interestRate =
    typeof candidate.interestRate === 'number' &&
    Number.isFinite(candidate.interestRate) &&
    candidate.interestRate >= 0 &&
    candidate.interestRate <= 50
      ? candidate.interestRate
      : fallback.interestRate;

  const amortizationYears =
    typeof candidate.amortizationYears === 'number' &&
    Number.isFinite(candidate.amortizationYears) &&
    candidate.amortizationYears >= 1 &&
    candidate.amortizationYears <= 50
      ? Math.round(candidate.amortizationYears)
      : fallback.amortizationYears;

  const paymentType: PaymentType =
    candidate.paymentType === 'installment' || candidate.paymentType === 'principal'
      ? candidate.paymentType
      : fallback.paymentType;

  const hasBalloon =
    typeof candidate.hasBalloon === 'boolean' ? candidate.hasBalloon : fallback.hasBalloon;

  const rawBalloonYears =
    typeof candidate.balloonYears === 'number' &&
    Number.isFinite(candidate.balloonYears) &&
    candidate.balloonYears >= 1 &&
    candidate.balloonYears <= 50
      ? Math.round(candidate.balloonYears)
      : fallback.balloonYears;
  const balloonYears = hasBalloon ? Math.min(rawBalloonYears, amortizationYears) : rawBalloonYears;

  return {
    purchasePrice,
    closingCostsPercent,
    grossPotentialIncome,
    vacancyRate,
    operatingExpenses,
    downPaymentPercent,
    interestRate,
    amortizationYears,
    paymentType,
    hasBalloon,
    balloonYears,
  };
}

/**
 * Encodes strictly whitelisted DealAnalyzerInput fields into a versioned URL hash string.
 * Never includes emails, audit flags, or non-underwriting fields.
 */
export function encodeDealAnalyzerHash(input: DealAnalyzerInput): string {
  const safe = sanitizeDealAnalyzerInput(input, DEFAULT_DEAL_INPUT);
  const params = new URLSearchParams();
  params.set('v', DEAL_SHARE_SCHEMA_VERSION);
  params.set('pp', String(safe.purchasePrice));
  params.set('cc', String(safe.closingCostsPercent));
  params.set('gpi', String(safe.grossPotentialIncome));
  params.set('vac', String(safe.vacancyRate));
  params.set('opex', String(safe.operatingExpenses));
  params.set('dp', String(safe.downPaymentPercent));
  params.set('ir', String(safe.interestRate));
  params.set('ay', String(safe.amortizationYears));
  params.set('pt', safe.paymentType);
  params.set('hb', safe.hasBalloon ? '1' : '0');
  params.set('by', String(safe.balloonYears));
  return params.toString();
}

/**
 * Decodes a URL hash or query string into a validated DealAnalyzerInput.
 * Unknown keys (e.g. email, audit, utm) are ignored. Invalid/out-of-range values
 * safely fall back to `fallback` (DEFAULT_DEAL_INPUT).
 */
export function decodeDealAnalyzerHash(
  rawHash: string,
  fallback: DealAnalyzerInput = DEFAULT_DEAL_INPUT
): DealAnalyzerInput {
  if (!rawHash || typeof rawHash !== 'string') {
    return { ...fallback };
  }
  const cleaned = rawHash.replace(/^[#?]+/, '').trim();
  if (!cleaned) {
    return { ...fallback };
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(cleaned);
  } catch {
    return { ...fallback };
  }

  const version = params.get('v');
  if (version !== null && version !== DEAL_SHARE_SCHEMA_VERSION) {
    return { ...fallback };
  }

  const ptRaw = params.get('pt');
  const paymentType: PaymentType =
    ptRaw === 'installment' || ptRaw === 'principal' ? ptRaw : fallback.paymentType;

  const hbRaw = params.get('hb');
  const hasBalloon =
    hbRaw === '1' || hbRaw === 'true'
      ? true
      : hbRaw === '0' || hbRaw === 'false'
      ? false
      : fallback.hasBalloon;

  const amortizationYears = Math.round(
    parseBoundedNumber(params.get('ay'), 1, 50, fallback.amortizationYears, false)
  );
  const rawBalloonYears = Math.round(
    parseBoundedNumber(params.get('by'), 1, 50, fallback.balloonYears, false)
  );
  const balloonYears = hasBalloon ? Math.min(rawBalloonYears, amortizationYears) : rawBalloonYears;

  return {
    purchasePrice: parseBoundedNumber(params.get('pp'), 1, 1_000_000_000, fallback.purchasePrice, false),
    closingCostsPercent: parseBoundedNumber(params.get('cc'), 0, 50, fallback.closingCostsPercent, true),
    grossPotentialIncome: parseBoundedNumber(params.get('gpi'), 0, 500_000_000, fallback.grossPotentialIncome, true),
    vacancyRate: parseBoundedNumber(params.get('vac'), 0, 100, fallback.vacancyRate, true),
    operatingExpenses: parseBoundedNumber(params.get('opex'), 0, 500_000_000, fallback.operatingExpenses, true),
    downPaymentPercent: parseBoundedNumber(params.get('dp'), 0, 100, fallback.downPaymentPercent, true),
    interestRate: parseBoundedNumber(params.get('ir'), 0, 50, fallback.interestRate, true),
    amortizationYears,
    paymentType,
    hasBalloon,
    balloonYears,
  };
}

/**
 * Escapes a single cell value according to RFC 4180 CSV specifications.
 * Wraps values containing commas, double quotes, or newlines in double quotes,
 * and escapes existing double quotes by doubling them ("").
 */
export function escapeCsvCell(val: string | number): string {
  const str = String(val ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an RFC 4180 compliant CSV string for Deal Analyzer results with a UTF-8 BOM.
 * Ensures strictly 3 columns (Metric, Base Case Value, Stress Test Value) per row.
 */
export function generateDealAnalyzerCsv(
  input: DealAnalyzerInput,
  base: SingleScenarioResult,
  stress: SingleScenarioResult
): string {
  const formatMoney = (val: number): string => {
    if (isNaN(val) || !isFinite(val)) return '$0';
    const rounded = Math.round(val);
    const formatted = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return rounded < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  const formatPct = (val: number): string => {
    if (isNaN(val) || !isFinite(val)) return '0.00%';
    return `${val.toFixed(2)}%`;
  };

  const rows: string[][] = [
    ['Metric', 'Base Case Value', 'Stress Test Value'],
    ['Purchase Price', formatMoney(input.purchasePrice), formatMoney(input.purchasePrice)],
    ['Annual NOI', formatMoney(base.noi), formatMoney(stress.noi)],
    ['Cap Rate', formatPct(base.capRate), formatPct(stress.capRate)],
    ['DSCR', `${base.dscr.toFixed(2)}x`, `${stress.dscr.toFixed(2)}x`],
    ['Cash-on-Cash Return', formatPct(base.cashOnCashReturn), formatPct(stress.cashOnCashReturn)],
    ['Break-Even Ratio', formatPct(base.breakEvenRatio), formatPct(stress.breakEvenRatio)],
    ['Break-Even Occupancy', formatPct(base.breakEvenOccupancy), formatPct(stress.breakEvenOccupancy)],
    [
      'Net Annual Cash Flow',
      formatMoney(base.noi - base.annualDebtService),
      formatMoney(stress.noi - stress.annualDebtService),
    ],
  ];

  return '\uFEFF' + rows.map((r) => r.map(escapeCsvCell).join(',')).join('\r\n');
}
