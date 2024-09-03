import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useStepper } from '@paalan/react-ui';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  goalsAndPreferenceSchema,
  type GoalsAndPreferencesSchema,
} from '@/validations/client/add-form.validation';

import { useClientFormStore, useClientGoalsAndPreferences } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { GOALS_AND_PREFERENCES_FIELDS } from './fields';

export const GoalsAndPreferencesForm: FC = () => {
  const { nextStep } = useStepper();
  const setGoalsAndPreferences = useClientFormStore(state => state.setGoalsAndPreferences);
  const clientGoalsAndPreferences = useClientGoalsAndPreferences();

  const form = useForm<GoalsAndPreferencesSchema>({
    resolver: zodResolver(goalsAndPreferenceSchema),
    defaultValues: clientGoalsAndPreferences,
  });

  const onSubmit = (data: GoalsAndPreferencesSchema) => {
    setGoalsAndPreferences(data);
    nextStep();
  };

  return (
    <Form<GoalsAndPreferencesSchema>
      form={form}
      onSubmit={onSubmit}
      hideResetButton
      hideSubmitButton
      fields={GOALS_AND_PREFERENCES_FIELDS}
      className="gap-4 sm:grid sm:grid-cols-2 sm:space-y-0"
    >
      <StepperFormActions className="col-span-2" />
    </Form>
  );
};
