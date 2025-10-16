
import React from 'react';
import { useAssignments } from '../../hooks/useAssignments';
import { CalendarIcon, UserGroupIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

export const AssignmentOverview: React.FC = () => {
  const { assignments, submissions } = useAssignments();
  const activeAssignments = assignments.filter(a => a.status === 'active');

  const getSubmissionStats = (assignmentId: string) => {
    const assignmentSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
    const totalAssigned = assignments.find(a => a.id === assignmentId)?.assignedTo?.length || 0;
    const submitted = assignmentSubmissions.length;
    const approved = assignmentSubmissions.filter(s => s.status === 'approved').length;
    
    return { totalAssigned, submitted, approved };
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Active Assignments</h3>
        <p className="text-sm text-gray-600 mt-1">Track progress and due dates</p>
      </div>
      <div className="divide-y divide-gray-200">
        {activeAssignments.map((assignment) => {
          const stats = getSubmissionStats(assignment.id);
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

          return (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
                  
                  <div className="flex items-center space-x-6 mt-3">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{stats.submitted}/{stats.totalAssigned} submitted</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <ArchiveBoxIcon className="h-4 w-4" />
                      <span>{stats.approved} approved</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800'
                      : isDueSoon
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isOverdue ? 'Overdue' : isDueSoon ? `${daysUntilDue}d left` : 'On track'}
                  </span>
                  
                  {/* Progress Bar */}
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${stats.totalAssigned > 0 ? (stats.submitted / stats.totalAssigned) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {Math.round((stats.submitted / stats.totalAssigned) * 100)}% submitted
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {activeAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No active assignments</div>
          <div className="text-gray-500 text-sm mt-2">Create new assignments to get started</div>
        </div>
      )}
    </div>
  );
};