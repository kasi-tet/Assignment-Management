
import { useState, useEffect, useMemo } from 'react';
import { mockAssignments, mockSubmissions, mockUsers, mockDashboardStats } from '../data/mockData';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'assignments' | 'submissions'>('assignments');

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssignments([...mockAssignments]);
      setSubmissions([...mockSubmissions]);
      setUsers([...mockUsers]);
      setLoading(false);
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

  const createAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `assignment-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser.id,
      status: 'active'
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, ...updates } : assignment
    ));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    setSubmissions(prev => prev.filter(submission => submission.assignmentId !== id));
  };

  const updateSubmission = (id: string, updates: Partial<Submission>) => {
    setSubmissions(prev => prev.map(submission => 
      submission.id === id ? { 
        ...submission, 
        ...updates,
        ...(updates.status && updates.status !== submission.status ? {
          reviewedBy: currentUser.id,
          reviewedAt: new Date().toISOString()
        } : {})
      } : submission
    ));
  };

  const reviewSubmission = (id: string, feedback: string, grade?: number, status: 'approved' | 'rejected' = 'approved') => {
    updateSubmission(id, {
      status,
      feedback,
      grade,
      reviewedBy: currentUser.id,
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