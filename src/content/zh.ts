import { LocaleContent } from './types';

export const zhContent: LocaleContent = {
  nav: {
    brandName: '商业地产投资计算器',
    calculators: '计算器总览',
    guides: '基准数据与指南',
    about: '关于本站',
    switchLangLabel: 'English',
    switchLangTarget: 'en',
    switchLangCode: 'en',
  },
  home: {
    metaTitle: '商业地产投资计算器 | 美国商业地产决策工具站',
    metaDescription: '专为在美华人投资者与经纪人打造的商业地产投资决策计算工具，支持 Cap Rate、NOI、Cash-on-Cash Return、DSCR 实时计算与公式解读。',
    heroH1: '商业地产投资决策数字工具',
    heroSubtitle: '提供实时、精准的商业地产财务计算器，辅以公式讲解、真实场景示例与行业基准数据，助您快速评估项目价值。',
    featuredTitle: '核心商业地产计算器',
    featuredDesc: '基于纯前端实时计算，无须注册，即刻评估收益率、净现金流与债务覆盖率。',
    calculators: [
      {
        slug: 'cap-rate',
        title: 'Cap Rate（资本化率）计算器',
        description: '快速算出任意商业地产的资本化率，或者反向推算你能接受的最高购买价。',
        badge: '核心指标',
      },
      {
        slug: 'noi',
        title: 'NOI（净营业收入）计算器',
        description: '扣除空置损失与运营支出，计算物业的净营业收入——几乎所有商业地产指标的计算基础。',
        badge: '基础必备',
      },
      {
        slug: 'cash-on-cash',
        title: 'Cash-on-Cash Return 计算器',
        description: '算出你实际投入的现金——在加了贷款杠杆之后——真正的税前年化现金回报率。',
        badge: '杠杆分析',
      },
      {
        slug: 'dscr',
        title: 'DSCR（偿债覆盖率）计算器',
        description: '计算净营业收入对贷款还款的覆盖倍数，即刻对照商业银行贷款审核要求。',
        badge: '银行审核',
      },
      {
        slug: 'loan-payment',
        title: '商业地产贷款月供计算器',
        description: '计算每月本息还款额、总利息支出、气球贷款到期尾款及还款摊销表。',
        badge: '融资还款',
      },
    ],
    whyUsTitle: '专为商业地产投资者与经纪人设计',
    whyUsItems: [
      {
        title: '纯前端实时响应',
        desc: '输入参数即刻显示计算结果与图表分析，零延迟，保障隐私安全。',
      },
      {
        title: '透明公式与场景化解读',
        desc: '拒绝黑盒计算。提供完整公式推导、实际案例与常见问题解答。',
      },
      {
        title: '深耕美国商业地产市场',
        desc: '全面适配美国商业地产市场习惯（USD / sq ft），提供专业术语对照。',
      },
    ],
  },
  capRate: {
    metaTitle: 'Cap Rate 计算器 — 商业地产资本化率在线计算工具',
    metaDescription: '输入物业价格和净营业收入（NOI），几秒钟算出Cap Rate；也可以反过来输入目标Cap Rate，算出你能接受的最高购买价格。',
    h1: 'Cap Rate（资本化率）计算器',
    subtitle: '快速算出任意商业地产的资本化率，或者反向推算你能接受的最高购买价。',
    whatIsTitle: 'Cap Rate 是什么，为什么重要',
    whatIsContent: 'Cap Rate（资本化率）是商业地产投资者最常用的快速对比指标。它反映的是：如果你全款买下这个物业，单纯基于净营业收入和购买价格，每年能有多少回报率。它不是你实际回报的全貌——不考虑贷款、税务、未来增值这些因素——但它是快速对比两个物业、或者判断一个挂牌价格是否合理最直接的方法。',
    formulaTitle: '计算公式',
    formulaCode: 'Cap Rate = 净营业收入(NOI) / 购买价格 × 100%',
    formulaVariables: [
      { label: 'NOI', desc: '扣除运营支出之后、但在还贷和缴税之前的年收入' },
      { label: '购买价格', desc: '物业的购买价（如果是评估自己已持有的物业，可以用当前市场估值代替）' },
    ],
    exampleTitle: '一个真实场景示例',
    exampleContent: '假设你在看一处小型零售商铺，挂牌价240万美元，年NOI是16.8万美元。\n\nCap Rate = $168,000 / $2,400,000 = 7.0%\n\n如果你的目标Cap Rate是7.5%，NOI固定是16.8万美元，可以反向推算：最高可接受购买价 = $168,000 / 0.075 = $224万——也就是说，这个挂牌价其实比按7.5%目标应有的价格更贵。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '商业地产的Cap Rate多少算合理？',
        answer: '这个高度取决于资产类型和地段。核心城市的多户住宅（Multifamily）可能在4-5%左右交易，而次级市场的单租户净租赁物业（Net-Lease）可能在7-9%左右。Cap Rate越低，通常意味着市场认为风险越低（收益也越低）；Cap Rate越高，通常意味着风险或收益更高。',
      },
      {
        question: 'Cap Rate 和 Cash-on-Cash Return 有什么区别？',
        answer: 'Cap Rate假设你是全款购买，不考虑贷款；Cash-on-Cash Return则是基于你贷款后实际投入的现金计算，反映的是加了杠杆之后的真实回报率。可以参考我们的 Cash-on-Cash Return 计算器。',
      },
      {
        question: 'Cap Rate 会把贷款因素算进去吗？',
        answer: '不会。Cap Rate的计算和融资方式完全无关，这正是它的优势——不管每个买家的贷款条件如何，都能做到"同一把尺子"横向对比。',
      },
      {
        question: '我能用Cap Rate给自己已持有的物业估值吗？',
        answer: '可以。把你物业当前的NOI，以及一个估计的市场价值（可以找经纪人要同类成交案例作参考）代入公式，就能大致判断你的Cap Rate相对市场处在什么水平。',
      },
    ],
    relatedTitle: '相关计算器',
    relatedCalculators: [
      { title: 'NOI 计算器', slug: 'noi' },
      { title: 'Cash-on-Cash Return 计算器', slug: 'cash-on-cash' },
      { title: 'DSCR 计算器', slug: 'dscr' },
    ],
  },
  noi: {
    metaTitle: 'NOI 计算器 — 商业地产净营业收入在线计算工具',
    metaDescription: '输入总收入、空置损失和运营支出，计算商业地产的净营业收入（NOI），这是几乎所有商业地产其他指标的计算基础。',
    h1: 'NOI（净营业收入）计算器',
    subtitle: '算出你物业的净营业收入——几乎所有其他商业地产指标都是从这个数字出发的。',
    whatIsTitle: 'NOI 是什么，为什么重要',
    whatIsContent: 'NOI是商业地产投资里最基础的指标。几乎所有其他计算——Cap Rate、DSCR、Cash-on-Cash Return——都是从NOI开始算的。它反映的是一个物业单纯从运营中产生的收入，还没算进你的房贷或所得税。贷款机构、评估师、买家都会先看NOI，因为它把物业本身的表现，和某个具体业主选择的融资方式区分开来了。',
    formulaTitle: '计算公式',
    formulaCode: 'NOI = 有效毛收入(EGI) − 运营支出\nEGI = 总收入 − 空置及坏账损失',
    formulaVariables: [
      { label: '有效毛收入 (EGI)', desc: '潜在年租金总收入减去预期的空置及坏账损失' },
      { label: '运营支出', desc: '包括物业税、保险、维修保养、物业管理费、房东承担的水电费等。不包括房贷还款、资本性改造或所得税。' },
    ],
    exampleTitle: '一个真实场景示例',
    exampleContent: '一栋12户的公寓楼，年租金总收入31.2万美元。你估计空置损失约5%（1.56万美元），运营支出（税、保险、维护、管理费）一年是9.4万美元。\n\nEGI = $312,000 − $15,600 = $296,400\nNOI = $296,400 − $94,000 = $202,400/年（约合每月$16,867）',
    faqTitle: '常见问题',
    faqs: [
      {
        question: 'NOI 包括房贷还款吗？',
        answer: '不包括。NOI是在还贷之前计算的。房贷还款是在算现金流的时候才扣除，不是在算NOI的时候扣除。',
      },
      {
        question: '哪些算运营支出？',
        answer: '物业税、保险、维修保养、物业管理费、房东承担的水电费，以及更新储备金。资本性改造（比如换屋顶）和房贷还款不算在内。',
      },
      {
        question: '为什么贷款机构这么看重NOI？',
        answer: '贷款机构会用NOI来算DSCR（偿债覆盖率）——也就是判断这个物业产生的收入，能不能舒服地覆盖贷款还款。NOI偏低或者在下滑，在贷款审核里是一个警示信号。',
      },
      {
        question: 'NOI 和现金流有什么区别？',
        answer: 'NOI是还贷之前的数字，现金流是还贷之后的数字。现金流 = NOI − 年度还贷总额（有时还要再减掉资本储备金）。',
      },
    ],
    relatedTitle: '相关计算器',
    relatedCalculators: [
      { title: 'Cap Rate 计算器', slug: 'cap-rate' },
      { title: 'DSCR 计算器', slug: 'dscr' },
      { title: 'Cash-on-Cash Return 计算器', slug: 'cash-on-cash' },
    ],
  },
  cashOnCash: {
    metaTitle: 'Cash-on-Cash Return 计算器 — 商业地产现金回报率工具',
    metaDescription: '输入年现金流和实际投入现金，计算你在商业地产投资中的Cash-on-Cash Return，也就是加了杠杆之后的真实资金回报率。',
    h1: 'Cash-on-Cash Return 计算器',
    subtitle: '算出你实际投入的现金——在加了贷款杠杆之后——真正的回报率。',
    whatIsTitle: 'Cash-on-Cash Return 是什么，为什么重要',
    whatIsContent: 'Cash-on-Cash Return衡量的是：你每年实际拿到手的税前现金流，相对于你实际投入这笔交易的现金——首付、过户成本，以及任何前期的资本性改造支出——的比率。和Cap Rate不同，它把杠杆（贷款）因素算了进去，所以它反映的是你投入的每一块钱资金实际"干活"的效率，而不是物业本身抽象意义上的表现。',
    formulaTitle: '计算公式',
    formulaCode: 'Cash-on-Cash Return = 年税前现金流 / 实际投入现金总额 × 100%',
    formulaVariables: [
      { label: '年现金流', desc: 'NOI减去年度还贷总额（贷款本息）' },
      { label: '实际投入现金总额', desc: '首付 + 过户成本 + 前期即时的资本性支出——不是物业的全部购买价' },
    ],
    exampleTitle: '一个真实场景示例',
    exampleContent: '你以120万美元买下一处物业，首付25%（30万美元），加上3万美元的过户成本和即时维修，实际投入现金总额是33万美元。年NOI是8.4万美元，年度还贷（本息）是5.4万美元。\n\n年现金流 = $84,000 − $54,000 = $30,000\nCash-on-Cash Return = $30,000 / $330,000 = 9.1%\n\n对比这个物业的Cap Rate（$84,000 / $1,200,000 = 7.0%）——这里的杠杆把你的现金回报率抬高到了Cap Rate之上，因为贷款成本低于物业本身的收益率。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '为什么Cash-on-Cash Return通常和Cap Rate不一样？',
        answer: 'Cap Rate假设没有贷款；Cash-on-Cash Return则反映了杠杆效应。如果你的贷款利率低于物业的Cap Rate，杠杆通常会把你的Cash-on-Cash Return抬高到Cap Rate之上（正向杠杆）。如果利率更高，则效果相反（负向杠杆）。',
      },
      {
        question: '什么算"投入现金"？',
        answer: '首付、过户成本、贷款手续费，以及物业出租前需要的即时维修或升级支出。不包括购买价里通过贷款融资的部分。',
      },
      {
        question: 'Cash-on-Cash Return 是不是越高越好？',
        answer: '不一定——非常高的Cash-on-Cash Return也可能意味着高杠杆、高风险（相对较小的首付、较大的贷款）。建议结合DSCR一起看，了解你的风险缓冲空间有多大。',
      },
    ],
    relatedTitle: '相关计算器',
    relatedCalculators: [
      { title: 'Cap Rate 计算器', slug: 'cap-rate' },
      { title: 'NOI 计算器', slug: 'noi' },
      { title: 'DSCR 计算器', slug: 'dscr' },
    ],
  },
  dscr: {
    metaTitle: 'DSCR 计算器 — 商业地产偿债覆盖率在线计算工具',
    metaDescription: '输入年净营业收入（NOI）和年度还贷总额，计算商业地产的偿债覆盖率（DSCR），即刻对照商业银行贷款审批常见标准。',
    h1: 'DSCR（偿债覆盖率）计算器',
    subtitle: '判断你的商业物业产生的净收入，能否舒服地覆盖贷款还款——并对照商业银行常见的审核线。',
    whatIsTitle: 'DSCR 是什么，为什么重要',
    whatIsContent: 'DSCR（Debt Service Coverage Ratio，偿债覆盖率）衡量的是商业地产通过自身的净营业收入（NOI）覆盖每年房贷还款本息的能力。与住宅贷款看重借款人个人收入不同，商业地产贷款主要看物业本身的盈利能力。DSCR是商业银行和贷款机构在审核贷款额度、利率及审批通过率时最核心的指标。比率为1.0x意味着净收入刚好够还贷，而银行通常要求1.20x至1.35x的比率作为应对市场波动的安全缓冲。',
    formulaTitle: '计算公式',
    formulaCode: 'DSCR = 净营业收入(NOI) / 年度还贷总额(Annual Debt Service)',
    formulaVariables: [
      { label: 'NOI', desc: '扣除运营支出后、但在还贷和缴税之前的年净收入' },
      { label: '年度还贷总额', desc: '一年内应偿还的贷款本金与利息总和' },
    ],
    exampleTitle: '一个真实场景示例',
    exampleContent: '假设一栋办公楼年NOI为25万美元。你的商业贷款申请要求每月还款15,625美元（每年还款18.75万美元）。\n\nDSCR = $250,000 / $187,500 = 1.33x\n\n因为1.33x高于银行常见的1.25x最低要求，这意味着该项目拥有每年6.25万美元的安全缓冲资金，属于银行非常青睐的稳健贷款标的。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '商业地产的 DSCR 多少算合理？',
        answer: '绝大多数商业银行要求最低 DSCR 在 1.20x 到 1.25x 之间。如果是现金流极其稳定的优质资产（如长租单租户 NNN 物业），最低要求可能放宽至 1.15x - 1.20x；如果是风险偏高的资产（如酒店或无主力店的零售 Center），银行通常要求 1.35x 到 1.50x 以上。',
      },
      {
        question: '如果 DSCR 低于 1.0x 会发生什么？',
        answer: 'DSCR 低于 1.0x 意味着负现金流——物业运营产生的收入不足以支付房贷。除非业主持续自筹资金补足缺口，否则项目将面临贷款违约风险。',
      },
      {
        question: '如何提高一个项目的 DSCR？',
        answer: '提高 DSCR 主要有两种途径：一是提高 NOI（通过提升租金、增加其他杂项收入或降低运营成本）；二是降低年度还款额（通过增加首付比例、争取更低利率或延长摊销年限）。',
      },
      {
        question: '计算 DSCR 是用总收入还是 NOI？',
        answer: 'DSCR 必须使用扣除所有运营支出和空置损失后的净营业收入（NOI）来计算，绝不能使用毛收入（Gross Income）。',
      },
    ],
    relatedTitle: '相关计算器',
    relatedCalculators: [
      { title: 'NOI 计算器', slug: 'noi' },
      { title: '商业地产贷款月供计算器', slug: 'loan-payment' },
      { title: 'Cash-on-Cash Return 计算器', slug: 'cash-on-cash' },
    ],
  },
  loanPayment: {
    metaTitle: '商业地产贷款月供计算器 — 还款摊销与气球贷款计算',
    metaDescription: '计算商业地产贷款的每月本息还款额、总利息支出、气球贷款（Balloon Payment）到期尾款金额，并查看前12个月还款摊销表。',
    h1: '商业地产贷款月供计算器',
    subtitle: '计算商业地产贷款的每月本息还款额、利息成本以及气球贷款到期应付尾款。',
    whatIsTitle: '商业地产贷款摊销与气球贷款是什么',
    whatIsContent: '商业地产贷款与住宅贷款有很大不同。住宅贷款常见30年固定利率，而商业地产贷款通常采用较短的贷款到期年限（如5年、7年或10年），搭配较长的摊销年限（如25年或30年）。在到期日，未还清的剩余本金余额必须通过一次性“气球贷款（Balloon Payment）”偿还或重新办理再融资（Refinance）。精准计算月供和到期尾款是预测现金流和防范再融资风险的关键。',
    formulaTitle: '计算公式',
    formulaCode: 'M = P × [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]',
    formulaVariables: [
      { label: 'M', desc: '每月本息还款额 (Monthly Payment)' },
      { label: 'P', desc: '贷款本金总额 ($)' },
      { label: 'r', desc: '月利率 (年利率 / 12)' },
      { label: 'n', desc: '总摊销期数 (摊销年限 × 12)' },
    ],
    exampleTitle: '一个真实场景示例',
    exampleContent: '你申请了一笔200万美元的商业地产贷款，利率为6.5%，按25年摊销计算月供，贷款期限为10年（到期气球还款）。\n\n你的月供为$13,496（每年$161,952）。在前10年内，你累计还款$1,619,520（其中利息$1,152,192，本金$467,328）。在第10年到期时，你需要一次性偿还剩余的气球贷款尾款$1,532,672。',
    faqTitle: '常见问题',
    faqs: [
      {
        question: '什么是商业地产里的气球贷款 (Balloon Payment)？',
        answer: '气球贷款是指贷款的实际到期期限（例如10年）短于其月供计算的摊销期限（例如25年），在贷款到期时需要一次性偿还的剩余本金大额尾款。投资者通常会在气球贷款到期前选择重新贷款（Refinance）或出售物业。',
      },
      {
        question: '商业地产贷款常见的摊销年限是多少？',
        answer: '绝大多数商业地产贷款采用25年摊销期。优质核心城市的标杆资产可能争取到30年摊销，而较老旧或特殊用途的物业可能被限制在20年。',
      },
      {
        question: '利率波动对商业地产债务影响有多大？',
        answer: '由于商业地产贷款金额巨大，哪怕0.5%的利率变化也会显著改变年度还款额，从而直接影响项目的 DSCR 和 Cash-on-Cash Return 现金回报率。',
      },
      {
        question: '商业地产贷款是固定利率还是浮动利率？',
        answer: '商业贷款可以是5-10年的固定利率，也可以是锚定 SOFR 或 Prime 的浮动利率。常见模式是前5年或7年固定，之后按市场利率重新调整。',
      },
    ],
    relatedTitle: '相关计算器',
    relatedCalculators: [
      { title: 'DSCR 计算器', slug: 'dscr' },
      { title: 'Cash-on-Cash Return 计算器', slug: 'cash-on-cash' },
      { title: 'Cap Rate 计算器', slug: 'cap-rate' },
    ],
  },
};
