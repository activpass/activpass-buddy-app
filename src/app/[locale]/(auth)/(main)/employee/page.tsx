import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

const EmployeePage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Employee',
        },
      ]}
    >
      <Heading>Employee Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default EmployeePage;
