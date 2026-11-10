import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { FileText, AlertTriangle, ShieldCheck, Scale, CheckCircle2, HelpCircle } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const TERMS_COPY = {
  en: {
    metaTitle: 'Terms of Use & Financial Disclaimer | CRE Calculators',
    metaDescription: 'Terms of Use, financial disclaimers, client-side execution principles, and intellectual property terms for CRE Calculators.',
    badge: 'Terms of Service',
    h1: 'Terms of Use & Financial Disclaimers',
    effectiveDate: 'Last Updated & Reviewed: November 2026',
    disclaimerTitle: 'Important Financial, Legal, and Investment Notice',
    disclaimerDesc: 'All tools, financial formulas, worked examples, and market guidelines provided on crecalculators.com are for educational and estimation purposes only. They do not constitute legal, tax (CPA), mortgage brokering, or registered investment advice. Always consult a qualified professional before executing commercial real estate transactions.',
    sections: [
      {
        title: '1. Permitted Use & Browser Execution',
        content: 'crecalculators.com is provided as a free calculation resource. All financial computations run entirely in your local browser. No account registration, fee payment, or server-side transmission of deal numbers is required. You are permitted to use our online calculators and download CSV and PDF summary exports for personal deal screening, client presentations, investment committee reviews, and educational research.',
      },
      {
        title: '2. Calculation Accuracy & Estimation Nature',
        content: 'While all mathematical formulas and worked examples are verified against standard commercial real estate underwriting practices before publication, real-world property performance depends on unique lease terms, local property tax assessments, tenant credit quality, and changing interest rates. Threshold ranges (such as standard DSCR lender minimums) are provided as general benchmarks, not lending guarantees.',
      },
      {
        title: '3. No Brokerage, Advisory, or Lending Relationship',
        content: 'crecalculators.com is an independent calculation tool built and maintained by Peter. It is not a real estate brokerage, direct commercial lender, mortgage broker, or fiduciary investment advisory service. We do not originate, broker, or service loans, nor do we buy or sell real estate assets.',
      },
      {
        title: '4. Third-Party Advertising & Cookie Usage',
        content: 'This website utilizes Google AdSense to display automated digital advertisements. Third-party vendors, including Google, use cookies to serve ads based on prior visits to this and other websites. You may manage or opt out of personalized advertising by visiting Google Ad Settings or aboutads.info.',
      },
      {
        title: '5. Intellectual Property & Exported Reports',
        content: 'The user interface, proprietary design, and educational narrative are protected by copyright. However, financial summary tables, CSV data exports, and PDF reports generated from your specific inputs are yours to distribute freely in your deal memoranda and investor presentations.',
      },
      {
        title: '6. Limitation of Liability',
        content: 'In no event shall crecalculators.com or its creator be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this site, or from any investment decisions made in reliance upon calculations, estimates, or benchmarks provided herein.',
      },
    ],
  },
  zh: {
    metaTitle: '服务条款与财务免责声明 | CRE Calculators',
    metaDescription: 'CRE Calculators 网站服务条款、浏览器本地测算原则、知识产权及财务免责声明。',
    badge: '服务条款',
    h1: '服务条款与财务免责声明',
    effectiveDate: '最后更新与审查：2026年11月',
    disclaimerTitle: '重要财务、法律与投资免责声明',
    disclaimerDesc: 'crecalculators.com 提供的所有商业地产计算器、公式推导、数据模型及指南文章仅供财务估算与教学参考，不构成任何形式的法律、税务（如 1031 Exchange 资格判断）或注册投资顾问建议。在做任何真实交易决策前，请务必咨询您的 CPA、执业律师及专业商业地产经纪。',
    sections: [
      {
        title: '1. 允许的使用规范与本地运算',
        content: 'crecalculators.com 作为免费的商业地产计算工具集开放使用。网站上的所有数学计算均 100% 在您的浏览器本地运行，无需注册账户、无需付费，且绝不向任何外部服务器传输您的财务数据。您可以自由使用本站工具、下载 CSV 及导出 PDF 尽调摘要，用于个人交易分析、团队研讨、客户展示及学术研究。',
      },
      {
        title: '2. 计算精度与测算假设',
        content: '尽管所有计算逻辑与算例在发布前均对照标准分步案例逐项核验，但实际商业不动产交易受租约条款、市政税政重估、租户信用评级及利率波动等复杂变量影响。各页面标注的门槛区间（如银行典型的 1.25x DSCR 底线）仅为市场典型参考值，绝非贷款批准保证。',
      },
      {
        title: '3. 非经纪公司、放贷机构或咨询顾问',
        content: 'crecalculators.com 纯属由独立开发者 Peter 构建并维护的量化分析计算工具。本站不是房地产经纪公司、直接放贷方、贷款中介或注册投资顾问，不买卖、不促成交易、亦不为任何商业不动产提供融资服务。',
      },
      {
        title: '4. 第三方广告与 Cookie 使用',
        content: '本站使用 Google AdSense 展示自适应数字广告。包括 Google 在内的第三方服务商会使用 Cookie 根据用户过往浏览记录展示个性化广告。用户可随时访问 Google 广告设置或 aboutads.info 选择退出个性化广告跟踪。',
      },
      {
        title: '5. 知识产权与导出报告使用权',
        content: '本站的设计系统、交互界面与原创深度指南内容受知识产权法保护。但是，由您的自定义输入数据衍生生成的 CSV 数据表格与 PDF 分析报告，您可以完全自由地用于商业承销备忘录、合伙人提案与客户演示中。',
      },
      {
        title: '6. 法律责任限制',
        content: '在适用法律允许的最大范围内，crecalculators.com 及其开发者对因使用或无法使用本网站工具、或因信赖本网站提供的测算数字、基准利差而作出的任何投资决策及其造成的任何直接或间接财务损失概不承担法律责任。',
      },
    ],
  },
  es: {
    metaTitle: 'Términos de Uso y Descargo Financiero | CRE Calculators',
    metaDescription: 'Términos de uso, descargos de responsabilidad financiera y normas de propiedad intelectual de CRE Calculators.',
    badge: 'Términos de Servicio',
    h1: 'Términos de Uso y Descargo de Responsabilidad',
    effectiveDate: 'Última revisión: Noviembre 2026',
    disclaimerTitle: 'Aviso Financiero y Legal Importante',
    disclaimerDesc: 'Todas las calculadoras, modelos financieros, supuestos ilustrativos y guías de crecalculators.com tienen fines exclusivamente educativos y de estimación preliminar. No constituyen asesoramiento legal, fiscal o de inversión formal.',
    sections: [
      {
        title: '1. Uso Permitido y Ejecución Local',
        content: 'crecalculators.com se ofrece como un recurso gratuito. Todos los cálculos se ejecutan íntegramente en su navegador local sin requerir registro ni enviar parámetros financieros a servidores externos. Los reportes exportados en PDF y CSV pueden usarse libremente en análisis y presentaciones.',
      },
      {
        title: '2. Precisión y Naturaleza de las Estimaciones',
        content: 'Aunque las fórmulas matemáticas se verifican antes de su publicación, las condiciones reales del mercado y los criterios bancarios varían. Los umbrales de referencia son orientativos y no representan garantías de financiamiento.',
      },
      {
        title: '3. Independencia de Servicios de Corretaje o Crédito',
        content: 'Este sitio es una herramienta analítica independiente desarrollada por Peter. No es una correduría inmobiliaria ni una entidad crediticia, y no financia ni intermedia propiedades.',
      },
      {
        title: '4. Publicidad y Cookies de Terceros',
        content: 'Utilizamos Google AdSense para mostrar publicidad relevante. Google y otros proveedores emplean cookies para personalizar anuncios según visitas previas. Puede inhabilitar los anuncios personalizados en Google Ad Settings.',
      },
      {
        title: '5. Propiedad Intelectual',
        content: 'El diseño del sitio y los textos de las guías están protegidos. Sin embargo, los reportes e informes generados a partir de sus datos ingresados son de su libre disposición para uso profesional.',
      },
      {
        title: '6. Limitación de Responsabilidad',
        content: 'En ningún caso el sitio ni sus administradores serán responsables de decisiones de inversión o pérdidas derivadas del uso de las calculadoras o supuestos presentados.',
      },
    ],
  },
  pt: {
    metaTitle: 'Termos de Uso e Isenção de Responsabilidade | CRE Calculators',
    metaDescription: 'Termos de uso, avisos de isenção financeira e diretrizes de utilização das ferramentas do CRE Calculators.',
    badge: 'Termos de Serviço',
    h1: 'Termos de Uso e Isenção de Responsabilidade',
    effectiveDate: 'Última revisão: Novembro 2026',
    disclaimerTitle: 'Aviso Financeiro e Jurídico Importante',
    disclaimerDesc: 'Todas as ferramentas, fórmulas e simulações do crecalculators.com possuem caráter puramente educativo e de estimativa preliminar. Não constituem aconselhamento tributário, jurídico ou financeiro.',
    sections: [
      {
        title: '1. Uso Permitido e Processamento Local',
        content: 'O crecalculators.com é disponibilizado como ferramenta gratuita. Todos os cálculos rodam integralmente no seu navegador, sem necessidade de login nem transmissão de dados confidenciais para servidores. Relatórios em PDF e CSV podem ser utilizados livremente em análises e apresentações.',
      },
      {
        title: '2. Precisão e Natureza das Estimativas',
        content: 'Embora as fórmulas sejam rigorosamente testadas, o desempenho real de imóveis depende de contratos específicos e taxas bancárias dinâmicas. Faixas de referência de mercado são indicativas e não garantias.',
      },
      {
        title: '3. Natureza Independente da Ferramenta',
        content: 'Este site é uma plataforma independente criada por Peter. Não atuamos como corretora, banco ou assessoria de investimentos, e não financiamos nem intermediamos transações imobiliárias.',
      },
      {
        title: '4. Publicidade e Cookies de Terceiros',
        content: 'O site exibe anúncios automáticos via Google AdSense. Fornecedores terceiros utilizam cookies para veiculação de anúncios personalizados. É possível desativar a personalização nas configurações do Google.',
      },
      {
        title: '5. Propriedade Intelectual',
        content: 'A interface e os conteúdos analíticos são protegidos. No entanto, os relatórios gerados a partir de seus próprios dados são de seu uso exclusivo para apresentações a investidores.',
      },
      {
        title: '6. Limitação de Responsabilidade',
        content: 'Em nenhuma circunstância o crecalculators.com ou seus criadores serão responsáveis por decisões de investimento ou perdas decorrentes de cálculos ou estimativas obtidos neste site.',
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const t = TERMS_COPY[locale as keyof typeof TERMS_COPY] || TERMS_COPY.en;

  return buildSeoMetadata({
    path: 'terms',
    locale,
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function TermsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale) as Locale;
  const t = TERMS_COPY[locale as keyof typeof TERMS_COPY] || TERMS_COPY.en;

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{t.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t.h1}
        </h1>
        <p className="text-xs text-slate-500 font-semibold tracking-wide">
          {t.effectiveDate}
        </p>
      </header>

      {/* Primary Legal Disclaimer Card */}
      <section className="bg-amber-50/90 border border-amber-200 rounded-2xl p-6 md:p-8 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t.disclaimerTitle}</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
          {t.disclaimerDesc}
        </p>
      </section>

      {/* Detailed Terms Sections */}
      <div className="space-y-6">
        {t.sections.map((sec, idx) => (
          <section key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sec.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {sec.content}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}
