export interface HomeFaqItem {
  question: string;
  answer: string;
}

export interface HomeDeveloperSection {
  badge: string;
  title: string;
  subtitle: string;
  intro: string;
  standardsTitle: string;
  standardsPoints: string[];
  disclaimer: string;
  reviewDate: string;
  aboutLinkText: string;
  methodologyLinkText: string;
  editorialLinkText: string;
  contactLinkText: string;
}

export interface HomeSectionsData {
  developer: HomeDeveloperSection;
  faqTitle: string;
  faqSubtitle: string;
  faqs: HomeFaqItem[];
}

export const HOME_SECTIONS: Record<string, HomeSectionsData> = {
  en: {
    developer: {
      badge: 'Independent CRE Developer',
      title: 'Built by Peter · Independent Developer & Underwriting Tools',
      subtitle: 'Free, professional commercial real estate calculation tools running 100% locally in your browser.',
      intro:
        'I built crecalculators.com because checking a commercial real estate deal shouldn\'t require an unwieldy spreadsheet or a paid subscription service. Every calculator on this site runs entirely in your browser — zero sign-up, zero accounts, and zero financial data sent to remote servers.',
      standardsTitle: 'Editorial & Mathematical Verification Standards',
      standardsPoints: [
        'Client-side computation: all formulas execute in real-time JavaScript without remote API latency or data tracking.',
        'Documented formulas: every metric shows its exact mathematical formula, definitions, and worked examples.',
        'Market benchmarks: typical underwriting thresholds (such as 1.25x DSCR or 85% BER) are clearly labeled as standard guidelines, not guaranteed lender commitments.',
      ],
      disclaimer:
        'This site is an independent calculation tool, not a brokerage, lender, or financial advisory firm. Nothing on this website constitutes tax, legal, or investment advice.',
      reviewDate: 'Last Reviewed: November 2026 · Verified by Peter',
      aboutLinkText: 'About Developer',
      methodologyLinkText: 'Methodology',
      editorialLinkText: 'Editorial Policy',
      contactLinkText: 'Contact & Feedback',
    },
    faqTitle: 'Frequently Asked Questions About Commercial Real Estate Analysis',
    faqSubtitle: 'Clear answers on calculation accuracy, privacy, financial metrics, and export workflows.',
    faqs: [
      {
        question: 'How do these calculators protect the confidentiality of my deals?',
        answer:
          'Every calculator on crecalculators.com executes 100% client-side inside your browser. No purchase prices, rental rolls, operating expenses, or mortgage debt parameters are ever transmitted to a server or stored in a database. Your underwriting figures remain strictly confidential on your personal device.',
      },
      {
        question: 'What is the difference between Cap Rate and Cash-on-Cash Return?',
        answer:
          'Cap Rate (Capitalization Rate = NOI ÷ Purchase Price) measures the unleveraged operational yield of the property as if acquired entirely for cash, making it ideal for comparing different properties and markets. Cash-on-Cash Return measures your leveraged first-year cash return on the actual out-of-pocket equity invested after paying annual mortgage debt service.',
      },
      {
        question: 'What minimum DSCR do commercial mortgage lenders look for?',
        answer:
          'Commercial banks and agency lenders (Fannie Mae, Freddie Mac) typically require a minimum Debt Service Coverage Ratio (DSCR) of 1.20x to 1.25x. This buffer ensures the property\'s Net Operating Income (NOI) covers annual loan payments with a 20% to 25% safety cushion to absorb tenant turnover or unexpected maintenance expenses.',
      },
      {
        question: 'How does the Break-Even Ratio (BER) differ from Break-Even Occupancy (BEO)?',
        answer:
          'The Break-Even Ratio (BER) measures what percentage of Effective Gross Income (EGI) is consumed by operating expenses and debt service: BER = (OpEx + ADS) ÷ EGI. Break-Even Occupancy (BEO) calculates the physical occupancy percentage needed against Gross Potential Income (GPI) to generate enough revenue to pay all obligations: BEO = (OpEx + ADS) ÷ GPI.',
      },
      {
        question: 'Can I export my underwriting scenarios to share with lenders or partners?',
        answer:
          'Yes. Our Deal Analyzer and individual calculators support one-click CSV export (strictly RFC 4180 compliant) and instant browser link sharing via URL hash encoding, making it easy to review underwriting scenarios with partners, lenders, or brokers without creating an account.',
      },
    ],
  },
  zh: {
    developer: {
      badge: '独立商业地产开发者',
      title: '由独立开发者 Peter 独立开发与维护',
      subtitle: '完全免费、专业级商业地产测算工具，100% 在您的浏览器本地运行。',
      intro:
        '创办 crecalculators.com 的初衷，是让商业地产投资分析不再依赖复杂的 Excel 模板或昂贵的收费软件。全站所有计算器均在您的浏览器本地实时运行——无需注册、无需登录，绝不将您的交易数据上传至任何服务器。公式全程公开透明，所有算例均经过严格数学验算，阈值范围与美国商业银行主流承销惯例保持一致。',
      standardsTitle: '编辑标准与数学验算流程',
      standardsPoints: [
        '浏览器端本地计算：所有模型均通过前端 JavaScript 执行，无延迟，无网络数据跟踪。',
        '公式与定义公开：所有指标均展示计算公式、变量定义与完整步骤推导。',
        '客观市场阈值：标示常见贷方指标区间（如 1.25x DSCR 或 85% BER 阈值），注明仅作行业惯例参考，非放贷承诺。',
      ],
      disclaimer:
        '本站仅提供专业财务测算工具，非经纪机构、放贷机构或投资顾问公司。本站任何内容均不构成税务、法律或投资建议。',
      reviewDate: '最后审核日期：2026 年 11 月 · 经 Peter 审核',
      aboutLinkText: '关于作者',
      methodologyLinkText: '计算方法论',
      editorialLinkText: '编辑标准',
      contactLinkText: '联系与建议',
    },
    faqTitle: '商业地产测算常见问题解答 (CRE Underwriting FAQs)',
    faqSubtitle: '关于数据私密性、核心财务指标、银行承销标准与导出功能的常见解答。',
    faqs: [
      {
        question: '这些商业地产计算器如何保护我的交易数据隐私？',
        answer:
          'crecalculators.com 上的所有计算完全在您的浏览器本地（Client-Side）执行。您的购买价格、租金收入、运营成本和贷款参数绝不会上传到远程服务器或被记录在数据库中，保障您的商业交易与尽调数据完全私密。',
      },
      {
        question: 'Cap Rate（资本化率）和 Cash-on-Cash（现金回报率）有什么区别？',
        answer:
          'Cap Rate（资本化率 = NOI ÷ 购买价）衡量的是物业自身的无杠杆运营收益率，假设全款现金买下，方便横向对比不同物业；而 Cash-on-Cash（现金回报率 = 税前年现金流 ÷ 实际自付本金）衡量的是在使用银行贷款杠杆后，您实际投入的自有资金在第一年获得的真实年化现金收益。',
      },
      {
        question: '商业地产贷款通常要求的最低偿债覆盖率 (DSCR) 是多少？',
        answer:
          '美国商业银行和机构贷款方（如 Fannie Mae、Freddie Mac）通常要求的最低 DSCR 为 1.20x 至 1.25x。这意味着物业的净营业收入 (NOI) 至少要是年还款额的 1.20 至 1.25 倍，留出 20%~25% 的安全垫以吸收租客空置或费用上涨的风险。',
      },
      {
        question: '收支平衡比率 (BER) 与盈亏平衡入住率 (BEO) 有什么不同？',
        answer:
          '收支平衡比率 (BER) 衡量运营支出与年还贷额占有效毛收入 (EGI) 的百分比：BER = (OpEx + ADS) ÷ EGI。而盈亏平衡入住率 (BEO) 则是将该总成本除以潜在总租金收入 (GPI)，表示物业需要达到多少物理出租率才能做到现金流不亏损。',
      },
      {
        question: '我可以导出交易分析结果或与合伙人分享方案吗？',
        answer:
          '可以。我们的 Deal Analyzer 及各计算器页面均支持一键导出符合 RFC 4180 标准的 CSV 报表，并支持通过带有参数 Hash 的 URL 链接即时分享测算情景，方便您与合伙人、经纪人或银行信贷经理协同审阅。',
      },
    ],
  },
  es: {
    developer: {
      badge: 'Desarrollador Independiente',
      title: 'Creado por Peter · Desarrollador Independiente de Herramientas CRE',
      subtitle: 'Herramientas financieras para bienes raíces comerciales, ejecutadas 100% en su navegador local.',
      intro:
        'Construí crecalculators.com porque evaluar una inversión inmobiliaria comercial no debería requerir complejas hojas de cálculo ni suscripciones de pago. Cada calculadora se ejecuta íntegramente en su navegador: sin registros, sin cuentas de usuario y sin enviar datos financieros a servidores externos.',
      standardsTitle: 'Normas Editoriales y Proceso de Verificación Matemática',
      standardsPoints: [
        'Cálculo en el cliente: las fórmulas se procesan instantáneamente en JavaScript local, sin latencia ni seguimiento.',
        'Transparencia matemática: cada métrica documenta su fórmula analítica, variables y ejemplos prácticos.',
        'Parámetros del mercado: los rangos típicos de entidades financieras (como 1.25x DSCR) se identifican como normas habituales, no garantías.',
      ],
      disclaimer:
        'Este sitio es una herramienta independiente de cálculo, no una correduría, prestamista ni firma de asesoría de inversiones. Ningún contenido constituye asesoramiento fiscal, legal o financiero.',
      reviewDate: 'Última revisión: Noviembre de 2026 · Verificado por Peter',
      aboutLinkText: 'Acerca del Autor',
      methodologyLinkText: 'Metodología',
      editorialLinkText: 'Normas Editoriales',
      contactLinkText: 'Contacto y Sugerencias',
    },
    faqTitle: 'Preguntas Frecuentes sobre Análisis Inmobiliario Comercial',
    faqSubtitle: 'Respuestas claras sobre privacidad de datos, métricas de rentabilidad y normas de suscripción.',
    faqs: [
      {
        question: '¿Cómo protegen estas calculadoras la confidencialidad de mis operaciones?',
        answer:
          'Todas las calculadoras de crecalculators.com se ejecutan al 100% en su navegador mediante JavaScript local. Ningún precio de compra, ingreso por renta, gasto operativo o monto de deuda se transmite a servidores ni se almacena en bases de datos.',
      },
      {
        question: '¿Cuál es la diferencia entre Cap Rate y Rendimiento Cash-on-Cash?',
        answer:
          'El Cap Rate (Tasa de Capitalización = NOI ÷ Precio) mide el rendimiento operativo del inmueble sin deuda como si se adquiriera al contado. El Rendimiento Cash-on-Cash mide el flujo de caja anual obtenido sobre el capital propio efectivamente invertido tras pagar la hipoteca.',
      },
      {
        question: '¿Qué índice de cobertura DSCR exigen típicamente los bancos comerciales?',
        answer:
          'La mayoría de los bancos comerciales y agencias institucionales (Fannie Mae, Freddie Mac) exigen un ratio DSCR mínimo de 1.20x a 1.25x. Esto garantiza que el NOI cubra el servicio anual de la deuda con un margen de seguridad del 20% al 25%.',
      },
      {
        question: '¿En qué se diferencian el Ratio de Equilibrio (BER) y la Ocupación de Equilibrio (BEO)?',
        answer:
          'El Ratio de Equilibrio (BER) mide el porcentaje del Ingreso Bruto Efectivo absorbido por gastos y deuda: BER = (OpEx + ADS) ÷ EGI. La Ocupación de Equilibrio (BEO) calcula la ocupación mínima necesaria sobre el Ingreso Potencial Bruto (GPI) para no incurrir en pérdidas de efectivo.',
      },
      {
        question: '¿Puedo exportar mi análisis y compartir escenarios con socios?',
        answer:
          'Sí. Nuestro Deal Analyzer y las calculadoras individuales permiten la exportación en formato CSV (conforme a RFC 4180) y la generación de enlaces interactivos codificados en URL para compartir análisis con socios o financistas sin necesidad de iniciar sesión.',
      },
    ],
  },
  pt: {
    developer: {
      badge: 'Desenvolvedor Independente',
      title: 'Desenvolvido por Peter · Ferramentas Independentes para CRE',
      subtitle: 'Calculadoras profissionais de investimento imobiliário rodando 100% no seu navegador.',
      intro:
        'Desenvolvi o crecalculators.com porque a avaliação de um imóvel comercial não deveria exigir planilhas complicadas ou assinaturas mensais caras. Cada calculadora executa inteiramente no seu navegador — sem cadastro, sem contas e sem envio de dados a servidores remotos.',
      standardsTitle: 'Padrões Editoriais e Verificação Numérica',
      standardsPoints: [
        'Execução local: todo o processamento financeiro roda diretamente no navegador via JavaScript sem latência ou rastreamento.',
        'Metodologia aberta: fórmulas matemáticas, definições de variáveis e cálculos práticos documentados passo a passo.',
        'Parâmetros de mercado: índices de referência bancários (como 1,25x DSCR ou 85% BER) são apresentados como parâmetros indicativos.',
      ],
      disclaimer:
        'Este site é uma ferramenta independente de cálculo, não uma corretora, instituição financeira ou consultoria de investimentos. Nenhum conteúdo constitui assessoria jurídica, contábil ou fiscal.',
      reviewDate: 'Última revisão: Novembro de 2026 · Verificado por Peter',
      aboutLinkText: 'Sobre o Autor',
      methodologyLinkText: 'Metodologia',
      editorialLinkText: 'Padrões Editoriais',
      contactLinkText: 'Contato e Sugestões',
    },
    faqTitle: 'Perguntas Frequentes sobre Análise de Imóveis Comerciais',
    faqSubtitle: 'Respostas diretas sobre confidencialidade de dados, indicadores financeiros e exportação de relatórios.',
    faqs: [
      {
        question: 'Como essas calculadoras protegem o sigilo das minhas negociações?',
        answer:
          'Todas as operações no crecalculators.com são executadas 100% localmente no navegador via JavaScript. Nenhum dado de preço, receita de locação, despesa operacional ou termo de financiamento é transmitido para servidores remotos.',
      },
      {
        question: 'Qual a diferença entre Cap Rate e Retorno Cash-on-Cash?',
        answer:
          'O Cap Rate (Taxa de Capitalização = NOI ÷ Preço) expressa o rendimento operacional do imóvel sem dívida, como se comprado totalmente à vista. Já o Retorno Cash-on-Cash calcula a rentabilidade do fluxo de caixa sobre o capital próprio efetivamente investido após pagar o serviço da dívida.',
      },
      {
        question: 'Qual o índice DSCR mínimo exigido por bancos em financiamentos comerciais?',
        answer:
          'Bancos comerciais e agências institucionais normalmente exigem um DSCR mínimo entre 1,20x e 1,25x, assegurando que o NOI cubra as parcelas anuais da dívida com uma margem de segurança de 20% a 25%.',
      },
      {
        question: 'Qual a diferença entre o Ponto de Equilíbrio (BER) e a Ocupação de Equilíbrio (BEO)?',
        answer:
          'O Ponto de Equilíbrio (BER) mede a fração da Receita Bruta Efetiva absorvida pelas despesas e amortização: BER = (OpEx + ADS) ÷ EGI. A Ocupação de Equilíbrio (BEO) calcula a ocupação física mínima sobre o Potencial Bruto (GPI) necessária para não ter déficit de caixa.',
      },
      {
        question: 'Posso exportar meu estudo de viabilidade e compartilhar com sócios?',
        answer:
          'Sim. O Deal Analyzer e as calculadoras permitem exportar relatórios CSV formatados e compartilhar cenários instantaneamente via link com parâmetros codificados na URL, sem necessidade de login.',
      },
    ],
  },
};
