import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  locale: string;
}

export function ComplianceDisclaimer({ locale }: Props) {
  const getDisclaimerText = (loc: string) => {
    switch (loc) {
      case 'zh':
        return '免责声明：CRE Calculators 提供的所有计算结果、行业基准及测算模型仅供财务分析与初步尽调参考，不构成任何投资建议、法律意见或税务筹划方案。商业地产投资涉及市场波动与本金风险，在做出正式投资或贷款承诺前，请务必咨询专业商业地产经纪人、注册会计师 (CPA) 或专业律师。';
      case 'es':
        return 'Aviso Legal de Análisis Financiero: Las fórmulas, cálculos, referencias de mercado y escenarios de estrés provistos por CRE Calculators están diseñados exclusivamente con fines educativos y de estimación preliminar. No constituyen asesoramiento financiero, de inversión, legal o tributario. Las transacciones inmobiliarias comerciales conllevan un riesgo de capital considerable. Siempre consulte a corredores comerciales acreditados, contadores públicos certificados (CPA) y asesores legales antes de celebrar acuerdos vinculantes.';
      case 'pt':
        return 'Aviso Legal de Análise Financeira: As fórmulas, cálculos, parâmetros de mercado e cenários de estresse fornecidos pelo CRE Calculators são destinados exclusivamente para fins educativos e de estimativa preliminar. Não constituem consultoria financeira, de investimentos, jurídica ou tributária. Investimentos em imóveis comerciais envolvem riscos de capital significativos. Sempre consulte corretores credenciados, contadores certificados (CPA) e assessoria jurídica antes de firmar contratos vinculantes.';
      default:
        return 'Financial Analysis Disclaimer: The formulas, calculations, market benchmarks, and stress scenarios provided by CRE Calculators are designed strictly for educational and underwriting estimation purposes. They do not constitute financial, investment, legal, or tax advice. Commercial real estate acquisitions involve substantial capital risk. Always consult licensed CRE brokers, certified CPAs, and legal counsel prior to executing binding transactions.';
    }
  };

  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {getDisclaimerText(locale)}
        </p>
      </div>
    </footer>
  );
}
