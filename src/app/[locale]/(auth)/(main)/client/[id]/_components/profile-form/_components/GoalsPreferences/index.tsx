'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useForm } from 'react-hook-form';

import {
  type ClientGoalsPreferencesFormSchema,
  clientGoalsPreferencesFormSchema,
} from '@/validations/client-profile/client-goals-preferences.validation';

const defaultValues: Partial<ClientGoalsPreferencesFormSchema> = {
  fitnessGoals: 'Muscle Building',
  dayPreference: 'Morning',
  timePreference: '07:00',
  instructorPreference: 'Yes',
  additionalService: 'Nutrition Plan',
};

const formFields: FormFieldItem<ClientGoalsPreferencesFormSchema>[] = [
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
    description: 'Select if you want an preferred workout time.',
  },
  {
    type: 'select',
    name: 'instructorPreference',
    label: 'Do you prefer an instructor?',
    options: ['Yes', 'No'],
    description: 'Select if you want an instructor.',
  },
];

export const GoalsPreferences = () => {
  const form = useForm<ClientGoalsPreferencesFormSchema>({
    resolver: zodResolver(clientGoalsPreferencesFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientGoalsPreferencesFormSchema) => {
    toast('Goals and Preferences Information Submitted:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ClientGoalsPreferencesFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Goals & Preferences"
      hideResetButton
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
