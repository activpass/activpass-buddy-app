import type { Metadata } from 'next';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { ProfileForm } from './_components/profile-form';
import { ProfileHeader } from './_components/ProfileHeader';

export const metadata: Metadata = {
  title: 'Client Profile',
  description: 'Manage your profile details',
};

type ClientProfilePageProps = {
  params: {
    id: string;
  };
};
const ClientProfilePage: FC<ClientProfilePageProps> = async ({ params }) => {
  const clientData = await api.clients.get(params.id);
  return (
    <>
      <SetBreadcrumbItems
        items={[{ label: 'Clients', href: '/client' }, { label: clientData.fullName }]}
      />
      <div className="space-y-6">
        <ProfileHeader
          title="Profile Details"
          description="Details of your client’s profile can be viewed here"
        />
        <ProfileForm clientData={clientData} />
      </div>
    </>
  );
};

export default ClientProfilePage;
