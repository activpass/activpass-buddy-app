'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import { formFields } from './fields';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
import {
  goalsAndPreferenceSchema,
  type GoalsAndPreferencesSchema,
} from '@/validations/client/add-form.validation';

type GoalsPreferencesProps = {
  data: ClientFormSchema['goalsAndPreference'];
};

export const GoalsPreferences: FC<GoalsPreferencesProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<GoalsAndPreferencesSchema>({
    resolver: zodResolver(goalsAndPreferenceSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateGoalsPreferences = api.clients.update.useMutation();

  const onSubmit = async (updateData: GoalsAndPreferencesSchema) => {
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
      toast.error(error.message);
    }
  };

  return (
    <Form<GoalsAndPreferencesSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Goals & Preferences"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
