import { Card, CardTitle } from '@paalan/react-ui';
import type { FC } from 'react';

import { ClientInfo } from './_components/ClientInfo';
import { EmergencyContact } from './_components/EmergencyContact';
import { GoalsPreferences } from './_components/GoalsPreferences';
import { HealthFitness } from './_components/HealthFitness';

type ProfileFormProps = {
  personalInformation: React.ComponentPropsWithoutRef<typeof ClientInfo>['data'];
  clientData: React.ComponentPropsWithoutRef<typeof Object>['data'];
};

export const ProfileForm: FC<ProfileFormProps> = ({ personalInformation, clientData }) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="pt-5">
        <CardTitle className="my-5">Personal Information</CardTitle>
        <ClientInfo data={personalInformation} />
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Emergency Contact</CardTitle>
        <EmergencyContact data={clientData.emergencyContact} />
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Health & Fitness</CardTitle>
        <HealthFitness data={clientData.healthAndFitness} />
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Goals & Preferences</CardTitle>
        <GoalsPreferences data={clientData.goalsAndPreference} />
      </Card>
    </div>
  );
};
