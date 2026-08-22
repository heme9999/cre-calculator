import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  locale: string;
}

export function ComplianceDisclaimer({ locale }: Props) {
  const isZh = locale === 'zh';

  return (
    <footer className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-2">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {isZh
            ? '免责声明：CRE Calculators 提供的所有计算结果、行业基准及测算模型仅供财务分析与初步尽调参考，不构成任何投资建议、法律意见或税务筹划方案。商业地产投资涉及市场波动与本金风险，在做出正式投资或贷款承诺前，请务必咨询专业商业地产经纪人、注册会计师 (CPA) 或专业律师。'
            : 'Financial Analysis Disclaimer: The formulas, calculations, market benchmarks, and stress scenarios provided by CRE Calculators are designed strictly for educational and underwriting estimation purposes. They do not constitute financial, investment, legal, or tax advice. Commercial real estate acquisitions involve substantial capital risk. Always consult licensed CRE brokers, certified CPAs, and legal counsel prior to executing binding transactions.'}
        </p>
      </div>
    </footer>
  );
}
