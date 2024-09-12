import { Heading, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import { AddClientClipboardButton } from './_components/AddClientClipboardButton';
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
        <div className="mb-5 flex items-center justify-between">
          <div>
            <Heading as="h1">New Client</Heading>
            <Text className="text-muted-foreground">This section you can add a new client.</Text>
          </div>
          <div>
            <AddClientClipboardButton />
          </div>
        </div>

        <AddClientForm />
      </div>
    </>
  );
};

export default NewClientPage;
