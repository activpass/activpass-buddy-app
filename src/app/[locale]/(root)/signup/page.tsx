import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';

import Link from '@/components/Link';

import { SignUpForm } from './_components/SignUpForm';

export const metadata = {
  title: 'Sign Up',
  description: 'Sign up to create an account',
};

const SignUpPage = () => {
  return (
    <Card className="lg:min-w-128">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Signup</CardTitle>
        <CardDescription className="text-balance">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <Text className="mt-3 text-center text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="text-link underline">
            Sign in
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
