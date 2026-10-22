import { Course, GradingSystem, Semester, GradeScaleItem } from '../types/cgpa';

/**
 * Calculates grade points for a single course based on active grading system
 */
export function getCourseGradePoints(course: Course, gradingSystem: GradingSystem): number {
  if (course.customPoints !== undefined && course.customPoints !== null) {
    return course.customPoints;
  }
  const match = gradingSystem.grades.find(
    (g: GradeScaleItem) => g.grade.trim().toLowerCase() === course.grade.trim().toLowerCase()
  );
  if (match) return match.points;
  const parsed = parseFloat(course.grade);
  if (!isNaN(parsed)) return parsed;
  return 0;
}

/**
 * Calculates SGPA (Semester Grade Point Average) for a given semester
 */
export function calculateSGPA(semester: Semester, gradingSystem: GradingSystem): {
  sgpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalGradePoints: number;
} {
  let totalCredits = 0;
  let earnedCredits = 0;
  let totalGradePoints = 0;

  for (const course of semester.courses) {
    const credits = Number(course.credits) || 0;
    if (credits <= 0) continue;

    totalCredits += credits;
    const points = getCourseGradePoints(course, gradingSystem);
    totalGradePoints += credits * points;

    // Fail check
    const isFail =
      course.grade.toUpperCase() === 'F' ||
      course.grade.toUpperCase() === 'FAIL' ||
      points === 0;

    if (!isFail && course.isCompleted) {
      earnedCredits += credits;
    }
  }

  const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  return {
    sgpa: parseFloat(sgpa.toFixed(3)),
    totalCredits,
    earnedCredits,
    totalGradePoints: parseFloat(totalGradePoints.toFixed(2)),
  };
}

/**
 * Calculates overall CGPA across all semesters with optional prior cumulative credits & cgpa
 */
export function calculateCGPA(
  semesters: Semester[],
  gradingSystem: GradingSystem,
  priorCgpa: number = 0,
  priorCredits: number = 0
): {
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  totalQualityPoints: number;
  semesterStats: Array<{
    semesterId: string;
    semesterName: string;
    sgpa: number;
    credits: number;
    earnedCredits: number;
    qualityPoints: number;
    cumulativeCgpa: number;
  }>;
} {
  let runningCredits = priorCredits > 0 ? priorCredits : 0;
  let runningQualityPoints = priorCredits > 0 && priorCgpa > 0 ? priorCredits * priorCgpa : 0;
  let totalEarnedCredits = priorCredits > 0 ? priorCredits : 0;

  const semesterStats = semesters.map((sem) => {
    const { sgpa, totalCredits, earnedCredits, totalGradePoints } = calculateSGPA(sem, gradingSystem);
    runningCredits += totalCredits;
    runningQualityPoints += totalGradePoints;
    totalEarnedCredits += earnedCredits;

    const cumulativeCgpa = runningCredits > 0 ? runningQualityPoints / runningCredits : 0;

    return {
      semesterId: sem.id,
      semesterName: sem.name,
      sgpa,
      credits: totalCredits,
      earnedCredits,
      qualityPoints: totalGradePoints,
      cumulativeCgpa: parseFloat(cumulativeCgpa.toFixed(3)),
    };
  });

  const finalCgpa = runningCredits > 0 ? runningQualityPoints / runningCredits : 0;

  return {
    cgpa: parseFloat(finalCgpa.toFixed(3)),
    totalCredits: runningCredits,
    earnedCredits: totalEarnedCredits,
    totalQualityPoints: parseFloat(runningQualityPoints.toFixed(2)),
    semesterStats,
  };
}

/**
 * Converts CGPA into standard Percentage using standard international & Indian formulas
 */
