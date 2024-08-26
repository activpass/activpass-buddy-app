import { Heading } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

export const metadata = {
  title: 'Billing',
  description: 'Billing page',
};

const BillingPage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Dashboard',
            href: '/dashboard',
          },
          {
            label: 'Billing',
          },
        ]}
      />
      <Heading>Billing Page</Heading>
    </>
  );
};

export default BillingPage;
