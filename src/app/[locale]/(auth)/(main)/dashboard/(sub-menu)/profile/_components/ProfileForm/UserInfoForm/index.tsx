'use client';

import { FormFieldItems, Grid } from '@paalan/react-ui';
import { type FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import type { UserFormSchema } from '@/validations/user/add-form.validation';

import { formFields } from './fields';

type UserInfoFormProps = {
  form: UseFormReturn<UserFormSchema>;
};

export const UserInfoForm: FC<UserInfoFormProps> = ({ form }) => {
  return (
    <Grid className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2">
      <FormFieldItems fields={formFields} control={form.control} />
    </Grid>
  );
};
