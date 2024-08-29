import { Heading, Text } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

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
      <div className="mb-5">
        <Heading as="h1">New Client</Heading>
        <Text className="text-muted-foreground">This section you can add a new client.</Text>
      </div>

      <div>steepr form</div>
    </>
  );
};

export default NewClientPage;
