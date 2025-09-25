import type { FormFieldItem } from '@paalan/react-ui';
import { z } from 'zod';

import { bankDetailsSchema } from '@/validations/employee/add-form.validation';

// Define the payment details schema for this step
export const paymentDetailsSchema = z.object({
  bank: bankDetailsSchema,
  dateOfSalary: z.string().min(1, 'Date of salary is required'),
});

export type PaymentDetailsFormData = z.infer<typeof paymentDetailsSchema>;

export const fields: FormFieldItem<PaymentDetailsFormData>[] = [
  {
    name: 'bank.name',
    label: 'Bank Name',
    type: 'input',
    placeholder: 'Enter your bank name',
    required: true,
    formItemClassName: 'col-span-1',
  },
  {
    name: 'bank.branchName',
    label: 'Branch Name',
    type: 'input',
    placeholder: 'Enter your branch name',
    required: true,
    formItemClassName: 'col-span-1',
  },
  {
    name: 'bank.accountHolderName',
    label: 'Account Holder Name',
    type: 'input',
    placeholder: 'Enter account holder name',
    required: true,
    formItemClassName: 'col-span-1',
  },
  {
    name: 'bank.accountNumber',
    label: 'Account Number',
    type: 'number',
    placeholder: 'Enter account number',
    required: true,
    formItemClassName: 'col-span-1',
    numberInputProps: {
      zeroAsEmptyString: true,
    },
  },
  {
    name: 'bank.ifscCode',
    label: 'IFSC Code',
    type: 'input',
    placeholder: 'Enter IFSC code',
    required: true,
    formItemClassName: 'col-span-1',
  },
  {
    name: 'dateOfSalary',
    label: 'Date of Salary',
    type: 'input',
    placeholder: 'Last day of a month',
    required: true,
    formItemClassName: 'col-span-1',
    inputType: 'date',
  },
];
