'use client';

import { numberIntl } from '@paalan/react-shared/lib';
import { type FC, useMemo } from 'react';
import { LuCheckCircle, LuFileText, LuUsers, LuXCircle } from 'react-icons/lu';

import AnalyticsCard from '@/components/shared/AnalyticsCard';
import { api } from '@/trpc/client';

type EmployeeAnalyticsProps = {};
export const EmployeeAnalytics: FC<EmployeeAnalyticsProps> = () => {
  const { data: analyticsData, isLoading } = api.employees.getDashboardStats.useQuery();

  // Cards data
  const cardItems = useMemo(() => {
    return [
      {
        title: 'Total Employees',
        icon: LuUsers,
        value: numberIntl.format(analyticsData?.totalEmployeeCount),
        description: 'Overall total employees',
      },
      {
        title: 'New Employees',
        icon: LuFileText,
        value: numberIntl.format(analyticsData?.newEmployeesThisMonth),
        description: 'New employees this month',
      },
      {
        title: 'Present',
        icon: LuCheckCircle,
        value: numberIntl.format(analyticsData?.presentCount),
        description: 'Today employees present',
      },
      {
        title: 'Absent',
        icon: LuXCircle,
        value: numberIntl.format(analyticsData?.absentCount),
        description: 'Today employees absent',
      },
    ];
  }, [analyticsData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardItems.map(card => (
        <AnalyticsCard key={card.title} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
};
