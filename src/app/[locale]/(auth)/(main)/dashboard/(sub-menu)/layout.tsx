import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';

import { SidebarNav } from '@/components/Common/SidebarNav';
import { api } from '@/trpc/server';

import { ProfileInfo } from './_components/ProfileInfo';

export const metadata: Metadata = {
  title: 'User Profile',
  description: 'Manage your user profile details',
};

type ProfileLayoutProps = PropsWithChildren;

const ProfileLayout: FC<ProfileLayoutProps> = async ({ children }) => {
  const data = await api.users.getUserCacheById();

  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `/dashboard/profile`,
    },
    {
      title: 'Billings',
      href: `/dashboard/billings`,
    },
    {
      title: 'Settings',
      href: `/dashboard/settings`,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <Heading as="h2">Profile</Heading>
        <Text className="text-muted-foreground">
          View and change your profile and company details here.{' '}
        </Text>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 flex flex-col gap-6 lg:w-72">
          <ProfileInfo data={data} />
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
