import { LuDollarSign, LuFileText, LuTrendingDown, LuUsers } from 'react-icons/lu';

import AnalyticsCard from '@/components/shared/AnalyticsCard';

const cardItems = [
  {
    id: 1,
    title: 'Total Clients',
    icon: LuUsers,
    value: '45,231',
    description: '+20.1% from Overall',
  },
  {
    id: 2,
    title: 'Client Entries',
    icon: LuFileText,
    value: '350',
    description: '+180.1% from today',
  },
  {
    id: 3,
    title: 'Total Earnings',
    icon: LuDollarSign,
    value: '+112,234',
    description: '+19% from this month',
  },
  {
    id: 4,
    title: 'Total Expenses',
    icon: LuTrendingDown,
    value: '-11,573',
    description: '+201 since this month',
  },
];

const Cards = () => {
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

export default Cards;
