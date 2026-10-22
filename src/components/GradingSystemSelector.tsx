import React, { useState } from 'react';
import { Plus, Sliders, Info, RotateCcw } from 'lucide-react';
import { GradingSystem, GradeScaleItem } from '../types/cgpa';
import { GRADING_SYSTEMS } from '../types/data';

interface GradingSystemSelectorProps {
  currentSystem: GradingSystem;
  onSelectSystem: (system: GradingSystem) => void;
  onUpdateSystem: (system: GradingSystem) => void;
}

export const GradingSystemSelector: React.FC<GradingSystemSelectorProps> = ({
  currentSystem,
  onSelectSystem,
  onUpdateSystem,
}) => {
  const [isEditingScale, setIsEditingScale] = useState(false);

  const handleSystemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = GRADING_SYSTEMS.find((s) => s.id === e.target.value);
    if (found) {
      onSelectSystem(found);
    }
  };

  const handleGradePointChange = (index: number, points: number) => {
    const updatedGrades = [...currentSystem.grades];
    updatedGrades[index] = { ...updatedGrades[index], points };
    onUpdateSystem({ ...currentSystem, grades: updatedGrades });
  };

  const handleAddGradeLevel = () => {
    const newGrade: GradeScaleItem = {
      grade: 'New',
      points: 0,
      description: 'Custom Grade',
    };
    onUpdateSystem({ ...currentSystem, grades: [...currentSystem.grades, newGrade] });
  };

  const handleResetToDefault = () => {
    const original = GRADING_SYSTEMS.find((s) => s.id === currentSystem.id) || GRADING_SYSTEMS[0];
    onSelectSystem(original);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Grading Scale & System
          </label>
          <div className="mt-1 flex items-center gap-2">
            <select
              value={currentSystem.id}
              onChange={handleSystemChange}
              className="text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {GRADING_SYSTEMS.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditingScale(!isEditingScale)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isEditingScale ? 'Hide Grade Points' : 'Customize Grade Table'}</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        {currentSystem.description}
      </p>

      {/* Quick view of grade points badges */}
      {!isEditingScale && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {currentSystem.grades.map((g) => (
            <span
              key={g.grade}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
            >
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{g.grade}</span> = {g.points}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Grade Customization Panel */}
      {isEditingScale && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              Adjust numeric points associated with each letter grade:
            </span>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Defaults
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {currentSystem.grades.map((g, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/40 text-center"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">{g.grade}</div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={currentSystem.maxScale}
                  value={g.points}
                  onChange={(e) => handleGradePointChange(idx, parseFloat(e.target.value) || 0)}
                  className="w-full text-center text-xs font-bold py-1 rounded bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddGradeLevel}
              className="p-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 text-slate-400 hover:text-indigo-600 flex flex-col items-center justify-center text-xs transition-colors"
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
