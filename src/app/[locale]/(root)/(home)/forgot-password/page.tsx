import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';

import Link from '@/components/Link';

import { ForgotPasswordForm } from './_components/ForgotPasswordForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'ForgotPassword',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const ForgotPasswordPage = () => {
  return (
    <Card className="flex-1">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription className="text-balance">
          Enter your email below to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
        <Text className="mt-3 text-center text-sm">
          Remember your password?{' '}
          <Link href="/signin" className="text-link underline">
            Sign in
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
