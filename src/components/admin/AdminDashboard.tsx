
import  { useState, useMemo } from 'react';
import { useAssignments } from '../../hooks/useAssignments';
import { Layout } from '../common/Layout';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { AssignmentList } from './AssignmentList';
import { SubmissionList } from './SubmissionList';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { Assignment, Submission } from '../../types/assignment';

export const AdminDashboard: React.FC = () => {
  const {
    assignments,
    submissions,
    currentUser,
    loading,
    dashboardStats,
    activeTab,
    setActiveTab,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    reviewSubmission
  } = useAssignments();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | undefined>();

  const submissionsCount = useMemo(() => {
    const count: Record<string, number> = {};
    submissions.forEach(submission => {
      count[submission.assignmentId] = (count[submission.assignmentId] || 0) + 1;
    });
    return count;
  }, [submissions]);

  const handleCreateAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    createAssignment(assignmentData);
    setIsCreateModalOpen(false);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsCreateModalOpen(true);
  };

  const handleUpdateAssignment = (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, assignmentData);
      setEditingAssignment(undefined);
      setIsCreateModalOpen(false);
    }
  };

  const handleReviewSubmission = (submission: Submission) => {
    const feedback = window.prompt('Enter feedback for this submission:', submission.feedback || '');
    const grade = window.prompt('Enter grade (0-100):', submission.grade?.toString() || '');
    const status = window.confirm('Approve this submission? Click OK for Approved, Cancel for Rejected.') 
      ? 'approved' as const 
      : 'rejected' as const;

    if (feedback !== null) {
      reviewSubmission(
        submission.id,
        feedback,
        grade ? parseInt(grade) : undefined,
        status
      );
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingAssignment(undefined);
  };

  if (loading) {
    return (
      <Layout title="Admin Dashboard" subtitle="Loading...">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout
      title="Assignment Manager"
      subtitle="Admin Dashboard - Manage assignments and review submissions"
      actions={
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'assignments'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'submissions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submissions
            </button>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create Assignment
          </button>
        </div>
      }
    >
      <DashboardStats stats={dashboardStats} />

      {activeTab === 'assignments' ? (
        <AssignmentList
          assignments={assignments}
          onEdit={handleEditAssignment}
          onDelete={deleteAssignment}
          submissionsCount={submissionsCount}
        />
      ) : (
        <SubmissionList
          submissions={submissions}
          assignments={assignments}
          onReview={handleReviewSubmission}
        />
      )}

      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
        assignment={editingAssignment}
      />
    </Layout>
  );
};