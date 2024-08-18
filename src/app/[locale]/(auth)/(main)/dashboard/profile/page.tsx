import { Heading } from '@paalan/react-ui';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

export const metadata = {
  title: 'Profile',
  description: 'Profile page',
};

const ProfilePage = () => {
  return (
    <WithBreadcrumbLayout
      items={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Profile',
        },
      ]}
    >
      <Heading>Profile Page</Heading>
    </WithBreadcrumbLayout>
  );
};

export default ProfilePage;
