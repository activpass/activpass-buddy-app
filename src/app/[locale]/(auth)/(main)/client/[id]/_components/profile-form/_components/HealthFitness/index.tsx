'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormItemField, toast } from '@paalan/react-ui';
import { useForm } from 'react-hook-form';

import {
  type ClientHealthFitnessFormSchema,
  clientHealthFitnessFormSchema,
} from '@/validations/client-profile/client-health-fitness.validation';

const defaultValues: Partial<ClientHealthFitnessFormSchema> = {
  height: 175,
  weight: 80,
  medicalConditions: 'None',
  allergies: 'No',
  injuries: 'No',
  currentFitnessLevel: 'Intermediate',
};

const formFields: FormItemField[] = [
  {
    type: 'number',
    name: 'height',
    label: 'Height (cm)',
    placeholder: '175',
  },
  {
    type: 'number',
    name: 'weight',
    label: 'Weight (kg)',
    placeholder: '80',
  },
  {
    type: 'input',
    name: 'medicalConditions',
    label: 'Medical Conditions',
    placeholder: 'None',
    description: 'Specify if you have medical issue.',
  },
  {
    type: 'select',
    name: 'allergies',
    label: 'Do you have allergies?',
    placeholder: 'Select Yes or No',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    description: 'Specify if you have allergies.',
  },
  {
    type: 'select',
    name: 'injuries',
    label: 'Do you have injuries?',
    placeholder: 'Select Yes or No',
    options: [
      { value: 'Yes', label: 'Yes' },
      { value: 'No', label: 'No' },
    ],
    description: 'Specify if you have injuries.',
  },
  {
    type: 'select',
    name: 'currentFitnessLevel',
    label: 'Current Fitness Level',
    placeholder: 'Select your fitness level',
    options: [
      { value: 'Beginner', label: 'Beginner' },
      { value: 'Intermediate', label: 'Intermediate' },
      { value: 'Advanced', label: 'Advanced' },
    ],
    description: 'Your current fitness level.',
  },
];

export const HealthFitness = () => {
  const form = useForm<ClientHealthFitnessFormSchema>({
    resolver: zodResolver(clientHealthFitnessFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientHealthFitnessFormSchema) => {
    toast('Health and Fitness Information Submitted:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ClientHealthFitnessFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      className="grid grid-cols-2 gap-4 space-y-0"
      submitText="Update Health & Fitness Info"
      hideResetButton
    />
  );
};
