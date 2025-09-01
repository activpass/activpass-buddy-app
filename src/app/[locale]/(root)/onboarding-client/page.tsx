import { Flex, Heading, Paper, Text } from '@paalan/react-ui';
import type { FC } from 'react';

import { api } from '@/trpc/server';

import { AddClientForm } from '../../(auth)/(main)/client/new/_components/AddClientForm';

type OnboardClientPageProps = {
  searchParams: {
    token: string;
  };
};

const OnboardClientPage: FC<OnboardClientPageProps> = async ({ searchParams }) => {
  const { token } = searchParams;
  const data = await api.clients.verifyOnboardingToken({ token });

  return (
    <div className="overflow-auto p-4 sm:p-0">
      <Paper className="p-8">
        <Flex flexDirection="column" gap="2" mb="8" alignItems="center" className="text-center">
          <Heading as="h2">
            Welcome to <strong className="text-primary">{data.organization.name}</strong> Onboarding
          </Heading>
          <Text className="text-secondary-foreground">
            Please fill out the form below to complete your registration.
          </Text>
        </Flex>
        <AddClientForm
          membershipPlans={data.membershipPlans}
          organization={data.organization}
          onboardClientId={data.onBoardingId}
        />
      </Paper>
    </div>
  );
};

export default OnboardClientPage;
