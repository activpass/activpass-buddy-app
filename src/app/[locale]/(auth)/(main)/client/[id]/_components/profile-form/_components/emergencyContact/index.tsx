'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormItemField, toast } from '@paalan/react-ui';
import { useForm } from 'react-hook-form';

import {
  clientEmergencyContactFormSchema,
  type ClientEmergencyContactFormSchemaType,
} from '@/validations/client-profile/client-emergency-contact.validation';

const defaultValues: Partial<ClientEmergencyContactFormSchemaType> = {
  name: 'Jane Doe',
  relationship: 'Spouse',
  phoneNumber: '0987654321',
  email: 'jane.doe@email.com',
  address: '456 Elm St, Springfield',
};

const formFields: FormItemField[] = [
  {
    type: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Jane Doe',
  },
  {
    type: 'select',
    name: 'relationship',
    label: 'Relationship',
    placeholder: 'Spouse',
    options: ['Father', 'Mother', 'Sibling', 'Spouse', 'Friend', 'Colleague', 'Other'],
  },
  {
    type: 'input',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: '0987654321',
  },
  {
    type: 'input',
    name: 'email',
    label: 'Email',
    placeholder: 'jane.doe@email.com',
  },
  {
    type: 'textarea',
    name: 'address',
    label: 'Address',
    className: 'resize-none',
    placeholder: '456 Elm St, Springfield',
    formItemClassName: 'col-span-2',
  },
];

export const EmergencyContact = () => {
  const form = useForm<ClientEmergencyContactFormSchemaType>({
    resolver: zodResolver(clientEmergencyContactFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientEmergencyContactFormSchemaType) => {
    toast('Emergency Contact Information Submitted:', {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form<ClientEmergencyContactFormSchemaType>
      form={form}
      fields={formFields}
      onSubmit={onSubmit}
      submitText="Update Emergency Contact"
      hideResetButton
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
