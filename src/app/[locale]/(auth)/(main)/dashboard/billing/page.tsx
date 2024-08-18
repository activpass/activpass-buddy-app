import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

export const metadata = {
  title: 'Billing',
  description: 'Billing page',
};

const BillingPage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Billing',
        },
      ]}
    >
      <Heading>Billing Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default BillingPage;
