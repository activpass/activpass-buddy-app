import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@paalan/react-ui';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import {
  type HealthAndFitnessSchema,
  healthAndFitnessSchema,
} from '@/validations/client/add-form.validation';

import { useClientFormStore, useClientHealthAndFitness } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { HEALTH_AND_FITNESS_FIELDS } from './fields';

export const HealthAndFitnessForm: FC = () => {
  const nextStep = useClientFormStore(state => state.nextStep);
  const setHealthAndFitness = useClientFormStore(state => state.setHealthAndFitness);
  const clientHealthAndFitness = useClientHealthAndFitness();

  const form = useForm<HealthAndFitnessSchema>({
    resolver: zodResolver(healthAndFitnessSchema),
    defaultValues: clientHealthAndFitness,
  });

  const onSubmit = (data: HealthAndFitnessSchema) => {
    setHealthAndFitness(data);
    nextStep();
  };

  return (
    <Form<HealthAndFitnessSchema>
      form={form}
      onSubmit={onSubmit}
      hideResetButton
      hideSubmitButton
      fields={HEALTH_AND_FITNESS_FIELDS}
      className="gap-4 sm:grid sm:grid-cols-2 sm:space-y-0"
    >
      <StepperFormActions className="col-span-2" />
    </Form>
  );
};
