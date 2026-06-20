'use client';

import { FormFieldItems, Grid } from '@paalan/react-ui';
import type { FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import type { UserFormSchema } from '@/validations/user/add-form.validation';

import { getFormFields } from './fields';

type CompanyDetailsFormProps = {
  form: UseFormReturn<UserFormSchema>;
};

export const CompanyDetailsForm: FC<CompanyDetailsFormProps> = ({ form }) => {
  return (
    <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
      <FormFieldItems fields={getFormFields()} control={form.control} />
    </Grid>
  );
};
