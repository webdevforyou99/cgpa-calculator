import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Calculator } from 'lucide-react';

export const FaqAndGuideSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: 'How do I calculate CGPA from SGPA of each semester?',
      a: 'To calculate cumulative CGPA from semester SGPAs, multiply each semester’s SGPA by its total credit hours to find total quality points, add them together, and divide by the total cumulative credits taken: CGPA = Σ(SGPA × Semester Credits) ÷ Σ(Total Credits). Note: Simply averaging the semester SGPAs without credit weighting is incorrect if semesters have different credit counts.'
    },
    {
      q: 'How does the Bangladesh University (UGC) 4.0 CGPA system work?',
      a: 'In Bangladesh, public universities (BUET, DU, RU, CU, SUST, etc.) and private universities (NSU, BRACU, AIUB, UIU, etc.) follow the Uniform Grading System approved by the University Grants Commission (UGC). On this 4.00 scale: 80%+ is A+ (4.00), 75% to <80% is A (3.75), 70% to <75% is A- (3.50), 65% to <70% is B+ (3.25), 60% to <65% is B (3.00), 55% to <60% is B- (2.75), 50% to <55% is C+ (2.50), 45% to <50% is C (2.25), 40% to <45% is D (2.00), and below 40% is F (0.00).'
    },
    {
      q: 'What is considered a "Good" CGPA in university and for graduate studies abroad?',
      a: 'Generally: 3.80 – 4.00 is outstanding (Dean’s Honor List / Chancellor Gold Medal), 3.50 – 3.79 is very good (eligible for top international scholarships like Fulbright, Erasmus, Commonwealth, or DAAD), 3.00 – 3.49 is good / First Class (qualifies for most master’s programs and multinational hiring), while below 2.50 usually requires academic improvement.'
    },
    {
      q: 'What is the exact difference between GPA, SGPA, and CGPA?',
      a: 'GPA (Grade Point Average) is an umbrella term. SGPA (Semester Grade Point Average) evaluates your academic score for one individual semester term. CGPA (Cumulative Grade Point Average) is the combined weighted score across ALL completed semesters from day one until graduation.'
    },
    {
      q: 'How does a retake course or F grade affect my CGPA?',
      a: 'An F grade awards 0.0 grade points while the credits are still counted in your total attempted credits, sharply reducing your GPA. When you retake the course, most universities replace the 0.0 points with the new grade (e.g. A or B), causing your cumulative CGPA to jump significantly.'
    },
    {
      q: 'What CGPA is required for First Class / First Division in Bangladesh universities?',
      a: 'According to Bangladesh UGC guidelines, a CGPA of 3.00 or higher (out of 4.00) is officially recognized as First Class / First Division. A CGPA of 2.50 to 2.99 is Second Class, and 2.00 to 2.49 is Third Class / Passing grade.'
    },
    {
      q: 'Why do course credit hours matter when calculating CGPA?',
      a: 'Credit hours determine how heavily a course affects your GPA. For instance, a 4-credit course has double the influence on your final CGPA compared to a 2-credit lab course. Earning an A+ in a 4-credit course will boost your CGPA far more than earning an A+ in a 1-credit or 2-credit course.'
    },
    {
      q: 'How is CGPA converted to percentage for job applications or higher studies?',
      a: 'For 10-point scales (India / AICTE), the official formula is Percentage = CGPA × 9.5 (or [CGPA - 0.75] × 10). For 4.0 scales (Bangladesh UGC / US / Canada), universities commonly evaluate: (CGPA ÷ 4.00) × 100, where 3.00 = 75%, 3.50 = 87.5%, and 4.00 = 100%. Our built-in % Converter Hub calculates both automatically.'
    },
    {
      q: 'How is Bangladesh SSC & HSC 5.0 GPA calculated?',
      a: 'For secondary (SSC) and higher secondary (HSC) education boards in Bangladesh (Dhaka, Chittagong, Rajshahi, etc.), grading is evaluated on a 5.00 GPA scale. 80-100% gives A+ (5.00, Golden GPA), 70-79% is A (4.00), 60-69% is A- (3.50), 50-59% is B (3.00), 40-49% is C (2.00), 33-39% is D (1.00), and below 33% is F (0.00).'
    },
    {
      q: 'How many credits are required to complete a Bachelor’s degree in Bangladesh?',
      a: 'For an engineering degree (such as CSE, EEE, ME in BUET, NSU, BRACU, AIUB), students typically must complete 130 to 148 credits across 8 to 12 semesters (4 years). General 4-year Honours programs (such as BBA, BA, BSc under National University or public universities) usually require between 120 and 136 credits.'
    }
  ];

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <HelpCircle className="w-5 h-5 text-indigo-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Grading Standards, CGPA Formulas & Frequently Asked Questions
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
            <Calculator className="w-4 h-4" /> SGPA Formula
          </h4>
          <p className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            SGPA = Σ (Course Credit × Grade Point) / Σ (Course Credits)
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Weighted mean of grade points earned in all courses taken during a specific semester term.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> CGPA Formula
          </h4>
          <p className="text-xs font-mono bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            CGPA = Σ (Semester Credits × SGPA) / Σ (All Cumulative Credits)
          </p>
          <p className="text-[11px] text-slate-500 mt-2">
            Measures your aggregate cumulative performance across all terms until graduation.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left px-4 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-3 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/20">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
