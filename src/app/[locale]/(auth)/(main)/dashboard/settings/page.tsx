import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

export const metadata = {
  title: 'Settings',
  description: 'Settings page',
};

const SettingsPage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Settings',
        },
      ]}
    >
      <Heading>Settings Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default SettingsPage;
