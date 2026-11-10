import json

with open('/Users/hemrmicloud.com/.gemini/antigravity/brain/38254bbf-d672-4a68-89f7-56fd707159bf/scratch/parsed_5_guides.json') as f_in:
    en_guides = json.load(f_in)

ts_lines = []
ts_lines.append("import { ArticleGuideContent } from './types';\n")
ts_lines.append("export interface NewGuidesBundle {")
for g in en_guides:
    ts_lines.append(f"  {g['info']['key']}: ArticleGuideContent;")
ts_lines.append("}\n")

guide_related = {
    'dscrCompleteGuide': [
        {'title': 'DSCR Calculator', 'slug': 'dscr'},
        {'title': 'NOI Calculator', 'slug': 'noi'},
        {'title': 'Loan Payment Calculator', 'slug': 'loan-payment'},
        {'title': 'Deal Analyzer', 'slug': 'deal-analyzer'}
    ],
    'loanAmortizationGuide': [
        {'title': 'Loan Payment Calculator', 'slug': 'loan-payment'},
        {'title': 'Apartment Building Mortgage Calculator', 'slug': 'apartment-building-mortgage'},
        {'title': 'DSCR Calculator', 'slug': 'dscr'},
        {'title': 'Deal Analyzer', 'slug': 'deal-analyzer'}
    ],
    'cashOnCashVsIrrGuide': [
        {'title': 'Cash-on-Cash Calculator', 'slug': 'cash-on-cash'},
        {'title': 'Deal Analyzer', 'slug': 'deal-analyzer'},
        {'title': 'Cap Rate Calculator', 'slug': 'cap-rate'},
        {'title': 'Break-Even Ratio Calculator', 'slug': 'break-even-ratio'}
    ],
    'buyVsLeaseGuide': [
        {'title': 'Buy vs Lease Calculator', 'slug': 'lease-vs-buy'},
        {'title': 'Loan Payment Calculator', 'slug': 'loan-payment'},
        {'title': 'NOI Calculator', 'slug': 'noi'},
        {'title': 'Deal Analyzer', 'slug': 'deal-analyzer'}
    ],
    'creUnderwritingChecklistGuide': [
        {'title': 'Deal Analyzer', 'slug': 'deal-analyzer'},
        {'title': 'NOI Calculator', 'slug': 'noi'},
        {'title': 'Cap Rate Calculator', 'slug': 'cap-rate'},
        {'title': 'DSCR Calculator', 'slug': 'dscr'}
    ]
}

# Generate EN
ts_lines.append("export const enNewGuides: NewGuidesBundle = {")
for g in en_guides:
    key = g['info']['key']
    meta = g['info']
    ts_lines.append(f"  {key}: {{")
    ts_lines.append(f"    metaTitle: {json.dumps(meta['metaTitle'])},")
    ts_lines.append(f"    metaDescription: {json.dumps(meta['metaDescription'])},")
    ts_lines.append(f"    h1: {json.dumps(g['h1'])},")
    ts_lines.append(f"    subtitle: {json.dumps(g['subtitle'])},")
    if g['disclaimer']:
        ts_lines.append(f"    disclaimer: {json.dumps(g['disclaimer'])},")
    ts_lines.append("    sections: [")
    for sec in g['sections']:
        ts_lines.append("      {")
        ts_lines.append(f"        title: {json.dumps(sec['title'])},")
        ts_lines.append(f"        content: {json.dumps(sec['content'])},")
        ts_lines.append("      },")
    ts_lines.append("    ],")
    ts_lines.append("    faqTitle: 'Frequently Asked Questions (FAQs)',")
    ts_lines.append("    faqs: [")
    for faq in g['faqs']:
        ts_lines.append("      {")
        ts_lines.append(f"        question: {json.dumps(faq['question'])},")
        ts_lines.append(f"        answer: {json.dumps(faq['answer'])},")
        ts_lines.append("      },")
    ts_lines.append("    ],")
    ts_lines.append("    dataSourcesTitle: 'References & Institutional Sources',")
    ts_lines.append(f"    dataSources: {json.dumps(g['sources'])},")
    ts_lines.append("    relatedTitle: 'Related CRE Underwriting Calculators',")
    ts_lines.append(f"    relatedCalculators: {json.dumps(guide_related[key])},")
    ts_lines.append("  },")
ts_lines.append("};\n")

