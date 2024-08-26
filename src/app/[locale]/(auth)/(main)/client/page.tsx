import { Button, Heading } from '@paalan/react-ui';

import Link from '@/components/Link';
import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

const ClientPage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Client',
          },
        ]}
      />
      <Heading>Client Page</Heading>
      <Link href="/client/profile">
        <Button className="mt-4 w-full">Go to client profile</Button>
      </Link>
    </>
  );
};

export default ClientPage;
