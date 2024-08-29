import { Heading } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

const FinancePage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Finance',
          },
        ]}
      />
      <Heading>Finance Page</Heading>
    </>
  );
};

export default FinancePage;
