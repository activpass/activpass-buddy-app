import { Heading, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import { AddClientForm } from './_components/AddClientForm';

export const metadata: Metadata = {
  title: 'New Client',
  description: 'This section you can add a new client.',
};

const NewClientPage: React.FC = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Client',
            href: '/client',
          },
          {
            label: 'New',
          },
        ]}
      />
      <div className="flex flex-col gap-5">
        <div className="mb-5">
          <Heading as="h1">New Client</Heading>
          <Text className="text-muted-foreground">This section you can add a new client.</Text>
        </div>

        <AddClientForm />
      </div>
    </>
  );
};

export default NewClientPage;
