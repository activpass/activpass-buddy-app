import { Box, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';
import type { FC } from 'react';

import Link from '@/components/Link';

import { ResetPasswordForm } from './_components/ResetPasswordForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'ResetPassword',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

type ResetPasswordPageProps = {
  params: { locale: string };
  searchParams: {
    token?: string;
    email?: string;
  };
};
const ResetPasswordPage: FC<ResetPasswordPageProps> = async ({ params, searchParams }) => {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'ResetPassword',
  });

  const { token = '', email = '' } = searchParams;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription className="text-balance">{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} email={email} />
        <Box className="mt-3 text-center text-sm">
          <Link href="/signin" className="text-link underline">
            {t('redirect_to_login')}
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
