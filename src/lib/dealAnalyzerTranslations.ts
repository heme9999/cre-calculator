export interface DealAnalyzerTranslations {
  promptDealName: string;
  defaultDealPrefix: string;
  tag: string;
  title: string;
  subtitle: string;
  saveDeal: string;
  saveDealTitle: string;
  savedCount: (n: number) => string;
  csvExport: string;
  csvExportTitle: string;
  shareLink: string;
  linkCopied: string;
  exportPdf: string;
  generating: string;
  stressTest: string;
  hideStressTest: string;
  more: string;
  sec1Title: string;
  purchasePrice: string;
  closingCosts: string;
  estClosingCosts: (amt: string) => string;
  sec2Title: string;
  gpiLabel: string;
  gpiHelp: string;
  vacancyLabel: string;
  vacancyHelp: (loss: string) => string;
  opexLabel: string;
  opexHelp: string;
  egiLabel: (amt: string) => string;
  noiLabel: (amt: string) => string;
  egiFormulaDesc: string;
  noiFormulaDesc: string;
  howToCalcNoi: string;
  sec3Title: string;
  downPayment: string;
  interestRate: string;
  amortTerm: string;
  yearsLabel: (n: number, isMain?: boolean) => string;
  repaymentMethod: string;
  equalInstallment: string;
  equalPrincipal: string;
  ruleEvaluation: string;
  badgeStable: string;
  badgeNear: string;
  badgeElevated: string;
  noiMetricLabel: string;
  noiMetricHelp: string;
  howToCalcNoiLink: string;
  capRateMetricLabel: string;
  capRateMetricHelp: string;
  howToCalcCapRateLink: string;
  cocMetricLabel: string;
  cocMetricHelp: string;
  howToCalcCocLink: string;
  dscrMetricLabel: string;
  dscrMetricHelp: string;
  howToCalcDscrLink: string;
  berMetricLabel: string;
  berMetricHelp: string;
  beoMetricLabel: string;
  beoMetricHelp: string;
  howToCalcBerBeoLink: string;
  totalInitialCashOutlay: string;
  monthlyPaymentPi: string;
  annualDebtServiceLabel: string;
  stressComparisonTitle: string;
  stressAssumptions: string;
  baseUnderwritingCase: string;
  initialParameters: string;
  stressedScenario: string;
  stressedParameters: string;
  baseNoiLabel: string;
  baseCapRateLabel: string;
  baseMonthlyPmtLabel: string;
  baseDebtServiceLabel: string;
  baseCocLabel: string;
  baseDscrLabel: string;
  baseBerLabel: string;
  baseOccupancyLabel: string;
  stressedNoiLabel: string;
  stressedCapRateLabel: string;
  stressedMonthlyPmtLabel: string;
  stressedDebtServiceLabel: string;
  stressedCocLabel: string;
  stressedDscrLabel: string;
  stressedBerLabel: string;
  stressedOccupancyLabel: string;
  modalSavedTitle: string;
  modalLoadBtn: string;
  infoBannerTitle: string;
  pdfBrandName: string;
  pdfSummaryTitle: string;
  pdfInputsHeader: string;
  pdfMetricsHeader: string;
  pdfColMetric: string;
  pdfColBase: string;
  pdfColStress: string;
  pdfFooterTagline: string;
  pdfFooterSub: string;
  pdfVerifiedModel: string;
  pdfConfidential: string;
}

