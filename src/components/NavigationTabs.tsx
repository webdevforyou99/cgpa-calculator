import React from 'react';
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  ArrowRightLeft, 
  Target 
} from 'lucide-react';

export type ActiveTab = 'calculator' | 'target' | 'converter';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAnalytics: () => void;
  onOpenReport: () => void;
  semesterCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  onOpenAnalytics,
  onOpenReport,
  semesterCount,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
      {/* Primary tabs */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'calculator'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Semesters ({semesterCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('target')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'target'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Goal Planner</span>
        </button>

        <button
          onClick={() => setActiveTab('converter')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'converter'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>% Converter</span>
        </button>
      </div>

      {/* Action modal triggers */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAnalytics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          title="Open Trend & Performance Analytics"
        >
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Analytics</span>
        </button>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
          title="Generate Printable Transcript Report"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Transcript Report</span>
        </button>
      </div>
    </div>
  );
};
