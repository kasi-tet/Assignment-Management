// src/data/mockData.ts
import { Assignment, Submission, User, DashboardStats } from '../types/assignment';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: '👨‍💼'
  },
  {
    id: '2',
    name: 'Lead Manager',
    email: 'lead@example.com',
    role: 'lead',
    avatar: '👩‍💼'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    avatar: '👨‍💻'
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'member',
    avatar: '👩‍💻'
  },
  {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'member',
    avatar: '🧑‍💻'
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'React Components Development',
    description: 'Create reusable React components with TypeScript and implement proper error handling. Focus on component composition and props validation.',
    dueDate: '2025-10-25',
    createdAt: '2025-10-15',
    createdBy: '1',
    status: 'active',
    assignedTo: ['3', '4', '5']
  },
  {
    id: '2',
    title: 'API Integration Task',
    description: 'Integrate with REST API endpoints, implement comprehensive error handling, and create proper loading states for better user experience.',
    dueDate: '2025-10-28',
    createdAt: '2025-10-16',
    createdBy: '1',
    status: 'active',
    assignedTo: ['3', '4']
  },
  {
    id: '3',
    title: 'Database Schema Design',
    description: 'Design and implement database schema for user management system with proper relationships, constraints, and indexing strategies.',
    dueDate: '2025-11-01',
    createdAt: '2025-10-17',
    createdBy: '2',
    status: 'active',
    assignedTo: ['4', '5']
  },
  {
    id: '4',
    title: 'UI/UX Design Review',
    description: 'Create wireframes and mockups for the new dashboard interface following material design principles and accessibility guidelines.',
    dueDate: '2025-10-20',
    createdAt: '2025-10-10',
    createdBy: '1',
    status: 'archived',
    assignedTo: ['3', '5']
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    assignmentId: '1',
    memberId: '3',
    memberName: 'John Doe',
    memberEmail: 'john@example.com',
    submittedAt: '2025-10-20T14:30:00',
    content: 'Completed React components with proper TypeScript interfaces and error boundaries. Implemented 15 reusable components including Button, Modal, Table, and Form components with comprehensive documentation.',
    attachments: ['component-library.zip'],
    status: 'approved',
    grade: 95,
    feedback: 'Excellent work! Code is clean, well-documented, and follows best practices. Great component composition and proper TypeScript usage.',
    reviewedBy: '1',
    reviewedAt: '2025-10-21T10:15:00'
  },
  {
    id: '2',
    assignmentId: '1',
    memberId: '4',
    memberName: 'Jane Smith',
    memberEmail: 'jane@example.com',
    submittedAt: '2025-10-21T09:45:00',
    content: 'Implemented React components with TypeScript. Created 12 components but facing some issues with prop validation and type definitions.',
    attachments: ['components-project.zip'],
    status: 'under-review',
    grade: 78,
    feedback: 'Good implementation overall. Please fix the prop validation issues and improve TypeScript type definitions. Consider adding more comprehensive tests.',
    reviewedBy: '1',
    reviewedAt: '2025-10-21T16:20:00'
  },
  {
    id: '3',
    assignmentId: '2',
    memberId: '3',
    memberName: 'John Doe',
    memberEmail: 'john@example.com',
    submittedAt: '2025-10-22T11:20:00',
    content: 'API integration completed with comprehensive error handling and loading states. Implemented retry mechanism and proper error boundaries.',
    attachments: ['api-integration.zip'],
    status: 'pending'
  },
  {
    id: '4',
    assignmentId: '3',
    memberId: '4',
    memberName: 'Jane Smith',
    memberEmail: 'jane@example.com',
    submittedAt: '2025-10-19T16:45:00',
    content: 'Database schema design with proper normalization and relationships. Includes user management, role-based access, and audit logging tables.',
    attachments: ['database-design.pdf'],
    status: 'approved',
    grade: 92,
    feedback: 'Well-designed schema with proper indexing considerations. Good normalization and relationship management.',
    reviewedBy: '2',
    reviewedAt: '2025-10-20T09:30:00'
  },
  {
    id: '5',
    assignmentId: '2',
    memberId: '4',
    memberName: 'Jane Smith',
    memberEmail: 'jane@example.com',
    submittedAt: '2025-10-23T08:15:00',
    content: 'Working on API error handling implementation. Completed basic integration but need more time for comprehensive testing and edge cases.',
    attachments: ['api-work-in-progress.zip'],
    status: 'under-review'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalAssignments: 4,
  totalSubmissions: 5,
  pendingReviews: 2,
  completedReviews: 3,
  overdueAssignments: 1
};