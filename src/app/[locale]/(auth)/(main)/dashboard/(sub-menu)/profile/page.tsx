import { ProfileHeader } from '@/components/Common/ProfileHeader';
import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import ProfileClientPage from './page.client';

// import ProfileClientPage from './page.client';

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
      <div className="space-y-6">
        <ProfileHeader
          title="Profile Details"
          description="Details of your profile can be viewed here"
          showActionButton={false}
        />
        <ProfileClientPage />
      </div>
    </>
  );
};

export default ProfilePage;
