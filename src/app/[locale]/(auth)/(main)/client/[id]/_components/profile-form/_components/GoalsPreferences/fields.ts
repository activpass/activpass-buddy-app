import type { FormFieldItem } from '@paalan/react-ui';

import {
  CLIENT_ADDITIONAL_SERVICE,
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
} from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { GoalsAndPreferencesSchema } from '@/validations/client/add-form.validation';

export const formFields: FormFieldItem<GoalsAndPreferencesSchema>[] = [
  {
    type: 'multi-select',
    name: 'fitnessGoals',
    label: 'Fitness Goals',
    placeholder: 'Enter your fitness goals eg. Weight Loss',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_GOAL),
  },
  {
    type: 'select',
    name: 'classPreference',
    label: 'Preferred Time of Day',
    placeholder: 'Select your preferred time of day eg. Morning',
    options: getOptionsFromDisplayConstant(CLIENT_CLASS_PREFERENCE),
  },
  {
    type: 'input',
    name: 'classTimePreference',
    label: 'Preferred Time',
    placeholder: 'Enter preferred time eg. 07:00 AM',
    inputType: 'time',
    description: 'Select your preferred workout time.',
  },
  {
    type: 'multi-select',
    name: 'additionalServices',
    label: 'Additional Services',
    placeholder: 'Select additional services',
    options: getOptionsFromDisplayConstant(CLIENT_ADDITIONAL_SERVICE),
  },
  {
    type: 'checkbox',
    name: 'instructorSupport',
    label: 'Do you prefer an instructor?',
    description: 'Select if you want an instructor for guidance.',
    formItemClassName: 'pt-5 space-y-1',
  },
  {
    type: 'checkbox',
    name: 'fitnessAssessment',
    label: 'Do you need fitness assessment?',
    description: 'Fitness assessment will help you in your fitness journey',
    formItemClassName: 'pt-5 space-y-1',
  },
];
