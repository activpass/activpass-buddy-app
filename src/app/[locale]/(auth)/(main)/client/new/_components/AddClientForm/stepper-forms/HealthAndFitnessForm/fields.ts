import type { FormFieldItem } from '@paalan/react-ui';

import {
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
  CLIENT_FITNESS_LEVEL,
} from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { HealthAndFitnessSchema } from '@/validations/client/add-form.validation';

export const HEALTH_AND_FITNESS_FIELDS: FormFieldItem<HealthAndFitnessSchema>[] = [
  {
    type: 'number',
    name: 'height',
    label: 'Height (in cm)',
    placeholder: 'Enter height eg. 180',
    required: true,
    numberInputProps: {
      zeroAsEmptyString: true,
    },
  },
  {
    type: 'number',
    name: 'weight',
    label: 'Weight (in kg)',
    placeholder: 'Enter weight eg. 70',
    required: true,
    numberInputProps: {
      zeroAsEmptyString: true,
    },
  },
  {
    type: 'select',
    name: 'fitnessLevel',
    label: 'Fitness Level',
    placeholder: 'Select fitness level',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_LEVEL),
    required: true,
  },
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
    type: 'checkbox',
    name: 'instructorSupport',
    label: 'Do you need instructor?',
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
