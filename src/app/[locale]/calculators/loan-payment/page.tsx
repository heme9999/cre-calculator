import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getContent } from '@/content';
import { LOCALES, SITE_URL, resolveLocale } from '@/lib/constants';
import { LoanPaymentCalculator } from '@/components/calculators/LoanPaymentCalculator';
import { LoanScenarioComparison } from '@/components/calculators/LoanScenarioComparison';
import { JsonLd, getCalculatorJsonLd } from '@/components/seo/JsonLd';
import { ArrowRight, HelpCircle, BookOpen } from 'lucide-react';

import { buildSeoMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).loanPayment;

  return buildSeoMetadata({
    path: 'calculators/loan-payment',
    locale,
    title: content.metaTitle,
    description: content.metaDescription,
  });
}

export default async function LoanPaymentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const content = getContent(locale).loanPayment;
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const homeLabel = isZh ? '首页' : isEs ? 'Inicio' : isPt ? 'Início' : 'Home';

  const jsonLdData = getCalculatorJsonLd(
    content.h1,
    content.metaDescription,
    `${SITE_URL}/${locale}/calculators/loan-payment/`,
    locale
  );

  return (
    <article className="space-y-10 py-4">
      <JsonLd data={jsonLdData} />

      {/* Page Header */}
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <nav className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-2">
          <Link href={`/${locale}/`} className="hover:text-emerald-600">{homeLabel}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{content.h1}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {content.h1}
        </h1>
        <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
          {content.subtitle}
        </p>
      </header>

      {/* Interactive Tool */}
      <section id="tool">
        <LoanPaymentCalculator locale={locale} />
      </section>

      {/* Content Body Section */}
      <div className="max-w-4xl space-y-12">
        {/* What Is & Why It Matters */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            {content.whatIsTitle}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {content.whatIsContent}
          </p>
        </section>

        {/* Formula */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.formulaTitle}</h2>
          <div className="bg-slate-900 text-emerald-400 font-mono text-sm sm:text-base p-4 rounded-xl shadow-inner whitespace-pre-line">
            <code>{content.formulaCode}</code>
          </div>
          <div className="space-y-2 pt-2">
            {content.formulaVariables.map((v, idx) => (
              <div key={idx} className="text-xs sm:text-sm flex items-start gap-2">
                <span className="font-bold text-slate-900 min-w-[180px]">{v.label}:</span>
                <span className="text-slate-600">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Worked Example */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900">{content.exampleTitle}</h2>
          <LoanScenarioComparison locale={locale} />
          <div className="pt-4 mt-4 border-t border-slate-100 text-sm text-slate-700">
            <p>
              {isZh ? (
                <>
                  上述 $2,100,000 贷款对应我们贯穿全站的 24 单元多户住宅案例（购买价 280 万，首付 25%）。计算出您的年还贷额后，请在{' '}
                  <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">
                    DSCR 计算器
                  </Link>
                  {' '}中将其与 NOI 结合评估抗风险能力，或在{' '}
                  <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">
                    Cash-on-Cash 计算器
                  </Link>
                  {' '}中测算扣除房贷后的现金回报。
                </>
              ) : isEs ? (
                <>
                  Este préstamo de $2,100,000 corresponde a nuestro ejemplo continuo de propiedad multifamiliar de 24 unidades (precio de compra de $2.8M, anticipo del 25%). Una vez obtenido el servicio anual de la deuda, combínelo con el NOI de su propiedad en la{' '}
                  <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">
                    calculadora de DSCR
                  </Link>
                  {' '}para evaluar la seguridad del financiamiento, o utilice la{' '}
                  <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">
                    calculadora de Cash-on-Cash
                  </Link>
                  {' '}para determinar su rendimiento de efectivo apalancado.
                </>
              ) : isPt ? (
                <>
                  Este financiamento de $2,100,000 corresponde ao nosso exemplo contínuo de imóvel multifamiliar de 24 unidades (preço de compra de $2,8M, 25% de entrada). Uma vez calculado o serviço anual da dívida, combine-o com o NOI do imóvel na{' '}
                  <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">
                    calculadora de DSCR
                  </Link>
                  {' '}para avaliar a segurança do endividamento, ou utilize a{' '}
                  <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">
                    calculadora de Cash-on-Cash
                  </Link>
                  {' '}para determinar seu rendimento de caixa alavancado.
                </>
              ) : (
                <>
                  This $2,100,000 loan matches our ongoing 24-unit multifamily example ($2.8M purchase price, 25% down). Once you have your annual debt service, combine it with your property&apos;s NOI to{' '}
                  <Link href={`/${locale}/calculators/dscr/`} className="text-emerald-600 hover:underline font-semibold">
                    calculate your DSCR
                  </Link>
                  {' '}to evaluate loan safety, or use the{' '}
                  <Link href={`/${locale}/calculators/cash-on-cash/`} className="text-emerald-600 hover:underline font-semibold">
                    Cash-on-Cash Return calculator
                  </Link>
                  {' '}to determine your leveraged cash yield.
                </>
              )}
            </p>
          </div>
        </section>
        {/* Guide Banner */}
        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {isZh
                  ? '深度商业贷款指南'
                  : isEs
                  ? 'Guía Completa de Financiamiento'
                  : isPt
                  ? 'Guia Completo de Financiamento'
                  : 'Comprehensive Debt Guide'}
              </span>
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              {isZh
                ? '商业地产贷款摊销与气球贷完全解析'
                : isEs
                ? 'Amortización de Préstamos Comerciales y Pagos Balloon'
                : isPt
                ? 'Amortização de Empréstimos Comerciais e Pagamentos Balão'
                : 'Commercial Loan Amortization and Balloon Loans'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {isZh
                ? '详解等额本息与等额本金差异、气球尾款测算公式、再融资风险控制，以及摊销年限如何影响全周期权益积累。'
                : isEs
                ? 'Comprenda las cuotas fijas vs decrecientes, el cálculo del saldo balloon y cómo estructurar el financiamiento comercial de forma segura.'
                : isPt
                ? 'Entenda parcelas fixas vs decrescentes, o cálculo do saldo balão e como estruturar o crédito comercial de forma segura.'
                : 'Understand fixed vs declining payments, balloon payoff calculations, refinancing risk, and how amortization schedules shape equity accumulation over time.'}
            </p>
          </div>
          <Link
            href={`/${locale}/guides/loan-amortization-and-balloon-loans/`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shrink-0 transition-all shadow-xs"
          >
            <span>
              {isZh
                ? '阅读摊销指南'
                : isEs
                ? 'Leer Guía de Amortización'
                : isPt
                ? 'Ler Guia de Amortização'
                : 'Read Amortization Guide'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            {content.faqTitle}
          </h2>
          <div className="space-y-6 divide-y divide-slate-100">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className={idx > 0 ? 'pt-6' : ''}>
                <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Calculators */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white">{content.relatedTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.relatedCalculators.map((rel) => (
              <Link
                key={rel.slug}
                href={`/${locale}/calculators/${rel.slug}/`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 flex items-center justify-between transition-all group"
              >
                <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400">
                  {rel.title}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
