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
    if (dscr < 1.0 && breakEvenRatio > 90) {
      healthTitle = isZh
        ? '示例评估：双重指标触碰红线 (DSCR 与 BER 同时击穿)'
        : isEs
        ? 'Regla Ilustrativa: Alerta Doble (DSCR y BER Infringidos)'
        : isPt
        ? 'Regra Demonstrativa: Alerta Duplo (DSCR e BER Infringidos)'
        : 'Illustrative Rule: Dual Critical Breach (DSCR & BER)';
      healthDesc = isZh
        ? `两项指标同时触发严重预警：① 偿债覆盖率 DSCR 降至 ${dscr.toFixed(2)}x（低于 1.0x 违约底线，净收入不足以偿付贷款本息）；② 收支平衡比率 BER 升至 ${breakEvenRatio.toFixed(1)}%（高于 90% 警戒线，出租率需达 ${breakEvenOccupancy.toFixed(1)}% 方能保本）。抗风险缓冲已被穿透。实际违约判定以借贷合同约定为准。`
        : isEs
        ? `Doble infracción crítica: ① DSCR cayó a ${dscr.toFixed(2)}x (< 1.0x insolvencia, flujo insuficiente para pagar deuda); ② Punto de Equilibrio BER subió a ${breakEvenRatio.toFixed(1)}% (> 90%, requiere ${breakEvenOccupancy.toFixed(1)}% de ocupación para cubrir costos). La regla ilustrativa señala alto riesgo.`
        : isPt
        ? `Dupla infração crítica: ① DSCR caiu para ${dscr.toFixed(2)}x (< 1.0x insolvência, receita insuficiente para pagar dívida); ② Ponto de Equilíbrio BER subiu para ${breakEvenRatio.toFixed(1)}% (> 90%, exige ${breakEvenOccupancy.toFixed(1)}% de ocupação para cobrir custos). A regra demonstrativa aponta alto risco.`
        : `Dual critical failure triggered: ① DSCR fell to ${dscr.toFixed(2)}x (< 1.0x insolvency floor, income cannot service debt); ② Break-Even Ratio rose to ${breakEvenRatio.toFixed(1)}% (> 90% ceiling, requiring ${breakEvenOccupancy.toFixed(1)}% occupancy just to break even). Safety cushion is depleted. Actual loan default terms depend on specific covenants.`;
    } else if (dscr < 1.0) {
      healthTitle = isZh
        ? '示例评估：DSCR 率先跌破底线 (现金流倒挂赤字)'
        : isEs
        ? 'Regla Ilustrativa: DSCR Falla Primero (Déficit de Flujo)'
        : isPt
        ? 'Regra Demonstrativa: DSCR Falha Primeiro (Déficit de Caixa)'
        : 'Illustrative Rule: DSCR Breaches Floor First (Negative Cash Flow)';
      healthDesc = isZh
        ? `在当前测算路径下，偿债覆盖率 (DSCR) 率先击穿安全底线（降至 ${dscr.toFixed(2)}x < 1.0x），年净营业收入不足以覆盖贷款本息支出，出现现金流赤字；此时收支平衡比率 (BER) 暂处 ${breakEvenRatio.toFixed(1)}%。实际重组或追加保证金要求取决于具体贷款协议。`
        : isEs
        ? `Bajo este escenario, el DSCR falla primero (cayendo a ${dscr.toFixed(2)}x < 1.0x), generando déficit operativo frente al servicio de deuda; el BER se ubica en ${breakEvenRatio.toFixed(1)}%.`
        : isPt
        ? `Neste cenário, o DSCR falha primeiro (caindo para ${dscr.toFixed(2)}x < 1.0x), gerando déficit operacional frente ao serviço da dívida; o BER está em ${breakEvenRatio.toFixed(1)}%.`
        : `Under this scenario, DSCR fails first (falling to ${dscr.toFixed(2)}x < 1.0x floor), meaning operating income cannot service debt; Break-Even Ratio currently sits at ${breakEvenRatio.toFixed(1)}%.`;
    } else {
      healthTitle = isZh
        ? '示例评估：收支平衡比率 (BER) 率先击穿上限'
        : isEs
        ? 'Regla Ilustrativa: BER Supera Límite Primero'
        : isPt
        ? 'Regra Demonstrativa: BER Supera Limite Primeiro'
        : 'Illustrative Rule: Break-Even Ratio Breaches Ceiling First';
      healthDesc = isZh
        ? `在当前测算路径下，收支平衡比率 (BER) 率先击穿上限（升至 ${breakEvenRatio.toFixed(1)}% > 90%），抗空置安全垫极薄，物业需维持 ${breakEvenOccupancy.toFixed(1)}% 以上的高出租率方能保本；此时 DSCR 仍暂维持在 ${dscr.toFixed(2)}x。`
        : isEs
        ? `Bajo este escenario, el BER falla primero (subiendo a ${breakEvenRatio.toFixed(1)}% > 90%), requiriendo ${breakEvenOccupancy.toFixed(1)}% de ocupación para no incurrir en pérdidas; el DSCR permanece en ${dscr.toFixed(2)}x.`
        : isPt
        ? `Neste cenário, o BER falha primeiro (subindo para ${breakEvenRatio.toFixed(1)}% > 90%), exigindo ${breakEvenOccupancy.toFixed(1)}% de ocupação para não ter prejuízo; o DSCR permanece em ${dscr.toFixed(2)}x.`
        : `Under this scenario, Break-Even Ratio fails first (rising to ${breakEvenRatio.toFixed(1)}% > 90%), leaving a razor-thin vacancy cushion (${breakEvenOccupancy.toFixed(1)}% occupancy required to break even); DSCR currently stands at ${dscr.toFixed(2)}x.`;
    }
  } else if (dscr < 1.25 || breakEvenRatio > 85) {
    healthStatus = 'yellow';
    if (dscr < 1.25 && breakEvenRatio > 85) {
      healthTitle = isZh
        ? '示例评估：双重指标接近临界警戒线'
        : isEs
        ? 'Regla Ilustrativa: Umbral Crítico Doble'
        : isPt
        ? 'Regra Demonstrativa: Limite de Atenção Duplo'
        : 'Illustrative Rule: Dual Near-Threshold Warning';
      healthDesc = isZh
        ? `DSCR (${dscr.toFixed(2)}x，银行常规标准 ≥ 1.25x) 与收支平衡比率 (${breakEvenRatio.toFixed(1)}%，警戒阈值 85%) 同时接近预警区间。实际是否需追加股权或设立储备金取决于具体贷款项目。`
        : isEs
        ? `Tanto el DSCR (${dscr.toFixed(2)}x frente a 1.25x) como el BER (${breakEvenRatio.toFixed(1)}% frente a 85%) se acercan a los rangos de precaución.`
        : isPt
        ? `Tanto o DSCR (${dscr.toFixed(2)}x vs 1.25x) quanto o BER (${breakEvenRatio.toFixed(1)}% vs 85%) aproximam-se das faixas de cautela.`
        : `Both DSCR (${dscr.toFixed(2)}x vs standard 1.25x) and Break-Even Ratio (${breakEvenRatio.toFixed(1)}% vs 85% guideline) approach warning thresholds.`;
    } else if (dscr < 1.25) {
      healthTitle = isZh
        ? '示例评估：DSCR 率先逼近借贷底线'
        : isEs
        ? 'Regla Ilustrativa: DSCR Cerca del Mínimo'
        : isPt
        ? 'Regra Demonstrativa: DSCR Próximo ao Limite'
        : 'Illustrative Rule: DSCR Approaching Minimum';
      healthDesc = isZh
        ? `偿债覆盖率 (${dscr.toFixed(2)}x) 率先接近银行常见审批底线 (1.20-1.25x)，抗收入波动空间收窄；收支平衡比率仍处于较稳健的 ${breakEvenRatio.toFixed(1)}%。`
        : isEs
        ? `El ratio DSCR (${dscr.toFixed(2)}x) se acerca primero al umbral bancario (1.20-1.25x); el BER se mantiene en un nivel moderado de ${breakEvenRatio.toFixed(1)}%.`
        : isPt
        ? `O índice DSCR (${dscr.toFixed(2)}x) aproxima-se primeiro do limite bancário (1.20-1.25x); o BER mantém-se em patamar moderado de ${breakEvenRatio.toFixed(1)}%.`
        : `DSCR (${dscr.toFixed(2)}x) approaches lender minimum guidelines (1.20-1.25x) first, compressing cushion against income drops; BER remains at ${breakEvenRatio.toFixed(1)}%.`;
    } else {
      healthTitle = isZh
        ? '示例评估：收支平衡比率 (BER) 率先进入警戒区间'
        : isEs
        ? 'Regla Ilustrativa: BER Entra en Rango de Precaución'
        : isPt
        ? 'Regra Demonstrativa: BER Entra em Faixa de Atenção'
        : 'Illustrative Rule: BER Enters Caution Zone First';
      healthDesc = isZh
        ? `收支平衡比率 (${breakEvenRatio.toFixed(1)}%) 率先超过 85% 警戒阈值，意味着物业需保持至少 ${breakEvenOccupancy.toFixed(1)}% 出租率方可覆盖营运及偿债；DSCR 目前为 ${dscr.toFixed(2)}x。`
        : isEs
        ? `El Punto de Equilibrio BER (${breakEvenRatio.toFixed(1)}%) supera primero el 85%, requiriendo ${breakEvenOccupancy.toFixed(1)}% de ocupación; el DSCR está en ${dscr.toFixed(2)}x.`
        : isPt
        ? `O Ponto de Equilíbrio BER (${breakEvenRatio.toFixed(1)}%) supera primeiro os 85%, exigindo ${breakEvenOccupancy.toFixed(1)}% de ocupação; o DSCR está em ${dscr.toFixed(2)}x.`
        : `Break-Even Ratio (${breakEvenRatio.toFixed(1)}%) exceeds the 85% caution guideline first, requiring ${breakEvenOccupancy.toFixed(1)}% occupancy; DSCR stands at ${dscr.toFixed(2)}x.`;
    }
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
