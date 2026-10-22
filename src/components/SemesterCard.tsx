import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  Award, 
  Layers, 
  Copy,
  Edit2,
  Check
} from 'lucide-react';
import { Semester, Course, GradingSystem } from '../types/cgpa';
import { calculateSGPA } from '../utils/calculator';
import { CourseRow } from './CourseRow';

interface SemesterCardProps {
  semester: Semester;
  semesterIndex: number;
  gradingSystem: GradingSystem;
  onUpdateSemester: (updated: Semester) => void;
  onDeleteSemester: () => void;
  onDuplicateSemester: () => void;
}

export const SemesterCard: React.FC<SemesterCardProps> = ({
  semester,
  semesterIndex,
  gradingSystem,
  onUpdateSemester,
  onDeleteSemester,
  onDuplicateSemester,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(semester.name);

  const { sgpa, totalCredits, earnedCredits, totalGradePoints } = calculateSGPA(semester, gradingSystem);

  const handleAddCourse = () => {
    const defaultGrade = gradingSystem.grades[0]?.grade || 'A';
    const newCourse: Course = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      code: '',
      name: '',
      credits: 3,
      grade: defaultGrade,
      isCompleted: true,
    };
    onUpdateSemester({
      ...semester,
      courses: [...semester.courses, newCourse],
    });
  };

  const handleUpdateCourse = (idx: number, updatedCourse: Course) => {
    const newCourses = [...semester.courses];
    newCourses[idx] = updatedCourse;
    onUpdateSemester({ ...semester, courses: newCourses });
  };

  const handleDeleteCourse = (idx: number) => {
    const newCourses = semester.courses.filter((_, i) => i !== idx);
    onUpdateSemester({ ...semester, courses: newCourses });
  };

  const handleSaveTitle = () => {
    if (titleInput.trim()) {
      onUpdateSemester({ ...semester, name: titleInput.trim() });
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all duration-200 mb-5">
      {/* Semester Header */}
      <div className="p-4 sm:px-6 bg-slate-50/60 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Title and edit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            title={isOpen ? 'Collapse Semester' : 'Expand Semester'}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                className="text-sm font-semibold px-2.5 py-1 rounded-md border border-indigo-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                {semesterIndex + 1}
              </span>
              <h3 
                onClick={() => setIsEditingTitle(true)}
                className="font-bold text-slate-800 dark:text-slate-100 text-base cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5"
              >
                {semester.name}
                <Edit2 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </h3>
            </div>
          )}
        </div>

        {/* Quick Stats & Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* SGPA Badge */}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1 rounded-xl">
            <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">SGPA:</span>
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-sm">
                {sgpa.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Credits Summary Badge */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <Layers className="w-3.5 h-3.5" />
            <span>{earnedCredits}/{totalCredits} Credits</span>
          </div>

          {/* Duplicate semester button */}
          <button
            type="button"
            onClick={onDuplicateSemester}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="Duplicate Semester Structure"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Semester button */}
          <button
            type="button"
            onClick={onDeleteSemester}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete Entire Semester"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Semester Body (Collapsible) */}
      {isOpen && (
        <div className="p-4 sm:p-5">
          {semester.courses.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">No courses added to this semester yet.</p>
              <button
                type="button"
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Course
              </button>
            </div>
          ) : (
            <>
              {/* Responsive Courses Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[560px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      <th className="py-2 px-3 text-center">Status</th>
                      <th className="py-2 px-2">Code</th>
                      <th className="py-2 px-2">Course Name</th>
                      <th className="py-2 px-2 text-center">Credits</th>
                      <th className="py-2 px-2">Grade</th>
                      <th className="py-2 px-3 text-right">Points</th>
                      <th className="py-2 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, idx) => (
                      <CourseRow
                        key={course.id}
                        index={idx}
                        course={course}
                        gradingSystem={gradingSystem}
                        onUpdate={(updated) => handleUpdateCourse(idx, updated)}
                        onDelete={() => handleDeleteCourse(idx)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Semester Action Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={handleAddCourse}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 transition-colors border border-indigo-200/50 dark:border-indigo-800/50 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Course
                </button>

                <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span>
                    Total Points: <strong className="text-slate-900 dark:text-slate-100">{totalGradePoints.toFixed(1)}</strong>
                  </span>
                  <span>
                    Credits: <strong className="text-slate-900 dark:text-slate-100">{totalCredits}</strong>
                  </span>
                  <span>
                    SGPA: <strong className="text-indigo-600 dark:text-indigo-400 text-sm">{sgpa.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
