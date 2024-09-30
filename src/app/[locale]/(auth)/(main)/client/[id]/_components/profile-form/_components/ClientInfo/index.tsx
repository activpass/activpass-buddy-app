'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { api } from '@/trpc/client';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
import { clientPersonalInformationSchema } from '@/validations/client/add-form.validation';

import { formFields } from './fields';

const clientPersonalInformationWithoutAvatarSchema = clientPersonalInformationSchema.omit({
  avatar: true,
});

export type ClientPersonalInformationSchema = z.infer<
  typeof clientPersonalInformationWithoutAvatarSchema
>;

type ClientInfoProps = {
  data: Omit<ClientFormSchema['personalInformation'], 'avatar'>;
};

export const ClientInfo: FC<ClientInfoProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientPersonalInformationSchema>({
    resolver: zodResolver(clientPersonalInformationWithoutAvatarSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateProfile = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientPersonalInformationSchema) => {
    try {
      await updateProfile.mutateAsync({
        id,
        data: {
          personalInformation: {
            ...updateData,
            dob: new Date(updateData.dob),
          },
        },
      });

      toast.success('Personal Information updated successfully!');
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <Form<ClientPersonalInformationSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Profile Info"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
