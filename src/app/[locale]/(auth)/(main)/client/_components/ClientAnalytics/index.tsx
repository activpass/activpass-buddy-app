'use client';

import { numberIntl } from '@paalan/react-shared/lib';
import { type FC, useMemo } from 'react';
import { LuCheckCircle, LuFileText, LuUsers, LuXCircle } from 'react-icons/lu';

import AnalyticsCard from '@/components/shared/AnalyticsCard';
import { api } from '@/trpc/client';

type ClientAnalyticsProps = {};
export const ClientAnalytics: FC<ClientAnalyticsProps> = () => {
  const { data: analyticsData, isLoading } = api.clients.analytics.useQuery();

  // Cards data
  const cardItems = useMemo(() => {
    return [
      {
        title: 'Total Clients',
        icon: LuUsers,
        value: numberIntl.format(analyticsData?.overallCount),
        description: 'Overall total clients',
      },
      {
        title: 'New Clients',
        icon: LuFileText,
        value: numberIntl.format(analyticsData?.newAddedCount),
        description: 'New clients this month',
      },
      {
        title: 'Present',
        icon: LuCheckCircle,
        value: numberIntl.format(analyticsData?.presentCount),
        description: 'Today clients present',
      },
      {
        title: 'Absent',
        icon: LuXCircle,
        value: numberIntl.format(analyticsData?.absentCount),
        description: 'Today clients absent',
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
