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
  healthAndFitnessSchema,
  type HealthAndFitnessSchema,
} from '@/validations/client/add-form.validation';

type HealthFitnessProps = {
  data: ClientFormSchema['healthAndFitness'];
};

export const HealthFitness: FC<HealthFitnessProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<HealthAndFitnessSchema>({
    resolver: zodResolver(healthAndFitnessSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateHealthFitness = api.clients.update.useMutation();

  const onSubmit = async (updateData: HealthAndFitnessSchema) => {
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
      toast.error(error.message);
    }
  };

  return (
    <Form<HealthAndFitnessSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
      submitText="Update Health & Fitness Info"
      hideResetButton
    />
  );
};
