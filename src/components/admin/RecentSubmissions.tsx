
import React from 'react';
import { useAssignments } from '../../hooks/useAssignments';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export const RecentSubmissions: React.FC = () => {
  const { submissions, assignments } = useAssignments();
  const recentSubmissions = submissions.slice(0, 5);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircleIcon, color: 'text-green-500', bgColor: 'bg-green-100' };
      case 'under-review':
        return { icon: ClockIcon, color: 'text-yellow-500', bgColor: 'bg-yellow-100' };
      case 'pending':
        return { icon: ClockIcon, color: 'text-blue-500', bgColor: 'bg-blue-100' };
      case 'rejected':
        return { icon: ExclamationCircleIcon, color: 'text-red-500', bgColor: 'bg-red-100' };
      default:
        return { icon: ClockIcon, color: 'text-gray-500', bgColor: 'bg-gray-100' };
    }
  };

  const getAssignmentTitle = (assignmentId: string) => {
    return assignments.find(a => a.id === assignmentId)?.title || 'Unknown Assignment';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
        <p className="text-sm text-gray-600 mt-1">Latest assignment submissions from members</p>
      </div>
      <div className="divide-y divide-gray-200">
        {recentSubmissions.map((submission) => {
          const StatusIcon = getStatusConfig(submission.status).icon;
          const statusColor = getStatusConfig(submission.status).color;
          const statusBgColor = getStatusConfig(submission.status).bgColor;

          return (
            <div key={submission.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${statusBgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{submission.memberName}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{submission.memberEmail}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {getAssignmentTitle(submission.assignmentId)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {formatDate(submission.submittedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {submission.grade && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Grade: {submission.grade}%
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusBgColor} ${statusColor}`}>
                    {submission.status.replace('-', ' ')}
                  </span>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {submission.feedback && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md">
                  <div className="text-sm font-medium text-gray-900 mb-1">Feedback:</div>
                  <div className="text-sm text-gray-600">{submission.feedback}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {recentSubmissions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No submissions yet</div>
          <div className="text-gray-500 text-sm mt-2">Submissions will appear here once members start submitting work</div>
        </div>
      )}
    </div>
  );
};