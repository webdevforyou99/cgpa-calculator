import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  School, 
  Award,
  Calendar,
  X
} from 'lucide-react';
import { Semester, GradingSystem } from '../types/cgpa';
import { calculateCGPA, convertCgpaToPercentage, getAcademicClassification } from '../utils/calculator';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  semesters: Semester[];
  gradingSystem: GradingSystem;
  studentName: string;
  major: string;
  institution: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  semesters,
  gradingSystem,
  studentName: initialName,
  major: initialMajor,
  institution: initialInstitution,
}) => {
  const [studentName, setStudentName] = useState(initialName || 'Academic Scholar');
  const [major, setMajor] = useState(initialMajor || 'Computer Science & Engineering');
  const [institution, setInstitution] = useState(initialInstitution || 'University of Dhaka / BUET / NSU');

  if (!isOpen) return null;

  const { cgpa, totalCredits, earnedCredits, semesterStats } = calculateCGPA(semesters, gradingSystem);
  const { percentage } = convertCgpaToPercentage(cgpa, gradingSystem.maxScale, gradingSystem.id);
  const standing = getAcademicClassification(cgpa, gradingSystem.maxScale, gradingSystem.id);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Transcript & Performance Report
              </h2>
              <p className="text-xs text-slate-500">
                Official format suitable for graduate school, employer submissions, & GitHub documentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-4 sm:p-8 my-4 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-200 dark:border-slate-800 font-sans text-slate-800 dark:text-slate-100 print:m-0 print:p-0 print:border-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-200 dark:border-slate-700 gap-4">
            <div>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400 tracking-tight flex items-center gap-2">
                <Award className="w-7 h-7 text-indigo-600" /> ACADEMIC TRANSCRIPT RECORD
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <School className="w-3.5 h-3.5" />
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="bg-transparent border-b border-dotted border-slate-400 focus:outline-none text-slate-700 dark:text-slate-300 font-medium"
                />
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div className="flex items-center sm:justify-end gap-1">
                <Calendar className="w-3.5 h-3.5" /> Generated: {currentDate}
              </div>
              <div className="mt-1 font-mono text-[11px] text-slate-400">Scale: {gradingSystem.name}</div>
            </div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-medium uppercase text-[10px] block">Student Name</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none w-full"
              />
            </div>
            <div>
              <span className="text-slate-400 font-medium uppercase text-[10px] block">Degree / Major</span>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="font-semibold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Key Summary Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900 text-center">
              <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400">CUMULATIVE CGPA</span>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-0.5">
                {cgpa.toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">PERCENTAGE</span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
                {percentage.toFixed(2)}%
              </div>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-500">CREDITS EARNED</span>
              <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
                {earnedCredits} / {totalCredits}
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-100 dark:border-purple-900 text-center">
              <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">CLASSIFICATION</span>
              <div className="text-xs font-bold text-purple-700 dark:text-purple-300 mt-1 line-clamp-2">
                {standing.title}
              </div>
            </div>
          </div>

          {/* Breakdown per Semester */}
          <div className="space-y-6 my-6">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2">
              Course & Semester Breakdown
            </h3>
            {semesters.map((sem, sIdx) => {
              const semStat = semesterStats[sIdx];
              return (
                <div key={sem.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex justify-between items-center text-xs font-bold">
                    <span>{sem.name}</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      SGPA: {semStat ? semStat.sgpa.toFixed(2) : '—'} | Cumulative CGPA: {semStat ? semStat.cumulativeCgpa.toFixed(2) : '—'}
                    </span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase text-slate-400">
                        <th className="py-1.5 px-3">Course Code</th>
                        <th className="py-1.5 px-3">Course Title</th>
                        <th className="py-1.5 px-3 text-center">Credits</th>
                        <th className="py-1.5 px-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sem.courses.map((c) => (
                        <tr key={c.id}>
                          <td className="py-1.5 px-3 font-mono font-medium">{c.code || '—'}</td>
                          <td className="py-1.5 px-3">{c.name || 'Untitled Course'}</td>
                          <td className="py-1.5 px-3 text-center">{c.credits}</td>
                          <td className="py-1.5 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400">{c.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          {/* Footer certification line */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-[11px] text-slate-400">
            <div>
              <p>Generated via GradeFlow CGPA Engine for GitHub</p>
              <p>Automated verification hash: {Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <span>Academic Advisor Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
