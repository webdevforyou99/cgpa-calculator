import React, { useState } from 'react';
import { Calculator, Sparkles, HelpCircle } from 'lucide-react';
import { GradingSystem } from '../types/cgpa';

interface PercentageConverterToolProps {
  gradingSystem: GradingSystem;
  currentCgpa: number;
}

export const PercentageConverterTool: React.FC<PercentageConverterToolProps> = ({
  gradingSystem,
  currentCgpa,
}) => {
  const isBdUgc = gradingSystem.id === 'scale_4_bd_ugc';
  const isBdBoard = gradingSystem.id === 'scale_5_bd_board';

  const [cgpaInput, setCgpaInput] = useState<string>(
    currentCgpa > 0 ? currentCgpa.toString() : (isBdUgc ? '3.75' : gradingSystem.maxScale === 10 ? '8.5' : '3.8')
  );
  const [selectedFormula, setSelectedFormula] = useState<'aicte' | 'direct' | 'bd_ugc' | 'bd_board' | 'custom'>('aicte');
  const [customMultiplier, setCustomMultiplier] = useState<number>(9.5);

  const parsedCgpa = parseFloat(cgpaInput) || 0;

  // Calculate percentage based on selected method
  let computedPercent = 0;
  let formulaDisplay = '';

  if (isBdUgc) {
    computedPercent = (parsedCgpa / 4.0) * 100;
    formulaDisplay = `(${parsedCgpa} ÷ 4.00) × 100 = ${computedPercent.toFixed(2)}% (Bangladesh UGC Standard Equivalent)`;
  } else if (isBdBoard) {
    computedPercent = (parsedCgpa / 5.0) * 100;
    formulaDisplay = `(${parsedCgpa} ÷ 5.00) × 100 = ${computedPercent.toFixed(2)}% (Bangladesh Education Board SSC/HSC)`;
  } else if (gradingSystem.maxScale === 10) {
    if (selectedFormula === 'aicte') {
      computedPercent = parsedCgpa * 9.5;
      formulaDisplay = `${parsedCgpa} × 9.5 = ${computedPercent.toFixed(2)}% (Standard AICTE / KTU / VTU formula)`;
    } else if (selectedFormula === 'direct') {
      computedPercent = Math.max(0, (parsedCgpa - 0.75) * 10);
      formulaDisplay = `(${parsedCgpa} - 0.75) × 10 = ${computedPercent.toFixed(2)}% (CBSE / Alternate Engineering formula)`;
    } else {
      computedPercent = parsedCgpa * customMultiplier;
      formulaDisplay = `${parsedCgpa} × ${customMultiplier} = ${computedPercent.toFixed(2)}% (Custom Multiplier)`;
    }
  } else {
    // 4.0 or 5.0 scale
    computedPercent = (parsedCgpa / gradingSystem.maxScale) * 100;
    formulaDisplay = `(${parsedCgpa} ÷ ${gradingSystem.maxScale}) × 100 = ${computedPercent.toFixed(2)}%`;
  }

  // Clamped result
  computedPercent = Math.min(100, Math.max(0, computedPercent));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              CGPA ↔ Percentage Conversion Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Official university conversion rules (AICTE, CBSE, US 4.0 & custom multiplier)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
        {/* Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            CGPA Value (Scale {gradingSystem.maxScale})
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              max={gradingSystem.maxScale}
              value={cgpaInput}
              onChange={(e) => setCgpaInput(e.target.value)}
              placeholder="e.g. 8.4"
              className="w-full text-base font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {currentCgpa > 0 && (
              <button
                type="button"
                onClick={() => setCgpaInput(currentCgpa.toFixed(2))}
                className="absolute right-2 top-2 text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-600 dark:text-slate-200 rounded"
              >
                Use My CGPA
              </button>
            )}
          </div>
        </div>

        {/* Formula Selection for 10-point scale */}
        {gradingSystem.maxScale === 10 ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Conversion Formula</span>
              <span className="text-[10px] text-indigo-500 flex items-center gap-0.5">
                <HelpCircle className="w-3 h-3" /> University standard
              </span>
            </label>
            <select
              value={selectedFormula}
              onChange={(e) => setSelectedFormula(e.target.value as any)}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="aicte">AICTE Standard: CGPA × 9.5</option>
              <option value="direct">CBSE / VTU alternate: (CGPA - 0.75) × 10</option>
              <option value="custom">Custom Multiplier</option>
            </select>

            {selectedFormula === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-500">Multiplier:</span>
                <input
                  type="number"
                  step="0.1"
                  value={customMultiplier}
                  onChange={(e) => setCustomMultiplier(parseFloat(e.target.value) || 1)}
                  className="w-20 text-xs px-2 py-1 border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Conversion Type
            </label>
            <div className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              Proportional Scale: (CGPA ÷ {gradingSystem.maxScale}) × 100
            </div>
          </div>
        )}

        {/* Calculated Result Card */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Calculated Percentage
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {computedPercent.toFixed(2)}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">%</span>
            </div>
          </div>
          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 truncate mt-2 font-mono">
            {formulaDisplay}
          </p>
        </div>
      </div>
    </div>
  );
};
