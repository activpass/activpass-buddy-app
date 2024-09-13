import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { ProfileForm } from './_components/profile-form';

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
  // console.log(clientData)
  const plainClientData = JSON.parse(JSON.stringify(clientData));

  const personalInformationData = {
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    email: clientData.email,
    phoneNumber: clientData.phoneNumber,
    address: clientData.address,
    dob: clientData.dob,
    gender: clientData.gender,
  };

  return (
    <>
      <SetBreadcrumbItems
        items={[{ label: 'Client', href: '/client' }, { label: clientData.fullName }]}
      />
      <div className="space-y-6">
        <div>
          <Heading as="h3">Profile</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Manage your profile details
          </Text>
        </div>
        <Separator />
        <ProfileForm personalInformation={personalInformationData} clientData={plainClientData} />
      </div>
    </>
  );
};

export default ClientProfilePage;
