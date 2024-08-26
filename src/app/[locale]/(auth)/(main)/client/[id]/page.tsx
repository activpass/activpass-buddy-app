import { Heading, Separator, Text } from '@paalan/react-ui';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import { ProfileForm } from './_components/profile-form';

type ClientProfilePageProps = {
  params: {
    id: string;
  };
};
const ClientProfilePage: FC<ClientProfilePageProps> = ({ params }) => {
  return (
    <>
      <SetBreadcrumbItems items={[{ label: 'Client', href: '/client' }, { label: params.id }]} />
      <div className="space-y-6">
        <div>
          <Heading as="h3">Profile</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Manage your profile details
          </Text>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </>
  );
};

export default ClientProfilePage;
