'use client';

import { FormFieldItems, Grid } from '@paalan/react-ui';
import type { FC } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

import { getFormFields } from './fields';

type JobDetailsFormProps = {
  form: UseFormReturn<EmployeeFormSchema>;
};

export const JobDetailsForm: FC<JobDetailsFormProps> = ({ form }) => {
  return (
    <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
      <FormFieldItems<EmployeeFormSchema> fields={getFormFields(form)} control={form.control} />
    </Grid>
  );
};
