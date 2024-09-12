'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, toast } from '@paalan/react-ui';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CLIENT_RELATIONSHIP } from '@/constants/client/add-form.constant';
import { api } from '@/trpc/client';
// import { useState } from 'react';
import { getOptionsFromDisplayConstant } from '@/utils/helpers';
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

export const EmergencyContact = () => {
  const { id } = useParams<{ id: string }>();

  const { data: clientData, isLoading } = api.clients.get.useQuery(id);
  // const [clientData, setClientData] = useState(initialClientData);

  const defaultValues: Partial<ClientEmergencyContactFormSchema> = {
    name: clientData?.emergencyContact?.name,
    relationship: clientData?.emergencyContact?.relationship,
    phoneNumber: clientData?.emergencyContact?.phoneNumber,
    email: clientData?.emergencyContact?.email,
    address: clientData?.emergencyContact?.address,
  };

  const form = useForm<ClientEmergencyContactFormSchema>({
    resolver: zodResolver(clientEmergencyContactFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: ClientEmergencyContactFormSchema) => {
    toast('Emergency Contact Information Submitted:', {
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