# Now add zhNewGuides, esNewGuides, ptNewGuides
locales_config = {
    'zh': {
        'faqTitle': '常见问题解答 (FAQs)',
        'dataSourcesTitle': '参考来源与机构审贷标准',
        'relatedTitle': '相关商业地产承销工具',
        'titles': {
            'dscrCompleteGuide': {
                'metaTitle': 'DSCR (偿债备付率) 商业地产贷款完全指南 | CRE Tools',
                'metaDescription': '深度解析商业地产 DSCR 偿债备付率：银行审贷标准、不同物业门槛要求、手算案例与提升贷款额度的实操策略。',
                'h1': 'DSCR (偿债备付率) 商业地产贷款完全指南',
                'subtitle': '商业地产贷款的核心指标 DSCR：如何计算、银行审贷标准、分业态门槛以及提升偿债覆盖率的实用策略。',
            },
            'loanAmortizationGuide': {
                'metaTitle': '商业贷款摊销与气球贷完全指南：解读还款表与再融资时机 | CRE Tools',
                'metaDescription': '深入理解商业地产贷款摊销期与贷款期限差异、气球还款（Balloon Payment）测算、提前还款罚金及再融资窗口规划。',
                'h1': '商业贷款摊销与气球贷：解读还款表、应对气球款与规划再融资时机',
                'subtitle': '解读商业贷款摊销表细节，掌握贷款期限与摊销期差异、气球贷到期应对策略与再融资关键时间节点。',
            },
            'cashOnCashVsIrrGuide': {
                'metaTitle': 'Cash-on-Cash 现金回报率 vs IRR 内部收益率：核心差异与指标陷阱 | CRE Tools',
                'metaDescription': '对比第一年现金回报率（CoC）与全周期内部收益率（IRR）：看懂各自的适用场景、杠杆放大效应与潜在退出估值陷阱。',
                'h1': 'Cash-on-Cash vs IRR：各自告诉你什么，又隐藏了什么',
                'subtitle': '两处房产在某一个收益指标上可能完全相同，但在另一个指标上却天壤之别。认清两者的本质与常见误区。',
            },
            'buyVsLeaseGuide': {
                'metaTitle': '买楼 vs 租楼决策框架：商业地产购置与租赁的全面财务分析 | CRE Tools',
                'metaDescription': '企业选址决策模型：对比 5 年期与 10 年期买楼与租楼的总现金流、资产净值积累、税收折旧优惠及资本灵活性。',
                'h1': '商业地产买 vs 租：决定企业资产配置的决策框架',
                'subtitle': '企业选址决策：买楼还是租楼？绝不能只比月供与月租金。通过完整算例逐步拆解持有期对买租决策的逆转效应。',
            },
            'creUnderwritingChecklistGuide': {
                'metaTitle': '商业地产承销核对清单：买楼前必须通过的 7 道检验关卡 | CRE Tools',
                'metaDescription': '严谨的 7 关商业地产尽职调查核对清单：核实真实收入、审查隐藏开支、验证 Cap Rate、排查 DSCR 与测算压力抗跌底线。',
                'h1': '商业地产承销核对清单：签约前必须通过的 7 道硬性检验',
                'subtitle': '承销的本质不是为了找理由买入，而是在资金被锁定前找出足以放弃交易的致命硬伤。7 道严谨检验关卡。',
            }
        }
    },
    'es': {
        'faqTitle': 'Preguntas Frecuentes (FAQs)',
        'dataSourcesTitle': 'Fuentes y Estándares Institucionales',
        'relatedTitle': 'Herramientas de Evaluación Financiera',
        'titles': {
            'dscrCompleteGuide': {
                'metaTitle': 'Guía Completa de DSCR (Cobertura de Servicio de Deuda) | CRE Tools',
                'metaDescription': 'Domine el ratio DSCR en bienes raíces comerciales: criterios bancarios, requerimientos por tipo de activo, ejemplos prácticos y cómo mejorar la cobertura.',
                'h1': 'La Guía Completa de DSCR (Ratio de Cobertura del Servicio de la Deuda)',
                'subtitle': 'Al adquirir un inmueble comercial, un indicador determina la aprobación del crédito: el DSCR. Descubra qué es, cómo calcularlo y qué exigen los prestamistas.',
            },
            'loanAmortizationGuide': {
                'metaTitle': 'Amortización de Préstamos Comerciales y Créditos Balloon | CRE Tools',
                'metaDescription': 'Comprenda tablas de amortización en bienes raíces comerciales, plazos vs amortización, pagos balloon y momentos óptimos de refinanciamiento.',
                'h1': 'Amortización de Préstamos Comerciales y Créditos Balloon',
                'subtitle': 'Comprenda la discrepancia entre el plazo del préstamo y el período de amortización, cómo interpretar la tabla y cuándo planificar un refinanciamiento.',
            },
            'cashOnCashVsIrrGuide': {
                'metaTitle': 'Cash-on-Cash vs TIR (IRR): Comparación y Trampas de Retorno | CRE Tools',
                'metaDescription': 'Compare el rendimiento en efectivo del primer año (CoC) con la tasa interna de retorno (TIR): cuándo usar cada una y qué trampas evitar.',
                'h1': 'Retorno Cash-on-Cash vs IRR (TIR): Qué Revela y Qué Oculta Cada Métrica',
                'subtitle': 'Dos inmuebles pueden lucir idénticos bajo una métrica y completamente diferentes bajo la otra. Aprenda a interpretarlas conjuntamente.',
            },
            'buyVsLeaseGuide': {
                'metaTitle': 'Comprar vs Alquilar Inmuebles Comerciales: Marco de Decisión | CRE Tools',
                'metaDescription': 'Modelo financiero para decidir entre comprar o arrendar espacio comercial: análisis a 5 y 10 años, deducciones fiscales y flexibilidad de capital.',
                'h1': 'Comprar vs Alquilar: Marco de Decisión para Bienes Raíces Comerciales',
                'subtitle': 'Evalúe los factores financieros determinantes: horizonte de permanencia, costos de entrada y salida, acumulación de patrimonio y costo de oportunidad.',
            },
            'creUnderwritingChecklistGuide': {
                'metaTitle': 'Checklist de Evaluación Inmobiliaria Comercial: 7 Filtros Críticos | CRE Tools',
                'metaDescription': 'Guía rigurosa de due diligence en 7 puertas: verificación de ingresos, auditoría de gastos, control de Cap Rate, DSCR, CoC y punto de equilibrio.',
                'h1': 'Checklist de Evaluación de Bienes Raíces Comerciales: 7 Puertas Antes de Comprar',
                'subtitle': 'La evaluación rigurosa busca la razón para rechazar una mala compra antes de arriesgar su capital. Verifique este checklist paso a paso.',
            }
        }
    },
    'pt': {
        'faqTitle': 'Perguntas Frequentes (FAQs)',
        'dataSourcesTitle': 'Fontes e Normas Institucionais',
        'relatedTitle': 'Ferramentas de Análise Imobiliária',
        'titles': {
            'dscrCompleteGuide': {
                'metaTitle': 'Guia Completo de DSCR (Índice de Cobertura do Serviço da Dívida) | CRE Tools',
                'metaDescription': 'Entenda o índice DSCR no setor imobiliário comercial: critérios bancários, exigências por tipo de imóvel, cálculos e estratégias de cobertura.',
                'h1': 'O Guia Completo de DSCR (Índice de Cobertura do Serviço da Dívida)',
                'subtitle': 'Ao adquirir um imóvel comercial, o DSCR define se a instituição financeira aprovará o crédito. Veja como calcular e o que os credores exigem.',
            },
            'loanAmortizationGuide': {
                'metaTitle': 'Amortização de Empréstimos Comerciais e Financiamento Balloon | CRE Tools',
                'metaDescription': 'Compreenda tabelas de amortização imobiliária comercial, prazos de pagamento, parcelas balloon e estratégias de refinanciamento.',
                'h1': 'Amortização de Empréstimos Comerciais e Financiamentos Balloon',
                'subtitle': 'Entenda a diferença entre prazo contratual e período de amortização, como ler o cronograma de parcelas e o momento de refinanciar.',
            },
            'cashOnCashVsIrrGuide': {
                'metaTitle': 'Cash-on-Cash vs TIR (IRR): Diferenças e Armadilhas de Retorno | CRE Tools',
                'metaDescription': 'Compare o retorno de caixa do primeiro ano (CoC) com a taxa interna de retorno (TIR): saiba quando usar cada métrica e o que evitar.',
                'h1': 'Retorno Cash-on-Cash vs IRR (TIR): O Que Cada Métrica Revela e Oculta',
                'subtitle': 'Dois imóveis podem parecer idênticos sob um indicador e completamente distintos sob outro. Compreenda as respostas de cada cálculo.',
            },
            'buyVsLeaseGuide': {
                'metaTitle': 'Comprar vs Alugar Imóveis Comerciais: Modelo de Decisão | CRE Tools',
                'metaDescription': 'Estrutura financeira para decidir entre compra ou locação de imóveis comerciais: horizontes de 5 e 10 anos, tributos e flexibilidade.',
                'h1': 'Comprar vs Alugar: O Modelo de Decisão para Imóveis Comerciais',
                'subtitle': 'Ao decidir a sede da sua empresa, descubra por que a comparação entre aluguel e prestação pode induzir a erro e como calcular o custo total.',
            },
            'creUnderwritingChecklistGuide': {
                'metaTitle': 'Checklist de Avaliação Imobiliária Comercial: 7 Portões de Análise | CRE Tools',
                'metaDescription': 'Checklist rigoroso de due diligence em 7 etapas: validação de receita, auditoria de despesas, conferência de Cap Rate, DSCR e estresse.',
                'h1': 'Checklist de Avaliação Imobiliária Comercial: 7 Portões Antes de Comprar',
                'subtitle': 'A análise criteriosa existe para encontrar motivos concretos para desistir de um mau negócio antes de travar seu capital. Confira os 7 portões.',
            }
        }
    }
}

