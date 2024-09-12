'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CLIENT_FITNESS_LEVEL } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import {
  type ClientHealthFitnessFormSchema,
  clientHealthFitnessFormSchema,
} from '@/validations/client-profile/client-health-fitness.validation';

const formFields: FormFieldItem<ClientHealthFitnessFormSchema>[] = [
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

export const HealthFitness = () => {
  const { id } = useParams<{ id: string }>();

  const { data: clientData, isLoading } = api.clients.get.useQuery(id);

  const defaultValues: Partial<ClientHealthFitnessFormSchema> = {
    height: clientData?.healthAndFitness?.height,
    weight: clientData?.healthAndFitness?.weight,
    fitnessLevel: clientData?.healthAndFitness?.fitnessLevel,
    medicalCondition: clientData?.healthAndFitness?.medicalCondition ?? '',
    allergy: clientData?.healthAndFitness?.allergy ?? '',
    injury: clientData?.healthAndFitness?.injury ?? '',
  };
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form<ClientHealthFitnessFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
      submitText="Update Health & Fitness Info"
      hideResetButton
    />
  );
};
