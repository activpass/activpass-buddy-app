import { Center, Flex, Heading, Text, VStack } from '@paalan/react-ui';
import type { Metadata } from 'next';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import { AddEmployeeClipboardButton } from './_components/AddEmployeeClipboardButton';
import { AddEmployeeForm } from './_components/AddEmployeeForm';
import { InviteEmployeeButton } from './_components/InviteEmployeeButton';

export const metadata: Metadata = {
  title: 'New Employee - Activpass',
  description: 'This section you can add a new employee.',
};

const NewClientPage: React.FC = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Employees',
            href: '/employees',
          },
          {
            label: 'Add New Employee',
          },
        ]}
      />
      <div className="flex flex-col gap-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <Heading as="h1">Add New Employee</Heading>
            <Text className="text-muted-foreground">
              You can add or invite a new employee in this section.
            </Text>
          </div>
          <Flex gap="2">
            <InviteEmployeeButton />
            <AddEmployeeClipboardButton />
          </Flex>
        </div>
        <Center>
          <VStack className="w-full max-w-4xl">
            <AddEmployeeForm />
          </VStack>
        </Center>
      </div>
    </>
  );
};

export default NewClientPage;