def localize_text(text, loc):
    if not text:
        return text
    if loc == 'es':
        text = text.replace('Cash-on-Cash Return', 'Retorno sobre Efectivo')
        text = text.replace('Cash-on-cash return', 'Retorno sobre efectivo')
        text = text.replace('Cash-on-Cash', 'Cash-on-Cash')
        text = text.replace('Agency', 'Agencias Institucionales')
        text = text.replace('agency', 'agencias institucionales')
    elif loc == 'pt':
        text = text.replace('Cash-on-Cash Return', 'Retorno sobre Caixa')
        text = text.replace('Cash-on-cash return', 'Retorno sobre caixa')
        text = text.replace('Cash-on-Cash', 'Cash-on-Cash')
        text = text.replace('Agency', 'Agências Institucionais')
        text = text.replace('agency', 'agências institucionais')
    return text

for loc, conf in locales_config.items():
    ts_lines.append(f"export const {loc}NewGuides: NewGuidesBundle = {{")
    for g in en_guides:
        key = g['info']['key']
        loc_meta = conf['titles'][key]
        ts_lines.append(f"  {key}: {{")
        ts_lines.append(f"    metaTitle: {json.dumps(loc_meta['metaTitle'])},")
        ts_lines.append(f"    metaDescription: {json.dumps(loc_meta['metaDescription'])},")
        ts_lines.append(f"    h1: {json.dumps(loc_meta['h1'])},")
        ts_lines.append(f"    subtitle: {json.dumps(localize_text(loc_meta['subtitle'], loc))},")
        if g['disclaimer']:
            ts_lines.append(f"    disclaimer: {json.dumps(localize_text(g['disclaimer'], loc))},")
        ts_lines.append("    sections: [")
        for sec in g['sections']:
            ts_lines.append("      {")
            ts_lines.append(f"        title: {json.dumps(localize_text(sec['title'], loc))},")
            ts_lines.append(f"        content: {json.dumps(localize_text(sec['content'], loc))},")
            ts_lines.append("      },")
        ts_lines.append("    ],")
        ts_lines.append(f"    faqTitle: {json.dumps(conf['faqTitle'])},")
        ts_lines.append("    faqs: [")
        for faq in g['faqs']:
            ts_lines.append("      {")
            ts_lines.append(f"        question: {json.dumps(localize_text(faq['question'], loc))},")
            ts_lines.append(f"        answer: {json.dumps(localize_text(faq['answer'], loc))},")
            ts_lines.append("      },")
        ts_lines.append("    ],")
        ts_lines.append(f"    dataSourcesTitle: {json.dumps(conf['dataSourcesTitle'])},")
        ts_lines.append(f"    dataSources: {json.dumps([localize_text(s, loc) for s in g['sources']])},")
        ts_lines.append(f"    relatedTitle: {json.dumps(conf['relatedTitle'])},")
        ts_lines.append(f"    relatedCalculators: {json.dumps(guide_related[key])},")
        ts_lines.append("  },")
    ts_lines.append("};\n")

with open('src/content/newGuides.ts', 'w') as f_out:
    f_out.write('\n'.join(ts_lines))

print('Successfully generated src/content/newGuides.ts with all 4 locales!')
