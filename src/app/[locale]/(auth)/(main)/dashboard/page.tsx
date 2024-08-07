import { getTranslations } from 'next-intl/server';

import Cards from './_components/Cards';
import { ClientsStatistics } from './_components/ClientsStatistics';
import { EmployeeSalary } from './_components/EmployeeSalary';
import { Hello } from './_components/Greating';
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
  };
}

const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="w-32 rounded-md border p-2 dark:bg-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      </div>
      <Hello />
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
  );
};

export default Dashboard;
