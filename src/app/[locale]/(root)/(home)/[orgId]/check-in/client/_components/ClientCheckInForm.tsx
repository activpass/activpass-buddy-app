'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, useToast } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';

import { api } from '@/trpc/client';
import { type CheckInFormSchema, checkInFormSchema } from '@/validations/check-in/form.validation';

import { ClientCheckInVerified } from './ClientCheckInVerified';
import type { ClientCheckInResult } from './types';

const getCheckInFormFields = (form: UseFormReturn<CheckInFormSchema>) => {
  const fields: FormFieldItem<CheckInFormSchema>[] = [
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

type ClientCheckInFormProps = {
  orgId: string;
};
export const ClientCheckInForm: FC<ClientCheckInFormProps> = ({ orgId }) => {
  const [clientVerifiedData, setClientVerifiedData] = useState<ClientCheckInResult | null>(null);
  const form = useForm<CheckInFormSchema>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: {
      phoneNumber: undefined,
    },
  });
  const toast = useToast();

  const clientCheckInMutation = api.checkIn.clientCheckIn.useMutation({
    onSuccess(data) {
      setClientVerifiedData(data);
      toast.success('Client checkin verified successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to verify client checkin');
    },
  });

  const onSubmit = async (values: CheckInFormSchema) => {
    clientCheckInMutation.mutate({ ...values, orgId });
  };

  const isLoading = clientCheckInMutation.isPending;

  if (clientVerifiedData) {
    return (
      <ClientCheckInVerified
        clientResult={clientVerifiedData}
        resetClientResult={() => {
          setClientVerifiedData(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <Form<CheckInFormSchema>
      form={form}
      fields={getCheckInFormFields(form)}
      onSubmit={onSubmit}
      hideResetButton
      isSubmitting={isLoading}
      submitText="Verify"
      submitClassName="flex-grow"
    />
  );
};
