import type { FormFieldItem } from '@paalan/react-ui';

import type { EmployeeFormSchema } from '@/validations/employee/add-form.validation';

export const formFields: FormFieldItem<EmployeeFormSchema>[] = [
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
    name: 'payroll.dateOfSalary',
    label: 'Date of Salary',
    type: 'input',
    placeholder: 'Last day of a month',
    required: true,
    formItemClassName: 'col-span-1',
    inputType: 'date',
  },
];
