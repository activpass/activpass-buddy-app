import type { StepItem } from '@paalan/react-ui';

export const ADD_CLIENT_STEP_ID = {
  CLIENT_INFORMATION: 'CLIENT_INFORMATION',
  FITNESS_GOALS: 'FITNESS_GOALS',
  PURCHASE_PLAN: 'PURCHASE_PLAN',
  PAYMENT_DETAILS: 'PAYMENT_DETAILS',
} as const;

export const ADD_CLIENT_STEPS = [
  {
    id: ADD_CLIENT_STEP_ID.CLIENT_INFORMATION,
    label: 'Personal Information',
    description: 'Please add your Personal Information and Emergency Contact',
  },
  {
    id: ADD_CLIENT_STEP_ID.FITNESS_GOALS,
    label: 'Fitness Goals',
    description: 'Please set your fitness plan and goals',
  },
  {
    id: ADD_CLIENT_STEP_ID.PURCHASE_PLAN,
    label: 'Purchase Plan',
    description: '',
  },
  {
    id: ADD_CLIENT_STEP_ID.PAYMENT_DETAILS,
    label: 'Payment Details',
    description: 'Confirm your payment details',
  },
] satisfies StepItem[];
