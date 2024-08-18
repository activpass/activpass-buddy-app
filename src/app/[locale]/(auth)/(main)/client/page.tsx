import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

const ClientPage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Client',
        },
      ]}
    >
      <Heading>Client Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default ClientPage;
