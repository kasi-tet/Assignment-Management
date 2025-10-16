// components/admin/DashboardStats.tsx
import React from 'react';
import { DashboardStats as DashboardStatsType } from '../../data/mockData';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statCards = [
    {
      name: 'Total Assignments',
      value: stats.totalAssignments,
      icon: '📝',
      color: 'bg-blue-500',
      description: 'Active assignments'
    },
    {
      name: 'Total Submissions',
      value: stats.totalSubmissions,
      icon: '📤',
      color: 'bg-green-500',
      description: 'All submissions'
    },
    {
      name: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: '⏰',
      color: 'bg-yellow-500',
      description: 'Need attention'
    },
    {
      name: 'Overdue',
      value: stats.overdueAssignments,
      icon: '⚠️',
      color: 'bg-red-500',
      description: 'Past due date'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} rounded-lg p-3`}>
                  <span className="text-white text-xl">{stat.icon}</span>
                </div>
              </div>
              <div className="ml-4 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd>
                    <div className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                  </dd>
                  <dt className="text-xs text-gray-400 mt-1">{stat.description}</dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};