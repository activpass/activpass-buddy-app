import { FormFieldItems, Grid } from '@paalan/react-ui';
import type { FC } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

import { formFields } from './fields';

type BankDetailsFormProps = {
  form: UseFormReturn<EmployeeFormSchema>;
};
export const BankDetailsForm: FC<BankDetailsFormProps> = ({ form }) => {
  return (
    <Grid className="grid-cols-1 gap-5 sm:grid-cols-2">
      <FormFieldItems<EmployeeFormSchema> fields={formFields} control={form.control} />
    </Grid>
  );
};
