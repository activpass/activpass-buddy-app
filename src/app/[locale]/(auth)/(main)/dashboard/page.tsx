import { getTranslations } from 'next-intl/server';

import Cards from './_components/Cards';
import { Hello } from './_components/Hello';

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
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Hello />
      <Cards />
    </div>
  );
};

export default Dashboard;
