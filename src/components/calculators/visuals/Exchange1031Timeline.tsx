'use client';

import React from 'react';
import { Clock, ShieldAlert, AlertCircle } from 'lucide-react';

interface Props {
  locale: string;
}

export function Exchange1031Timeline({ locale }: Props) {
  const isZh = locale === 'zh';
  const isEs = locale === 'es';
  const isPt = locale === 'pt';

  return (
    <figure className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 text-left my-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold" aria-hidden="true">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {isZh
                ? '1031 Exchange 法定时间节点关键时间轴'
                : isEs
                ? 'Reglas Cronológicas Legales del Intercambio 1031'
                : isPt
                ? 'Cronograma Legal e Prazos Obrigatórios da Troca 1031'
                : '1031 Exchange Statutory Timeline Rules'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {isZh
                ? 'IRS 严格执行的日历天数规则（含周末及节假日，通常不可延期）'
                : isEs
                ? 'Plazos estrictos en días naturales del IRS (sin prórroga)'
                : isPt
                ? 'Prazos estritos em dias corridos da Receita Federal dos EUA (IRS, sem prorrogação)'
                : 'Strict IRS Calendar Day Deadlines (Non-extendable)'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Timeline Diagram */}
      <div className="relative pt-2 pb-2">
        {/* Horizontal connector line on desktop */}
        <div className="hidden md:block absolute top-[36px] left-[15%] right-[15%] h-1 bg-slate-200 z-0" aria-hidden="true" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Milestone 1: Day 0 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 relative">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0" aria-hidden="true">
                0
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {isZh ? '第 0 天：原物业过户' : isEs ? 'Día 0: Cierre de la Venta' : isPt ? 'Dia 0: Fechamento da Venda' : 'Day 0: Sale Closes'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isZh ? '起算日 (Relinquished Property)' : isEs ? 'Inicio del Plazo de Intercambio' : isPt ? 'Início da Contagem do Prazo' : 'Start of Exchange Clock'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isZh
                ? '转让原物业产权。全部售房款必须由合格中介人 (QI) 直接托管，纳税人不得触碰资金。'
                : isEs
                ? 'Se transfiere la titularidad del inmueble cedido. Todos los fondos deben ser retenidos directamente por un Intermediario Calificado (QI).'
                : isPt
                ? 'A titularidade do imóvel cedido é transferida. Todos os recursos da venda devem ser mantidos diretamente por um Intermediário Qualificado (QI).'
                : 'Relinquished property title is transferred. All proceeds must be held directly by a Qualified Intermediary (QI).'}
            </p>
          </div>

          {/* Milestone 2: Day 45 */}
          <div className="bg-amber-50/80 p-4 rounded-xl border-2 border-amber-300 shadow-xs space-y-2 relative">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0" aria-hidden="true">
                45
              </div>
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  {isZh ? '第 45 天：识别期截止' : isEs ? 'Día 45: Identificación' : isPt ? 'Dia 45: Identificação' : 'Day 45: Identification'}
                </span>
                <span className="text-[10px] text-amber-800 font-bold">
                  {isZh ? '45-Day Identification Window' : isEs ? 'Ventana Estricta de 45 Días' : isPt ? 'Janela Estrita de 45 Dias' : 'Strict 45-Day Window'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              {isZh
                ? '必须以书面形式向 QI 明确提交意向替代物业清单（遵循 3 处物业规则或 200% 价值规则）。'
                : isEs
                ? 'Debe identificar los inmuebles de reemplazo por escrito ante el QI (Regla de 3 Inmuebles o Regla del 200% del Valor).'
                : isPt
                ? 'Deve identificar os imóveis substitutos formalmente por escrito ao QI (Regra dos 3 Imóveis ou Regra dos 200% do Valor).'
                : 'Must identify replacement properties in writing to QI (3-Property Rule or 200% Value Rule).'}
            </p>
          </div>

          {/* Milestone 3: Day 180 */}
          <div className="bg-emerald-50/80 p-4 rounded-xl border-2 border-emerald-300 shadow-xs space-y-2 relative">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0" aria-hidden="true">
                180
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  {isZh ? '第 180 天：置换期截止' : isEs ? 'Día 180: Cierre de la Compra' : isPt ? 'Dia 180: Conclusão da Compra' : 'Day 180: Purchase Closes'}
                </span>
                <span className="text-[10px] text-emerald-800 font-bold">
                  {isZh ? '180-Day Exchange Deadline' : isEs ? 'Fecha Límite Final de Cierre' : isPt ? 'Prazo Final para Fechamento' : 'Final Closing Deadline'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              {isZh
                ? '必须在第 180 天或当年纳税申报截止日（取较早者）之前完成所选替代物业的最终交割与放款。'
                : isEs
                ? 'Debe cerrar la compra del inmueble de reemplazo identificado dentro de los 180 días o antes de la fecha límite de declaración de impuestos (lo que ocurra primero).'
                : isPt
                ? 'Deve concluir a escritura do imóvel substituto identificado em até 180 dias ou na data de entrega da declaração de IR (o que ocorrer primeiro).'
                : 'Must close title on identified replacement property within 180 days or tax filing date (whichever is earlier).'}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Legal & Timeline Explanations */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 space-y-2 text-xs text-slate-700">
        <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
          <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
          {isZh ? '法定时间轴核心合规要点：' : isEs ? 'Puntos clave de cumplimiento legal:' : isPt ? 'Pontos-chave de conformidade legal:' : 'Key Statutory 1031 Timeline Rules:'}
        </span>
        <ul className="space-y-1.5 text-slate-600 pl-5 list-disc text-[11px] leading-relaxed">
          {isZh ? (
            <>
              <li>两项期限通常从转让原物业之日起计算。</li>
              <li>45天识别期和180天交换期同时开始计算，并非先后相加（总期限为 180 天，而非 45 + 180 天）。</li>
              <li>期限通常按日历日计算，包括周末和节假日。</li>
              <li>如果纳税申报截止日在第180天之前且未有效延期，交换截止日可能提前。</li>
              <li>相关期限通常非常严格，应咨询合格中介人与税务顾问。</li>
            </>
          ) : isEs ? (
            <>
              <li>Ambos plazos comienzan generalmente en la fecha en que se transfiere el inmueble cedido.</li>
              <li>El período de identificación de 45 días y el período de intercambio de 180 días corren simultáneamente (180 días naturales en total, NO 45 + 180).</li>
              <li>Los plazos se calculan estrictamente en días naturales, incluidos fines de semana y festivos.</li>
              <li>La fecha límite de intercambio puede adelantarse si la declaración de impuestos vence antes del día 180 sin prórroga válida.</li>
              <li>Los plazos son estrictos e improrrogables; consulte siempre a su intermediario calificado y asesor fiscal.</li>
            </>
          ) : isPt ? (
            <>
              <li>Ambos os prazos começam a contar na data de transferência do imóvel cedido.</li>
              <li>O período de identificação de 45 dias e o prazo de troca de 180 dias correm simultaneamente (total de 180 dias corridos, NÃO 45 + 180).</li>
              <li>Os prazos são contados em dias corridos, incluindo finais de semana e feriados.</li>
              <li>O prazo limite pode ser antecipado se a data de entrega da declaração fiscal ocorrer antes do dia 180, a menos que haja prorrogação válida.</li>
              <li>Os prazos são rígidos e inegociáveis; consulte sempre seu intermediário qualificado e consultor tributário.</li>
            </>
          ) : (
            <>
              <li>Both periods generally begin on the date the relinquished property is transferred.</li>
              <li>The 45-day identification period and 180-day exchange period run concurrently (total 180 calendar days, NOT 45 + 180).</li>
              <li>Deadlines are generally measured in calendar days, including weekends and holidays.</li>
              <li>The exchange deadline may occur earlier if the taxpayer’s return is due before Day 180 unless a valid extension is filed.</li>
              <li>Deadlines are generally strict; consult a qualified intermediary and tax adviser.</li>
            </>
          )}
        </ul>
      </div>

      {/* Figcaption */}
      <figcaption className="text-[11px] text-slate-500 leading-relaxed flex items-start gap-1.5 pt-1 border-t border-slate-200/80">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <span>
          {isZh
            ? '本图表仅供初步流程示意，不构成法律、税务或专业投资建议。在进行 1031 置换交易前请务必与合格中介人 (QI) 及注册会计师 (CPA) 确认具体时间截点。'
            : isEs
            ? 'Este diagrama tiene fines informativos generales y no constituye asesoramiento legal o fiscal. Confirme siempre los plazos exactos con un Intermediario Calificado (QI) y un contador certificado (CPA).'
            : isPt
            ? 'Este diagrama destina-se a fins puramente informativos e não constitui assessoria jurídica ou fiscal. Sempre confirme os prazos exatos com um Intermediário Qualificado (QI) e um contador certificado (CPA).'
            : 'This diagram is for general informational purposes only and does not constitute legal or tax advice. Always confirm exact deadlines with a Qualified Intermediary (QI) and CPA.'}
        </span>
      </figcaption>
    </figure>
  );
}
