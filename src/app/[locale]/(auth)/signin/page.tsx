import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';

import Link from '@/components/Link';
import { FeedbackLayout } from '@/layouts/FeedbackLayout';

import { SignInForm } from './_components/SignInForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignInPage = () => {
  return (
    <FeedbackLayout>
      <Card className="lg:min-w-128">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription className="text-balance">
            Enter your email below to signin to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <Text className="mt-3 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-link underline">
              Sign up
            </Link>
          </Text>
        </CardContent>
      </Card>
    </FeedbackLayout>
  );
};

export default SignInPage;
