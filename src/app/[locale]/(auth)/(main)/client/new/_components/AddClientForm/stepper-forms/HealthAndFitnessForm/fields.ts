import type { FormFieldItem } from '@paalan/react-ui';

import { CLIENT_FITNESS_LEVEL } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { HealthAndFitnessSchema } from '@/validations/client/add-form.validation';

export const HEALTH_AND_FITNESS_FIELDS: FormFieldItem<HealthAndFitnessSchema>[] = [
  {
    type: 'number',
    name: 'height',
    label: 'Height (in cm)',
    placeholder: 'Enter height eg. 180',
    required: true,
  },
  {
    type: 'number',
    name: 'weight',
    label: 'Weight (in kg)',
    placeholder: 'Enter weight eg. 70',
    required: true,
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
    type: 'input',
    name: 'medicalCondition',
    label: 'Medical Condition (if any)',
    placeholder: 'Enter medical condition eg. Diabetes, Asthma',
  },
  {
    type: 'input',
    name: 'allergy',
    label: 'Allergy (if any)',
    placeholder: 'Enter allergy eg. Pollen, Dust',
  },
  {
    type: 'input',
    name: 'injury',
    label: 'Injury (if any)',
    placeholder: 'Enter injury eg. Knee, Back',
  },
];
