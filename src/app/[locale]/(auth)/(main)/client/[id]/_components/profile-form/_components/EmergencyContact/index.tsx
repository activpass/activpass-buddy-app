'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
import {
  type ClientEmergencyContactFormSchema,
  clientEmergencyContactFormSchema,
} from '@/validations/client-profile/client-emergency-contact.validation';

const formFields: FormFieldItem<ClientEmergencyContactFormSchema>[] = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter full name eg. Jane Doe',
  },
  {
    type: 'select',
    name: 'relationship',
    label: 'Relationship',
    placeholder: 'Select relationship eg. Spouse',
    options: getOptionsFromDisplayConstant(CLIENT_RELATIONSHIP),
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter phone number eg. 0987654321',
    inputType: 'number',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email eg. jane.doe@email.com',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: 'Enter address eg. 456 Elm St, Springfield',
    formItemClassName: 'col-span-1 sm:col-span-2',
  },
];

type ClientInfoProps = {
  data: ClientFormSchema['emergencyContact'];
};

export const EmergencyContact: FC<ClientInfoProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientEmergencyContactFormSchema>({
    resolver: zodResolver(clientEmergencyContactFormSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateEmergencyContact = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientEmergencyContactFormSchema) => {
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
      toast.error(`Failed to update emergency contact: ${error.message}`);
    }
  };

  return (
    <Form<ClientEmergencyContactFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Emergency Contact"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
