import React, { useState } from 'react';
import { Submission, Assignment } from '../../data/mockData'; // Updated import path
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

  const formatDateMobile = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      {/* Header - Mobile responsive */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Submissions</h3>
          <div className="flex flex-col xs:flex-row xs:space-x-2 sm:space-x-4 space-y-2 xs:space-y-0">
            <select
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="w-full xs:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Assignments</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title.length > 30 ? assignment.title.substring(0, 30) + '...' : assignment.title}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full xs:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
            <div key={submission.id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
              {/* Mobile: Stacked layout, Desktop: Side by side */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                {/* Left content - Member info and submission details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start space-x-3">
                    {/* Status icon */}
                    <div className={`p-2 rounded-full ${statusBgColor} flex-shrink-0`}>
                      <StatusIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${statusColor}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Member info row */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-2 space-y-1 xs:space-y-0">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                          {submission.memberName}
                        </span>
                        <span className="hidden xs:inline text-gray-400">•</span>
                        <span className="text-xs sm:text-sm text-gray-600 truncate">
                          {submission.memberEmail}
                        </span>
                      </div>

                      {/* Assignment title */}
                      <p className="text-sm text-gray-700 mt-1 sm:mt-1">
                        <strong className="text-xs sm:text-sm">
                          {getAssignmentTitle(submission.assignmentId)}
                        </strong>
                      </p>

                      {/* Submission content - truncated on mobile */}
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-2">
                        {submission.content}
                      </p>

                      {/* Date - different format for mobile */}
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted <span className="sm:hidden">{formatDateMobile(submission.submittedAt)}</span>
                        <span className="hidden sm:inline">{formatDate(submission.submittedAt)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Feedback - always full width */}
                  {submission.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="text-sm font-medium text-gray-900 mb-1">Feedback:</div>
                      <div className="text-sm text-gray-700 line-clamp-3">{submission.feedback}</div>
                    </div>
                  )}
                </div>

                {/* Right content - Status badges and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 sm:pl-4 sm:min-w-max">
                  {/* Grade badge - if exists */}
                  {submission.grade && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                      Grade: {submission.grade}%
                    </span>
                  )}
                  
                  {/* Status badge */}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBgColor} ${statusColor} w-fit`}>
                    {statusLabel}
                  </span>
                  
                  {/* Review button */}
                  <button
                    onClick={() => onReview(submission)}
                    className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors w-full sm:w-auto"
                  >
                    <EyeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="sm:hidden">View</span>
                    <span className="hidden sm:inline">Review</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubmissions.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-base sm:text-lg">No submissions found</div>
          <div className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
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