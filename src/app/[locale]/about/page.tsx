import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { ShieldCheck, Code2, CheckCircle2, AlertTriangle, ArrowRight, Mail } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const title = isZh
    ? '关于我们 | CRE Calculators'
    : isEs
    ? 'Sobre Nosotros | CRE Calculators'
    : isPt
    ? 'Sobre Nós | CRE Calculators'
    : 'About Us | CRE Calculators';

  const description = isZh
    ? '了解 crecalculators.com 的背景、建站初衷、计算逻辑核验流程与使用原则。'
    : isEs
    ? 'Conozca la historia, misión, metodología de verificación y principios de uso de crecalculators.com.'
    : isPt
    ? 'Conheça a história, missão, metodologia de verificação e princípios de uso do crecalculators.com.'
    : 'Learn about crecalculators.com, why it was built, how calculation logic is verified, and our core principles.';

  return buildSeoMetadata({
    path: 'about',
    locale,
    title,
    description,
  });
}

export default async function AboutPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';
  const aboutLabel = isZh ? '关于我们' : isEs ? 'Sobre Nosotros' : isPt ? 'Sobre Nós' : 'About Us';

  return (
    <article className="max-w-3xl mx-auto space-y-10 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
        <Link href={`/${locale}/`} className="hover:text-emerald-600 transition-colors">{homeLabel}</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{aboutLabel}</span>
      </nav>

      {/* Header */}
      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isZh ? '关于网站与开发者' : isEs ? 'Sobre el Proyecto' : isPt ? 'Sobre o Projeto' : 'About the Project'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          {isZh
            ? '关于 crecalculators.com'
            : isEs
            ? 'Sobre crecalculators.com'
            : isPt
            ? 'Sobre crecalculators.com'
            : 'About crecalculators.com'}
        </h1>
        <p className="text-lg text-slate-700 leading-relaxed font-medium">
          {isZh ? (
            <>
              <strong>crecalculators.com</strong> 是一套免费的商业地产投资计算工具集，由独立开发者 Peter 独立构建并维护。
            </>
          ) : isEs ? (
            <>
              <strong>crecalculators.com</strong> es un conjunto gratuito de calculadoras de bienes raíces comerciales, desarrollado y mantenido por Peter, un desarrollador independiente.
            </>
          ) : isPt ? (
            <>
              O <strong>crecalculators.com</strong> é um conjunto gratuito de calculadoras para o setor imobiliário comercial, desenvolvido e mantido por Peter, um desenvolvedor independente.
            </>
          ) : (
            <>
              <strong>crecalculators.com</strong> is a free set of commercial real estate calculators, built and maintained by Peter, an independent developer.
            </>
          )}
        </p>
      </header>

      {/* Main Content Body */}
      <div className="space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        {/* Section 1: Why I Built This Site */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            {isZh ? '我为什么做这个网站' : isEs ? 'Por Qué Creé Este Sitio' : isPt ? 'Por Que Criei Este Site' : 'Why I Built This Site'}
          </h2>
          <p>
            {isZh
              ? '我创建这个网站的初衷很简单：评估一笔商业地产交易，不应该非得依赖复杂的 Excel 表格或昂贵的付费工具。'
              : isEs
              ? 'Construí este sitio porque evaluar una inversión inmobiliaria no debería requerir una hoja de cálculo compleja o herramientas de pago costosas.'
              : isPt
              ? 'Criei este site porque analisar uma transação imobiliária não deveria exigir planilhas complexas nem ferramentas pagas.'
              : "I built this site because checking a deal shouldn't require a spreadsheet or a paid tool."}
          </p>
          <p>
            {isZh ? (
              <>
                网站上的每一个计算器都完全在您的<strong>浏览器本地运行</strong>——无需创建账户、无需登录，绝不向任何服务器发送您的财务数据。每页都直观公开了计算公式，所有算例均采用真实商业地产数字，整体分析方法记录在{' '}
                <Link href={`/${locale}/editorial/`} className="text-emerald-600 font-semibold hover:underline">
                  方法论页面 (Methodology)
                </Link>
                。
              </>
            ) : isEs ? (
              <>
                Cada calculadora funciona enteramente en su navegador: sin cuentas, sin registro y sin enviar datos a ningún servidor. Las fórmulas se muestran directamente en la página, los ejemplos prácticos utilizan cifras reales y la metodología está documentada en la página de{' '}
                <Link href={`/${locale}/editorial/`} className="text-emerald-600 font-semibold hover:underline">
                  Metodología
                </Link>
                .
              </>
            ) : isPt ? (
              <>
                Cada calculadora roda 100% no seu navegador — sem necessidade de conta, sem cadastro e sem envio de dados para servidores. As fórmulas são exibidas na página, os exemplos utilizam números reais e a metodologia está documentada na página de{' '}
                <Link href={`/${locale}/editorial/`} className="text-emerald-600 font-semibold hover:underline">
                  Metodologia
                </Link>
                .
              </>
            ) : (
              <>
                Every calculator runs entirely in your browser — no account, no sign-up, and no data sent to a server. Formulas are shown on the page, worked examples use real numbers, and the methodology is documented on the{' '}
                <Link href={`/${locale}/editorial/`} className="text-emerald-600 font-semibold hover:underline">
                  Methodology page
                </Link>
                .
              </>
            )}
          </p>
        </section>

        {/* Section 2: How the Content Is Checked */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            {isZh ? '内容是如何审核与核验的' : isEs ? 'Cómo se Verifica el Contenido' : isPt ? 'Como o Conteúdo é Verificado' : 'How the Content Is Checked'}
          </h2>
          <ul className="space-y-3 list-disc pl-5 text-slate-600">
            <li>
              <strong>{isZh ? '算例逻辑验证：' : isEs ? 'Verificación de cálculos: ' : isPt ? 'Verificação de cálculos: ' : 'Calculation logic: '}</strong>
              {isZh
                ? '所有计算逻辑在发布前均对照分步手算案例逐项核验；'
                : isEs
                ? 'La lógica de cálculo se comprueba contra ejemplos paso a paso antes de su publicación;'
                : isPt
                ? 'A lógica dos cálculos é auditada com exemplos práticos antes da publicação;'
                : 'Calculation logic is verified against worked examples before publication;'}
            </li>
            <li>
              <strong>{isZh ? '参考区间分类：' : isEs ? 'Rangos de referencia: ' : isPt ? 'Faixas de referência: ' : 'Threshold ranges: '}</strong>
              {isZh
                ? '门槛区间（例如典型的商业银行审贷 DSCR 最低要求）均明确标注为市场典型参考值，绝非商业贷款承诺或担保；'
                : isEs
                ? 'Los rangos de referencia (por ejemplo, los requisitos mínimos típicos de DSCR de los bancos) se clasifican como típicos y no como garantías;'
                : isPt
                ? 'As faixas de referência (como as exigências mínimas típicas de DSCR dos bancos) são identificadas como típicas, e não como garantias;'
                : 'Threshold ranges (for example, typical lender DSCR minimums) are labeled as typical, not guarantees;'}
            </li>
            <li>
              <strong>{isZh ? '权威来源链接：' : isEs ? 'Fuentes institucionales: ' : isPt ? 'Fontes institucionais: ' : 'Sources linked: '}</strong>
              {isZh
                ? '指南文章中均附带官方机构与学术出版物数据来源链接；'
                : isEs
                ? 'Las fuentes de datos están citadas y enlazadas directamente en las guías;'
                : isPt
                ? 'As fontes de dados são citadas e linkadas diretamente nos guias;'
                : 'Sources are linked in the guides;'}
            </li>
            <li>
              <strong>{isZh ? '最后审核时间：' : isEs ? 'Fechas de revisión: ' : isPt ? 'Datas de revisão: ' : 'Review dates: '}</strong>
              {isZh
                ? '各页面均明确标注最后审查与校准日期。'
                : isEs
                ? 'Las páginas incluyen una fecha visible de última revisión.'
                : isPt
                ? 'As páginas exibem a data da última revisão.'
                : 'Pages carry a last-reviewed date.'}
            </li>
          </ul>
        </section>

        {/* Section 3: Legal & Professional Disclaimer */}
        <section className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {isZh ? '工具性质与免责声明' : isEs ? 'Aviso Legal y de Servicio' : isPt ? 'Aviso Legal e de Serviço' : 'Calculation Tool Disclaimer'}
          </h2>
          <p className="text-amber-900 text-xs sm:text-sm leading-relaxed">
            {isZh
              ? '本站纯属计算与分析工具，不是房地产经纪公司、放贷机构或投资顾问。本站不买卖、不促成交易、也不为任何物业提供融资。页面上的任何文字、数字或测算结果均不构成税务、法律或投资建议。'
              : isEs
              ? 'Este sitio es una herramienta de cálculo, no una agencia inmobiliaria, entidad crediticia ni servicio de asesoría. No compra, vende ni financia propiedades, y ningún contenido aquí constituye asesoramiento fiscal, legal o de inversión.'
              : isPt
              ? 'Este site é uma ferramenta de cálculo, não uma corretora, instituição financeira ou consultoria de investimentos. Não compramos, vendemos ou financiamos imóveis, e nenhum conteúdo aqui constitui aconselhamento tributário, jurídico ou financeiro.'
              : "This site is a calculation tool, not a brokerage, lender, or advisory service. It doesn't buy, sell, or finance properties, and nothing here is tax, legal, or investment advice."}
          </p>
        </section>

        {/* Section 4: Contact & Feedback */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {isZh ? '欢迎指正与建议' : isEs ? 'Correcciones y Sugerencias' : isPt ? 'Correções e Sugestões' : 'Corrections & Suggestions'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {isZh
                ? '如果您发现任何数字、公式或表达有误，欢迎向我们提出反馈。'
                : isEs
                ? 'Si encuentra algún error o desea sugerir una mejora, sus comentarios son bienvenidos.'
                : isPt
                ? 'Se encontrar qualquer inconsistência ou desejar sugerir melhorias, seu feedback é bem-vindo.'
                : 'Corrections and suggestions are welcome — see the Contact page.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact/`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            <Mail className="w-4 h-4" />
            <span>{isZh ? '联系我们' : isEs ? 'Página de Contacto' : isPt ? 'Página de Contato' : 'Contact Page'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </div>
    </article>
  );
}
