'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormItemField, toast } from '@paalan/react-ui';
import { useForm } from 'react-hook-form';

import {
  clientGoalsPreferencesFormSchema,
  type ClientGoalsPreferencesFormSchemaType,
} from '@/validations/client-profile/client-goals-preferences.validation';

const defaultValues: Partial<ClientGoalsPreferencesFormSchemaType> = {
  fitnessGoals: 'Muscle Building',
  dayPreference: 'Morning',
  timePreference: '07:00',
  instructorPreference: 'Yes',
  additionalService: 'Nutrition Plan',
};

const formFields: FormItemField[] = [
  {
    type: 'select',
    name: 'fitnessGoals',
    label: 'Fitness Goals',
    placeholder: 'Enter your fitness goals',
    options: [
      'Weight Loss',
      'Fat Loss',
      'Muscle Building',
      'Improving Strength',
      'Toning and Sculpting',
      'Increasing Flexibility',
      'Improving Posture',
      'Boosting Athletic Performance',
      'Rehabilitation and Recovery',
      'Weight Maintenance',
    ],
  },
  {
    type: 'select',
    name: 'dayPreference',
    label: 'Preferred Time of Day',
    placeholder: 'Select your preferred time of day',
    options: [
      { value: 'Morning', label: 'Morning' },
      { value: 'Afternoon', label: 'Afternoon' },
      { value: 'Evening', label: 'Evening' },
    ],
  },
  {
    type: 'input',
    name: 'timePreference',
    label: 'Preferred Time',
    placeholder: '07:00 AM',
    inputType: 'time',
  },
  {
    type: 'select',
    name: 'instructorPreference',
    label: 'Do you prefer an instructor?',
    description: 'Select if you want an instructor.',
    options: ['Yes', 'No'],
  },
];

export const GoalsPreferences = () => {
  const form = useForm<ClientGoalsPreferencesFormSchemaType>({
    resolver: zodResolver(clientGoalsPreferencesFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientGoalsPreferencesFormSchemaType) => {
    toast('Goals and Preferences Information Submitted:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ClientGoalsPreferencesFormSchemaType>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Goals & Preferences"
      hideResetButton
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
