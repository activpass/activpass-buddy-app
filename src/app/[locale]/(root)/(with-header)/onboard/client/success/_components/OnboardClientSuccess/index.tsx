'use client';

import { CheckCircleIcon } from '@paalan/react-icons';
import { Box, Card, CardContent, Heading, Strong, Text } from '@paalan/react-ui';
import { useSearchParams } from 'next/navigation';

export const OnboardClientSuccess = () => {
  const searchParams = useSearchParams();
  const organizationName = searchParams.get('organizationName');
  const type = searchParams.get('type') || 'Gym';
  return (
    <Card className="max-w-[50rem]">
      <CardContent className="p-8">
        <Box className="text-center">
          <CheckCircleIcon className="size-16" color="success" />

          <Heading as="h2" mt="6" mb="2">
            Onboard Successful
          </Heading>
          <Text className="mb-2 text-center text-lg text-secondary-foreground">
            You have successfully onboarded into{' '}
            <Strong className="text-primary">{organizationName}</Strong> {type}. <br /> Please check
            your email for further instructions.
          </Text>
        </Box>
      </CardContent>
    </Card>
  );
};
