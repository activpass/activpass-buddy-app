'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UpdateIcon } from '@paalan/react-icons';
import { Button } from '@paalan/react-ui';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { type FC, useEffect } from 'react';

import Link from '@/components/Link';
import BaseLayout from '@/layouts/BaseLayout';
import { CenteredLayout } from '@/layouts/CenteredLayout';
import { Providers } from '@/providers/providers';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  params: { locale: string };
  reset: () => void;
};
const GlobalErrorPage: FC<GlobalErrorPageProps> = ({ error, params, reset }) => {
  const t = useTranslations();
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang={params.locale}>
      <body>
        <Providers>
          <BaseLayout>
            <CenteredLayout>
              <main className="flex flex-col gap-3 text-center">
                <h1 className="text-4xl font-semibold"> 500 </h1>
                <h1 className="mt-4">{t('layouts.error.internalServerError.title')}</h1>
                <p className="mt-4 max-w-sm text-center text-lg">
                  {t('layouts.error.internalServerError.description')}
                </p>
                <div className="flex gap-2">
                  <Button
                    as={Link}
                    href="/dashboard"
                    leftIcon={<ArrowLeftIcon className="size-4" />}
                  >
                    {t('layouts.error.backToHome')}
                  </Button>
                  <Button
                    as={Link}
                    href="/"
                    variant="outline"
                    onClick={e => {
                      e.preventDefault();
                      // Attempt to recover by trying to re-render the segment

                      reset();
                    }}
                    leftIcon={<UpdateIcon className="size-4" />}
                  >
                    {t('layouts.error.refresh')}
                  </Button>
                </div>
              </main>
            </CenteredLayout>
          </BaseLayout>
        </Providers>
      </body>
    </html>
  );
};

export default GlobalErrorPage;
