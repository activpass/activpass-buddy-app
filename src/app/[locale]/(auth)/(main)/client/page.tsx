import { Button, Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';
import Link from '@/components/Link';

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
      <Button>
        <Link href="/client/profile">Go to client profile</Link>
      </Button>
    </WithBreadcrumbLayout>
  );
};

export default ClientPage;
