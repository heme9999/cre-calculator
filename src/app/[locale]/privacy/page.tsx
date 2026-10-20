import React from 'react';
import { Metadata } from 'next';
import { LOCALES, resolveLocale, Locale } from '@/lib/constants';
import { buildSeoMetadata } from '@/lib/seo';
import { ShieldCheck, Lock } from 'lucide-react';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

const PRIVACY_COPY: Record<
  Locale,
  {
    metaTitle: string;
    metaDescription: string;
    badge: string;
    h1: string;
    effectiveDate: string;
    commitmentTitle: string;
    commitmentDesc: string;
    sec1Title: string;
    sec1Desc: string;
    sec2Title: string;
    sec2Desc: string;
    sec3Title: string;
    sec3Desc: string;
  }
> = {
  en: {
    metaTitle: 'Privacy Policy | CRE Calculators',
    metaDescription:
      'Learn how CRE Calculators protects your privacy. All underwriting calculation inputs run 100% locally in your browser.',
    badge: 'Privacy Policy',
    h1: 'Privacy Policy',
    effectiveDate: 'Effective Date: August 2026',
    commitmentTitle: 'Core Commitment: 100% Client-Side Processing',
    commitmentDesc:
      'When you enter financial inputs into our calculators, all processing happens locally in your browser session. We do not upload or store your financial numbers on any server.',
    sec1Title: '1. Information Collection',
    sec1Desc:
      'We do not require account creation to use any tool. We collect standard aggregated analytical information (e.g., pageviews, general geography) to optimize site performance.',
    sec2Title: '2. Cookies & Local Storage',
    sec2Desc:
      'We use local storage strictly to remember your preferences (such as selected language and deal analyzer history). You can clear this data anytime from your browser.',
    sec3Title: '3. Third-Party Services',
    sec3Desc:
      'Our website is hosted on Cloudflare network infrastructure. Cloudflare may process network-level request metrics for anti-DDoS protection and CDN acceleration.',
  },
  zh: {
    metaTitle: '隐私政策 | CRE Calculators',
    metaDescription:
      'CRE Calculators 尊重并保护所有用户的隐私。我们的计算器纯客户端运行，不收集或保存你的任何物业财务测算数据。',
    badge: '隐私声明',
    h1: '隐私政策',
    effectiveDate: '生效日期：2026年8月',
    commitmentTitle: '核心隐私承诺：所有测算数据均保存在本地',
    commitmentDesc:
      '当你在 Cap Rate、NOI、DSCR 或 Deal Analyzer 工具中输入房屋价格、租金、贷款额等物业数据时，所有计算仅在你的浏览器中处理。我们不会将其发送、上传或存储至任何云端服务器。',
    sec1Title: '1. 信息收集',
    sec1Desc:
      '我们不强制要求注册账号即可使用全站所有工具。我们仅收集标准的匿名汇总访问分析数据（例如页面浏览量、国家/地区来源），用于改进产品使用体验。',
    sec2Title: '2. Cookie 与本地存储',
    sec2Desc:
      '我们使用 Cookie 或 LocalStorage 仅用于保存你的偏好设置（如当前选中的语言版本、测试历史记录）。你可以随时清除浏览器的缓存与 LocalStorage 记录。',
    sec3Title: '3. 第三方服务',
    sec3Desc:
      '本站托管于 Cloudflare 边缘节点网络。Cloudflare 可能会收集标准的网络层访问日志（如 IP 地址、浏览器请求头），以抵御 DDoS 攻击并提供 CDN 加速。',
  },
  es: {
    metaTitle: 'Política de Privacidad | CRE Calculators',
    metaDescription:
      'Conozca cómo CRE Calculators protege su privacidad. Todos los datos financieros ingresados se procesan 100% localmente en su navegador.',
    badge: 'Política de Privacidad',
    h1: 'Política de Privacidad',
    effectiveDate: 'Fecha de entrada en vigor: Agosto de 2026',
    commitmentTitle: 'Compromiso Principal: Procesamiento 100% Local en su Navegador',
    commitmentDesc:
      'Cuando ingresa datos financieros (precio de compra, rentas, gastos o préstamos) en nuestras calculadoras o en el Deal Analyzer, todo el cálculo se ejecuta exclusivamente en su navegador. No transmitimos, subimos ni almacenamos sus cifras financieras en ningún servidor.',
    sec1Title: '1. Recopilación de Información',
    sec1Desc:
      'No exigimos el registro de cuentas ni datos personales para utilizar nuestras herramientas. Únicamente recopilamos métricas analíticas agregadas y anónimas (como vistas de página y región geográfica general) para optimizar el rendimiento del sitio.',
    sec2Title: '2. Cookies y Almacenamiento Local',
    sec2Desc:
      'Utilizamos el almacenamiento local del navegador (LocalStorage) únicamente para recordar sus preferencias de idioma y los escenarios que decida guardar voluntariamente en su dispositivo. Puede borrar estos datos en cualquier momento desde la configuración de su navegador.',
    sec3Title: '3. Servicios de Infraestructura de Terceros',
    sec3Desc:
      'Nuestro sitio web está alojado en la infraestructura de red de Cloudflare. Cloudflare puede procesar registros técnicos de red estándar para protección contra ataques DDoS y aceleración mediante CDN.',
  },
  pt: {
    metaTitle: 'Política de Privacidade | CRE Calculators',
    metaDescription:
      'Saiba como o CRE Calculators protege sua privacidade. Todos os dados financeiros inseridos são processados 100% localmente no seu navegador.',
    badge: 'Política de Privacidade',
    h1: 'Política de Privacidade',
    effectiveDate: 'Data de vigência: Agosto de 2026',
    commitmentTitle: 'Compromisso Principal: Processamento 100% Local no Navegador',
    commitmentDesc:
      'Quando você insere dados financeiros (preço de compra, aluguéis, despesas ou financiamentos) em nossas calculadoras ou no Deal Analyzer, todo o processamento ocorre exclusivamente na sessão do seu navegador. Não enviamos, carregamos nem armazenamos seus números financeiros em nenhum servidor.',
    sec1Title: '1. Coleta de Informações',
    sec1Desc:
      'Não exigimos criação de conta nem dados pessoais para utilizar qualquer ferramenta. Coletamos apenas informações analíticas agregadas e anônimas (como visualizações de página e localização geográfica geral) para otimizar o desempenho do site.',
    sec2Title: '2. Cookies e Armazenamento Local',
    sec2Desc:
      'Utilizamos o armazenamento local do navegador (LocalStorage) estritamente para lembrar suas preferências de idioma e os cenários que você optar por salvar no próprio dispositivo. Você pode limpar esses dados a qualquer momento no seu navegador.',
    sec3Title: '3. Serviços de Infraestrutura de Terceiros',
    sec3Desc:
      'Nosso site é hospedado na infraestrutura de rede da Cloudflare. A Cloudflare pode processar métricas técnicas de requisição em nível de rede para proteção contra ataques DDoS e aceleração via CDN.',
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = PRIVACY_COPY[locale] || PRIVACY_COPY.en;

  return buildSeoMetadata({
    path: 'privacy',
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    noindex: true,
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = resolveLocale(resolvedParams.locale);
  const copy = PRIVACY_COPY[locale] || PRIVACY_COPY.en;

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{copy.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {copy.h1}
        </h1>
        <p className="text-xs text-slate-500">
          {copy.effectiveDate}
        </p>
      </header>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-4">
        <Lock className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-emerald-950">
            {copy.commitmentTitle}
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {copy.commitmentDesc}
          </p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{copy.sec1Title}</h2>
          <p className="text-slate-600">{copy.sec1Desc}</p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{copy.sec2Title}</h2>
          <p className="text-slate-600">{copy.sec2Desc}</p>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h2 className="text-base font-bold text-slate-900">{copy.sec3Title}</h2>
          <p className="text-slate-600">{copy.sec3Desc}</p>
        </section>
      </div>
    </article>
  );
}
