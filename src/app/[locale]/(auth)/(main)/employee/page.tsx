import { Heading } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

const EmployeePage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Employee',
          },
        ]}
      />
      <Heading>Employee Page</Heading>
    </>
  );
};

export default EmployeePage;