export function convertCgpaToPercentage(cgpa: number, scale: number, gradingSystemId?: string): {
  percentage: number;
  formulaDescription: string;
} {
  if (gradingSystemId === 'scale_4_bd_ugc' || (scale === 4.0 && gradingSystemId?.includes('bd'))) {
    // Bangladesh UGC formula / DU / BUET / NSU: CGPA of 4.0 is 80%+, 3.75 is 75%, etc.
    // Linear regression formula widely adopted for BD university transcripts:
    // (CGPA / 4.0) * 100 or specific UGC intervals: Percentage ~= (CGPA * 20) for 4.0 = 80%+
    const percent = Math.min(100, Math.max(0, (cgpa / 4.0) * 100));
    return {
      percentage: parseFloat(percent.toFixed(2)),
      formulaDescription: 'Bangladesh UGC / Univ Equivalent: (CGPA ÷ 4.0) × 100',
    };
  } else if (gradingSystemId === 'scale_5_bd_board') {
    const percent = Math.min(100, Math.max(0, (cgpa / 5.0) * 100));
    return {
      percentage: parseFloat(percent.toFixed(2)),
      formulaDescription: 'Bangladesh Board (SSC/HSC): (GPA ÷ 5.0) × 100',
    };
  } else if (scale === 10) {
    const standardPercent = Math.min(100, Math.max(0, cgpa * 9.5));
    return {
      percentage: parseFloat(standardPercent.toFixed(2)),
      formulaDescription: 'Standard (AICTE / UGC): CGPA × 9.5',
    };
  } else if (scale === 4.0) {
    const percent = Math.min(100, Math.max(0, (cgpa / 4.0) * 100));
    return {
      percentage: parseFloat(percent.toFixed(2)),
      formulaDescription: '(GPA ÷ 4.0) × 100',
    };
  } else if (scale === 5.0) {
    const percent = Math.min(100, Math.max(0, (cgpa / 5.0) * 100));
    return {
      percentage: parseFloat(percent.toFixed(2)),
      formulaDescription: '(GPA ÷ 5.0) × 100',
    };
  } else {
    const percent = Math.min(100, Math.max(0, (cgpa / scale) * 100));
    return {
      percentage: parseFloat(percent.toFixed(2)),
      formulaDescription: `(CGPA ÷ ${scale}) × 100`,
    };
  }
}

/**
 * Returns academic standing honor tier
 */
