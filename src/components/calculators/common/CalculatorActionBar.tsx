'use client';

import React, { useState } from 'react';
import { Share2, Download, Printer, Bookmark, Check } from 'lucide-react';

interface Props {
  locale: string;
  onExportCsv?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  hidePrint?: boolean;
}

export function CalculatorActionBar({
  locale,
  onExportCsv,
  onSave,
  onShare,
  onPrint,
  hidePrint = false,
}: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [csvExported, setCsvExported] = useState(false);

  const labels = {
    share: isZh ? '分享' : isEs ? 'Compartir' : isPt ? 'Compartilhar' : 'Share',
    copied: isZh ? '已复制' : isEs ? 'Copiado' : isPt ? 'Copiado' : 'Copied',
    save: isZh ? '本地保存' : isEs ? 'Guardar' : isPt ? 'Salvar' : 'Save',
    saved: isZh ? '已保存' : isEs ? 'Guardado' : isPt ? 'Salvo' : 'Saved',
    csv: isZh ? '导出 CSV' : isEs ? 'Exportar CSV' : isPt ? 'Exportar CSV' : 'Export CSV',
    csvDone: isZh ? '已导出' : isEs ? 'Descargado' : isPt ? 'Baixado' : 'Downloaded',
    print: isZh ? '打印' : isEs ? 'Imprimir' : isPt ? 'Imprimir' : 'Print',
  };

  const handleShareClick = () => {
    if (onShare) onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveClick = () => {
    if (onSave) onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCsvClick = () => {
    if (onExportCsv) onExportCsv();
    setCsvExported(true);
    setTimeout(() => setCsvExported(false), 2000);
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Calculator actions"
      data-testid="calculator-action-bar"
      className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs"
    >
      {onSave && (
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={labels.save}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs font-medium"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-bold">{labels.saved}</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5 text-slate-500" />
              <span>{labels.save}</span>
            </>
          )}
        </button>
      )}

      {onExportCsv && (
        <button
          type="button"
          onClick={handleCsvClick}
          aria-label={labels.csv}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs font-medium"
        >
          {csvExported ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-bold">{labels.csvDone}</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{labels.csv}</span>
            </>
          )}
        </button>
      )}

      {!hidePrint && (
        <button
          type="button"
          onClick={handlePrintClick}
          aria-label={labels.print}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs font-medium"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>{labels.print}</span>
        </button>
      )}

      {onShare && (
        <button
          type="button"
          onClick={handleShareClick}
          aria-label={labels.share}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 active:scale-95 transition-all shadow-2xs font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-bold">{labels.copied}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{labels.share}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
