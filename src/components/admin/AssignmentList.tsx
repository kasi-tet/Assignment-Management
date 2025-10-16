
import React, { useState } from 'react';
import { Assignment } from '../../types/assignment';
import { PencilIcon, TrashIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface AssignmentListProps {
  assignments: Assignment[];
  onEdit: (assignment: Assignment) => void;
  onDelete: (id: string) => void;
  submissionsCount: Record<string, number>;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onEdit,
  onDelete,
  submissionsCount
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Assignments</h3>
          <div className="w-64">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredAssignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
          const submissionCount = submissionsCount[assignment.id] || 0;

          return (
            <div key={assignment.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{assignment.title}</h4>
                      <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                        {assignment.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => onEdit(assignment)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id, assignment.title)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{submissionCount} submissions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserGroupIcon className="h-4 w-4" />
                      <span>{assignment.assignedTo?.length || 0} assigned</span>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isOverdue 
                      ? 'bg-red-100 text-red-800'
                      : isDueSoon
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isOverdue ? 'Overdue' : isDueSoon ? `${daysUntilDue}d left` : 'On track'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No assignments found</div>
          <div className="text-gray-500 text-sm mt-2">
            {searchTerm ? 'Try adjusting your search terms' : 'Create your first assignment to get started'}
          </div>
        </div>
      )}
    </div>
  );
};