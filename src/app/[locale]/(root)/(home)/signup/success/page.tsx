'use client';

import { Box, Heading, Text } from '@paalan/react-ui';
import { useSearchParams } from 'next/navigation';

import { SignupSuccess } from './_components/SignupSuccess';

const SignupSuccessPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  if (!email) {
    return (
      <Box className="flex min-h-screen items-center justify-center">
        <Box className="text-center">
          <Heading className="mb-4 text-2xl font-bold">Invalid Request</Heading>
          <Text className="text-muted-foreground">No email address provided.</Text>
        </Box>
      </Box>
    );
  }

  return <SignupSuccess email={email} />;
};

export default SignupSuccessPage;
