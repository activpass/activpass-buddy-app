import { Heading } from '@paalan/react-ui';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

export const metadata = {
  title: 'Profile',
  description: 'Profile page',
};

const ProfilePage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Dashboard',
            href: '/dashboard',
          },
          {
            label: 'Profile',
          },
        ]}
      />
      <Heading>Profile Page</Heading>
    </>
  );
};

export default ProfilePage;
