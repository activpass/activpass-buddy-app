import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC, PropsWithChildren } from 'react';

import { api } from '@/trpc/server';

import { EmployeeProfileInfo } from './_components/EmployeeProfileInfo';
import { SidebarNav } from './_components/SidebarNav';

export const metadata: Metadata = {
  title: 'Employee Profile',
  description: 'Manage your employee profile details',
};

type ProfileLayoutProps = PropsWithChildren<{
  params: {
    id: string;
  };
}>;

const ProfileLayout: FC<ProfileLayoutProps> = async ({ children, params }) => {
  const data = await api.employees.get(params);

  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `/employees/${params.id}`,
    },
    {
      title: 'Job Details',
      href: `/employees/${params.id}/job-details`,
    },
    {
      title: 'Attendance',
      href: `/employees/${params.id}/attendance`,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div className="space-y-0.5">
        <Heading as="h2">Employee Profile</Heading>
        <Text className="text-muted-foreground">Details of your employee can be viewed here.</Text>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 flex flex-col gap-6 lg:w-72">
          <EmployeeProfileInfo data={data} />
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ProfileLayout;
