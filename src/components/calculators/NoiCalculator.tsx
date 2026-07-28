'use client';

import React, { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, PieChart, Info, Layers } from 'lucide-react';

interface Props {
  locale: string;
}

export function NoiCalculator({ locale }: Props) {
  const isZh = locale === 'zh';

  // Inputs
  const [grossIncome, setGrossIncome] = useState<number>(312000);
  const [vacancyRate, setVacancyRate] = useState<number>(5); // 5%
  
  // Expenses
  const [propertyTax, setPropertyTax] = useState<number>(35000);
  const [insurance, setInsurance] = useState<number>(12000);
  const [maintenance, setMaintenance] = useState<number>(24000);
  const [managementFee, setManagementFee] = useState<number>(15000);
  const [utilities, setUtilities] = useState<number>(8000);

  // Calculations
  const vacancyLoss = (grossIncome * vacancyRate) / 100;
  const egi = grossIncome - vacancyLoss;
  const totalExpenses = propertyTax + insurance + maintenance + managementFee + utilities;
  const noi = egi - totalExpenses;
  const monthlyNoi = noi / 12;
  const expenseRatio = egi > 0 ? (totalExpenses / egi) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
            <Calculator className="w-3.5 h-3.5" />
            {isZh ? 'NOI 净营业收入计算' : 'NOI Calculation Tool'}
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            {isZh ? 'NOI (净营业收入) 实时计算器' : 'Net Operating Income (NOI) Calculator'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isZh ? '输入总租金收入、空置损失及各项运营费用' : 'Enter potential income, vacancy, and itemized operating expenses'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Gross Income */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              {isZh ? '1. 收入与空置损失 (Income & Vacancy)' : '1. Gross Income & Vacancy'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '年潜在毛租金收入 ($)' : 'Gross Potential Income ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={grossIncome || ''}
                    onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="312,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '预估空置与坏账率 (%)' : 'Vacancy & Credit Loss (%)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.5"
                    value={vacancyRate || ''}
                    onChange={(e) => setVacancyRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3 pr-7 py-2 text-slate-900 font-semibold text-sm focus:outline-none"
                    placeholder="5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isZh ? `空置损失额: ${formatCurrency(vacancyLoss)}` : `Loss: ${formatCurrency(vacancyLoss)}`}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Expenses */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-600" />
              {isZh ? '2. 运营支出细项 (Itemized Expenses)' : '2. Operating Expenses Breakdown'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '物业税 (Property Tax)' : 'Property Taxes ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={propertyTax || ''}
                    onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '物业保险 (Insurance)' : 'Property Insurance ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={insurance || ''}
                    onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '维修与保养 (Maintenance)' : 'Repairs & Maintenance ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={maintenance || ''}
                    onChange={(e) => setMaintenance(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '物业管理费 (Management Fee)' : 'Management Fees ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={managementFee || ''}
                    onChange={(e) => setManagementFee(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {isZh ? '房东负担水电与杂费 (Utilities & Other)' : 'Utilities & Other Landlord Expenses ($/yr)'}
                </label>
                <div className="relative rounded-lg border border-slate-300 focus-ring overflow-hidden bg-white">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                  <input
                    type="number"
                    value={utilities || ''}
                    onChange={(e) => setUtilities(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 text-slate-900 text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              {isZh ? 'NOI 结果总览' : 'NOI Financial Summary'}
            </h3>

            {/* Major Result Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isZh ? '年度净营业收入 (Annual NOI)' : 'Annual Net Operating Income'}
              </span>
              <div className="text-3xl md:text-4xl font-black text-emerald-600 mt-1">
                {formatCurrency(noi)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isZh ? `月均 NOI: ${formatCurrency(monthlyNoi)} / 月` : `Monthly Avg: ${formatCurrency(monthlyNoi)} / mo`}
              </p>
            </div>

            {/* Income & Expense Breakdown */}
            <div className="space-y-3 text-sm border-t border-slate-200 pt-4">
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '潜在毛收入 (Gross Income):' : 'Gross Potential Income:'}</span>
                <span className="font-semibold">{formatCurrency(grossIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '空置及坏账扣除:' : 'Vacancy Deduction:'}</span>
                <span className="font-semibold text-amber-600">-{formatCurrency(vacancyLoss)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
                <span className="text-slate-800">{isZh ? '有效毛收入 (EGI):' : 'Effective Gross Income (EGI):'}</span>
                <span className="text-slate-900">{formatCurrency(egi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{isZh ? '总运营支出 (OpEx):' : 'Total Operating Expenses:'}</span>
                <span className="font-semibold text-red-600">-{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{isZh ? '运营支出占比 (OpEx Ratio):' : 'Expense Ratio (% of EGI):'}</span>
                <span className="font-semibold">{formatPercent(expenseRatio)}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 mt-6 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              {isZh
                ? '提示：NOI 不包含每年应还的房贷本息（Debt Service）。计算现金流时需再扣除房贷还款。'
                : 'Note: NOI does not deduct mortgage debt service. Subtract annual loan payments to find net pre-tax cash flow.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
