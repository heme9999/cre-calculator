import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { Mail, Building2, HelpCircle } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const contactTranslations = {
  en: {
    metaTitle: 'Contact Us | CRE Calculators',
    metaDescription: 'Get in touch with the CRE Calculators team for feature requests, calculator suggestions, or business inquiries.',
    badge: 'Contact Us',
    h1: 'We’d Love to Hear Your Feedback',
    desc: 'Have questions about calculation formulas or feature requests? Contact our team anytime.',
    directEmail: 'Direct Email',
    directEmailSub: 'General inquiries and support',
    partnership: 'Partnership & Media',
    partnershipSub: 'White-label reports & API access',
    responseTimes: 'Response Times',
    responseTimesDesc: 'We typically respond to all feedback within 1-2 business days.',
  },
  zh: {
    metaTitle: '联系我们 | CRE Calculators',
    metaDescription: '欢迎通过邮件与建议表单联系 CRE Calculators 团队，提出计算器需求、功能改进建议或商业合作。',
    badge: '联系与反馈',
    h1: '有任何建议或计算需求？与我们联系',
    desc: '不管是计算逻辑疑问、新计算器需求建议，还是数据合作，请随时与我们的产品团队联系。',
    directEmail: '电子邮件',
    directEmailSub: '一般反馈与数据问题咨询',
    partnership: '商业与合作',
    partnershipSub: '机构白标、定制工具与数据合作',
    responseTimes: '常见问题与答复时间',
    responseTimesDesc: '我们会在 1-2 个工作日内回复所有关于计算精度、公式假设或功能需求的邮件。如果是定制需求，请在邮件中包含具体指标说明。',
  },
  es: {
    metaTitle: 'Contacto y Soporte | CRE Calculators',
    metaDescription: 'Póngase en contacto con el equipo de CRE Calculators para sugerencias, consultas sobre fórmulas o alianzas comerciales.',
    badge: 'Contacto y Sugerencias',
    h1: '¿Tiene Sugerencias o Dudas? Contáctenos',
    desc: '¿Tiene preguntas sobre nuestras fórmulas de cálculo o desea solicitar nuevas herramientas? Escríbanos en cualquier momento.',
    directEmail: 'Correo Electrónico Directo',
    directEmailSub: 'Consultas generales y soporte técnico',
    partnership: 'Alianzas Comerciales y Prensa',
    partnershipSub: 'Informes personalizados, integraciones y API',
    responseTimes: 'Tiempos de Respuesta',
    responseTimesDesc: 'Respondemos a todas las consultas sobre precisión de cálculos, fórmulas o nuevas funciones en un plazo de 1 a 2 días hábiles.',
  },
  pt: {
    metaTitle: 'Contato e Suporte | CRE Calculators',
    metaDescription: 'Entre em contato com a equipe da CRE Calculators para sugestões, dúvidas sobre fórmulas ou parcerias comerciais.',
    badge: 'Contato e Sugestões',
    h1: 'Tem Dúvidas ou Sugestões? Fale Conosco',
    desc: 'Tem dúvidas sobre fórmulas de cálculo ou sugestões de novas calculadoras? Entre em contato a qualquer momento.',
    directEmail: 'E-mail Direto',
    directEmailSub: 'Dúvidas gerais e suporte técnico',
    partnership: 'Parcerias e Imprensa',
    partnershipSub: 'Relatórios personalizados, API e parcerias institucionais',
    responseTimes: 'Tempo de Resposta',
    responseTimesDesc: 'Respondemos a todas as mensagens sobre precisão de cálculo, fórmulas ou novas funcionalidades em 1 a 2 dias úteis.',
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
    noindex: true,
  });
}

export default async function ContactPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const t = contactTranslations[locale as keyof typeof contactTranslations] || contactTranslations.en;

  return (
    <article className="max-w-3xl mx-auto space-y-10 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.h1}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          {t.desc}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.directEmail}</h3>
            <p className="text-xs text-slate-500 mt-1">{t.directEmailSub}</p>
          </div>
          <a
            href="mailto:mayday0064@gmail.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline"
          >
            mayday0064@gmail.com
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.partnership}</h3>
            <p className="text-xs text-slate-500 mt-1">{t.partnershipSub}</p>
          </div>
          <a
            href="mailto:mayday0064@gmail.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline"
          >
            mayday0064@gmail.com
          </a>
        </div>
      </div>

      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          {t.responseTimes}
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.responseTimesDesc}
        </p>
      </section>
    </article>
  );
}
