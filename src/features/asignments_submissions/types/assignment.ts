
export type Assignment = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'archived';
  assignedTo?: string[];
};

export type Submission = {
  id: string;
  assignmentId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  submittedAt: string;
  content: string;
  attachments?: string[];
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  grade?: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'member';
  avatar?: string;
};

export type DashboardStats = {
  totalAssignments: number;
  totalSubmissions: number;
  pendingReviews: number;
  completedReviews: number;
  overdueAssignments: number;
};

// Alternative: You can also use interface with export default
export interface IAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'archived';
  assignedTo?: string[];
}

export interface ISubmission {
  id: string;
  assignmentId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  submittedAt: string;
  content: string;
  attachments?: string[];
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  grade?: number;
  feedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lead' | 'member';
  avatar?: string;
}

export interface IDashboardStats {
  totalAssignments: number;
  totalSubmissions: number;
  pendingReviews: number;
  completedReviews: number;
  overdueAssignments: number;
}
export const __types = true;