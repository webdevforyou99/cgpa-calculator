import React from 'react';
import { Award, TrendingUp, Percent, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import { GradingSystem } from '../types/cgpa';
import { convertCgpaToPercentage, getAcademicClassification } from '../utils/calculator';

interface OverviewMetricsProps {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  gradingSystem: GradingSystem;
  targetCgpa: number;
  semesterCount: number;
  totalCourses: number;
}

export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  cgpa,
  totalCredits,
  earnedCredits,
  gradingSystem,
  targetCgpa,
  semesterCount,
  totalCourses,
}) => {
  const { percentage, formulaDescription } = convertCgpaToPercentage(cgpa, gradingSystem.maxScale, gradingSystem.id);
  const classification = getAcademicClassification(cgpa, gradingSystem.maxScale, gradingSystem.id);
  const cgpaPercentageRatio = gradingSystem.maxScale > 0 ? (cgpa / gradingSystem.maxScale) * 100 : 0;
  
  // Progress towards target
  const targetDiff = targetCgpa > 0 ? cgpa - targetCgpa : 0;
  const isTargetMet = targetDiff >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Primary Cumulative CGPA Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/20">
        <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-200" /> Cumulative CGPA
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">
            Scale {gradingSystem.maxScale}
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight">
            {cgpa > 0 ? cgpa.toFixed(2) : '0.00'}
          </span>
          <span className="text-indigo-200 font-medium text-sm">
            / {gradingSystem.maxScale.toFixed(1)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, cgpaPercentageRatio))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-indigo-100 mt-1.5">
            <span>Score: {cgpaPercentageRatio.toFixed(1)}%</span>
            <span>{earnedCredits} / {totalCredits} Credits</span>
          </div>
        </div>
      </div>

      {/* Percentage Equivalent Card */}
      <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-500" /> Percentage
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              Equivalent
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {percentage > 0 ? percentage.toFixed(2) : '0.00'}
            </span>
            <span className="text-slate-400 font-medium text-lg">%</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={formulaDescription}>
            {formulaDescription}
          </p>
        </div>
      </div>

      {/* Academic Standing Card */}
      <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" /> Academic Standing
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${classification.badgeColor}`} />
          </div>
          <div className="mt-3">
            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {classification.title}
            </h4>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {semesterCount} {semesterCount === 1 ? 'Semester' : 'Semesters'}
          </span>
          <span>{totalCourses} Courses</span>
        </div>
      </div>

      {/* Target Progress Card */}
      <div className="rounded-2xl p-5 bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-violet-500" /> Target Goal
            </span>
            {targetCgpa > 0 && (
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                isTargetMet 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              }`}>
                {isTargetMet ? 'On Track' : 'Behind'}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {targetCgpa > 0 ? targetCgpa.toFixed(2) : '—'}
            </span>
            {targetCgpa > 0 && (
              <span className={`text-xs font-semibold ${isTargetMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {targetDiff >= 0 ? `+${targetDiff.toFixed(2)}` : targetDiff.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{targetCgpa > 0 ? `Target ${targetCgpa} CGPA benchmark` : 'Set your desired target CGPA below'}</span>
        </div>
      </div>
    </div>
  );
};
