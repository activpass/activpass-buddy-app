import { Heading, VStack } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import Cards from './_components/Cards';
import { ClientsStatistics } from './_components/ClientsStatistics';
import { EmployeeSalary } from './_components/EmployeeSalary';
import { Greeting } from './_components/Greeting';
import { MostVisitedHour } from './_components/MostVisitedHour';
import RecentEntries from './_components/RecentEntries';
import RevenueUpdatesChart from './_components/RevenueUpdatesChart';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const Dashboard = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Dashboard',
          },
        ]}
      />
      <div className="flex flex-1 flex-col gap-4 md:gap-8">
        <VStack gap="3">
          <Heading>Dashboard</Heading>
          <Greeting />
        </VStack>
        <Cards />
        <RevenueUpdatesChart />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <EmployeeSalary />
          <MostVisitedHour />
          <ClientsStatistics />
        </div>
        <div className="grid gap-4 md:grid-cols-1 md:gap-8 lg:grid-cols-2">
          <RecentEntries />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
