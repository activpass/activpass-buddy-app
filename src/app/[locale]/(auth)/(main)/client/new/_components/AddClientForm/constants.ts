import type { StepItem } from '@paalan/react-ui';
import type { FunctionComponent } from 'react';

import { ClientInformationForm } from './stepper-forms/ClientInformationForm';
import { ConsentAndAgreementsForm } from './stepper-forms/ConsentAndAgreementsForm';
import { GoalsAndPreferencesForm } from './stepper-forms/GoalsAndPreferencesForm';
import { HealthAndFitnessForm } from './stepper-forms/HealthAndFitnessForm';
import { MembershipDetailsForm } from './stepper-forms/MembershipDetailsForm';
import { PaymentDetailsForm } from './stepper-forms/PaymentDetailsForm';

export const ADD_CLIENT_STEP_ID = {
  CLIENT_INFORMATION: 'CLIENT_INFORMATION',
  HEALTH_AND_FITNESS: 'HEALTH_AND_FITNESS',
  GOALS_AND_PREFERENCES: 'GOALS_AND_PREFERENCES',
  MEMBERSHIP_DETAILS: 'MEMBERSHIP_DETAILS',
  PAYMENT_DETAILS: 'PAYMENT_DETAILS',
  CONSENT_AND_AGREEMENTS: 'CONSENT_AND_AGREEMENTS',
} as const;

export const ADD_CLIENT_STEPPER_COMPONENT: Record<
  keyof typeof ADD_CLIENT_STEP_ID,
  FunctionComponent
> = {
  [ADD_CLIENT_STEP_ID.CLIENT_INFORMATION]: ClientInformationForm,
  [ADD_CLIENT_STEP_ID.HEALTH_AND_FITNESS]: HealthAndFitnessForm,
  [ADD_CLIENT_STEP_ID.GOALS_AND_PREFERENCES]: GoalsAndPreferencesForm,
  [ADD_CLIENT_STEP_ID.MEMBERSHIP_DETAILS]: MembershipDetailsForm,
  [ADD_CLIENT_STEP_ID.PAYMENT_DETAILS]: PaymentDetailsForm,
  [ADD_CLIENT_STEP_ID.CONSENT_AND_AGREEMENTS]: ConsentAndAgreementsForm,
};

export const ADD_CLIENT_STEPS = [
  {
    id: ADD_CLIENT_STEP_ID.CLIENT_INFORMATION,
    label: 'Client Information',
    description: 'Add your client info',
  },
  {
    id: ADD_CLIENT_STEP_ID.HEALTH_AND_FITNESS,
    label: 'Health and Fitness',
    description: 'Add your client health and fitness info',
  },
  {
    id: ADD_CLIENT_STEP_ID.GOALS_AND_PREFERENCES,
    label: 'Goals and Preferences',
    description: 'Add your client goals and preferences info',
  },
  {
    id: ADD_CLIENT_STEP_ID.MEMBERSHIP_DETAILS,
    label: 'Membership Details',
    description: 'Add your client membership details info',
  },
  {
    id: ADD_CLIENT_STEP_ID.PAYMENT_DETAILS,
    label: 'Payment Details',
    description: 'Add your client payment details info',
  },
  {
    id: ADD_CLIENT_STEP_ID.CONSENT_AND_AGREEMENTS,
    label: 'Consent and Agreements',
    description: 'Add your client consent and agreements info',
  },
] satisfies StepItem[];
