export type Locale = 'en' | 'zh' | 'es' | 'pt';

export interface UiTranslations {
  home: {
    heroTag: string;
    cocLeadIn: string;
    cocLinkText: string;
    ctaDealAnalyzer: string;
    ctaCapRate: string;
    trustText: string;
    onboardingNavAria: string;
    onboardingTitle: string;
    onboardingSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    launchCalculator: string;
    dealAnalyzerHubTitle: string;
    dealAnalyzerHubDesc: string;
    runAnalysis: string;
    viewAllGuides: string;
    whyUsSubtitle: string;
  };
  preview: {
    title: string;
    sampleBadge: string;
    sampleSubtitle: string;
    scenarioAria: string;
    baseCaseBtn: string;
    stressCaseBtn: string;
    baseAssumption: string;
    stressAssumption: string;
    diagnosticLabel: string;
    purchasePrice: string;
    annualNoi: string;
    dscrLabel: string;
    dscrFormula: string;
    berLabel: string;
    beoLabel: string;
    ctaAria: string;
    ctaText: string;
    figcaption: string;
  };
  footer: {
    brandDesc: string;
    calculatorsHeader: string;
    fullUnderwriting: string;
    guidesHeader: string;
    glossaryLink: string;
    benchmarksLink: string;
    estimateNoiLink: string;
    exchange1031Link: string;
    underwriteLink: string;
    companyHeader: string;
    aboutUs: string;
    methodology: string;
    contactUs: string;
    privacy: string;
    terms: string;
    disclaimer: string;
  };
  capRateCalc: {
    interactiveBadge: string;
    title: string;
    subtitle: string;
    modeGroupAria: string;
    modeForward: string;
    modeReverse: string;
    priceLabel: string;
    noiLabel: string;
    noiHelp: string;
    noiHelpLink: string;
    targetCapRateLabel: string;
    listingPriceLabel: string;
    summaryTitle: string;
    shareDeal: string;
    copied: string;
    copyTitle: string;
    capRateResultLabel: string;
    purchasePriceRow: string;
    annualNoiRow: string;
    monthlyNoiRow: string;
    marketInsightTitle: string;
    marketInsightHigh: string;
    marketInsightCorePlus: string;
    marketInsightPrime: string;
    maxPriceLabel: string;
    listingPriceRow: string;
    differenceRow: string;
    overpricedBy: string;
    underpricedBy: string;
    targetAlert: (target: number, maxPriceFormatted: string) => string;
    nextStepLabel: string;
    nextStepCta: string;
  };
  dscrCalc: {
    toolBadge: string;
    title: string;
    subtitle: string;
    noiLabel: string;
    debtModeLabel: string;
    annualMode: string;
    monthlyMode: string;
    annualHelp: string;
    monthlyHelp: (annualDebtFormatted: string) => string;
    benchmarkHeader: string;
    benchmarkTier1: string;
    benchmarkTier2: string;
    benchmarkTier3: string;
    summaryTitle: string;
    shareDeal: string;
    copied: string;
    copyTitle: string;
    dscrCardTitle: string;
    annualNoiRow: string;
    annualDebtRow: string;
    cashCushionRow: string;
    maxDebtRow: string;
    tipText: string;
    leadBadge: string;
    leadHeading: string;
    leadSubtitle: (dscrFormatted: string) => string;
    leadSuccessTitle: string;
    leadSuccessSubtitle: string;
    leadPropertyTypeLabel: string;
    leadLoanAmountLabel: string;
    leadEmailLabel: string;
    leadSubmitBtn: string;
    leadTrustNotes: string;
  };
}

