'use client';

import { FormFieldItems, Grid } from '@paalan/react-ui';
import type { FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import type { ClientProfileFormSchema } from '../../schema';
import { formFields } from './fields';

type HealthFitnessProps = {
  form: UseFormReturn<ClientProfileFormSchema>;
};

export const HealthFitness: FC<HealthFitnessProps> = ({ form }) => {
  return (
    <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
      <FormFieldItems<ClientProfileFormSchema> fields={formFields} control={form.control} />
    </Grid>
  );
};
