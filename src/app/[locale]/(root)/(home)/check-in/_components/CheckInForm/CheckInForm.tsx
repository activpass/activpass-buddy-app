'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormFieldItem, Text, useToast, VStack } from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from '@/components/Link';
import { api } from '@/trpc/client';
import {
  type CheckInFormSchema,
  checkInFormSchema,
  type TimeLogTypeEnum,
  timelogTypeEnum,
} from '@/validations/check-in/form.validation';

import type { CheckInResult } from '../../types';
import { CheckInVerified } from './CheckInVerified';

const formFields: FormFieldItem<CheckInFormSchema>[] = [
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

type CheckInFormProps = {
  orgId: string;
  type: TimeLogTypeEnum;
};
export const CheckInForm: FC<CheckInFormProps> = ({ orgId, type }) => {
  const textWord = type === timelogTypeEnum.enum.client ? 'Client' : 'Employee';

  const [verifiedData, setVerifiedData] = useState<CheckInResult | null>(null);
  const form = useForm<CheckInFormSchema>({
    resolver: zodResolver(checkInFormSchema),
    defaultValues: {
      phoneNumber: undefined,
    },
  });
  const toast = useToast();

  const checkInMutation = api.timeLogs.checkIn.useMutation({
    onSuccess(data) {
      setVerifiedData(data);
      toast.success(`${textWord} checkin verified successfully`);
    },
    onError(error) {
      toast.error(error.message || `Failed to verify ${type} checkin`);
    },
  });

  const onSubmit = async (values: CheckInFormSchema) => {
    checkInMutation.mutate({ ...values, orgId, type });
  };

  const isLoading = checkInMutation.isPending;

  if (verifiedData) {
    return (
      <CheckInVerified
        type={type}
        result={verifiedData}
        onResetResult={() => {
          setVerifiedData(null);
          form.reset();
        }}
      />
    );
  }

  return (
    <VStack gap="4">
      <Form<CheckInFormSchema>
        form={form}
        fields={formFields}
        onSubmit={onSubmit}
        hideResetButton
        isSubmitting={isLoading}
        submitText={isLoading ? 'Verifying...' : 'Verify'}
        submitClassName="flex-grow"
      />
      <Text className="text-center text-sm">
        Want to go back to?{' '}
        <Link href={`/check-out/${type}?orgId=${orgId}`} className="text-link underline">
          {textWord} Check out
        </Link>
      </Text>
    </VStack>
  );
};
