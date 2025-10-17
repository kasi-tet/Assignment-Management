// src/features/asignments_submissions/hooks/useAdmin.ts

import { useMemo } from 'react';
import { useAssignments } from '../hooks/useAssignments';
import type { DashboardStats } from '../types/assignment';

export const useAdmin = () => {
  const { assignments, submissions, users } = useAssignments();

  const dashboardStats = useMemo((): DashboardStats => {
    const totalAssignments = assignments.length;
    const totalSubmissions = submissions.length;
    const pendingReviews = submissions.filter(
      s => s.status === 'pending' || s.status === 'under-review'
    ).length;
    const completedReviews = submissions.filter(
      s => s.status === 'approved' || s.status === 'rejected'
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

  const getAssignmentAnalytics = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
    const totalAssigned = assignments.find(a => a.id === assignmentId)?.assignedTo?.length || 0;

    return {
      totalAssigned,
      submitted: assignmentSubmissions.length,
      approved: assignmentSubmissions.filter(s => s.status === 'approved').length,
      underReview: assignmentSubmissions.filter(s => s.status === 'under-review').length,
      pending: assignmentSubmissions.filter(s => s.status === 'pending').length,
      averageGrade:
        assignmentSubmissions.filter(s => s.grade).reduce((acc, curr) => acc + (curr.grade || 0), 0) /
          assignmentSubmissions.filter(s => s.grade).length || 0
    };
  };

  const getMemberPerformance = (memberId: string) => {
    const memberSubmissions = submissions.filter(s => s.memberId === memberId);
    const approvedSubmissions = memberSubmissions.filter(s => s.status === 'approved');
    const averageGrade =
      approvedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) /
        approvedSubmissions.length || 0;

    return {
      totalSubmissions: memberSubmissions.length,
      approvedSubmissions: approvedSubmissions.length,
      averageGrade,
      completionRate:
        assignments.length > 0
          ? (memberSubmissions.length /
              assignments.filter(a => a.assignedTo?.includes(memberId)).length) *
            100
          : 0
    };
  };

  return {
    dashboardStats,
    getAssignmentAnalytics,
    getMemberPerformance,
    assignments,
    submissions,
    users
  };
};
