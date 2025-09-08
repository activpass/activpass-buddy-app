'use client';

import { FormFieldItems, Grid } from '@paalan/react-ui';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import type { ClientProfileFormSchema } from '../../schema';
import { formFields } from './fields';

type ClientInfoProps = {
  form: UseFormReturn<ClientProfileFormSchema>;
};

export const ClientInfo: FC<ClientInfoProps> = ({ form }) => {
  return (
    <Grid className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2">
      <FormFieldItems<ClientProfileFormSchema> fields={formFields} control={form.control} />
    </Grid>
  );
};
