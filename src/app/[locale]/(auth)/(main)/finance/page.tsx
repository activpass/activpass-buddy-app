import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

const FinancePage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Finance',
        },
      ]}
    >
      <Heading>Finance Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default FinancePage;