export const dealAnalyzerTranslations: Record<string, DealAnalyzerTranslations> = {
  en: {
    promptDealName: 'Enter a name for this deal (e.g. Dallas 24-Unit):',
    defaultDealPrefix: 'Deal',
    tag: 'Full Commercial CRE Underwriting Suite',
    title: 'Deal Analyzer: Comprehensive CRE Underwriting',
    subtitle: 'One input set for Cap Rate, NOI, Cash-on-Cash, DSCR, and Break-Even Ratio.',
    saveDeal: '💾 Save Deal',
    saveDealTitle: 'Save current inputs to local storage',
    savedCount: (n: number) => `Saved (${n})`,
    csvExport: '📊 CSV Export',
    csvExportTitle: 'Export CSV data',
    shareLink: '🔗 Share Link',
    linkCopied: '✅ Link Copied',
    exportPdf: 'Export PDF',
    generating: 'Generating...',
    stressTest: 'Stress Test',
    hideStressTest: 'Hide Stress Test',
    more: 'More ▾',
    sec1Title: '1. Property & Acquisition Info',
    purchasePrice: 'Purchase Price ($)',
    closingCosts: 'Closing Costs (%)',
    estClosingCosts: (amt: string) => `Est: ${amt}`,
    sec2Title: '2. Annual Income & Expenses',
    gpiLabel: 'Gross Potential Income (GPI, $)',
    gpiHelp: '100% full-occupancy annual rent + other income before vacancy or expenses.',
    vacancyLabel: 'Vacancy & Credit Loss (%)',
    vacancyHelp: (loss: string) => `Uncollected rent from empty units or default: -${loss}/yr.`,
    opexLabel: 'Annual Operating Expenses ($)',
    opexHelp: 'Property tax, insurance, repairs, management (excludes loan payments).',
    egiLabel: (amt: string) => `Effective Gross Income (EGI): ${amt}`,
    noiLabel: (amt: string) => `Net Operating Income (NOI): ${amt}`,
    egiFormulaDesc: 'GPI × (1 − Vacancy %), actual collected annual revenue after vacancy and credit loss.',
    noiFormulaDesc: 'EGI − Operating Expenses (OpEx), property operating income before loan payments and taxes.',
    howToCalcNoi: 'How to calculate NOI',
    sec3Title: '3. Debt & Financing Terms',
    downPayment: 'Down Payment (%)',
    interestRate: 'Interest Rate (%)',
    amortTerm: 'Amortization Term (Yrs)',
    yearsLabel: (n: number, isMain?: boolean) => `${n} ${isMain ? 'Years (Std)' : 'Years'}`,
    repaymentMethod: 'Repayment Method:',
    equalInstallment: 'Equal Installment (Fixed)',
    equalPrincipal: 'Equal Principal (Declining)',
    ruleEvaluation: 'Illustrative Rule Evaluation',
    badgeStable: 'Illustrative: Stable Cushion',
    badgeNear: 'Illustrative: Near Threshold',
    badgeElevated: 'Illustrative: Elevated Risk',
    noiMetricLabel: 'Net Operating Income (NOI)',
    noiMetricHelp: 'EGI minus operating expenses (before debt)',
    howToCalcNoiLink: 'How to calculate',
    capRateMetricLabel: 'Cap Rate',
    capRateMetricHelp: 'NOI ÷ Purchase Price (unleveraged yield)',
    howToCalcCapRateLink: 'How to calculate',
    cocMetricLabel: 'Cash-on-Cash Return',
    cocMetricHelp: '(NOI − Annual Debt Service) ÷ Cash Invested',
    howToCalcCocLink: 'How to calculate',
    dscrMetricLabel: 'DSCR (Debt Coverage)',
    dscrMetricHelp: 'NOI ÷ Annual Debt Service (loan payment coverage)',
    howToCalcDscrLink: 'How to calculate',
    berMetricLabel: 'Break-Even Ratio (BER)',
    berMetricHelp: '(Operating Expenses + Annual Debt Service) ÷ EGI — share of effective gross income consumed by expenses and debt.',
    beoMetricLabel: 'Break-Even Occupancy (BEO)',
    beoMetricHelp: '(Operating Expenses + Annual Debt Service) ÷ GPI — simplified occupancy rate on gross potential income needed to cover expenses and debt.',
    howToCalcBerBeoLink: 'How to calculate BER & BEO',
    totalInitialCashOutlay: 'Total Initial Cash Outlay',
    monthlyPaymentPi: 'Monthly Payment (P&I)',
    annualDebtServiceLabel: 'Annual Debt Service',
    stressComparisonTitle: 'Stress Test Side-by-Side Comparison',
    stressAssumptions: 'Assumptions: +5 percentage points Vacancy, +100 bps Rate',
    baseUnderwritingCase: 'Base Underwriting Case',
    initialParameters: 'Initial Parameters',
    stressedScenario: 'Stressed Scenario',
    stressedParameters: 'Vac +5 pts | Rate +100 bps',
    baseNoiLabel: 'Base NOI',
    baseCapRateLabel: 'Base Cap Rate',
    baseMonthlyPmtLabel: 'Base Monthly Pmt',
    baseDebtServiceLabel: 'Base Debt Service',
    baseCocLabel: 'Base CoC',
    baseDscrLabel: 'Base DSCR',
    baseBerLabel: 'Base Break-Even Ratio',
    baseOccupancyLabel: 'Base Occupancy',
    stressedNoiLabel: 'Stressed NOI',
    stressedCapRateLabel: 'Stressed Cap Rate',
    stressedMonthlyPmtLabel: 'Stressed Monthly Pmt',
    stressedDebtServiceLabel: 'Stressed Debt Service',
    stressedCocLabel: 'Stressed CoC',
    stressedDscrLabel: 'Stressed DSCR',
    stressedBerLabel: 'Stressed Break-Even Ratio',
    stressedOccupancyLabel: 'Stressed Occupancy',
    modalSavedTitle: 'Saved Deal Underwritings',
    modalLoadBtn: 'Load Deal',
    infoBannerTitle: '💡 One input set calculates Cap Rate, DSCR, and 3 more core metrics at once — click for details',
    pdfBrandName: 'CRE Calculators',
    pdfSummaryTitle: 'Commercial Real Estate Underwriting Summary',
    pdfInputsHeader: 'Underwriting Input Parameters',
    pdfMetricsHeader: 'Calculated Core CRE Metrics & Stress Test',
    pdfColMetric: 'Core Metric',
    pdfColBase: 'Base Case',
    pdfColStress: 'Stressed Case (+5 pts Vac, +100 bps Rate)',
    pdfFooterTagline: 'Generated by CRECalculators.com — The Independent Underwriting Suite',
    pdfFooterSub: 'Client-Side Deal Underwriting Report • Review online at https://crecalculators.com/en/tools/deal-analyzer/',
    pdfVerifiedModel: 'Standard CRE Formula Summary',
    pdfConfidential: 'Confidential Deal Evaluation',
  },
  zh: {
    promptDealName: '请输入交易备忘名称（如：Dallas 24-Unit Apartment）：',
    defaultDealPrefix: '交易',
    tag: '全流程商业地产尽调与测算',
    title: 'Deal Analyzer 综合尽调工具',
    subtitle: '一次输入全部指标，进行压力测试并导出一页纸PDF尽调摘要',
    saveDeal: '💾 保存交易',
    saveDealTitle: '保存当前测算配置到浏览器本地',
    savedCount: (n: number) => `已存交易 (${n})`,
    csvExport: '📊 CSV 导出',
    csvExportTitle: '导出 CSV 数据文件',
    shareLink: '🔗 分享链接',
    linkCopied: '✅ 链接已复制',
    exportPdf: '导出 PDF',
    generating: '导出中...',
    stressTest: '压力测试',
    hideStressTest: '隐藏压力测试',
    more: '更多 (More) ▾',
    sec1Title: '1. 物业与购买信息 (Property & Acquisition)',
    purchasePrice: '购买价格 (Purchase Price, $)',
    closingCosts: '过户成本 (Closing Costs, %)',
    estClosingCosts: (amt: string) => `过户支出: ${amt}`,
    sec2Title: '2. 收入与支出 (Income & Expenses)',
    gpiLabel: '总潜在年收入 (GPI, $)',
    gpiHelp: '假设 100% 满租时的全年总租金及其他收入（扣空置和支出前）。',
    vacancyLabel: '空置及坏账损失 (%)',
    vacancyHelp: (loss: string) => `未出租或欠租折损：-${loss}/年。`,
    opexLabel: '年运营支出 (OpEx, $)',
    opexHelp: '地税、保险、维修、管理费等日常支出（不含房贷本息）。',
    egiLabel: (amt: string) => `有效毛收入 (EGI): ${amt}`,
    noiLabel: (amt: string) => `净营业收入 (NOI): ${amt}`,
    egiFormulaDesc: 'GPI × (1 − 空置率)，即扣除空置与坏账后的实际有效年收入。',
    noiFormulaDesc: 'EGI − 年运营支出 (OpEx)，即还房贷与缴所得税前的物业净营业收入。',
    howToCalcNoi: '如何分项计算 NOI',
    sec3Title: '3. 融资条件 (Financing Terms)',
    downPayment: '首付比例 (Down Payment, %)',
    interestRate: '年利率 (%)',
    amortTerm: '摊销年限 (Amortization)',
    yearsLabel: (n: number, isMain?: boolean) => `${n} ${isMain ? '年 (主流)' : '年'}`,
    repaymentMethod: '还款模式:',
    equalInstallment: '等额本息 (Equal P&I)',
    equalPrincipal: '等额本金 (Equal Principal)',
    ruleEvaluation: '全案示例规则诊断',
    badgeStable: '示例评级：稳健',
    badgeNear: '示例评级：临界',
    badgeElevated: '示例评级：高风险',
    noiMetricLabel: '净营业收入 NOI',
    noiMetricHelp: '有效毛收入 (EGI) − 年运营支出（还贷前）',
    howToCalcNoiLink: '如何计算 NOI',
    capRateMetricLabel: '资本化率 Cap Rate',
    capRateMetricHelp: 'NOI ÷ 购买价格（全款无杠杆年化收益率）',
    howToCalcCapRateLink: '如何计算 Cap Rate',
    cocMetricLabel: '现金回报率 CoC',
    cocMetricHelp: '(NOI − 年房贷本息) ÷ 初始投入总现金',
    howToCalcCocLink: '如何计算 CoC',
    dscrMetricLabel: '偿债覆盖率 DSCR',
    dscrMetricHelp: 'NOI ÷ 年还贷总额（净营业收入够付几倍年房贷）',
    howToCalcDscrLink: '如何计算 DSCR',
    berMetricLabel: '收支平衡比率 (BER)',
    berMetricHelp: '(年运营支出 + 年还贷总额) ÷ 有效毛收入 (EGI) —— 运营与还贷支出占有效总收入的负担比例。',
    beoMetricLabel: '盈亏平衡入住率 (BEO)',
    beoMetricHelp: '(年运营支出 + 年还贷总额) ÷ 总潜在年收入 (GPI) —— 按满租潜在收入估算覆盖运营支出与房贷所需的盈亏入住率。',
    howToCalcBerBeoLink: '如何计算 BER 与 BEO',
    totalInitialCashOutlay: '初始投入现金 (首付+过户)',
    monthlyPaymentPi: '月供本息合计 (Monthly Pmt)',
    annualDebtServiceLabel: '年还贷总额 (Annual Debt Service)',
    stressComparisonTitle: '交易压力测试对比 (Stress Test Comparison)',
    stressAssumptions: '压力条件: 空置率 +5个百分点, 利率 +100基点',
    baseUnderwritingCase: '当前基础情景',
    initialParameters: '初始测算参数',
    stressedScenario: '加压悲观情景',
    stressedParameters: '空置+5个百分点 | 利率+100基点',
    baseNoiLabel: '净营业收入 NOI',
    baseCapRateLabel: '资本化率 Cap Rate',
    baseMonthlyPmtLabel: '月供还款额',
    baseDebtServiceLabel: '年还贷总额',
    baseCocLabel: '现金回报率 CoC',
    baseDscrLabel: '偿债覆盖率 DSCR',
    baseBerLabel: '收支平衡比率 (BER)',
    baseOccupancyLabel: '盈亏平衡入住率',
    stressedNoiLabel: '净营业收入 NOI',
    stressedCapRateLabel: '资本化率 Cap Rate',
    stressedMonthlyPmtLabel: '月供还款额',
    stressedDebtServiceLabel: '年还贷总额',
    stressedCocLabel: '现金回报率 CoC',
    stressedDscrLabel: '偿债覆盖率 DSCR',
    stressedBerLabel: '收支平衡比率 (BER)',
    stressedOccupancyLabel: '盈亏平衡入住率',
    modalSavedTitle: '已保存的交易测算备忘',
    modalLoadBtn: '载入测算',
    infoBannerTitle: '💡 一次输入，同时算出Cap Rate、DSCR等5项核心指标 —— 点击查看详细说明',
    pdfBrandName: '商业地产投资计算器',
    pdfSummaryTitle: '商业地产尽调与投资分析摘要',
    pdfInputsHeader: '关键测算输入参数',
    pdfMetricsHeader: '核心指标评估与压力测试对比',
    pdfColMetric: '评估指标',
    pdfColBase: '基础情景',
    pdfColStress: '压力情景 (空置率+5个百分点, 利率+100基点)',
    pdfFooterTagline: 'Generated by CRECalculators.com — The Independent Underwriting Suite',
    pdfFooterSub: '商业地产全案尽调分析报告 • 在线复核请访问 https://crecalculators.com/zh/tools/deal-analyzer/',
    pdfVerifiedModel: '标准商业地产财务公式模型',
    pdfConfidential: '严格保密与非公开测算',
  },
  es: {
    promptDealName: 'Ingrese un nombre para esta operación (ej. Multifamiliar 24 Unidades):',
    defaultDealPrefix: 'Operación',
    tag: 'Suite Profesional de Debida Diligencia Comercial',
    title: 'Deal Analyzer: Suite Integral de Debida Diligencia',
    subtitle: 'Unifique Cap Rate, NOI, Cash-on-Cash, DSCR y Break-Even Ratio en un solo análisis.',
    saveDeal: '💾 Guardar Negocio',
    saveDealTitle: 'Guardar parámetros actuales en el almacenamiento local del navegador',
    savedCount: (n: number) => `Guardados (${n})`,
    csvExport: '📊 Exportar CSV',
    csvExportTitle: 'Descargar archivo de datos en formato CSV',
    shareLink: '🔗 Compartir Enlace',
    linkCopied: '✅ Enlace Copiado',
    exportPdf: 'Exportar PDF',
    generating: 'Generando...',
    stressTest: 'Prueba de Estrés',
    hideStressTest: 'Ocultar Prueba de Estrés',
    more: 'Más ▾',
    sec1Title: '1. Información de Propiedad y Adquisición',
    purchasePrice: 'Precio de Compra ($)',
    closingCosts: 'Costos de Cierre (%)',
    estClosingCosts: (amt: string) => `Est: ${amt}`,
    sec2Title: '2. Ingresos y Gastos Operativos Anuales',
    gpiLabel: 'Ingreso Potencial Bruto (GPI, $)',
    gpiHelp: 'Ingreso total anual al 100% de ocupación antes de vacancia o gastos.',
    vacancyLabel: 'Pérdida por Vacancia y Crédito (%)',
    vacancyHelp: (loss: string) => `Pérdida estimada por unidades desocupadas o impago: -${loss}/año.`,
    opexLabel: 'Gastos Operativos Anuales (OpEx, $)',
    opexHelp: 'Impuestos sobre la propiedad, seguros, reparaciones, administración (excluye pagos de deuda).',
    egiLabel: (amt: string) => `Ingreso Bruto Efectivo (EGI): ${amt}`,
    noiLabel: (amt: string) => `Ingreso Operativo Neto (NOI): ${amt}`,
    egiFormulaDesc: 'GPI × (1 − Vacancia %) — ingreso recaudado real tras deducir vacancia y pérdidas crediticias.',
    noiFormulaDesc: 'EGI − Gastos Operativos (OpEx) — ingreso operativo neto antes del servicio de la deuda e impuestos.',
    howToCalcNoi: 'Cómo calcular el NOI',
    sec3Title: '3. Estructura de Financiamiento y Deuda',
    downPayment: 'Pago Inicial / Entrada (%)',
    interestRate: 'Tasa de Interés Anual (%)',
    amortTerm: 'Plazo de Amortización (Años)',
    yearsLabel: (n: number, isMain?: boolean) => `${n} ${isMain ? 'Años (Estándar)' : 'Años'}`,
    repaymentMethod: 'Método de Pago:',
    equalInstallment: 'Cuota Constante (P&I Fijo)',
    equalPrincipal: 'Amortización Constante (Capital Fijo)',
    ruleEvaluation: 'Evaluación de Reglas Ilustrativas',
    badgeStable: 'Calificación Ilustrativa: Colchón Estable',
    badgeNear: 'Calificación Ilustrativa: Cerca del Umbral',
    badgeElevated: 'Calificación Ilustrativa: Riesgo Elevado',
    noiMetricLabel: 'Ingreso Operativo Neto (NOI)',
    noiMetricHelp: 'EGI menos gastos operativos (antes del servicio de la deuda)',
    howToCalcNoiLink: 'Cómo calcular',
    capRateMetricLabel: 'Tasa de Capitalización (Cap Rate)',
    capRateMetricHelp: 'NOI ÷ Precio de Compra (rendimiento no apalancado al contado)',
    howToCalcCapRateLink: 'Cómo calcular',
    cocMetricLabel: 'Retorno Cash-on-Cash (CoC)',
    cocMetricHelp: '(NOI − Servicio Anual de Deuda) ÷ Capital Total Invertido',
    howToCalcCocLink: 'Cómo calcular',
    dscrMetricLabel: 'Cobertura de Deuda (DSCR)',
    dscrMetricHelp: 'NOI ÷ Servicio Anual de Deuda (capacidad de cobertura de las cuotas del préstamo)',
    howToCalcDscrLink: 'Cómo calcular',
    berMetricLabel: 'Ratio de Equilibrio (BER)',
    berMetricHelp: '(Gastos Operativos + Servicio Anual de Deuda) ÷ EGI — porcentaje del ingreso efectivo consumido por gastos y deuda.',
    beoMetricLabel: 'Ocupación de Equilibrio (BEO)',
    beoMetricHelp: '(Gastos Operativos + Servicio Anual de Deuda) ÷ GPI — porcentaje de ocupación sobre el GPI requerido para cubrir gastos y deuda.',
    howToCalcBerBeoLink: 'Cómo calcular BER y BEO',
    totalInitialCashOutlay: 'Desembolso Inicial Total (Entrada + Cierre)',
    monthlyPaymentPi: 'Cuota Mensual (Principal e Interés)',
    annualDebtServiceLabel: 'Servicio Anual de la Deuda',
    stressComparisonTitle: 'Comparación en Prueba de Estrés (Stress Test)',
    stressAssumptions: 'Supuestos: +5 puntos porcentuales de vacancia, +100 bps de tasa de interés',
    baseUnderwritingCase: 'Escenario Base de Evaluación',
    initialParameters: 'Parámetros Iniciales',
    stressedScenario: 'Escenario Bajo Estrés',
    stressedParameters: 'Vacancia +5 pts | Tasa +100 bps',
    baseNoiLabel: 'NOI Base',
    baseCapRateLabel: 'Cap Rate Base',
    baseMonthlyPmtLabel: 'Cuota Mensual Base',
    baseDebtServiceLabel: 'Servicio de Deuda Base',
    baseCocLabel: 'CoC Base',
    baseDscrLabel: 'DSCR Base',
    baseBerLabel: 'Punto de Equilibrio (BER) Base',
    baseOccupancyLabel: 'Ocupación Base',
    stressedNoiLabel: 'NOI Bajo Estrés',
    stressedCapRateLabel: 'Cap Rate Bajo Estrés',
    stressedMonthlyPmtLabel: 'Cuota Mensual Bajo Estrés',
    stressedDebtServiceLabel: 'Servicio Deuda Bajo Estrés',
    stressedCocLabel: 'CoC Bajo Estrés',
    stressedDscrLabel: 'DSCR Bajo Estrés',
    stressedBerLabel: 'Punto de Equilibrio (BER) Bajo Estrés',
    stressedOccupancyLabel: 'Ocupación Bajo Estrés',
    modalSavedTitle: 'Análisis de Operaciones Guardados',
    modalLoadBtn: 'Cargar Operación',
    infoBannerTitle: '💡 Una sola serie de datos calcula Cap Rate, DSCR y 3 métricas clave a la vez — haz clic para ver detalles',
    pdfBrandName: 'CRE Calculators',
    pdfSummaryTitle: 'Resumen Ejecutivo de Evaluación Inmobiliaria Comercial',
    pdfInputsHeader: 'Parámetros de Entrada de la Evaluación',
    pdfMetricsHeader: 'Métricas Centrales y Comparación de Prueba de Estrés',
    pdfColMetric: 'Métrica Clave',
    pdfColBase: 'Escenario Base',
    pdfColStress: 'Escenario Bajo Estrés (+5 pts Vac, +100 bps Tasa)',
    pdfFooterTagline: 'Generado por CRECalculators.com — Suite Independiente de Evaluación',
    pdfFooterSub: 'Informe de Evaluación Financiera • Revise en línea en https://crecalculators.com/es/tools/deal-analyzer/',
    pdfVerifiedModel: 'Resumen con Fórmulas CRE Estándar',
    pdfConfidential: 'Evaluación de Negocio Confidencial',
  },
  pt: {
    promptDealName: 'Digite um nome para este negócio (ex.: Multifamiliar 24 Unidades):',
    defaultDealPrefix: 'Negócio',
    tag: 'Suite Completa de Análise de Risco Comercial',
    title: 'Deal Analyzer: Análise Abrangente de Investimentos',
    subtitle: 'Unifique Cap Rate, NOI, Cash-on-Cash, DSCR e Break-Even Ratio em uma única modelagem.',
    saveDeal: '💾 Salvar Negócio',
    saveDealTitle: 'Salvar parâmetros atuais localmente no navegador',
    savedCount: (n: number) => `Salvos (${n})`,
    csvExport: '📊 Exportar CSV',
    csvExportTitle: 'Baixar arquivo de dados em formato CSV',
    shareLink: '🔗 Compartilhar Link',
    linkCopied: '✅ Link Copiado',
    exportPdf: 'Exportar PDF',
    generating: 'Gerando...',
    stressTest: 'Teste de Estresse',
    hideStressTest: 'Ocultar Teste de Estresse',
    more: 'Mais ▾',
    sec1Title: '1. Informações do Imóvel e Aquisição',
    purchasePrice: 'Preço de Aquisição ($)',
    closingCosts: 'Custos de Fechamento (%)',
    estClosingCosts: (amt: string) => `Est: ${amt}`,
    sec2Title: '2. Receitas e Despesas Operacionais Anuais',
    gpiLabel: 'Receita Bruta Potencial (GPI, $)',
    gpiHelp: 'Receita bruta anual a 100% de ocupação antes de vacância e custos operacionais.',
    vacancyLabel: 'Perda por Vacância e Inadimplência (%)',
    vacancyHelp: (loss: string) => `Perda estimada por unidades vazias ou inadimplência: -${loss}/ano.`,
    opexLabel: 'Despesas Operacionais Anuais (OpEx, $)',
    opexHelp: 'IPTU/taxas, seguros, reparos, gestão predial (exclui parcelas da dívida).',
    egiLabel: (amt: string) => `Receita Bruta Efetiva (EGI): ${amt}`,
    noiLabel: (amt: string) => `Receita Operacional Líquida (NOI): ${amt}`,
    egiFormulaDesc: 'GPI × (1 − Vacância %) — receita arrecadada real após dedução de vacância e inadimplência.',
    noiFormulaDesc: 'EGI − Despesas Operacionais (OpEx) — receita operacional líquida antes do serviço da dívida e impostos.',
    howToCalcNoi: 'Como calcular o NOI',
    sec3Title: '3. Estrutura de Financiamento e Dívida',
    downPayment: 'Entrada (%)',
    interestRate: 'Taxa de Juros Anual (%)',
    amortTerm: 'Prazo de Amortização (Anos)',
    yearsLabel: (n: number, isMain?: boolean) => `${n} ${isMain ? 'Anos (Padrão)' : 'Anos'}`,
    repaymentMethod: 'Forma de Pagamento:',
    equalInstallment: 'Parcela Fixa (Tabela Price)',
    equalPrincipal: 'Amortização Constante (SAC)',
    ruleEvaluation: 'Avaliação de Regras Demonstrativas',
    badgeStable: 'Avaliação Ilustrativa: Margem Estável',
    badgeNear: 'Avaliação Ilustrativa: Próximo ao Limite',
    badgeElevated: 'Avaliação Ilustrativa: Risco Elevado',
    noiMetricLabel: 'Receita Operacional Líquida (NOI)',
    noiMetricHelp: 'EGI menos despesas operacionais (antes do serviço da dívida)',
    howToCalcNoiLink: 'Como calcular',
    capRateMetricLabel: 'Taxa de Capitalização (Cap Rate)',
    capRateMetricHelp: 'NOI ÷ Preço de Compra (rendimento desalavancado à vista)',
    howToCalcCapRateLink: 'Como calcular',
    cocMetricLabel: 'Retorno Cash-on-Cash (CoC)',
    cocMetricHelp: '(NOI − Serviço Anual da Dívida) ÷ Capital Total Investido',
    howToCalcCocLink: 'Como calcular',
    dscrMetricLabel: 'Cobertura da Dívida (DSCR)',
    dscrMetricHelp: 'NOI ÷ Serviço Anual da Dívida (capacidade de cobertura das parcelas do financiamento)',
    howToCalcDscrLink: 'Como calcular',
    berMetricLabel: 'Ponto de Equilíbrio (BER)',
    berMetricHelp: '(Despesas Operacionais + Serviço Anual da Dívida) ÷ EGI — proporção da receita efetiva consumida por custos operacionais e dívida.',
    beoMetricLabel: 'Ocupação de Equilíbrio (BEO)',
    beoMetricHelp: '(Despesas Operacionais + Serviço Anual da Dívida) ÷ GPI — taxa de ocupação necessária sobre o GPI para cobrir despesas e dívida.',
    howToCalcBerBeoLink: 'Como calcular BER e BEO',
    totalInitialCashOutlay: 'Desembolso Inicial Total (Entrada + Fechamento)',
    monthlyPaymentPi: 'Parcela Mensal (Amortização e Juros)',
    annualDebtServiceLabel: 'Serviço Anual da Dívida',
    stressComparisonTitle: 'Comparação em Teste de Estresse (Stress Test)',
    stressAssumptions: 'Premissas: +5 pontos percentuais de vacância, +100 bps de taxa de juros',
    baseUnderwritingCase: 'Cenário Base de Análise',
    initialParameters: 'Parâmetros Iniciais',
    stressedScenario: 'Cenário Sob Estresse',
    stressedParameters: 'Vacância +5 pts | Juros +100 bps',
    baseNoiLabel: 'NOI Base',
    baseCapRateLabel: 'Cap Rate Base',
    baseMonthlyPmtLabel: 'Parcela Mensal Base',
    baseDebtServiceLabel: 'Serviço de Dívida Base',
    baseCocLabel: 'CoC Base',
    baseDscrLabel: 'DSCR Base',
    baseBerLabel: 'Ponto de Equilíbrio (BER) Base',
    baseOccupancyLabel: 'Ocupação Base',
    stressedNoiLabel: 'NOI Sob Estresse',
    stressedCapRateLabel: 'Cap Rate Sob Estresse',
    stressedMonthlyPmtLabel: 'Parcela Mensal Sob Estresse',
    stressedDebtServiceLabel: 'Serviço Dívida Sob Estresse',
    stressedCocLabel: 'CoC Sob Estresse',
    stressedDscrLabel: 'DSCR Sob Estresse',
    stressedBerLabel: 'Ponto de Equilíbrio (BER) Sob Estresse',
    stressedOccupancyLabel: 'Ocupação Sob Estresse',
    modalSavedTitle: 'Análises de Investimento Salvas',
    modalLoadBtn: 'Carregar Negócio',
    infoBannerTitle: '💡 Um único conjunto de dados calcula Cap Rate, DSCR e mais 3 métricas principais de uma vez — clique para ver detalhes',
    pdfBrandName: 'CRE Calculators',
    pdfSummaryTitle: 'Resumo Executivo de Análise Imobiliária Comercial',
    pdfInputsHeader: 'Parâmetros de Entrada da Análise',
    pdfMetricsHeader: 'Métricas Principais e Teste de Estresse Comparativo',
    pdfColMetric: 'Métrica Principal',
    pdfColBase: 'Cenário Base',
    pdfColStress: 'Cenário Sob Estresse (+5 pts Vac, +100 bps Juros)',
    pdfFooterTagline: 'Gerado por CRECalculators.com — Suite Independente de Análise',
    pdfFooterSub: 'Relatório de Análise Financeira • Revise online em https://crecalculators.com/pt/tools/deal-analyzer/',
    pdfVerifiedModel: 'Resumo com Fórmulas CRE Padrão',
    pdfConfidential: 'Avaliação Confidencial de Negócio',
  },
};

export function getDealAnalyzerTranslations(locale: string): DealAnalyzerTranslations {
  return dealAnalyzerTranslations[locale] || dealAnalyzerTranslations.en;
}
