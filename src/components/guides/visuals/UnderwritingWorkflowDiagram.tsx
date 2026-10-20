import React from 'react';
import { Building2, DollarSign, TrendingUp, BarChart3, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  locale: string;
}

export function UnderwritingWorkflowDiagram({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const stepLabel = isZh ? '第' : isEs ? 'Paso' : isPt ? 'Etapa' : 'Step';

  const steps = [
    {
      num: '01',
      title: isZh ? '1. 物业基本信息' : isEs ? '1. Datos de la Propiedad' : isPt ? '1. Dados do Imóvel' : '1. Property Inputs',
      sub: isZh ? '购买价格、建筑面积与过户成本' : isEs ? 'Precio de Compra, Unidades y Costos de Cierre' : isPt ? 'Preço de Compra, Unidades e Custos de Fechamento' : 'Purchase Price, Unit Count & Closing Costs',
      desc: isZh ? '确认交易基础对价与交易税费' : isEs ? 'Definir base de adquisición y costos de entrada' : isPt ? 'Definir base de aquisição e custos de entrada' : 'Define acquisition basis and entry costs',
      icon: Building2,
      accent: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'bg-blue-600',
    },
    {
      num: '02',
      title: isZh ? '2. 收入与开支 (NOI)' : isEs ? '2. Ingresos y Gastos (NOI)' : isPt ? '2. Receitas e Despesas (NOI)' : '2. Income & Expenses',
      sub: isZh ? '租金、空置坏账与运营杂费' : isEs ? 'Renta Bruta, Desocupación y Gastos Operativos' : isPt ? 'Receita Bruta, Vacância e Despesas Operacionais' : 'Gross Rent, Vacancy Rate & Operating Expenses',
      desc: isZh ? '计算真实有效的净营业收入' : isEs ? 'Calcular un Ingreso Operativo Neto sostenible' : isPt ? 'Calcular uma Receita Operacional Líquida sustentável' : 'Underwrite sustainable Net Operating Income',
      icon: DollarSign,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-600',
    },
    {
      num: '03',
      title: isZh ? '3. 融资借贷条件' : isEs ? '3. Financiamiento y Deuda' : isPt ? '3. Financiamento e Dívida' : '3. Debt & Financing',
      sub: isZh ? 'LTV首付比例、利率与摊销年限' : isEs ? '% Anticipo, Tasa de Interés y Amortización' : isPt ? '% Entrada, Taxa de Juros e Amortização' : 'Down Payment %, Interest Rate & Amortization',
      desc: isZh ? '确定月供还款与年还债总额' : isEs ? 'Determinar las obligaciones de servicio de deuda' : isPt ? 'Determinar as obrigações de serviço da dívida' : 'Determine annual debt service obligations',
      icon: TrendingUp,
      accent: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badge: 'bg-indigo-600',
    },
    {
      num: '04',
      title: isZh ? '4. 测算核心指标' : isEs ? '4. Métricas Clave' : isPt ? '4. Métricas Principais' : '4. Core Metrics',
      sub: isZh ? 'Cap Rate、DSCR、CoC 与 BER' : isEs ? 'Cap Rate, DSCR, Cash-on-Cash y Break-Even' : isPt ? 'Cap Rate, DSCR, Cash-on-Cash e Ponto de Equilíbrio' : 'Cap Rate, DSCR, Cash-on-Cash & Break-Even',
      desc: isZh ? '对比全美与本地都市圈基准线' : isEs ? 'Comparar métricas contra rendimientos de mercado' : isPt ? 'Comparar métricas contra referências de mercado' : 'Benchmark metrics against market yields',
      icon: BarChart3,
      accent: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-600',
    },
    {
      num: '05',
      title: isZh ? '5. 压力情景测试' : isEs ? '5. Pruebas de Estrés' : isPt ? '5. Testes de Estresse' : '5. Stress Testing',
      sub: isZh ? '空置率增加5个百分点，利率增加100个基点 (bps, 即1.00个百分点)' : isEs ? '+5 puntos de vacancia y +100 bps de subida en tasas' : isPt ? '+5 pontos de vacância e +100 bps de choque nos juros' : '+5 percentage points Vacancy & +100 bps (1.00 percentage point) Rate Shock',
      desc: isZh ? '检验下行周期中的现金流安全垫与偿债能力' : isEs ? 'Evaluar liquidez y cobertura de deuda en escenarios adversos' : isPt ? 'Avaliar liquidez e cobertura de dívida em cenários adversos' : 'Evaluate downside liquidity, debt coverage & solvency',
      icon: Zap,
      accent: 'bg-rose-50 text-rose-700 border-rose-200',
      badge: 'bg-rose-600',
    },
    {
      num: '06',
      title: isZh ? '6. 投资决策评审' : isEs ? '6. Revisión de Inversión' : isPt ? '6. Revisão de Investimento' : '6. Investment Review',
      sub: isZh ? '风险收益平衡、报价与退出测算' : isEs ? 'Balance Riesgo/Retorno y Estructuración de Oferta' : isPt ? 'Equilíbrio Risco/Retorno e Estruturação de Proposta' : 'Risk/Return Balancing & Offer Structuring',
      desc: isZh ? '形成一页纸尽调报告与出价策略' : isEs ? 'Generar memorándum de evaluación y precio de oferta' : isPt ? 'Gerar memorando de avaliação e estratégia de proposta' : 'Generate underwriting memo & LOI pricing',
      icon: CheckCircle2,
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-600',
    },
  ];

  return (
    <figure className="bg-slate-50 border border-slate-200/90 rounded-3xl p-5 sm:p-8 space-y-6 text-left my-8 shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
          {isZh ? '尽调方法论可视化流程' : isEs ? 'Metodología Estructurada de Evaluación' : isPt ? 'Metodologia Estruturada de Avaliação' : 'Structured Underwriting Methodology'}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          {isZh ? '商业地产 6 步标准尽调与承销流程' : isEs ? 'Flujo de Trabajo de 6 Pasos para Evaluación Inmobiliaria Comercial' : isPt ? 'Fluxo de Trabalho de 6 Etapas para Avaliação Imobiliária Comercial' : 'The 6-Step Commercial Real Estate Underwriting Workflow'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {isZh
            ? '从原始物业参数到最终出价决策，每一步均建立在透明且量化的财务模型基础之上。'
            : isEs
            ? 'Desde los parámetros iniciales de la propiedad hasta la decisión final de oferta, cada paso se basa en una validación cuantitativa rigurosa.'
            : isPt
            ? 'Dos dados iniciais do imóvel à decisão final de proposta, cada etapa apoia-se em uma validação quantitativa rigorosa.'
            : 'From property inputs to investment committee approval, each step builds rigorous quantitative validation.'}
        </p>
      </div>

      {/* Grid Flow Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3 relative group"
            >
              {/* Step Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${step.accent} flex items-center justify-center font-bold`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[11px] font-black text-white px-2 py-0.5 rounded-md ${step.badge}`}>
                    {stepLabel} {step.num}{isZh ? '步' : ''}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <span className="text-slate-300 group-hover:text-emerald-500 transition-colors hidden lg:block">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h4>
                <p className="text-xs font-medium text-slate-600 mb-1">{step.sub}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Figcaption */}
      <figcaption className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-200/80">
        {isZh
          ? '图解：商业地产标准 6 步承销尽调流程。Deal Analyzer 工具将步骤 1 至步骤 5 集成为单一操作面板，支持即时计算与一页纸 PDF 报告输出。'
          : isEs
          ? 'Figura: Ciclo de vida estándar de 6 etapas para evaluación de bienes raíces comerciales. Deal Analyzer integra los pasos 1 al 5 en una sola interfaz con pruebas de estrés y exportación a PDF.'
          : isPt
          ? 'Figura: Ciclo de vida padrão de 6 etapas para avaliação imobiliária comercial. O Deal Analyzer integra as etapas 1 a 5 em uma única interface com testes de estresse e exportação em PDF.'
          : 'Figure: The 6-stage commercial real estate underwriting lifecycle. Our Deal Analyzer suite unifies Steps 1 through 5 in a single interface with instant stress testing and PDF export.'}
      </figcaption>
    </figure>
  );
}
