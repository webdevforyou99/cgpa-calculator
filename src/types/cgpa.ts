export interface GradeScaleItem {
  grade: string;
  points: number;
  minPercentage?: number;
  maxPercentage?: number;
  description?: string;
}

export interface GradingSystem {
  id: string;
  name: string;
  maxScale: number; // e.g. 10.0, 4.0, 5.0, 4.33
  description: string;
  grades: GradeScaleItem[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: string; // matches a grade string in current grading system, or custom point
  customPoints?: number;
  isCompleted: boolean;
}

export interface Semester {
  id: string;
  name: string;
  year?: string;
  season?: string;
  courses: Course[];
  targetSgpa?: number;
}

export interface UserAcademicProfile {
  studentName: string;
  major: string;
  institution: string;
  gradingSystemId: string;
  semesters: Semester[];
  targetCgpa: number;
  priorCgpa?: number;
  priorCredits?: number;
}

export interface GradePresetOption {
  value: string;
  label: string;
  points: number;
}
