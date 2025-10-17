import type {
  Assignment,
  Submission,
  User,
  DashboardStats
} from '../types/assignment';
import { useState, useEffect, useMemo } from 'react';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        const [assignmentsRes, submissionsRes, usersRes] = await Promise.all([
          fetch('/api/assignments'),
          fetch('/api/submissions'),
          fetch('/api/users')
        ]);

        const [assignmentsData, submissionsData, usersData] = await Promise.all([
          assignmentsRes.json(),
          submissionsRes.json(),
          usersRes.json()
        ]);

        setAssignments(assignmentsData);
        setSubmissions(submissionsData);
        setUsers(usersData);
        setCurrentUser(usersData[0]); // Replace with auth context or session logic
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const dashboardStats = useMemo((): DashboardStats => {
    const totalAssignments = assignments.length;
    const totalSubmissions = submissions.length;
    const pendingReviews = submissions.filter(s =>
      s.status === 'pending' || s.status === 'under-review'
    ).length;
    const completedReviews = submissions.filter(s =>
      s.status === 'approved' || s.status === 'rejected'
    ).length;
    const overdueAssignments = assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      const today = new Date();
      return dueDate < today && assignment.status === 'active';
    }).length;

    return {
      totalAssignments,
      totalSubmissions,
      pendingReviews,
      completedReviews,
      overdueAssignments
    };
  }, [assignments, submissions]);

  const createAssignment = async (
    assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>
  ) => {
    if (!currentUser) return null;

    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id,
      status: 'active'
    };

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment)
      });
      if (res.ok) {
        setAssignments(prev => [...prev, newAssignment]);
        return newAssignment;
      }
    } catch (error) {
      console.error('Failed to create assignment:', error);
    }
    return null;
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setAssignments(prev =>
          prev.map(assignment =>
            assignment.id === id ? { ...assignment, ...updates } : assignment
          )
        );
      }
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setAssignments(prev => prev.filter(assignment => assignment.id !== id));
        setSubmissions(prev => prev.filter(submission => submission.assignmentId !== id));
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const updateSubmission = async (id: string, updates: Partial<Submission>) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          ...(updates.status && currentUser ? {
            reviewedBy: currentUser.id,
            reviewedAt: new Date().toISOString()
          } : {})
        })
      });
      if (res.ok) {
        setSubmissions(prev =>
          prev.map(submission =>
            submission.id === id ? {
              ...submission,
              ...updates,
              ...(updates.status && updates.status !== submission.status && currentUser ? {
                reviewedBy: currentUser.id,
                reviewedAt: new Date().toISOString()
              } : {})
            } : submission
          )
        );
      }
    } catch (error) {
      console.error('Failed to update submission:', error);
    }
  };

  const reviewSubmission = (
    id: string,
    feedback: string,
    grade?: number,
    status: 'approved' | 'rejected' = 'approved'
  ) => {
    updateSubmission(id, {
      status,
      feedback,
      grade,
      reviewedBy: currentUser?.id,
      reviewedAt: new Date().toISOString()
    });
  };

  const getAssignmentSubmissions = (assignmentId: string) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  const getMemberSubmissions = (memberId: string) => {
    return submissions.filter(submission => submission.memberId === memberId);
  };

  const getMembers = () => {
    return users.filter(user => user.role === 'member');
  };

  return {
    assignments,
    submissions,
    users,
    currentUser,
    loading,
    dashboardStats,
    activeTab,
    setActiveTab,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    updateSubmission,
    reviewSubmission,
    getAssignmentSubmissions,
    getMemberSubmissions,
    getMembers,
    switchUser: (user: User) => setCurrentUser(user)
  };
};
