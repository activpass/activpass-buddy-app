'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CLIENT_FITNESS_LEVEL } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
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

type HealthFitnessProps = {
  data: ClientFormSchema['healthAndFitness'];
};

export const HealthFitness: FC<HealthFitnessProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientHealthFitnessFormSchema>({
    resolver: zodResolver(clientHealthFitnessFormSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateHealthFitness = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientHealthFitnessFormSchema) => {
    try {
      await updateHealthFitness.mutateAsync({
        id,
        data: {
          healthAndFitness: updateData,
        },
      });

      toast.success('Health and Fitness Information updated successfully!');
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to update health and fitness information: ${error.message}`);
    }
  };

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
