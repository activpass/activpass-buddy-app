import { numberIntl } from '@paalan/react-shared/lib';
import { CheckCircle, FileText, Users, XCircle } from 'lucide-react';
import { type FC } from 'react';

import AnalyticsCard from '@/components/shared/AnalyticsCard';
import { api } from '@/trpc/server';

type ClientAnalyticsProps = {};
export const ClientAnalytics: FC<ClientAnalyticsProps> = async () => {
  const analyticsData = await api.clients.analytics();

  const cardItems = [
    {
      title: 'Total Clients',
      icon: Users,
      value: numberIntl.format(analyticsData.overallCount),
      description: 'Overall total clients',
    },
    {
      title: 'New Clients',
      icon: FileText,
      value: numberIntl.format(analyticsData.newAddedCount),
      description: 'New clients this month',
    },
    {
      title: 'Present',
      icon: CheckCircle,
      value: numberIntl.format(analyticsData.presentCount),
      description: 'Today clients present',
    },
    {
      title: 'Absent',
      icon: XCircle,
      value: numberIntl.format(analyticsData.absentCount),
      description: 'Today clients absent',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardItems.map(card => (
        <AnalyticsCard key={card.title} {...card} />
      ))}
    </div>
  );
};
