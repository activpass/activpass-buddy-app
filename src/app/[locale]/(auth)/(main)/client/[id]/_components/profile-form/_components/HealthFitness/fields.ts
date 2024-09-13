import type { FormFieldItem } from '@paalan/react-ui';

import { CLIENT_FITNESS_LEVEL } from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { HealthAndFitnessSchema } from '@/validations/client/add-form.validation';

export const formFields: FormFieldItem<HealthAndFitnessSchema>[] = [
  {
    type: 'number',
    name: 'height',
    label: 'Height (cm)',
    placeholder: 'Enter your height eg. 175',
  },
  {
    type: 'number',
    name: 'weight',
    label: 'Weight (kg)',
    placeholder: 'Enter your weight eg. 80',
  },
  {
    type: 'input',
    name: 'medicalCondition',
    label: 'Medical Conditions',
    placeholder: 'Enter medical conditions eg. None',
    description: 'Specify if you have any medical issues.',
  },
  {
    type: 'select',
    name: 'allergy',
    label: 'Do you have allergy?',
    placeholder: 'Select Yes or No',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    description: 'Specify if you have any allergy.',
  },
  {
    type: 'select',
    name: 'injury',
    label: 'Do you have injury?',
    placeholder: 'Select Yes or No',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    description: 'Specify if you have any injury.',
  },
  {
    type: 'select',
    name: 'fitnessLevel',
    label: 'Current Fitness Level',
    placeholder: 'Select your fitness level eg. Beginner',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_LEVEL),
    description: 'Select your current fitness level.',
  },
];
