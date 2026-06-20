import { Heading } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

export const metadata = {
  title: 'Settings',
  description: 'Settings page',
};

const SettingsPage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Dashboard',
            href: '/dashboard',
          },
          {
            label: 'Settings',
          },
        ]}
      />
      <Heading>Settings Page</Heading>
    </>
  );
};

export default SettingsPage;
