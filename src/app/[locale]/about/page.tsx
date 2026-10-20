import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { LOCALES, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { ShieldCheck, Building2, Award, FileSpreadsheet, ArrowRight } from 'lucide-react';

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
    ? '关于我们与编辑使命 | CRE Calculators'
    : isEs
    ? 'Sobre Nosotros y Misión Editorial | CRE Calculators'
    : isPt
    ? 'Sobre Nós e Missão Editorial | CRE Calculators'
    : 'About Us & Mission | CRE Calculators';

  const description = isZh
    ? 'CRE Calculators 致力于为商业地产投资者、经纪人及承销人员提供透明、精准的财务计算工具与尽调数据模型。'
    : isEs
    ? 'CRE Calculators proporciona herramientas de evaluación financiera y modelos de inversión transparentes e independientes para profesionales de bienes raíces comerciales.'
    : isPt
    ? 'O CRE Calculators oferece ferramentas de análise financeira e modelos de investimento transparentes e independentes para profissionais do mercado imobiliário comercial.'
    : 'CRE Calculators provides transparent, institutional-grade commercial real estate underwriting tools and financial models for investors and brokers.';

  return buildSeoMetadata({
    path: 'about',
    locale,
    title,
    description,
    noindex: true,
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
    <article className="max-w-4xl mx-auto space-y-10 py-4">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
        <Link href={`/${locale}/`} className="hover:text-emerald-600 transition-colors">{homeLabel}</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{aboutLabel}</span>
      </nav>

      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>{isZh ? '关于我们' : isEs ? 'Acerca de CRE Calculators' : isPt ? 'Sobre o CRE Calculators' : 'About CRE Calculators'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {isZh
            ? '打造专业的商业地产投资决策工具'
            : isEs
            ? 'Análisis Financiero Transparente y Potente para Bienes Raíces Comerciales'
            : isPt
            ? 'Análise Financeira Transparente e Poderosa para Imóveis Comerciais'
            : 'Transparent & Powerful Commercial Real Estate Financial Analytics'}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {isZh
            ? '我们为商业地产 (CRE) 投资者、小组成员、贷款承销员及跨国投资者提供透明、易用、不要求注册即可直接使用的决策分析工具。'
            : isEs
            ? 'Desarrollamos calculadoras y modelos de evaluación rápidos, gratuitos y 100% transparentes, diseñados específicamente para inversores, corredores y analistas de bienes raíces comerciales.'
            : isPt
            ? 'Criamos calculadoras e modelos de análise ágeis, gratuitos e 100% transparentes, projetados especificamente para investidores, corretores e analistas do mercado imobiliário comercial.'
            : 'We build fast, free, transparent underwriting and valuation calculators engineered specifically for commercial real estate professionals.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '公式完全透明' : isEs ? 'Fórmulas 100% Transparentes' : isPt ? 'Fórmulas 100% Transparentes' : 'Transparent Formulas'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '不搞“黑盒算法”。每一个指标（Cap Rate、NOI、DSCR、Cash-on-Cash 等）都公开数学逻辑与推导假设。'
              : isEs
              ? 'Cero algoritmos de "caja negra". Cada métrica (Cap Rate, NOI, DSCR, CoC, etc.) expone su lógica matemática, variables y supuestos paso a paso.'
              : isPt
              ? 'Zero algoritmos de "caixa-preta". Cada indicador (Cap Rate, NOI, DSCR, CoC, etc.) apresenta sua lógica matemática, variáveis e premissas passo a passo.'
              : 'Zero black-box calculations. Every metric provides plain-math formulas, variable definitions, and step-by-step examples.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '零门槛，不留隐私' : isEs ? 'Privacidad Primero, Sin Registro' : isPt ? 'Privacidade em Primeiro Lugar' : 'Privacy-First & No Signup'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '所有计算逻辑 100% 在你的浏览器客户端执行，不强制要求注册账号，更不会将你的交易数据存入云端数据库。'
              : isEs
              ? 'Todos los cálculos se ejecutan 100% en su navegador local. Jamás recopilamos, transferimos ni almacenamos sus cifras financieras privadas.'
              : isPt
              ? 'Todos os cálculos rodam 100% no navegador do usuário. Nunca coletamos, transferimos ou armazenamos seus dados financeiros privados em nuvem.'
              : 'All underwriting runs 100% client-side in your browser. We never collect or store your private property financial numbers.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isZh ? '行业基准参考' : isEs ? 'Estándares del Mercado' : isPt ? 'Padrões de Mercado' : 'Market Benchmarks'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isZh
              ? '定期根据全美主要都市圈（Tier 1-4）与银行机构测算标准更新参考范围，确保测算符合市场实操。'
              : isEs
              ? 'Actualizado periódicamente con rangos de referencia de Cap Rate de las principales áreas metropolitanas (Tier 1-4) y criterios bancarios.'
              : isPt
              ? 'Atualizado periodicamente com parâmetros de Cap Rate das principais regiões metropolitanas dos EUA (Tier 1-4) e critérios bancários.'
              : 'Regularly updated with Tier 1-4 US metropolitan cap rate benchmarks and DSCR lender underwriting parameters.'}
          </p>
        </div>
      </div>

      <section className="bg-slate-900 text-white rounded-2xl p-8 space-y-4">
        <h2 className="text-xl font-bold">
          {isZh
            ? '查看更多说明与指南'
            : isEs
            ? 'Metodología Editorial y Fórmulas'
            : isPt
            ? 'Metodologia Editorial e Fórmulas'
            : 'Editorial Policy & Calculation Methodology'}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          {isZh
            ? '你可以阅读我们的编辑方法论、公式假设定义，或通过联系页面向我们提出意见与功能需求。'
            : isEs
            ? 'Revise nuestras pautas metodológicas completas o póngase en contacto con nuestro equipo para enviarnos sugerencias y consultas.'
            : isPt
            ? 'Confira nossas diretrizes metodológicas completas ou entre em contato com nossa equipe para enviar sugestões e dúvidas.'
            : 'Review our complete methodology guidelines or get in touch with our product team for feedback.'}
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={`/${locale}/editorial/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
          >
            <span>{isZh ? '公式与方法论说明' : isEs ? 'Metodología de Cálculo' : isPt ? 'Metodologia de Cálculo' : 'Calculation Methodology'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/contact/`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700"
          >
            <span>{isZh ? '联系我们' : isEs ? 'Contáctenos' : isPt ? 'Fale Conosco' : 'Contact Us'}</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
