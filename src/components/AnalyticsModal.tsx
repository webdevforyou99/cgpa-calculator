import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart
} from 'lucide-react';
import { Semester, GradingSystem } from '../types/cgpa';
import { calculateCGPA } from '../utils/calculator';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: Semester[];
  gradingSystem: GradingSystem;
  priorCgpa: number;
  priorCredits: number;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  semesters,
  gradingSystem,
  priorCgpa,
  priorCredits,
}) => {
  if (!isOpen) return null;

  const { cgpa, totalCredits, earnedCredits, semesterStats } = calculateCGPA(
    semesters,
    gradingSystem,
    priorCgpa,
    priorCredits
  );

  // Grade frequency distribution
  const gradeCounts: Record<string, number> = {};
  let totalCourses = 0;
  let highestSgpa = 0;
  let lowestSgpa = gradingSystem.maxScale;

  semesters.forEach((sem) => {
    sem.courses.forEach((c) => {
      totalCourses++;
      const g = c.grade.toUpperCase();
      gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });
  });

  semesterStats.forEach((s) => {
    if (s.credits > 0) {
      if (s.sgpa > highestSgpa) highestSgpa = s.sgpa;
      if (s.sgpa < lowestSgpa) lowestSgpa = s.sgpa;
    }
  });

  if (highestSgpa === 0 && lowestSgpa === gradingSystem.maxScale) {
    lowestSgpa = 0;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Performance Analytics
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Semester trend trajectory & grade distribution insights
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Quick Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Current CGPA</span>
            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
              {cgpa.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Highest SGPA</span>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {highestSgpa.toFixed(2)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Earned Credits</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {earnedCredits} / {totalCredits}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Courses</span>
            <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {totalCourses}
            </div>
          </div>
        </div>

        {/* Semester Trend Chart (SVG Visualizer) */}
        <div className="my-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> SGPA vs Cumulative CGPA Progress
          </h4>
          {semesterStats.length === 0 ? (
            <p className="text-xs text-slate-400">Add semesters to see your growth curve.</p>
          ) : (
            <div className="space-y-3">
              {semesterStats.map((stat) => {
                const ratioSgpa = Math.min(100, (stat.sgpa / gradingSystem.maxScale) * 100);
                const ratioCgpa = Math.min(100, (stat.cumulativeCgpa / gradingSystem.maxScale) * 100);

                return (
                  <div key={stat.semesterId} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                      <span className="text-slate-800 dark:text-slate-200">{stat.semesterName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-indigo-600 dark:text-indigo-400">SGPA: {stat.sgpa.toFixed(2)}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">CGPA: {stat.cumulativeCgpa.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Bars */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 w-10">SGPA</span>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${ratioSgpa}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 w-10">CGPA</span>
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${ratioCgpa}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Grade Distribution */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-violet-500" /> Grade Distribution Breakdown
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(gradeCounts).map(([grade, count]) => (
              <div
                key={grade}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2"
              >
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{grade}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {count} {count === 1 ? 'course' : 'courses'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
