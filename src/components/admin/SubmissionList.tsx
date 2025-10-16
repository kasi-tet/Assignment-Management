
import React, { useState } from 'react';
import { Submission, Assignment } from '../../types/assignment';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

interface SubmissionListProps {
  submissions: Submission[];
  assignments: Assignment[];
  onReview: (submission: Submission) => void;
}

export const SubmissionList: React.FC<SubmissionListProps> = ({
  submissions,
  assignments,
  onReview
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');

  const filteredSubmissions = submissions.filter(submission => {
    const statusMatch = statusFilter === 'all' || submission.status === statusFilter;
    const assignmentMatch = assignmentFilter === 'all' || submission.assignmentId === assignmentFilter;
    return statusMatch && assignmentMatch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { 
          icon: CheckCircleIcon, 
          color: 'text-green-500', 
          bgColor: 'bg-green-100',
          label: 'Approved'
        };
      case 'under-review':
        return { 
          icon: ClockIcon, 
          color: 'text-yellow-500', 
          bgColor: 'bg-yellow-100',
          label: 'Under Review'
        };
      case 'pending':
        return { 
          icon: ClockIcon, 
          color: 'text-blue-500', 
          bgColor: 'bg-blue-100',
          label: 'Pending'
        };
      case 'rejected':
        return { 
          icon: ExclamationCircleIcon, 
          color: 'text-red-500', 
          bgColor: 'bg-red-100',
          label: 'Rejected'
        };
      default:
        return { 
          icon: ClockIcon, 
          color: 'text-gray-500', 
          bgColor: 'bg-gray-100',
          label: 'Unknown'
        };
    }
  };

  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find(a => a.id === assignmentId)?.title || 'Unknown Assignment';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
          <div className="flex space-x-4">
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Assignments</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredSubmissions.map((submission) => {
          const StatusIcon = getStatusConfig(submission.status).icon;
          const statusColor = getStatusConfig(submission.status).color;
          const statusBgColor = getStatusConfig(submission.status).bgColor;
          const statusLabel = getStatusConfig(submission.status).label;

          return (
            <div key={submission.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${statusBgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{submission.memberName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{submission.memberEmail}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>{getAssignmentTitle(submission.assignmentId)}</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {submission.content}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Submitted {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {submission.grade && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Grade: {submission.grade}%
                    </span>
                  )}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor}`}>
                    {statusLabel}
                  </span>
                  <button
                    onClick={() => onReview(submission)}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Review
                  </button>
                </div>
              </div>

              {submission.feedback && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">Feedback:</div>
                  <div className="text-sm text-gray-700">{submission.feedback}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No submissions found</div>
          <div className="text-gray-500 text-sm mt-2">
            {statusFilter !== 'all' || assignmentFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Submissions will appear here once members start submitting work'
            }
          </div>
        </div>
      )}
    </div>
  );
};