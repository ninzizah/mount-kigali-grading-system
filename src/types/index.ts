export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'lecturer' | 'admin';
  createdAt?: Date;
  lastLogin?: Date;
  isActive?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: string;
  studentAnswer?: string;
}

export interface GradingResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  letterGrade: string;
  questions: Question[];
  studentInfo?: StudentInfo;
}

export interface StudentInfo {
  name: string;
  department: string;
  school: string;
  regNumber: string;
}

export interface UploadedFile {
  name: string;
  content: string;
  uploadDate: Date;
}

export interface SystemStats {
  totalUsers: number;
  totalStudents: number;
  totalLecturers: number;
  totalPapersGraded: number;
  totalQuestionsAnalyzed: number;
  averageGrade: number;
  activeUsersToday: number;
}

export interface GradingScale {
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
}