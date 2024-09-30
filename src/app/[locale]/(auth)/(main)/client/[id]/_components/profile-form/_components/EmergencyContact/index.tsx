'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import type {
  ClientEmergencyContactSchema,
  ClientFormSchema,
} from '@/validations/client/add-form.validation';
import { clientEmergencyContactSChema } from '@/validations/client/add-form.validation';

import { formFields } from './fields';

type ClientInfoProps = {
  data: ClientFormSchema['emergencyContact'];
};

export const EmergencyContact: FC<ClientInfoProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientEmergencyContactSchema>({
    resolver: zodResolver(clientEmergencyContactSChema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateEmergencyContact = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientEmergencyContactSchema) => {
    try {
      await updateEmergencyContact.mutateAsync({
        id,
        data: {
          emergencyContact: updateData,
        },
      });

      toast.success('Emergency Contact Information updated successfully!');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <Form<ClientEmergencyContactSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Emergency Contact"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
