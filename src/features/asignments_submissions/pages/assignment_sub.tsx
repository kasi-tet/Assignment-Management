// src/features/asignments_submissions/pages/assignment_sub.tsx

import { useState, useMemo, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { useAssignments } from '../hooks/useAssignments';
import { Layout } from '../components/common/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { DashboardStats } from '../components/admin/DashboardStats';
import { AssignmentList } from '../components/admin/AssignmentList';
import { SubmissionList } from '../components/admin/SubmissionList';
import { CreateAssignmentModal } from '../components/admin/CreateAssignmentModal';
import type { Assignment, Submission } from '../types/assignment';

export const AssignmentSub: React.FC = () => {
  const {
    assignments,
    submissions,
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

  const handleCreateAssignment = async (
    assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>
  ) => {
    await createAssignment(assignmentData);
    setIsCreateModalOpen(false);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsCreateModalOpen(true);
  };

  const handleUpdateAssignment = async (
    assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>
  ) => {
    if (editingAssignment) {
      await updateAssignment(editingAssignment.id, assignmentData);
      setEditingAssignment(undefined);
      setIsCreateModalOpen(false);
    }
  };

  const handleReviewSubmission = (submission: Submission) => {
    const feedback = window.prompt('Enter feedback for this submission:', submission.feedback || '');
    const grade = window.prompt('Enter grade (0-100):', submission.grade?.toString() || '');
    const status = window.confirm('Approve this submission? Click OK for Approved, Cancel for Rejected.')
      ? 'approved'
      : 'rejected';

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
      <Layout title="Admin Dashboard" subtitle="Loading data...">
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout
      title="Assignment Manager"
      subtitle="Manage assignments and review submissions"
      actions={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Tab Buttons */}
          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'assignments'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeTab === 'submissions'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submissions
            </button>
          </div>

          {/* Create Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition-transform duration-300 hover:scale-[1.02]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </button>
        </div>
      }
    >
      <DashboardStats stats={dashboardStats} />

      <div className="mt-6 space-y-6">
        <Transition
          as={Fragment}
          show={activeTab === 'assignments'}
          enter="transition ease-out duration-500 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-300 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div>
            <AssignmentList
              assignments={assignments}
              onEdit={handleEditAssignment}
              onDelete={deleteAssignment}
              submissionsCount={submissionsCount}
            />
          </div>
        </Transition>

        <Transition
          as={Fragment}
          show={activeTab === 'submissions'}
          enter="transition ease-out duration-500 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-300 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div>
            <SubmissionList
              submissions={submissions}
              assignments={assignments}
              onReview={handleReviewSubmission}
            />
          </div>
        </Transition>
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
