import { Avatar, Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';

import { SidebarNav } from './_components/sidebar-nav';

export const metadata: Metadata = {
  title: 'Client Profile',
  description: 'Manage your profile, membership, and attendance.',
};

type ProfileLayoutProps = PropsWithChildren<{
  params: {
    id: string;
  };
}>;
const ProfileLayout: FC<ProfileLayoutProps> = async ({ children, params }) => {
  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `/client/${params.id}`,
    },
    {
      title: 'Membership',
      href: `/client/${params.id}/membership`,
    },
    {
      title: 'Attendance',
      href: `/client/${params.id}/attendance`,
    },
  ];
  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <Heading as="h2">Client Profile</Heading>
        <Text className="text-muted-foreground">
          Manage your profile, membership, and attendance.
        </Text>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 flex flex-col gap-6 lg:w-72">
          <Avatar src="/avatars/avatar-1.jpg" className="size-48 self-center" />
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
