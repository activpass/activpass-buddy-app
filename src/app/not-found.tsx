'use client';

import { Button } from '@paalan/react-ui';
import { useTranslations } from 'next-intl';
import { HiArrowLeft } from 'react-icons/hi2';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

const NotFoundPage = () => {
  const t = useTranslations();
  return (
    <>
      <div />
      <CenteredLayout>
        <main className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-semibold"> 404 </h1>
          <h1 className="mt-4">{t('layouts.error.notFound.title')}</h1>
          <p className="mt-4 max-w-sm text-center text-lg">
            {t('layouts.error.notFound.description')}
          </p>
          <Button as={Link} href="/" leftIcon={<HiArrowLeft className="size-4" />}>
            {t('layouts.error.backToHome')}
          </Button>
        </main>
      </CenteredLayout>
    </>
  );
};

export default NotFoundPage;
