'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CLIENT_CLASS_PREFERENCE, CLIENT_FITNESS_GOAL } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
import {
  type ClientGoalsPreferencesFormSchema,
  clientGoalsPreferencesFormSchema,
} from '@/validations/client-profile/client-goals-preferences.validation';

const formFields: FormFieldItem<ClientGoalsPreferencesFormSchema>[] = [
  {
    type: 'multi-select',
    name: 'fitnessGoals',
    label: 'Fitness Goals',
    placeholder: 'Enter your fitness goals eg. Weight Loss',
    options: getOptionsFromDisplayConstant(CLIENT_FITNESS_GOAL),
  },
  {
    type: 'select',
    name: 'classPreference',
    label: 'Preferred Time of Day',
    placeholder: 'Select your preferred time of day eg. Morning',
    options: getOptionsFromDisplayConstant(CLIENT_CLASS_PREFERENCE),
  },
  {
    type: 'input',
    name: 'classTimePreference',
    label: 'Preferred Time',
    placeholder: 'Enter preferred time eg. 07:00 AM',
    inputType: 'time',
    description: 'Select your preferred workout time.',
  },
  {
    type: 'checkbox',
    name: 'instructorSupport',
    label: 'Do you prefer an instructor?',
    description: 'Select if you want an instructor for guidance.',
    formItemClassName: 'pt-5 space-y-1',
  },
];

type GoalsPreferencesProps = {
  data: Omit<ClientFormSchema['goalsAndPreference'], 'fitnessAssessment' | 'additionalServices'>;
};

export const GoalsPreferences: FC<GoalsPreferencesProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientGoalsPreferencesFormSchema>({
    resolver: zodResolver(clientGoalsPreferencesFormSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateGoalsPreferences = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientGoalsPreferencesFormSchema) => {
    try {
      await updateGoalsPreferences.mutateAsync({
        id,
        data: {
          goalsAndPreference: updateData,
        },
      });

      toast.success('Goals and Preferences Information updated successfully!');
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed to update goals and preferences information: ${error.message}`);
    }
  };

  return (
    <Form<ClientGoalsPreferencesFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Goals & Preferences"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
