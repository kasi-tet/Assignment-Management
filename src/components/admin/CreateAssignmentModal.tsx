import { useState, useEffect } from 'react';
import { Assignment } from '../../data/mockData';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (assignment: Omit<Assignment, 'id' | 'createdAt' | 'createdBy' | 'status'>) => void;
  assignment?: Assignment;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  assignment
}) => {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    description: assignment?.description || '',
    dueDate: assignment?.dueDate || '',
    assignedTo: assignment?.assignedTo || [] as string[]
  });

  // Reset form when assignment changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: assignment?.title || '',
        description: assignment?.description || '',
        dueDate: assignment?.dueDate || '',
        assignedTo: assignment?.assignedTo || []
      });
    }
  }, [assignment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Don't reset form here - let useEffect handle it when modal reopens
  };

  const handleClose = () => {
    onClose();
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      {/* Enhanced mobile container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-auto my-auto sm:my-0">
        {/* Sticky header with better mobile handling */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-3">
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h2>
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Form with enhanced mobile UX */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Assignment Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base placeholder-gray-400"
              placeholder="Enter assignment title"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base placeholder-gray-400 resize-vertical min-h-[120px]"
              placeholder="Enter assignment description and requirements..."
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base sm:text-base"
            />
            {formData.dueDate && (
              <p className="text-xs text-gray-500 mt-2">
                Due on: {new Date(formData.dueDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>

          {/* Enhanced action buttons with better mobile UX */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-2 space-y-reverse sm:space-y-0 pt-4 sm:pt-6 border-t border-gray-200 sticky bottom-0 bg-white pb-2 sm:pb-0">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors active:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors active:bg-blue-800 shadow-sm"
            >
              {assignment ? 'Update Assignment' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};