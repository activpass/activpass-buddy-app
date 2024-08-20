import { CheckCircle, FileText, Users, XCircle } from 'lucide-react';

import AnalyticsCard from '@/components/shared/AnalyticsCard';

const cardItems = [
  {
    id: 1,
    title: 'Total Clients',
    icon: Users,
    value: '45,231',
    description: '+20.1% compared to last month',
  },
  {
    id: 2,
    title: 'New Clients',
    icon: FileText,
    value: '350',
    description: '+180.1% compared to yesterday',
  },
  {
    id: 3,
    title: 'Present',
    icon: CheckCircle,
    value: '2,234',
    description: '+119% compared to yesterday',
  },
  {
    id: 4,
    title: 'Absent',
    icon: XCircle,
    value: '573',
    description: '-20 compared to yesterday',
  },
];

const ClientAnalytics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardItems.map(card => (
        <AnalyticsCard
          key={card.id}
          title={card.title}
          icon={card.icon}
          value={card.value}
          description={card.description}
        />
      ))}
    </div>
  );
};

export default ClientAnalytics;
