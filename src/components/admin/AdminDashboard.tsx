import { useState, useMemo } from 'react';
import { useAssignments } from '../../hooks/useAssignments';
import { Layout } from '../common/Layout';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { AssignmentList } from './AssignmentList';
import { SubmissionList } from './SubmissionList';
import { CreateAssignmentModal } from './CreateAssignmentModal';
import { Assignment, Submission } from '../../data/mockData';

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
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-4 w-full xs:w-auto">
          {/* Tab Navigation - Mobile responsive */}
          <div className="flex bg-gray-100 rounded-lg p-1 w-full xs:w-auto">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 xs:flex-none px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'assignments'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex-1 xs:flex-none px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                activeTab === 'submissions'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submissions
            </button>
          </div>
          
          {/* Create Button - Mobile responsive */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap w-full xs:w-auto flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </button>
        </div>
      }
    >
      {/* Remove the extra container divs that might be causing issues */}
      <DashboardStats stats={dashboardStats} />

      {/* Main Content Area - Simplified */}
      <div className="mt-6"> {/* Use margin instead of complex flexbox */}
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
      </div>

      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
        assignment={editingAssignment}
      />
    </Layout>
  );
};