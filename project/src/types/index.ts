export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin';
  studentId?: string;
  semester?: number;
  department?: string;
  mobile?: string; // Added for admin/faculty
  createdAt: string;
}

export interface Activity {
  id: string;
  studentId: string;
  title: string;
  description: string;
  category: 'academic' | 'extracurricular' | 'internship' | 'workshop' | 'volunteering' | 'certificate' | 'project';
  semester: number;
  credits: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
  documentUrl?: string;
  documentName?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'approval' | 'rejection' | 'reminder' | 'info';
  read: boolean;
  createdAt: string;
}

export interface Analytics {
  totalActivities: number;
  totalCredits: number;
  approvedActivities: number;
  pendingActivities: number;
  activitiesBySemester: { semester: number; count: number }[];
  activitiesByCategory: { category: string; count: number }[];
  creditsPerMonth: { month: string; credits: number }[];
}