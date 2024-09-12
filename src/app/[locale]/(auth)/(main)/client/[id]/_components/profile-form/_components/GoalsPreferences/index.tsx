'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CLIENT_CLASS_PREFERENCE, CLIENT_FITNESS_GOAL } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
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

export const GoalsPreferences = () => {
  const { id } = useParams<{ id: string }>();

  const { data: clientData, isLoading } = api.clients.get.useQuery(id);

  const defaultValues: Partial<ClientGoalsPreferencesFormSchema> = {
    fitnessGoals: clientData?.goalsAndPreference?.fitnessGoals,
    classPreference: clientData?.goalsAndPreference?.classPreference,
    classTimePreference: clientData?.goalsAndPreference?.classTimePreference,
    instructorSupport: clientData?.goalsAndPreference?.instructorSupport,
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
