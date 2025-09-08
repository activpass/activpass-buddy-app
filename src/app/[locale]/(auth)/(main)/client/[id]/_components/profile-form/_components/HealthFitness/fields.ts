import type { FormFieldItem } from '@paalan/react-ui';

import {
  CLIENT_CLASS_PREFERENCE,
  CLIENT_FITNESS_GOAL,
  CLIENT_FITNESS_LEVEL,
} from '@/constants/client/add-form.constant';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';

import type { ClientProfileFormSchema } from '../../schema';

export const formFields: FormFieldItem<ClientProfileFormSchema>[] = [
  {
    type: 'number',
    name: 'healthAndFitness.height',
    label: 'Height (cm)',
    placeholder: 'Enter your height eg. 175',
    required: true,
  },
  {
    type: 'number',
    name: 'healthAndFitness.weight',
    label: 'Weight (kg)',
    placeholder: 'Enter your weight eg. 80',
    required: true,
  },
  {
    type: 'select',
    name: 'healthAndFitness.fitnessLevel',
    label: 'Current Fitness Level',
    placeholder: 'Select your fitness level eg. Beginner',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_LEVEL),
    description: 'Select your current fitness level.',
    required: true,
  },
  {
    type: 'multi-select',
    name: 'healthAndFitness.fitnessGoals',
    label: 'Fitness Goals',
    placeholder: 'Enter your fitness goals eg. Weight Loss',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_GOAL),
    required: true,
  },
  {
    type: 'select',
    name: 'healthAndFitness.classPreference',
    label: 'Preferred Time of Day',
    placeholder: 'Select your preferred time of day eg. Morning',
    options: getOptionsFromDisplayConstant(CLIENT_CLASS_PREFERENCE),
    description: 'Select your preferred time of day for classes.',
    required: true,
  },
  {
    type: 'input',
    name: 'healthAndFitness.classTimePreference',
    label: 'Preferred Time',
    placeholder: 'Enter preferred time eg. 07:00 AM',
    inputType: 'time',
    description: 'Select your preferred workout time.',
    required: true,
  },
  {
    type: 'checkbox',
    name: 'healthAndFitness.instructorSupport',
    label: 'Do you prefer an instructor?',
    description: 'Select if you want an instructor for guidance.',
    formItemClassName: 'space-y-1',
  },
  {
    type: 'checkbox',
    name: 'healthAndFitness.fitnessAssessment',
    label: 'Do you need fitness assessment?',
    description: 'Fitness assessment will help you in your fitness journey',
    formItemClassName: 'space-y-1',
  },
];
