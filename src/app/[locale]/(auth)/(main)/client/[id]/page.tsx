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

  const personalInformationData = {
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    email: clientData.email,
    phoneNumber: clientData.phoneNumber,
    address: clientData.address,
    dob: clientData.dob,
    gender: clientData.gender,
  };

  const emergencyContactData = {
    name: clientData?.emergencyContact?.name || '',
    phoneNumber: clientData?.emergencyContact?.phoneNumber || 0,
    relationship: clientData?.emergencyContact?.relationship || 'OTHERS',
    email: clientData?.emergencyContact?.email || null,
    address: clientData?.emergencyContact?.address || '',
  };

  const healthAndFitnessData = {
    height: clientData?.healthAndFitness?.height || 0,
    weight: clientData?.healthAndFitness?.weight || 0,
    medicalCondition: clientData?.healthAndFitness?.medicalCondition || '',
    allergy: clientData?.healthAndFitness?.allergy || '',
    injury: clientData?.healthAndFitness?.injury || '',
    fitnessLevel: clientData?.healthAndFitness?.fitnessLevel || 'BEGINNER',
  };

  const goalsAndPreferenceData = {
    fitnessGoals: clientData?.goalsAndPreference?.fitnessGoals || [],
    classPreference: clientData?.goalsAndPreference?.classPreference || 'BOTH',
    classTimePreference: clientData?.goalsAndPreference?.classTimePreference || '',
    instructorSupport: clientData?.goalsAndPreference?.instructorSupport || false,
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
        <ProfileForm
          personalInformation={personalInformationData}
          emergencyContact={emergencyContactData}
          healthAndFitness={healthAndFitnessData}
          goalsAndPreference={goalsAndPreferenceData}
        />
      </div>
    </>
  );
};

export default ClientProfilePage;