export function getAcademicClassification(cgpa: number, maxScale: number, gradingSystemId?: string): {
  title: string;
  badgeColor: string;
  textColor: string;
  bgLight: string;
} {
  // Bangladesh UGC Standard (Scale 4.0):
  // 3.75 - 4.00: First Class with Distinction / Chancellor's Award / Dean's Honor
  // 3.00 - 3.74: First Class
  // 2.50 - 2.99: Second Class
  // 2.00 - 2.49: Third Class / Pass
  // < 2.00: Fail / Academic Probation
  if (gradingSystemId === 'scale_4_bd_ugc') {
    if (cgpa >= 3.75) {
      return {
        title: 'First Class with Distinction (Dean’s Honor List)',
        badgeColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (cgpa >= 3.00) {
      return {
        title: 'First Class (UGC Standards)',
        badgeColor: 'bg-blue-500',
        textColor: 'text-blue-700 dark:text-blue-300',
        bgLight: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      };
    }
    if (cgpa >= 2.50) {
      return {
        title: 'Second Class (Satisfactory)',
        badgeColor: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-300',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      };
    }
    if (cgpa >= 2.00) {
      return {
        title: 'Third Class / Passing Grade',
        badgeColor: 'bg-orange-500',
        textColor: 'text-orange-700 dark:text-orange-300',
        bgLight: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      };
    }
    return {
      title: 'Academic Probation / Below Minimum',
      badgeColor: 'bg-rose-500',
      textColor: 'text-rose-700 dark:text-rose-300',
      bgLight: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    };
  }

  // Bangladesh Board 5.0 (SSC/HSC)
  if (gradingSystemId === 'scale_5_bd_board') {
    if (cgpa >= 5.00) {
      return {
        title: 'Golden GPA 5.0 (Outstanding / A+)',
        badgeColor: 'bg-emerald-500',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      };
    }
    if (cgpa >= 4.00) {
      return {
        title: 'Grade A (Excellent)',
        badgeColor: 'bg-blue-500',
        textColor: 'text-blue-700 dark:text-blue-300',
        bgLight: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      };
    }
    if (cgpa >= 3.50) {
      return {
        title: 'Grade A- (Very Good)',
        badgeColor: 'bg-indigo-500',
        textColor: 'text-indigo-700 dark:text-indigo-300',
        bgLight: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      };
    }
    if (cgpa >= 3.00) {
      return {
        title: 'Grade B (Good)',
        badgeColor: 'bg-amber-500',
        textColor: 'text-amber-700 dark:text-amber-300',
        bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      };
    }
    if (cgpa >= 2.00) {
      return {
        title: 'Grade C / D (Pass)',
        badgeColor: 'bg-orange-500',
        textColor: 'text-orange-700 dark:text-orange-300',
        bgLight: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      };
    }
    return {
      title: 'Grade F (Fail / Need Retake)',
      badgeColor: 'bg-rose-500',
      textColor: 'text-rose-700 dark:text-rose-300',
      bgLight: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    };
  }

  const ratio = cgpa / maxScale;
  if (ratio >= 0.9) {
    return {
      title: 'First Class with Distinction / Summa Cum Laude',
      badgeColor: 'bg-emerald-500',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    };
  }
  if (ratio >= 0.8) {
    return {
      title: 'First Class / Magna Cum Laude',
      badgeColor: 'bg-blue-500',
      textColor: 'text-blue-700 dark:text-blue-300',
      bgLight: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    };
  }
  if (ratio >= 0.7) {
    return {
      title: 'First Class / Cum Laude',
      badgeColor: 'bg-indigo-500',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    };
  }
  if (ratio >= 0.6) {
    return {
      title: 'Second Class (Upper Division)',
      badgeColor: 'bg-amber-500',
      textColor: 'text-amber-700 dark:text-amber-300',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    };
  }
  if (ratio >= 0.5) {
    return {
      title: 'Second Class (Lower Division) / Pass',
      badgeColor: 'bg-orange-500',
      textColor: 'text-orange-700 dark:text-orange-300',
      bgLight: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
    };
  }
  return {
    title: 'Academic Notice / Below Minimum',
    badgeColor: 'bg-rose-500',
    textColor: 'text-rose-700 dark:text-rose-300',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
  };
}

/**
 * Calculates Required SGPA for future credits to reach target CGPA
 */
export function calculateTargetRequirement(
  currentCgpa: number,
  currentCredits: number,
  targetCgpa: number,
  remainingCredits: number,
  maxScale: number
): {
  requiredSgpa: number;
  isAchievable: boolean;
  message: string;
} {
  if (remainingCredits <= 0) {
    return {
      requiredSgpa: 0,
      isAchievable: currentCgpa >= targetCgpa,
      message: 'No remaining credits entered.',
    };
  }

  const totalRequiredPoints = targetCgpa * (currentCredits + remainingCredits);
  const currentPoints = currentCgpa * currentCredits;
  const neededPoints = totalRequiredPoints - currentPoints;
  const requiredSgpa = neededPoints / remainingCredits;

  if (requiredSgpa > maxScale) {
    return {
      requiredSgpa: parseFloat(requiredSgpa.toFixed(2)),
      isAchievable: false,
      message: `Mathematically unattainable with maximum possible grade points. You would need an average SGPA of ${requiredSgpa.toFixed(2)}, which exceeds the maximum scale limit of ${maxScale}.`,
    };
  }

  if (requiredSgpa <= 0) {
    return {
      requiredSgpa: 0,
      isAchievable: true,
      message: `You have already secured this target! Even with passing grades or 0 additional points in future credits, your cumulative performance exceeds your goal.`,
    };
  }

  return {
    requiredSgpa: parseFloat(requiredSgpa.toFixed(2)),
    isAchievable: true,
    message: `You need an average SGPA of ${requiredSgpa.toFixed(2)} across your remaining ${remainingCredits} credits to graduate with a ${targetCgpa} CGPA.`,
  };
}