export const uiTranslations: Record<Locale, UiTranslations> = {
  en: {
    home: {
      heroTag: 'US Commercial Real Estate Underwriting Suite',
      cocLeadIn: 'Looking to measure your leveraged equity return? Jump straight to our ',
      cocLinkText: 'Cash-on-Cash Return Calculator',
      ctaDealAnalyzer: 'Run a Free Deal Analysis',
      ctaCapRate: 'Cap Rate Calculator',
      trustText: 'Free · No signup · Calculations run in your browser · PDF & CSV export',
      onboardingNavAria: 'New to CRE starter path',
      onboardingTitle: 'New to CRE? Start here',
      onboardingSubtitle: '3 steps to analyze your first deal',
      step1Title: '1. Understand NOI',
      step1Desc: 'Net Operating Income: property rent minus vacancy and operating expenses, before any loan payments.',
      step2Title: '2. Compare with Cap Rate',
      step2Desc: 'Capitalization Rate (NOI ÷ Price): unleveraged all-cash annual yield to compare price and return across deals.',
      step3Title: '3. Test Financing in Deal Analyzer',
      step3Desc: 'Model loan terms and stress scenarios to check DSCR (Debt Service Coverage Ratio: how many times NOI covers annual loan payments) and BER (Break-Even Ratio: share of effective gross income consumed by operating expenses and debt service).',
      launchCalculator: 'Launch Calculator',
      dealAnalyzerHubTitle: 'Comprehensive Deal Analyzer',
      dealAnalyzerHubDesc: 'Combine all calculations into one master view with stress testing.',
      runAnalysis: 'Run Analysis',
      viewAllGuides: 'View All Guides',
      whyUsSubtitle: 'Built around numbers, transparent calculations, and market clarity.',
    },
    preview: {
      title: 'Deal Analyzer Preview',
      sampleBadge: 'Sample',
      sampleSubtitle: 'Sample: 24-Unit Multifamily',
      scenarioAria: 'Scenario switcher',
      baseCaseBtn: 'Base Case',
      stressCaseBtn: 'Stress Case',
      baseAssumption: '6.5% interest · 25-year amortization · 5% vacancy',
      stressAssumption: '+5 percentage points vacancy and +100 bps interest rate (7.5% interest · 10% vacancy)',
      diagnosticLabel: 'Illustrative Rule Evaluation',
      purchasePrice: 'Purchase Price',
      annualNoi: 'Annual NOI',
      dscrLabel: 'DSCR (Debt Coverage)',
      dscrFormula: 'NOI ÷ Annual Debt',
      berLabel: 'Break-Even Ratio (BER)',
      beoLabel: 'Occupancy (BEO)',
      ctaAria: 'Launch Full Deal Analyzer Suite',
      ctaText: 'Launch Full Deal Analyzer',
      figcaption: 'Deal Analyzer preview displaying unified base and stress case scenario modeling with +5 percentage points vacancy and +100 bps interest rate.',
    },
    footer: {
      brandDesc: 'Commercial real estate investment calculation tools for investors, brokers, and CRE professionals.',
      calculatorsHeader: 'Calculators',
      fullUnderwriting: 'Full Underwriting',
      guidesHeader: 'Guides',
      glossaryLink: 'CRE Glossary & Formulas',
      benchmarksLink: 'Cap Rate Benchmarks',
      estimateNoiLink: 'How to Estimate NOI',
      exchange1031Link: '1031 Exchange Process',
      underwriteLink: 'How to Underwrite a Deal',
      companyHeader: 'Company & Legal',
      aboutUs: 'About Us',
      methodology: 'Methodology',
      contactUs: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      disclaimer: 'Disclaimer: The tools and information on this site are provided for financial estimation purposes only and do not constitute legal, tax, or professional investment advice. Always consult a qualified CPA or licensed real estate attorney before executing transactions.',
    },
    capRateCalc: {
      interactiveBadge: 'Interactive Tool',
      title: 'Cap Rate Calculator',
      subtitle: 'Select mode and enter values for instant results',
      modeGroupAria: 'Calculation mode switcher',
      modeForward: 'Calculate Cap Rate',
      modeReverse: 'Reverse Purchase Price',
      priceLabel: 'Property Purchase Price ($)',
      noiLabel: 'Annual Net Operating Income (NOI)',
      noiHelp: 'NOI = Effective Gross Income (EGI) minus operating expenses (property tax, insurance, maintenance, management), before loan payments and income taxes.',
      noiHelpLink: 'How to calculate NOI (step-by-step calculator)',
      targetCapRateLabel: 'Target Cap Rate (%)',
      listingPriceLabel: 'Listing Price for Comparison (Optional)',
      summaryTitle: 'Calculation Summary',
      shareDeal: 'Share Deal',
      copied: 'Link Copied!',
      copyTitle: 'Copy link with parameters',
      capRateResultLabel: 'Capitalization Rate',
      purchasePriceRow: 'Purchase Price:',
      annualNoiRow: 'Annual NOI:',
      monthlyNoiRow: 'Monthly NOI:',
      marketInsightTitle: 'Market Insight:',
      marketInsightHigh: 'High yield tier (typically secondary markets or higher-risk profile assets).',
      marketInsightCorePlus: 'Standard core-plus commercial range for primary/secondary markets.',
      marketInsightPrime: 'Prime core tier with lower immediate yield, focusing on stability & appreciation.',
      maxPriceLabel: 'Max Acceptable Purchase Price',
      listingPriceRow: 'Listing Price:',
      differenceRow: 'Price Difference:',
      overpricedBy: 'Overpriced by ',
      underpricedBy: 'Underpriced by ',
      targetAlert: (target, maxPrice) => `To achieve a ${target}% cap rate, your maximum purchase price should not exceed ${maxPrice}.`,
      nextStepLabel: 'Next step: Add loan terms & stress tests',
      nextStepCta: 'Test Financing in Deal Analyzer',
    },
    dscrCalc: {
      toolBadge: 'DSCR Underwriting Tool',
      title: 'Debt Service Coverage Ratio (DSCR) Calculator',
      subtitle: 'Evaluate net operating income against annual loan payments',
      noiLabel: 'Annual Net Operating Income (NOI)',
      debtModeLabel: 'Debt Service Input Mode',
      annualMode: 'Annual',
      monthlyMode: 'Monthly',
      annualHelp: 'Total annual principal and interest payments',
      monthlyHelp: (amt) => `Equivalent Annual Debt Service: ${amt} / year`,
      benchmarkHeader: 'Standard Commercial Bank Underwriting Tiers:',
      benchmarkTier1: 'Standard Commercial Bank Minimum Threshold',
      benchmarkTier2: 'Acceptable for prime Long-term Net Lease/Government tenants',
      benchmarkTier3: 'Distressed / Negative Cash Flow',
      summaryTitle: 'Underwriting Analysis',
      shareDeal: 'Share Deal',
      copied: 'Link Copied!',
      copyTitle: 'Copy link with parameters',
      dscrCardTitle: 'Debt Service Coverage Ratio (DSCR)',
      annualNoiRow: 'Annual NOI:',
      annualDebtRow: 'Annual Debt Service:',
      cashCushionRow: 'Annual Pre-Tax Cushion:',
      maxDebtRow: 'Max Allowable Debt for 1.25x:',
      tipText: 'Tip: Higher DSCR reflects a larger income cushion against tenant vacancy or rate increases.',
      leadBadge: 'Pre-Qualified Commercial Financing',
      leadHeading: 'Connect with Top-Rated DSCR Lenders for This Deal',
      leadSubtitle: (dscr) => `Based on your calculated ${dscr}x DSCR, your transaction aligns with commercial lender underwriting guidelines. Request non-binding quotes from vetted national CRE and portfolio lenders.`,
      leadSuccessTitle: 'Quote Request Received!',
      leadSuccessSubtitle: 'Partner commercial lenders will review your deal parameters and follow up with tailored financing terms.',
      leadPropertyTypeLabel: 'Property Type',
      leadLoanAmountLabel: 'Estimated Loan Amount ($)',
      leadEmailLabel: 'Business Email for Quotes',
      leadSubmitBtn: 'Request Lender Term Sheets',
      leadTrustNotes: 'No credit impact · 100% Free · Direct lender matching only',
    },
  },
  zh: {
    home: {
      heroTag: '美国商业地产 (CRE) 专业投资决策工具',
      cocLeadIn: '正在分析加杠杆后的真实回报？直接使用我们的 ',
      cocLinkText: 'Cash-on-Cash 现金回报率计算器',
      ctaDealAnalyzer: '免费分析一笔交易',
      ctaCapRate: 'Cap Rate 计算器',
      trustText: '免费使用 · 无需注册 · 数据在浏览器本地计算 · 支持 PDF 与 CSV 导出',
      onboardingNavAria: '商业地产新手入门路径',
      onboardingTitle: '商业地产新手？从这里开始 (New to CRE? Start here)',
      onboardingSubtitle: '3 步看懂第一笔商业地产交易',
      step1Title: '1. 先认识 NOI',
      step1Desc: '净营业收入 (Net Operating Income)：租金扣除空置与日常运营支出后、还房贷前的真实物业年收入。',
      step2Title: '2. 用 Cap Rate 比价格与收益',
      step2Desc: '资本化率 (Capitalization Rate = NOI ÷ 购买价)：假设全款买下时的无杠杆年收益率，横向对比价格与收益。',
      step3Title: '3. 用 Deal Analyzer 看融资与压力情景',
      step3Desc: '加入贷款与压力情景，检验 DSCR（偿债覆盖率，Debt Service Coverage Ratio：NOI 够付几倍年房贷）与 BER（收支平衡比率，Break-Even Ratio：运营支出加房贷占有效毛收入的比例）。',
      launchCalculator: '立即开始计算',
      dealAnalyzerHubTitle: '综合交易分析',
      dealAnalyzerHubDesc: '在一个工具中合并所有测算并进行压力测试。',
      runAnalysis: '运行分析',
      viewAllGuides: '查看所有指南',
      whyUsSubtitle: '不写泛泛攻略，只做专业可执行的判断工具',
    },
    preview: {
      title: 'Deal Analyzer 预览',
      sampleBadge: 'Sample',
      sampleSubtitle: '示例资产：24 单元多户公寓',
      scenarioAria: '情景切换',
      baseCaseBtn: '基准情景',
      stressCaseBtn: '压力情景',
      baseAssumption: '6.5% 利率 · 25 年摊销 · 5% 空置率',
      stressAssumption: '空置率增加5个百分点，贷款利率增加100个基点 (7.5% 利率 / 10% 空置率)',
      diagnosticLabel: '全案示例规则诊断',
      purchasePrice: '购买价格',
      annualNoi: '净营业收入 NOI',
      dscrLabel: 'DSCR 偿债覆盖率',
      dscrFormula: 'NOI ÷ 年房贷本息 (NOI ÷ Annual Debt)',
      berLabel: '收支平衡比 BER (Break-Even Ratio)',
      beoLabel: '盈亏入住率 BEO',
      ctaAria: '打开完整 Deal Analyzer 工具',
      ctaText: '进入 Deal Analyzer 完整实测',
      figcaption: 'Deal Analyzer 商业地产综合尽调工具预览：通过统一计算核心呈现基准情景与压力情景对比（压力情景：空置率增加5个百分点，利率增加100个基点）。',
    },
    footer: {
      brandDesc: '专注于美国商业地产 (CRE) 投资决策的数字分析与计算工具站，帮助投资者与经纪人快速做数字判断。',
      calculatorsHeader: '计算器导航',
      fullUnderwriting: '综合尽调',
      guidesHeader: '实操指南',
      glossaryLink: 'CRE 核心指标词汇表',
      benchmarksLink: 'Cap Rate全美基准',
      estimateNoiLink: '怎么估算NOI',
      exchange1031Link: '1031 Exchange流程',
      underwriteLink: '商业地产交易尽调',
      companyHeader: '关于与条款',
      aboutUs: '关于我们',
      methodology: '公式与方法论',
      contactUs: '联系我们',
      privacy: '隐私政策',
      terms: '服务条款',
      disclaimer: '免责声明：本站所有计算器与示例仅供财务估算与参考，不构成任何法律、税务或专业投资建议。商业地产投资具有风险，决策前请咨询注册会计师（CPA）及专业执业律师。',
    },
    capRateCalc: {
      interactiveBadge: '实时交互工具',
      title: 'Cap Rate 实时计算器',
      subtitle: '选择计算方向，输入数字实时出结果',
      modeGroupAria: '计算模式切换',
      modeForward: '正算 Cap Rate',
      modeReverse: '反算购买价',
      priceLabel: '物业购买价格 (Purchase Price)',
      noiLabel: '年净营业收入 (Annual NOI)',
      noiHelp: 'NOI = 有效毛收入 (EGI) − 日常运营支出（地税、保险、维修、物业管理费等），不扣除房贷月供与所得税。',
      noiHelpLink: '不知道如何计算 NOI？用 NOI 计算器分步算出 (How to calculate NOI)',
      targetCapRateLabel: '目标 Cap Rate (%)',
      listingPriceLabel: '对比：卖方挂牌价格（选填）',
      summaryTitle: '计算结果分析',
      shareDeal: '分享测算',
      copied: '链接已复制！',
      copyTitle: '复制带参数的测算链接',
      capRateResultLabel: '资本化率 (Cap Rate)',
      purchasePriceRow: '购买价格:',
      annualNoiRow: '年 NOI:',
      monthlyNoiRow: '月平均 NOI:',
      marketInsightTitle: '市场快评：',
      marketInsightHigh: '高收益率区间（通常对应次级市场或高风险/更高现金流资产）。',
      marketInsightCorePlus: '稳健主流商业地产区间（核心与次核心城市常见交割水平）。',
      marketInsightPrime: '核心低收益率区间（核心城市Prime location，注重资产保值）。',
      maxPriceLabel: '最高可接受购买价格',
      listingPriceRow: '卖方挂牌价格:',
      differenceRow: '价格额度差距:',
      overpricedBy: '高出 ',
      underpricedBy: '低于 ',
      targetAlert: (target, maxPrice) => `若要达到 ${target}% 的目标Cap Rate，最高出价不应超过 ${maxPrice}。`,
      nextStepLabel: '下一步：加入贷款与压力情景',
      nextStepCta: '进入 Deal Analyzer 测融资',
    },
    dscrCalc: {
      toolBadge: '偿债覆盖率计算',
      title: 'DSCR (偿债覆盖率) 实时计算器',
      subtitle: '对照商业银行审核标准，评估物业净收入对债务本息的覆盖安全度',
      noiLabel: '年净营业收入 (Annual NOI)',
      debtModeLabel: '还贷计算方式',
      annualMode: '按年输入',
      monthlyMode: '按月输入',
      annualHelp: '包含本金及利息的全年偿债总额 (Annual Principal & Interest)',
      monthlyHelp: (amt) => `折算年度还贷: ${amt} / 年`,
      benchmarkHeader: '商业银行通用审核标准 (Lender Benchmarks):',
      benchmarkTier1: '常规商业银行标准批准线',
      benchmarkTier2: '优质长期单租户 (NNN) 或政府租户特别批准',
      benchmarkTier3: '入不敷出 (无法通过常规审核)',
      summaryTitle: '偿债能力分析',
      shareDeal: '分享测算',
      copied: '链接已复制！',
      copyTitle: '复制带参数的测算链接',
      dscrCardTitle: 'DSCR 偿债覆盖率',
      annualNoiRow: '年 NOI:',
      annualDebtRow: '年度还贷总额:',
      cashCushionRow: '年税前现金缓冲 (Cash Cushion):',
      maxDebtRow: '按 1.25x 标准推算最高允许年还贷:',
      tipText: '提示：DSCR 越高，表明物业抵御租客空置和利息上升的能力越强，银行给予的利率优惠也通常更大。',
      leadBadge: '商业贷款直通车',
      leadHeading: '获取优质商业地产 DSCR 贷款机构报价方案',
      leadSubtitle: (dscr) => `基于当前测算的 ${dscr}x 偿债覆盖率，您的物业已满足多数商业银行与非银机构的核心准入要求。提交参数即可快速匹配最优利率与杠杆方案。`,
      leadSuccessTitle: '意向已提交！',
      leadSuccessSubtitle: '我们的合作放贷机构团队将根据您的物业类型与 DSCR 指标准备定制报价单。',
      leadPropertyTypeLabel: '物业类型',
      leadLoanAmountLabel: '预计贷款金额 ($)',
      leadEmailLabel: '接收报价企业邮箱',
      leadSubmitBtn: '获取贷款方案与利率报价',
      leadTrustNotes: '无需查信用 · 100% 免费匹配 · 直接对接放贷机构',
    },
  },
  es: {
    home: {
      heroTag: 'Suite Profesional de Suscripción en Bienes Raíces Comerciales (CRE)',
      cocLeadIn: '¿Desea medir el retorno de su capital con apalancamiento? Acceda a nuestra ',
      cocLinkText: 'Calculadora de Cash-on-Cash Return',
      ctaDealAnalyzer: 'Analizar una Propiedad Gratis',
      ctaCapRate: 'Calculadora de Cap Rate',
      trustText: '100% Gratuito · Sin registro · Cálculos en su navegador · Exportación en PDF y CSV',
      onboardingNavAria: 'Ruta de iniciación en bienes raíces comerciales',
      onboardingTitle: '¿Nuevo en Bienes Raíces Comerciales? Comience aquí (New to CRE? Start here)',
      onboardingSubtitle: '3 pasos para analizar su primera inversión',
      step1Title: '1. Entender el NOI',
      step1Desc: 'Ingreso Operativo Neto (Net Operating Income): ingresos por rentas menos pérdidas por vacancia y gastos operativos, antes de la hipoteca.',
      step2Title: '2. Comparar con Cap Rate',
      step2Desc: 'Tasa de Capitalización (NOI ÷ Precio): rendimiento anual sin deuda pagado al contado para comparar precios y rentabilidad entre inmuebles.',
      step3Title: '3. Evaluar Financiamiento en Deal Analyzer',
      step3Desc: 'Modele términos del préstamo y escenarios de estrés para verificar el DSCR (Debt Service Coverage Ratio: cobertura de deuda) y el BER (Break-Even Ratio: proporción de ingresos absorbida por gastos y deuda).',
      launchCalculator: 'Abrir Calculadora',
      dealAnalyzerHubTitle: 'Análisis Integral de Inversión',
      dealAnalyzerHubDesc: 'Combine todos los cálculos en un único panel maestro con pruebas de estrés financiero.',
      runAnalysis: 'Iniciar Análisis',
      viewAllGuides: 'Ver Todas las Guías',
      whyUsSubtitle: 'Diseñado con rigor numérico, cálculos transparentes y parámetros del mercado.',
    },
    preview: {
      title: 'Vista Previa de Deal Analyzer',
      sampleBadge: 'Ejemplo',
      sampleSubtitle: 'Propiedad de ejemplo: Multifamiliar de 24 Unidades',
      scenarioAria: 'Cambiar escenario',
      baseCaseBtn: 'Caso Base',
      stressCaseBtn: 'Escenario de Estrés',
      baseAssumption: '6.5% interés · 25 años de amortización · 5% vacancia',
      stressAssumption: '+5 puntos porcentuales de vacancia y +100 pb en tasa de interés (7.5% interés · 10% vacancia)',
      diagnosticLabel: 'Evaluación de Reglas de Muestra',
      purchasePrice: 'Precio de Compra',
      annualNoi: 'NOI Anual (Ingreso Neto)',
      dscrLabel: 'DSCR (Cobertura de Deuda)',
      dscrFormula: 'NOI ÷ Servicio Anual de Deuda (NOI ÷ Annual Debt)',
      berLabel: 'Punto de Equilibrio (Break-Even Ratio - BER)',
      beoLabel: 'Ocupación Mínima (BEO)',
      ctaAria: 'Abrir Suite Completa de Deal Analyzer',
      ctaText: 'Abrir Deal Analyzer Completo',
      figcaption: 'Vista previa de Deal Analyzer con modelado de caso base y escenario de estrés (+5 puntos porcentuales de vacancia y +100 pb en tasa).',
    },
    footer: {
      brandDesc: 'Herramientas profesionales de análisis y cálculo para inversiones en bienes raíces comerciales (CRE), diseñadas para inversionistas y corredores.',
      calculatorsHeader: 'Calculadoras',
      fullUnderwriting: 'Análisis Completo',
      guidesHeader: 'Guías y Metodología',
      glossaryLink: 'Glosario y Fórmulas CRE',
      benchmarksLink: 'Puntos de Referencia Cap Rate',
      estimateNoiLink: 'Cómo Estimar el NOI',
      exchange1031Link: 'Proceso de Intercambio 1031',
      underwriteLink: 'Cómo Suscribir un Negocio Inmobiliario',
      companyHeader: 'Empresa y Legal',
      aboutUs: 'Acerca de Nosotros',
      methodology: 'Metodología y Fórmulas',
      contactUs: 'Contacto',
      privacy: 'Política de Privacidad',
      terms: 'Términos de Uso',
      disclaimer: 'Descargo de responsabilidad: Todas las calculadoras y ejemplos en este sitio se ofrecen únicamente con fines de estimación financiera y no constituyen asesoramiento legal, fiscal o de inversión profesional. Siempre consulte a un contador público certificado (CPA) o abogado calificado antes de tomar decisiones.',
    },
    capRateCalc: {
      interactiveBadge: 'Herramienta Interactiva',
      title: 'Calculadora de Cap Rate en Tiempo Real',
      subtitle: 'Seleccione el modo e ingrese valores para ver resultados al instante',
      modeGroupAria: 'Cambiar modo de cálculo',
      modeForward: 'Calcular Cap Rate',
      modeReverse: 'Calcular Precio Máximo',
      priceLabel: 'Precio de Compra de la Propiedad ($)',
      noiLabel: 'Ingreso Operativo Neto Anual (NOI)',
      noiHelp: 'NOI = Ingreso Efectivo Bruto (EGI) menos gastos operativos (impuestos sobre la propiedad, seguros, mantenimiento, administración), antes del pago de préstamos e impuestos sobre la renta.',
      noiHelpLink: '¿No sabe cómo calcular el NOI? Utilice la Calculadora de NOI paso a paso (How to calculate NOI)',
      targetCapRateLabel: 'Cap Rate Objetivo (%)',
      listingPriceLabel: 'Precio de Lista del Vendedor para Comparación (Opcional)',
      summaryTitle: 'Resumen del Cálculo',
      shareDeal: 'Compartir Análisis',
      copied: '¡Enlace copiado!',
      copyTitle: 'Copiar enlace con parámetros',
      capRateResultLabel: 'Tasa de Capitalización (Cap Rate)',
      purchasePriceRow: 'Precio de Compra:',
      annualNoiRow: 'NOI Anual:',
      monthlyNoiRow: 'NOI Mensual Promedio:',
      marketInsightTitle: 'Perspectiva de Mercado:',
      marketInsightHigh: 'Rango de alto rendimiento (comúnmente mercados secundarios o activos de mayor perfil de riesgo).',
      marketInsightCorePlus: 'Rango institucional estándar para mercados primarios y secundarios.',
      marketInsightPrime: 'Ubicaciones prime con menor rendimiento inmediato, enfocadas en preservación de capital y plusvalía.',
      maxPriceLabel: 'Precio Máximo de Compra Aceptable',
      listingPriceRow: 'Precio de Lista:',
      differenceRow: 'Diferencia de Precio:',
      overpricedBy: 'Sobrevaluado por ',
      underpricedBy: 'Con descuento de ',
      targetAlert: (target, maxPrice) => `Para alcanzar un Cap Rate objetivo del ${target}%, su oferta máxima no debe exceder ${maxPrice}.`,
      nextStepLabel: 'Siguiente paso: Añadir financiamiento y pruebas de estrés',
      nextStepCta: 'Probar Financiamiento en Deal Analyzer',
    },
    dscrCalc: {
      toolBadge: 'Herramienta de Cobertura DSCR',
      title: 'Calculadora de Cobertura de Deuda (DSCR)',
      subtitle: 'Evalúe los ingresos operativos frente al servicio anual de la deuda según parámetros bancarios',
      noiLabel: 'Ingreso Operativo Neto Anual (NOI)',
      debtModeLabel: 'Modo de Ingreso de Deuda',
      annualMode: 'Anual',
      monthlyMode: 'Mensual',
      annualHelp: 'Pagos totales anuales de capital e intereses',
      monthlyHelp: (amt) => `Servicio Anual de Deuda Equivalente: ${amt} / año`,
      benchmarkHeader: 'Parámetros Estándar de Bancos Comerciales:',
      benchmarkTier1: 'Umbral mínimo estándar de aprobación bancaria',
      benchmarkTier2: 'Aceptable para inquilinos con contratos Net Lease (NNN) a largo plazo o gubernamentales',
      benchmarkTier3: 'Flujo de caja negativo / Riesgo alto de impago',
      summaryTitle: 'Análisis de Cobertura',
      shareDeal: 'Compartir Análisis',
      copied: '¡Enlace copiado!',
      copyTitle: 'Copiar enlace con parámetros',
      dscrCardTitle: 'Ratio de Cobertura de Deuda (DSCR)',
      annualNoiRow: 'NOI Anual:',
      annualDebtRow: 'Servicio Anual de la Deuda:',
      cashCushionRow: 'Colchón de Flujo Libre Antes de Impuestos:',
      maxDebtRow: 'Deuda Máxima Permitida para 1.25x:',
      tipText: 'Consejo: Un DSCR más alto refleja un mayor colchón de ingresos frente a desocupación o aumentos en tasas de interés.',
      leadBadge: 'Financiamiento Comercial Precalificado',
      leadHeading: 'Conecte con Prestamistas DSCR Comerciales para esta Operación',
      leadSubtitle: (dscr) => `Con base en su ratio DSCR calculado de ${dscr}x, su propiedad cumple con los criterios de financiamiento bancario. Solicite cotizaciones sin compromiso con prestamistas institucionales verificados.`,
      leadSuccessTitle: '¡Solicitud de Cotización Recibida!',
      leadSuccessSubtitle: 'Las entidades bancarias aliadas evaluarán los parámetros de su transacción para presentarle ofertas de financiamiento.',
      leadPropertyTypeLabel: 'Tipo de Propiedad',
      leadLoanAmountLabel: 'Monto Estimado del Préstamo ($)',
      leadEmailLabel: 'Correo Electrónico para Cotizaciones',
      leadSubmitBtn: 'Solicitar Términos y Cotizaciones',
      leadTrustNotes: 'Sin impacto crediticio · 100% Gratuito · Conexión directa con entidades',
    },
  },
  pt: {
    home: {
      heroTag: 'Suite Profissional de Investimento Imobiliário Comercial (CRE)',
      cocLeadIn: 'Deseja calcular o retorno do capital próprio alavancado? Acesse nossa ',
      cocLinkText: 'Calculadora de Retorno Cash-on-Cash',
      ctaDealAnalyzer: 'Analisar um Imóvel Grátis',
      ctaCapRate: 'Calculadora de Cap Rate',
      trustText: '100% Gratuito · Sem cadastro · Cálculos no navegador · Exportação em PDF e CSV',
      onboardingNavAria: 'Trilha para iniciantes em imóveis comerciais',
      onboardingTitle: 'Novo em Imóveis Comerciais? Comece aqui (New to CRE? Start here)',
      onboardingSubtitle: '3 passos para analisar seu primeiro investimento',
      step1Title: '1. Entender o NOI',
      step1Desc: 'Receita Operacional Líquida (Net Operating Income): aluguéis menos vacância e despesas operacionais, antes de pagar a dívida.',
      step2Title: '2. Comparar com Cap Rate',
      step2Desc: 'Taxa de Capitalização (NOI ÷ Preço): rentabilidade anual à vista sem alavancagem para comparar preço e retorno entre imóveis.',
      step3Title: '3. Testar Financiamento no Deal Analyzer',
      step3Desc: 'Modele financiamento e cenários de estresse para checar o DSCR (Debt Service Coverage Ratio: cobertura da dívida pelo NOI) e BER (Break-Even Ratio: proporção da receita absorvida por despesas e dívida).',
      launchCalculator: 'Abrir Calculadora',
      dealAnalyzerHubTitle: 'Análise Abrangente de Investimento',
      dealAnalyzerHubDesc: 'Combine todos os cálculos em uma única visão mestre com testes de estresse.',
      runAnalysis: 'Iniciar Análise',
      viewAllGuides: 'Ver Todos os Guias',
      whyUsSubtitle: 'Desenvolvido com rigor financeiro, cálculos transparentes e clareza de mercado.',
    },
    preview: {
      title: 'Prévia do Deal Analyzer',
      sampleBadge: 'Exemplo',
      sampleSubtitle: 'Imóvel demonstrativo: Multifamiliar de 24 Unidades',
      scenarioAria: 'Alternar cenário',
      baseCaseBtn: 'Cenário Base',
      stressCaseBtn: 'Cenário de Estresse',
      baseAssumption: '6,5% juros · 25 anos de amortização · 5% vacância',
      stressAssumption: '+5 pontos percentuais de vacância e +100 bps de taxa (7,5% juros · 10% vacância)',
      diagnosticLabel: 'Avaliação de Regras Demonstrativas',
      purchasePrice: 'Preço de Compra',
      annualNoi: 'NOI Anual (Receita Líquida)',
      dscrLabel: 'DSCR (Cobertura da Dívida)',
      dscrFormula: 'NOI ÷ Serviço Anual da Dívida (NOI ÷ Annual Debt)',
      berLabel: 'Ponto de Equilíbrio (Break-Even Ratio - BER)',
      beoLabel: 'Ocupação Mínima (BEO)',
      ctaAria: 'Abrir Suite Completa de Deal Analyzer',
      ctaText: 'Abrir Deal Analyzer Completo',
      figcaption: 'Prévia do Deal Analyzer exibindo modelagem unificada de cenário base e estresse (+5 pontos percentuais de vacância e +100 bps de taxa).',
    },
    footer: {
      brandDesc: 'Ferramentas profissionais de análise e cálculo para investimentos em imóveis comerciais (CRE), projetadas para investidores e corretores.',
      calculatorsHeader: 'Calculadoras',
      fullUnderwriting: 'Análise Completa',
      guidesHeader: 'Guias e Metodologia',
      glossaryLink: 'Glossário e Fórmulas CRE',
      benchmarksLink: 'Padrões de Mercado Cap Rate',
      estimateNoiLink: 'Como Estimar o NOI',
      exchange1031Link: 'Processo de Intercâmbio 1031',
      underwriteLink: 'Como Analisar um Investimento Imobiliário',
      companyHeader: 'Empresa e Termos Legais',
      aboutUs: 'Sobre Nós',
      methodology: 'Metodologia e Fórmulas',
      contactUs: 'Contato',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Uso',
      disclaimer: 'Aviso Legal: Todas as calculadoras e exemplos neste site são fornecidos apenas para fins de estimativa financeira e não constituem consultoria jurídica, tributária ou de investimento profissional. Sempre consulte um contador certificado (CPA) ou advogado antes de fechar negócios.',
    },
    capRateCalc: {
      interactiveBadge: 'Ferramenta Interativa',
      title: 'Calculadora de Cap Rate em Tempo Real',
      subtitle: 'Selecione o modo e insira os valores para ver resultados em tempo real',
      modeGroupAria: 'Alternar modo de cálculo',
      modeForward: 'Calcular Cap Rate',
      modeReverse: 'Calcular Preço Máximo',
      priceLabel: 'Preço de Aquisição do Imóvel ($)',
      noiLabel: 'Receita Operacional Líquida Anual (NOI)',
      noiHelp: 'NOI = Receita Bruta Efetiva (EGI) menos despesas operacionais (IPTU/taxas, seguros, manutenção, gestão predial), antes do pagamento de dívidas e impostos.',
      noiHelpLink: 'Não sabe como calcular o NOI? Use a Calculadora de NOI passo a passo (How to calculate NOI)',
      targetCapRateLabel: 'Cap Rate Alvo (%)',
      listingPriceLabel: 'Preço Anunciado pelo Vendedor para Comparação (Opcional)',
      summaryTitle: 'Resumo do Cálculo',
      shareDeal: 'Compartilhar Análise',
      copied: 'Link copiado!',
      copyTitle: 'Copiar link com parâmetros',
      capRateResultLabel: 'Taxa de Capitalização (Cap Rate)',
      purchasePriceRow: 'Preço de Compra:',
      annualNoiRow: 'NOI Anual:',
      monthlyNoiRow: 'NOI Mensal Médio:',
      marketInsightTitle: 'Visão de Mercado:',
      marketInsightHigh: 'Faixa de alto rendimento (comumente mercados secundários ou ativos de maior risco/maior fluxo de caixa).',
      marketInsightCorePlus: 'Faixa institucional padrão para mercados primários e secundários.',
      marketInsightPrime: 'Localizações prime com menor rendimento imediato, com foco na preservação patrimonial e valorização.',
      maxPriceLabel: 'Preço Máximo de Aquisição Recomendado',
      listingPriceRow: 'Preço de Lista:',
      differenceRow: 'Diferença de Preço:',
      overpricedBy: 'Acima do valor por ',
      underpricedBy: 'Abaixo do valor por ',
      targetAlert: (target, maxPrice) => `Para atingir um Cap Rate alvo de ${target}%, sua proposta máxima não deve exceder ${maxPrice}.`,
      nextStepLabel: 'Próximo passo: Adicionar financiamento e testes de estresse',
      nextStepCta: 'Testar Financiamento no Deal Analyzer',
    },
    dscrCalc: {
      toolBadge: 'Ferramenta de Cobertura DSCR',
      title: 'Calculadora de Cobertura da Dívida (DSCR)',
      subtitle: 'Avalie a receita operacional líquida contra o serviço anual da dívida bancária',
      noiLabel: 'Receita Operacional Líquida Anual (NOI)',
      debtModeLabel: 'Modo de Entrada da Dívida',
      annualMode: 'Anual',
      monthlyMode: 'Mensal',
      annualHelp: 'Total de pagamentos anuais de principal e juros',
      monthlyHelp: (amt) => `Serviço Anual de Dívida Equivalente: ${amt} / ano`,
      benchmarkHeader: 'Parâmetros Padrão de Bancos Comerciais:',
      benchmarkTier1: 'Limite mínimo padrão para aprovação bancária',
      benchmarkTier2: 'Aceitável para inquilinos corporativos com contratos Net Lease (NNN) ou órgãos públicos',
      benchmarkTier3: 'Fluxo de caixa negativo / Alto risco de inadimplência',
      summaryTitle: 'Análise de Cobertura',
      shareDeal: 'Compartilhar Análise',
      copied: 'Link copiado!',
      copyTitle: 'Copiar link com parâmetros',
      dscrCardTitle: 'Índice de Cobertura do Serviço da Dívida (DSCR)',
      annualNoiRow: 'NOI Anual:',
      annualDebtRow: 'Serviço Anual da Dívida:',
      cashCushionRow: 'Margem de Fluxo de Caixa Antes dos Impostos:',
      maxDebtRow: 'Dívida Máxima Permitida para 1.25x:',
      tipText: 'Dica: Um DSCR mais alto reflete uma maior margem de segurança contra vacância de inquilinos ou aumentos na taxa de juros.',
      leadBadge: 'Financiamento Comercial Pré-Qualificado',
      leadHeading: 'Conecte-se com Credores DSCR Comerciais para esta Operação',
      leadSubtitle: (dscr) => `Com base no índice DSCR calculado de ${dscr}x, seu imóvel atende aos critérios bancários de crédito comercial. Solicite cotações sem compromisso de credores institucionais homologados.`,
      leadSuccessTitle: 'Solicitação de Cotação Recebida!',
      leadSuccessSubtitle: 'Nossos credores parceiros analisarão as características do imóvel para enviar propostas de financiamento.',
      leadPropertyTypeLabel: 'Tipo de Imóvel',
      leadLoanAmountLabel: 'Valor Estimado do Empréstimo ($)',
      leadEmailLabel: 'E-mail para Recebimento de Cotações',
      leadSubmitBtn: 'Solicitar Propostas e Cotações de Taxas',
      leadTrustNotes: 'Sem impacto na pontuação de crédito · 100% Gratuito · Conexão direta com instituições',
    },
  },
};

export function getUiTranslations(locale: string): UiTranslations {
  if (locale === 'zh') return uiTranslations.zh;
  if (locale === 'es') return uiTranslations.es;
  if (locale === 'pt') return uiTranslations.pt;
  return uiTranslations.en;
}
