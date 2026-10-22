import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Course, GradingSystem } from '../types/cgpa';
import { getCourseGradePoints } from '../utils/calculator';

interface CourseRowProps {
  course: Course;
  index: number;
  gradingSystem: GradingSystem;
  onUpdate: (updatedCourse: Course) => void;
  onDelete: () => void;
}

export const CourseRow: React.FC<CourseRowProps> = ({
  course,
  index,
  gradingSystem,
  onUpdate,
  onDelete,
}) => {
  const points = getCourseGradePoints(course, gradingSystem);
  const totalQualityPoints = (Number(course.credits) || 0) * points;

  return (
    <tr className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
      {/* Index & Status */}
      <td className="py-2.5 px-3 w-12 text-center text-xs text-slate-400">
        <button
          type="button"
          onClick={() => onUpdate({ ...course, isCompleted: !course.isCompleted })}
          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          title={course.isCompleted ? 'Mark as In-Progress' : 'Mark as Completed'}
        >
          {course.isCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 inline" />
          )}
        </button>
      </td>

      {/* Course Code */}
      <td className="py-2.5 px-2 w-28">
        <input
          type="text"
          value={course.code}
          onChange={(e) => onUpdate({ ...course, code: e.target.value })}
          placeholder={`CS${101 + index}`}
          className="w-full text-xs font-mono font-medium uppercase px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </td>

      {/* Course Title / Name */}
      <td className="py-2.5 px-2">
        <input
          type="text"
          value={course.name}
          onChange={(e) => onUpdate({ ...course, name: e.target.value })}
          placeholder="Course Name / Subject"
          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </td>

      {/* Credits */}
      <td className="py-2.5 px-2 w-24">
        <input
          type="number"
          min="0"
          max="30"
          step="0.5"
          value={course.credits === 0 ? '' : course.credits}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onUpdate({ ...course, credits: isNaN(val) ? 0 : val });
          }}
          placeholder="3"
          className="w-full text-xs text-center font-semibold px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </td>

      {/* Grade Selector */}
      <td className="py-2.5 px-2 w-36">
        <select
          value={course.grade}
          onChange={(e) => {
            onUpdate({ ...course, grade: e.target.value });
          }}
          className="w-full text-xs font-medium px-2 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          {gradingSystem.grades.map((g) => (
            <option key={g.grade} value={g.grade}>
              {g.grade} ({g.points} pts)
            </option>
          ))}
        </select>
      </td>

      {/* Points Calculation */}
      <td className="py-2.5 px-3 w-28 text-right">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {totalQualityPoints.toFixed(1)} <span className="text-[10px] text-slate-400 font-normal">pts</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {points} × {course.credits}cr
          </span>
        </div>
      </td>

      {/* Delete Course */}
      <td className="py-2.5 px-2 w-10 text-center">
        <button
          type="button"
          onClick={onDelete}
          className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Remove Course"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};
