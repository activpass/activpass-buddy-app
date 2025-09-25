import { Center, Flex, Heading, Paper, Text, VStack } from '@paalan/react-ui';
import { RedirectType } from 'next/navigation';
import type { FC } from 'react';

import { AddEmployeeForm } from '@/app/[locale]/(auth)/(main)/employees/new/_components/AddEmployeeForm';
import { redirect } from '@/lib/navigation';
import { api } from '@/trpc/server';

type OnboardEmployeePageProps = {
  searchParams: {
    token: string;
  };
};

const OnboardEmployeePage: FC<OnboardEmployeePageProps> = async ({ searchParams }) => {
  const { token } = searchParams;

  try {
    const data = await api.onboardEmployee.verify({ token });

    if (data.onBoarded) {
      return redirect('/onboard/employee/success', RedirectType.replace);
    }

    return (
      <div className="overflow-auto p-4 sm:p-0">
        <Paper className="p-8">
          <Flex flexDirection="column" gap="2" mb="8" alignItems="center" className="text-center">
            <Heading as="h2">
              Welcome to <strong className="text-primary">{data.organization.name}</strong> Employee
              Onboarding
            </Heading>
            <Text className="text-secondary-foreground">
              Please complete your employee registration by filling out the form below.
            </Text>
          </Flex>
          <Center>
            <VStack className="w-full max-w-4xl">
              <AddEmployeeForm token={data.token} organization={data.organization} />
            </VStack>
          </Center>
        </Paper>
      </div>
    );
  } catch (error) {
    return (
      <Center className="h-full p-4 sm:p-0">
        <Flex flexDirection="column" gap="4" alignItems="center" className="text-center">
          <Heading as="h2" className="text-danger">
            Invalid or Expired Token
          </Heading>
          <Text className="text-secondary-foreground">
            The onboarding link you used is either invalid or has expired. Please contact your
            organization administrator for a new invitation.
          </Text>
        </Flex>
      </Center>
    );
  }
};

export default OnboardEmployeePage;
