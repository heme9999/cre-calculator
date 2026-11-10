import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { Mail, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '@/components/common/ContactForm';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const contactTranslations = {
  en: {
    metaTitle: 'Contact & Feedback | CRE Calculators',
    metaDescription: 'Get in touch with Peter at CRE Calculators for formula audits, bug reports, calculator suggestions, or feedback.',
    badge: 'Direct Contact & Inquiries',
    h1: 'Contact & Feedback',
    desc: 'Have technical questions regarding our calculation formulas, suggestions for the Deal Analyzer, or spotted a mathematical typo? Get in touch directly.',
    directEmail: 'Direct Developer & Feedback Email',
    directEmailSub: 'Formula audits, bug reports, and feature suggestions',
    responseTimes: 'Response Times & Review Standards',
    responseTimesDesc: 'All inquiries sent via the form below or directly to mayday0064@gmail.com are reviewed personally. We typically respond within 1–2 business days.',
    verificationBadge: 'Independent Developer · Verified Contact',
  },
  zh: {
    metaTitle: '联系与反馈 | CRE Calculators',
    metaDescription: '联系独立开发者 Peter，提出公式核验、新计算器开发需求、Bug 反馈或使用建议。',
    badge: '直接联系与反馈',
    h1: '联系与反馈',
    desc: '对计算公式推导、数据来源或指标定义有疑问？发现任何数值或排版错误？请随时与独立开发者 Peter 取得联系。',
    directEmail: '开发者直连邮箱',
    directEmailSub: '由独立开发者 Peter 亲自查收，用于公式核验、Bug 反馈与功能建议',
    responseTimes: '答复时效与反馈说明',
    responseTimesDesc: '通过下方表单或直接发送至 mayday0064@gmail.com 的邮件均会认真审阅。我们通常在 1–2 个工作日内给予邮件答复。',
    verificationBadge: '独立开发者维护 · 真实联系渠道',
  },
  es: {
    metaTitle: 'Contacto y Sugerencias | CRE Calculators',
    metaDescription: 'Póngase en contacto con Peter en CRE Calculators para auditoría de fórmulas, reporte de errores o sugerencias.',
    badge: 'Contacto Directo',
    h1: 'Contacto y Sugerencias',
    desc: '¿Tiene preguntas técnicas sobre nuestras fórmulas de cálculo, sugerencias para Deal Analyzer o detectó algún error? Escríbanos directamente.',
    directEmail: 'Correo Directo del Desarrollador',
    directEmailSub: 'Auditoría de fórmulas, reporte de errores y sugerencias',
    responseTimes: 'Tiempos de Respuesta',
    responseTimesDesc: 'Todas las consultas enviadas mediante el formulario o directamente a mayday0064@gmail.com se revisan personalmente, con respuesta habitual en 1 a 2 días hábiles.',
    verificationBadge: 'Desarrollador Independiente · Contacto Verificado',
  },
  pt: {
    metaTitle: 'Contato e Sugestões | CRE Calculators',
    metaDescription: 'Fale com Peter no CRE Calculators para auditoria de fórmulas, relato de inconsistências ou sugestões.',
    badge: 'Contato Direto',
    h1: 'Contato e Sugestões',
    desc: 'Tem dúvidas técnicas sobre fórmulas de cálculo, sugestões para o Deal Analyzer ou encontrou alguma inconsistência? Fale diretamente com o desenvolvedor.',
    directEmail: 'E-mail Direto do Desenvolvedor',
    directEmailSub: 'Auditoria de fórmulas, dúvidas e sugestões de ferramentas',
    responseTimes: 'Prazos de Resposta',
    responseTimesDesc: 'Todas as mensagens enviadas pelo formulário ou diretamente para mayday0064@gmail.com são respondidas habitualmente em 1 a 2 dias úteis.',
    verificationBadge: 'Desenvolvedor Independente · Contato Verificado',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const t = contactTranslations[locale as keyof typeof contactTranslations] || contactTranslations.en;

  return buildSeoMetadata({
    path: 'contact',
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale) as Locale;
  const t = contactTranslations[locale as keyof typeof contactTranslations] || contactTranslations.en;

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.h1}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
          {t.desc}
        </p>
      </header>

      {/* Direct Verified Email Channel */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">{t.directEmail}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">{t.directEmailSub}</p>
          <a
            href="mailto:mayday0064@gmail.com"
            className="inline-block text-emerald-600 hover:text-emerald-700 font-bold text-base hover:underline font-mono pt-1"
          >
            mayday0064@gmail.com
          </a>
        </div>

        <div className="shrink-0 text-xs text-slate-500 bg-slate-50 border border-slate-200 p-3 rounded-xl max-w-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.responseTimes}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {t.responseTimesDesc}
          </p>
        </div>
      </div>

      {/* Interactive Contact Form */}
      <section>
        <ContactForm locale={locale} />
      </section>
    </article>
  );
}
