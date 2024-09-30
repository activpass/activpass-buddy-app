import { Card, CardTitle } from '@paalan/react-ui';
import type { FC } from 'react';

import type { RouterOutputs } from '@/trpc/shared';

import { ClientInfo } from './_components/ClientInfo';
import { EmergencyContact } from './_components/EmergencyContact';
import { GoalsPreferences } from './_components/GoalsPreferences';
import { HealthFitness } from './_components/HealthFitness';

type ProfileFormProps = {
  clientData: RouterOutputs['clients']['get'];
};

export const ProfileForm: FC<ProfileFormProps> = ({ clientData }) => {
  const { emergencyContact, healthAndFitness, goalsAndPreference } = clientData;
  const personalInformation = {
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    email: clientData.email,
    phoneNumber: clientData.phoneNumber,
    address: clientData.address,
    dob: clientData.dob,
    gender: clientData.gender,
  };
  return (
    <div className="flex flex-col gap-6">
      <Card className="pt-5">
        <CardTitle className="my-5">Personal Information</CardTitle>
        <ClientInfo data={personalInformation} />
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Emergency Contact</CardTitle>
        {emergencyContact && <EmergencyContact data={emergencyContact} />}
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Health & Fitness</CardTitle>
        {healthAndFitness && <HealthFitness data={healthAndFitness} />}
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Goals & Preferences</CardTitle>
        {goalsAndPreference && <GoalsPreferences data={goalsAndPreference} />}
      </Card>
    </div>
  );
};
