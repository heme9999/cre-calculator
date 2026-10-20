import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { FileText, AlertTriangle } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TERMS_COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    h1: string;
    effectiveDate: string;
    disclaimerTitle: string;
    disclaimerDesc: string;
    sec1Title: string;
    sec1Desc: string;
    sec2Title: string;
    sec2Desc: string;
  }
> = {
  en: {
    metaTitle: 'Terms of Use | CRE Calculators',
    metaDescription:
      'Terms of Use and financial disclaimers for using CRE Calculators tools and services.',
    badge: 'Terms of Use',
    h1: 'Terms of Use & Financial Disclaimer',
    effectiveDate: 'Effective Date: August 2026',
    disclaimerTitle: 'Important Financial & Legal Disclaimer',
    disclaimerDesc:
      'All tools, financial models, and market guidelines provided on this website are for educational and estimation purposes only. They do not constitute legal, CPA tax advice, or formal underwriting commitments. Always consult a qualified professional before executing real estate transactions.',
    sec1Title: '1. Permitted Use',
    sec1Desc:
      'You are free to use our online calculators and exported PDF deal summaries for personal, team, or professional underwriting exploration and client presentations.',
    sec2Title: '2. Accuracy & Limitation of Liability',
    sec2Desc:
      'While we strive for mathematical accuracy, real estate market conditions and loan underwriting guidelines vary dynamically. We assume no liability for investment decisions made using calculations or illustrative examples from this website.',
  },
  zh: {
    metaTitle: '服务条款 | CRE Calculators',
    metaDescription:
      '使用 CRE Calculators 网站工具与服务的相关条款、计算免责声明及知识产权说明。',
    badge: '服务条款',
    h1: '服务条款与财务免责声明',
    effectiveDate: '生效日期：2026年8月',
    disclaimerTitle: '重要财务与法律免责声明',
    disclaimerDesc:
      '本网站提供的所有商业地产计算器、公式推导、数据模型及指南文章仅供财务估算与参考，不构成任何形式的法律、税务（如 1031 Exchange 资格判断）或注册投资顾问建议。在做任何真实交易决策前，请务必咨询你的 CPA、执业律师及专业商业地产经纪。',
    sec1Title: '1. 允许的使用规范',
    sec1Desc:
      '你可以将本站计算器、导出生成的 PDF 摘要及分析图表用于个人交易评估、团队内部研讨、客户展示及商业地产提案。',
    sec2Title: '2. 计算精度与免责',
    sec2Desc:
      '尽管我们致力于确保计算逻辑的准确性，但真实商业地产尽调受特定城市法规、租约细节、利率波动等复杂变量影响。本站不对因使用本计算器或教学示例导致的任何直接或间接投资损失承担法律责任。',
  },
  es: {
    metaTitle: 'Términos de Uso | CRE Calculators',
    metaDescription:
      'Términos de uso y descargos de responsabilidad financiera para las herramientas y guías de CRE Calculators.',
    badge: 'Términos de Uso',
    h1: 'Términos de Uso y Descargo de Responsabilidad Financiera',
    effectiveDate: 'Fecha de entrada en vigor: Agosto de 2026',
    disclaimerTitle: 'Aviso Financiero y Legal Importante',
    disclaimerDesc:
      'Todas las calculadoras, modelos financieros, supuestos ilustrativos y guías de este sitio web tienen fines exclusivamente educativos y de estimación preliminar. No constituyen asesoramiento legal, fiscal o contable (como la calificación de un intercambio 1031) ni compromisos formales de financiamiento. Consulte siempre a un contador público certificado (CPA), abogado inmobiliario y corredor calificado antes de tomar decisiones de inversión.',
    sec1Title: '1. Uso Permitido',
    sec1Desc:
      'Usted puede utilizar libremente nuestras calculadoras en línea y los resúmenes exportados en PDF o CSV para análisis personales, discusiones internas de equipo y presentaciones preliminares.',
    sec2Title: '2. Exactitud y Limitación de Responsabilidad',
    sec2Desc:
      'Aunque procuramos mantener la precisión matemática de nuestras fórmulas, las condiciones del mercado inmobiliario comercial y los criterios bancarios de otorgamiento de crédito cambian continuamente. CRE Calculators no asume responsabilidad alguna por pérdidas directas o indirectas derivadas de decisiones de inversión basadas en este sitio.',
  },
  pt: {
    metaTitle: 'Termos de Uso | CRE Calculators',
    metaDescription:
      'Termos de uso e avisos de isenção de responsabilidade financeira para as ferramentas e guias do CRE Calculators.',
    badge: 'Termos de Uso',
    h1: 'Termos de Uso e Isenção de Responsabilidade Financeira',
    effectiveDate: 'Data de vigência: Agosto de 2026',
    disclaimerTitle: 'Aviso Financeiro e Jurídico Importante',
    disclaimerDesc:
      'Todas as calculadoras, modelos financeiros, premissas ilustrativas e guias disponibilizados neste site têm finalidade exclusivamente educacional e de estimativa preliminar. Não constituem consultoria jurídica, contábil ou tributária (como elegibilidade para Troca 1031), nem compromisso formal de financiamento. Consulte sempre um contador (CPA), advogado especializado e corretor qualificado antes de realizar transações imobiliárias.',
    sec1Title: '1. Uso Permitido',
    sec1Desc:
      'Você pode utilizar livremente nossas calculadoras online e os relatórios exportados em PDF ou CSV para análises pessoais, estudos em equipe e apresentações preliminares.',
    sec2Title: '2. Precisão e Limitação de Responsabilidade',
    sec2Desc:
      'Embora busquemos assegurar o rigor matemático das fórmulas apresentadas, as condições do mercado imobiliário comercial e os critérios bancários de crédito variam dinamicamente. O CRE Calculators não assume qualquer responsabilidade por perdas diretas ou indiretas decorrentes de decisões de investimento baseadas neste site.',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = TERMS_COPY[locale] || TERMS_COPY.en;

  return buildSeoMetadata({
    path: 'terms',
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    noindex: true,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = TERMS_COPY[locale] || TERMS_COPY.en;

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{copy.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {copy.h1}
        </h1>
        <p className="text-xs text-slate-500">
          {copy.effectiveDate}
        </p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-amber-950">
            {copy.disclaimerTitle}
          </h3>
          <p className="text-xs text-amber-900 leading-relaxed">
            {copy.disclaimerDesc}
          </p>
        </div>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{copy.sec1Title}</h2>
          <p className="text-slate-600">{copy.sec1Desc}</p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{copy.sec2Title}</h2>
          <p className="text-slate-600">{copy.sec2Desc}</p>
        </section>
      </div>
    </article>
  );
}
