import type { StepItem } from '@paalan/react-ui';

export const ADD_EMPLOYEE_STEP_ID = {
  PERSONAL_INFORMATION: 'PERSONAL_INFORMATION',
  JOB_DETAILS: 'JOB_DETAILS',
  PAYMENT_DETAILS: 'PAYMENT_DETAILS',
} as const;

export const ADD_EMPLOYEE_STEPS = [
  {
    id: ADD_EMPLOYEE_STEP_ID.PERSONAL_INFORMATION,
    label: 'Personal Information',
    description: "Please add your employee's personal information here.",
  },
  {
    id: ADD_EMPLOYEE_STEP_ID.JOB_DETAILS,
    label: 'Job Details',
    description: "Please add your employee's job role information here.",
  },
  {
    id: ADD_EMPLOYEE_STEP_ID.PAYMENT_DETAILS,
    label: 'Payment Details',
    description: "Please add your employee's bank details for salary payment.",
  },
] satisfies StepItem[];
