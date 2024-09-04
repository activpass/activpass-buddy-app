import { Card, CardTitle } from '@paalan/react-ui';

import { ClientInfo } from './_components/ClientInfo';
import { EmergencyContact } from './_components/EmergencyContact';
import { GoalsPreferences } from './_components/GoalsPreferences';
import { HealthFitness } from './_components/HealthFitness';

export const ProfileForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="pt-5">
        <CardTitle className="my-5">Personal Information</CardTitle>
        <ClientInfo />
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Emergency Contact</CardTitle>
        <EmergencyContact />{' '}
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Health & Fitness</CardTitle>
        <HealthFitness />{' '}
      </Card>
      <Card className="pt-5">
        <CardTitle className="my-5">Goals & Preferences</CardTitle>
        <GoalsPreferences />{' '}
      </Card>
    </div>
  );
};
