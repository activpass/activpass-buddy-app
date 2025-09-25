import type { Role } from './types';

export const getLevelColor = (level: Role['level']) => {
  const colors = {
    SUPER_ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    ADMIN: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    MANAGER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    EMPLOYEE: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    VIEWER: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    GUEST: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  };
  return colors[level] || 'bg-gray-100 text-gray-800';
};

export const getTypeColor = (type: Role['type']) => {
  const colors = {
    SYSTEM: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    ORGANIZATION: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
    CUSTOM: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};
