'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, Text, useToast, VStack } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from '@/components/Link';
import { api } from '@/trpc/client';
import type { TimeLogTypeEnum } from '@/validations/check-in/form.validation';
import {
  type CheckOutFormSchema,
  checkOutFormSchema,
} from '@/validations/check-out/form.validation';

import type { CheckOutResult } from '../../types';
import { CheckOutVerified } from './CheckOutVerified';

const formFields: FormFieldItem<CheckOutFormSchema>[] = [
  {
    type: 'number',
    name: 'phoneNumber',
    label: 'Phone Number',
    placeholder: 'Enter your registered phone number',
    required: true,
    numberInputProps: {
      zeroAsEmptyString: true,
      maxLength: 10,
      autoFocus: true,
    },
  },
];

type CheckOutFormProps = {
  type: TimeLogTypeEnum;
  orgId: string;
};
export const CheckOutForm: FC<CheckOutFormProps> = ({ orgId, type }) => {
  const textWord = type === 'client' ? 'Client' : 'Employee';
  const [clientVerifiedData, setClientVerifiedData] = useState<CheckOutResult | null>(null);
  const form = useForm<CheckOutFormSchema>({
    resolver: zodResolver(checkOutFormSchema),
    defaultValues: {
      phoneNumber: undefined,
    },
  });
  const toast = useToast();

  const checkOutMutation = api.timeLogs.checkOut.useMutation({
    onSuccess(data) {
      setClientVerifiedData(data);
      toast.success(`${textWord} CheckOut verified successfully`);
    },
    onError(error) {
      toast.error(error.message || `Failed to verify ${type} CheckOut`);
    },
  });

  const onSubmit = async (values: CheckOutFormSchema) => {
    checkOutMutation.mutate({ ...values, orgId, type });
  };

  const isLoading = checkOutMutation.isPending;

  if (clientVerifiedData) {
    return (
      <CheckOutVerified
        type={type}
        clientResult={clientVerifiedData}
        onResetResult={() => {
          setClientVerifiedData(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <VStack gap="4">
      <Form<CheckOutFormSchema>
        form={form}
        fields={formFields}
        onSubmit={onSubmit}
        hideResetButton
        isSubmitting={isLoading}
        submitText={isLoading ? 'Verifying...' : 'Verify'}
        submitClassName="flex-grow"
      />
      <Text className="mt-4 text-center text-sm">
        Want to go back to?{' '}
        <Link href={`/check-in/${type}?orgId=${orgId}`} className="text-link underline">
          Check in
        </Link>
      </Text>
    </VStack>
  );
};
