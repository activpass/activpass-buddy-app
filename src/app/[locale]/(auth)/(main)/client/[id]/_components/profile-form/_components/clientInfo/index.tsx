'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormItemField, toast } from '@paalan/react-ui';
import { useForm } from 'react-hook-form';

import {
  clientInfoFormSchema,
  type ClientInfoFormSchemaType,
} from '@/validations/client-profile/client-profile-info.validation';

const defaultValues: Partial<ClientInfoFormSchemaType> = {
  username: 'Cristiano Ronaldo',
  email: 'cristiano.ronaldo@email.com',
  phoneNumber: '1234567890',
  gender: 'Male',
  dob: '1985-02-05',
  address: '123 Main St, Springfield',
};

const formFields: FormItemField[] = [
  {
    type: 'input',
    name: 'username',
    label: 'Name',
    placeholder: 'Cristiano Ronaldo',
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: '1234567890',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'cristiano.ronaldo@email.com',
  },
  {
    type: 'select',
    name: 'gender',
    label: 'Gender',
    placeholder: 'Male',
    options: ['Male', 'Female', 'Transgender', 'Others'],
  },
  {
    type: 'date-picker',
    name: 'dob',
    label: 'Date of Birth',
    placeholder: '1985-02-05',
    description: 'Your date of birth.',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: '123 Main St, Springfield',
    formItemClassName: 'col-span-2',
  },
];

export const ClientInfoForm = () => {
  const form = useForm<ClientInfoFormSchemaType>({
    resolver: zodResolver(clientInfoFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientInfoFormSchemaType) => {
    toast('You submitted the following values:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ClientInfoFormSchemaType>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Profile Info"
      hideResetButton
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
