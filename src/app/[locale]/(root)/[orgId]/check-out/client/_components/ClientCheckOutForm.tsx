'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, useToast } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

import { api } from '@/trpc/client';
import {
  type CheckOutFormSchema,
  checkOutFormSchema,
} from '@/validations/check-out/form.validation';

import { ClientCheckOutVerified } from './ClientCheckOutVerified';
import type { ClientCheckOutResult } from './types';

const getCheckOutFormFields = (form: UseFormReturn<CheckOutFormSchema>) => {
  const fields: FormFieldItem<CheckOutFormSchema>[] = [
    {
      type: 'number',
      name: 'phoneNumber',
      label: 'Phone Number',
      placeholder: 'Enter your registered phone number',
      required: true,
      onValueChange(value) {
        const strValue = value.toString();
        if (!strValue) return;
        if (strValue.length > 10) {
          form.setValue('phoneNumber', +strValue.slice(0, 10));
        } else {
          form.setValue('phoneNumber', value);
        }
      },
    },
  ];
  return fields;
};

type ClientCheckOutFormProps = {
  orgId: string;
};
export const ClientCheckOutForm: FC<ClientCheckOutFormProps> = ({ orgId }) => {
  const [clientVerifiedData, setClientVerifiedData] = useState<ClientCheckOutResult | null>(null);
  const form = useForm<CheckOutFormSchema>({
    resolver: zodResolver(checkOutFormSchema),
    defaultValues: {
      phoneNumber: undefined,
    },
  });
  const toast = useToast();

  const clientCheckOutMutation = api.checkIn.clientCheckOut.useMutation({
    onSuccess(data) {
      setClientVerifiedData(data);
      toast.success('Client CheckOut verified successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to verify client CheckOut');
    },
  });

  const onSubmit = async (values: CheckOutFormSchema) => {
    clientCheckOutMutation.mutate({ ...values, orgId });
  };

  const isLoading = clientCheckOutMutation.isPending;

  if (clientVerifiedData) {
    return (
      <ClientCheckOutVerified
        clientResult={clientVerifiedData}
        resetClientResult={() => {
          setClientVerifiedData(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <Form<CheckOutFormSchema>
      form={form}
      fields={getCheckOutFormFields(form)}
      onSubmit={onSubmit}
      hideResetButton
      isSubmitting={isLoading}
      submitText="Verify"
      submitClassName="flex-grow"
    />
  );
};
