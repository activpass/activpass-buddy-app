import type { FormFieldItem } from '@paalan/react-ui';

import {
  CLIENT_ADDITIONAL_SERVICE,
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
} from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { GoalsAndPreferencesSchema } from '@/validations/client/add-form.validation';

export const GOALS_AND_PREFERENCES_FIELDS: FormFieldItem<GoalsAndPreferencesSchema>[] = [
  {
    type: 'multi-select',
    name: 'fitnessGoals',
    label: 'Fitness Goals',
    placeholder: 'Select fitness goals',
    required: true,
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_GOAL),
  },
  {
    type: 'select',
    name: 'classPreference',
    label: 'Class Preference',
    placeholder: 'Select class preference',
    required: true,
    options: getOptionsFromDisplayConstant(CLIENT_CLASS_PREFERENCE),
  },
  {
    type: 'input',
    inputType: 'time',
    name: 'classTimePreference',
    label: 'Class Time Preference',
    placeholder: 'Select class time preference',
    required: true,
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
    label: 'Do you need instructor support?',
    description: 'Instructor will help you in your fitness journey',
    formItemClassName: 'pt-3 space-y-1',
  },
  {
    type: 'checkbox',
    name: 'fitnessAssessment',
    label: 'Do you need fitness assessment?',
    description: 'Fitness assessment will help you in your fitness journey',
    formItemClassName: 'pt-3 space-y-1',
  },
];
