'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import { type FC } from 'react';
import { useForm } from 'react-hook-form';

import { CLIENT_GENDER } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
import type { ClientFormSchema } from '@/validations/client/add-form.validation';
import {
  type ClientInfoFormSchema,
  clientInfoFormSchema,
} from '@/validations/client-profile/client-profile-info.validation';

const formFields: FormFieldItem<ClientInfoFormSchema>[] = [
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter first name eg. Cristiano',
  },
  {
    type: 'input',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Enter last name eg. Ronaldo',
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter phone number eg. 1234567890',
    inputType: 'number',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'Enter email eg. abc@gmail.com',
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Select gender eg. Male',
    options: getOptionsFromDisplayConstant(CLIENT_GENDER),
  },
  {
    type: 'date-picker',
    name: 'dob',
    label: 'Date of Birth',
    placeholder: 'Enter date of birth eg. 1985-02-05',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: 'Enter address eg. 123 Main St, Springfield',
    formItemClassName: 'col-span-1 sm:col-span-2',
  },
];

type ClientInfoProps = {
  data: Omit<ClientFormSchema['personalInformation'], 'avatar'>;
};
export const ClientInfo: FC<ClientInfoProps> = ({ data }) => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<ClientInfoFormSchema>({
    resolver: zodResolver(clientInfoFormSchema),
    defaultValues: data,
    mode: 'onChange',
  });

  const updateProfile = api.clients.update.useMutation();

  const onSubmit = async (updateData: ClientInfoFormSchema) => {
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
      toast.error(`Failed to update personal information: ${error.message}`);
    }
  };

  return (
    <Form<ClientInfoFormSchema>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Profile Info"
      hideResetButton
      className="grid grid-cols-1 gap-4 space-y-0 sm:grid-cols-2"
    />
  );
};
