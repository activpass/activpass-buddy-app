import type { Metadata } from 'next';
import type { FC } from 'react';

import { ProfileHeader } from '@/components/Common/ProfileHeader';
import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { ProfileForm } from './_components/ProfileForm';

export const metadata: Metadata = {
  title: 'Employee Profile',
  description: 'Manage your profile details',
};

type EmployeeProfilePageProps = {
  params: {
    id: string;
  };
};
const EmployeeProfilePage: FC<EmployeeProfilePageProps> = async ({ params }) => {
  const data = await api.employees.get({ id: params.id });
  return (
    <>
      <SetBreadcrumbItems
        items={[{ label: 'Employees', href: '/employees' }, { label: data.fullName }]}
      />
      <div className="space-y-6">
        <ProfileHeader
          title="Profile Details"
          description="Details of your employee’s profile can be viewed here"
        />
        <ProfileForm data={data} />
      </div>
    </>
  );
};

export default EmployeeProfilePage;
