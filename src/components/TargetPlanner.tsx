import React, { useState } from 'react';
import { Target, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import { GradingSystem } from '../types/cgpa';
import { calculateTargetRequirement } from '../utils/calculator';
import confetti from 'canvas-confetti';

interface TargetPlannerProps {
  currentCgpa: number;
  currentCredits: number;
  gradingSystem: GradingSystem;
  targetCgpa: number;
  onUpdateTargetCgpa: (val: number) => void;
}

export const TargetPlanner: React.FC<TargetPlannerProps> = ({
  currentCgpa,
  currentCredits,
  gradingSystem,
  targetCgpa,
  onUpdateTargetCgpa,
}) => {
  const [futureCredits, setFutureCredits] = useState<number>(20);
  const [targetInput, setTargetInput] = useState<string>(targetCgpa ? targetCgpa.toString() : '');

  const parsedTarget = parseFloat(targetInput) || targetCgpa || 0;
  const analysis = calculateTargetRequirement(
    currentCgpa,
    currentCredits,
    parsedTarget,
    futureCredits,
    gradingSystem.maxScale
  );

  const handleApplyTarget = () => {
    const val = parseFloat(targetInput);
    if (!isNaN(val) && val > 0 && val <= gradingSystem.maxScale) {
      onUpdateTargetCgpa(val);
      if (analysis.isAchievable) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Target CGPA Goal Planner
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predict what SGPA you need in upcoming semesters to hit your graduation target
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Desired Target CGPA (Max {gradingSystem.maxScale})
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.05"
                min="0"
                max={gradingSystem.maxScale}
                value={targetInput}
                onChange={(e) => {
                  setTargetInput(e.target.value);
                  const parsed = parseFloat(e.target.value);
                  if (!isNaN(parsed)) onUpdateTargetCgpa(parsed);
                }}
                placeholder={`e.g. ${(gradingSystem.maxScale * 0.85).toFixed(1)}`}
                className="w-full text-sm font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleApplyTarget}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Remaining / Future Credits to Complete: <span className="text-indigo-600 font-bold">{futureCredits}</span>
              </label>
              <span className="text-[11px] text-slate-400">Current completed: {currentCredits} cr</span>
            </div>
            <input
              type="range"
              min="1"
              max="160"
              value={futureCredits}
              onChange={(e) => setFutureCredits(parseInt(e.target.value) || 1)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 credit (single course)</span>
              <span>20 cr (1 sem)</span>
              <span>40 cr (1 yr)</span>
              <span>80+ cr</span>
            </div>
          </div>
        </div>

        {/* Prediction Results Banner */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between ${
          !parsedTarget
            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-250 dark:border-slate-750 text-slate-500'
            : analysis.isAchievable
            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              {!parsedTarget ? (
                <Calculator className="w-5 h-5 text-slate-400" />
              ) : analysis.isAchievable ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {!parsedTarget
                  ? 'Enter a target CGPA'
                  : analysis.isAchievable
                  ? 'Target is Achievable!'
                  : 'Target Beyond Range'}
              </h4>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {parsedTarget > 0
                ? analysis.message
                : 'Set your target graduation CGPA above to see the minimum SGPA you need across remaining credits.'}
            </p>
          </div>

          {parsedTarget > 0 && analysis.isAchievable && analysis.requiredSgpa > 0 && (
            <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Minimum SGPA needed per semester:
              </span>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-slate-900 px-3 py-1 rounded-lg shadow-xs">
                {analysis.requiredSgpa.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
