import { getTranslations } from 'next-intl/server';

import siteConfig from '@/next-helpers/site.config';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const Index = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Site Name: {siteConfig.title}</p>
    </div>
  );
};
export default Index;
