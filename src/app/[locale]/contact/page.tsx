import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { Mail, Building2, HelpCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { ContactForm } from '@/components/common/ContactForm';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const contactTranslations = {
  en: {
    metaTitle: 'Contact Us & Editorial Inquiries | CRE Calculators',
    metaDescription: 'Get in touch with the CRE Calculators editorial desk and financial analytics team for formula verification, calculator requests, or partnerships.',
    badge: 'Contact & Editorial Desk',
    h1: 'Contact Our Underwriting & Editorial Team',
    desc: 'Have technical questions regarding our calculation formulas, data methodology, or feature suggestions? Our analysts are here to help.',
    editorialEmail: 'Editorial & Math Verification',
    editorialEmailSub: 'Formula audits, citations, and underwriting inquiries',
    partnership: 'Partnerships & Institutional Use',
    partnershipSub: 'Custom deal models, syndication templates, and API licensing',
    officeTitle: 'Office & Operating Headquarters',
    officeDesc: '100 Congress Avenue, Suite 2000, Austin, TX 78701, United States',
    responseTimes: 'Response Times & Review Standards',
    responseTimesDesc: 'We typically respond to technical mathematical queries, bug notifications, and underwriting feedback within 1–2 business days. If you are reporting a specific numerical discrepancy, please include your property type, inputs, and desired formula standard.',
  },
  zh: {
    metaTitle: '联系我们与编辑部咨询 | CRE Calculators',
    metaDescription: '联系 CRE Calculators 编辑部与量化分析团队，提出公式核验、新计算器开发需求、数据反馈或机构合作。',
    badge: '联系我们与编辑部',
    h1: '联系我们的商业地产承销与编辑团队',
    desc: '对计算公式推导、数据来源或指标定义有疑问？或者需要定制商业地产测算功能？请随时与我们的专业团队取得联系。',
    editorialEmail: '编辑部与数学逻辑核验',
    editorialEmailSub: '公式审计、引用授权与商业承销测算咨询',
    partnership: '机构定制与商务合作',
    partnershipSub: '定制尽调模型、辛迪加模板与数据接口授权',
    officeTitle: '机构地址与研究总部',
    officeDesc: '100 Congress Avenue, Suite 2000, Austin, TX 78701, United States',
    responseTimes: '答复时效与审核流程',
    responseTimesDesc: '我们通常在 1–2 个工作日内回复关于计算精度、公式假设或功能改进的邮件。如需核验具体测算偏差，请附上物业类型、具体输入数值与所参照的行业标准。',
  },
  es: {
    metaTitle: 'Contacto y Consultas Editoriales | CRE Calculators',
    metaDescription: 'Póngase en contacto con el equipo editorial y de análisis de CRE Calculators para verificación de fórmulas o alianzas.',
    badge: 'Contacto y Mesa Editorial',
    h1: 'Contacte a Nuestro Equipo de Análisis y Evaluación',
    desc: '¿Tiene preguntas técnicas sobre nuestras fórmulas matemáticas, metodología o sugerencias de herramientas? Nuestro equipo está a su disposición.',
    editorialEmail: 'Mesa Editorial y Auditoría Matemática',
    editorialEmailSub: 'Auditoría de fórmulas, citas y consultas de evaluación',
    partnership: 'Alianzas Comerciales e Integraciones',
    partnershipSub: 'Modelos personalizados, plantillas sindicadas y API',
    officeTitle: 'Sede y Oficina de Investigación',
    officeDesc: '100 Congress Avenue, Suite 2000, Austin, TX 78701, Estados Unidos',
    responseTimes: 'Tiempos de Respuesta y Estándares',
    responseTimesDesc: 'Respondemos a consultas técnicas sobre fórmulas y reportes en un plazo habitual de 1 a 2 días hábiles. Al reportar una discrepancia numérica, incluya el tipo de activo y sus variables.',
  },
  pt: {
    metaTitle: 'Contato e Mesa Editorial | CRE Calculators',
    metaDescription: 'Entre em contato com a equipe editorial e de modelagem do CRE Calculators para verificação de fórmulas e parcerias.',
    badge: 'Contato e Mesa Editorial',
    h1: 'Fale com Nossa Equipe Editorial e de Underwriting',
    desc: 'Tem dúvidas técnicas sobre fórmulas matemáticas, fontes de dados ou deseja sugerir novas ferramentas? Nossa equipe está pronta para atendê-lo.',
    editorialEmail: 'Mesa Editorial e Auditoria Matemática',
    editorialEmailSub: 'Auditoria de fórmulas, citações e dúvidas de modelagem',
    partnership: 'Parcerias Institucionais e API',
    partnershipSub: 'Modelos customizados, templates de syndication e integração',
    officeTitle: 'Sede e Escritório de Pesquisa',
    officeDesc: '100 Congress Avenue, Suite 2000, Austin, TX 78701, Estados Unidos',
    responseTimes: 'Prazos de Resposta e Padrões de Revisão',
    responseTimesDesc: 'Normalmente respondemos a dúvidas sobre precisão de cálculo e melhorias em 1 a 2 dias úteis. Ao enviar um caso específico, inclua o tipo de imóvel e as variáveis utilizadas.',
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
  const locale = resolveLocale(resolvedParams.locale) as Locale;
  const t = contactTranslations[locale as keyof typeof contactTranslations] || contactTranslations.en;

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-4">
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

      {/* Direct Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.editorialEmail}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.editorialEmailSub}</p>
          </div>
          <a
            href="mailto:editorial@crecalculators.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline font-mono"
          >
            editorial@crecalculators.com
          </a>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{t.partnership}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{t.partnershipSub}</p>
          </div>
          <a
            href="mailto:mayday0064@gmail.com"
            className="inline-block text-emerald-600 font-bold text-sm hover:underline font-mono"
          >
            mayday0064@gmail.com
          </a>
        </div>
      </div>

      {/* Interactive Contact Form */}
      <section>
        <ContactForm locale={locale} />
      </section>

      {/* Physical Address & Response SLA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{t.officeTitle}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {t.officeDesc}
          </p>
          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Registered Business Entity & Research Desk</span>
          </div>
        </section>

        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>{t.responseTimes}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t.responseTimesDesc}
          </p>
        </section>
      </div>
    </article>
  );
}
