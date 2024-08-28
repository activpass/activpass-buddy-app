import { Card, CardTitle } from '@paalan/react-ui';

import { ClientInfoForm } from './_components/clientInfo';
import { EmergencyContact } from './_components/emergencyContact';
import { GoalsPreferences } from './_components/goalsPreferences';
import { HealthFitness } from './_components/healthFitness';

export const ProfileForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="pt-5">
        <CardTitle className="my-5">Personal Information</CardTitle>
        <ClientInfoForm />
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
