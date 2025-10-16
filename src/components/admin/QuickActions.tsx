
import { 
  PlusIcon, 
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const actions = [
  {
    title: 'Create Assignment',
    description: 'Create a new assignment for members',
    icon: PlusIcon,
    href: '#',
    iconBackground: 'bg-green-500',
  },
  {
    title: 'Review Submissions',
    description: 'Check and grade pending submissions',
    icon: DocumentMagnifyingGlassIcon,
    href: '#',
    iconBackground: 'bg-blue-500',
  },
  {
    title: 'View Analytics',
    description: 'See performance metrics and reports',
    icon: ChartBarIcon,
    href: '#',
    iconBackground: 'bg-purple-500',
  },
  {
    title: 'Manage Members',
    description: 'Add or remove team members',
    icon: UserGroupIcon,
    href: '#',
    iconBackground: 'bg-orange-500',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <div
            key={action.title}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div>
              <span className={`rounded-lg inline-flex p-3 ${action.iconBackground} text-white ring-4 ring-white`}>
                <action.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">
                <a href={action.href} className="focus:outline-none">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {action.title}
                </a>
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {action.description}
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};