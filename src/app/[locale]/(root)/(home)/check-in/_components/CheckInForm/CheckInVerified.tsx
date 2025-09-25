import { zodResolver } from '@hookform/resolvers/zod';
import { dateIntl } from '@paalan/react-shared/lib';
import {
  Button,
  Form,
  type FormFieldItem,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Text,
  toast,
} from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import type { TimeLogTypeEnum } from '@/validations/check-in/form.validation';
import { type OtpPinFormSchema, otpPinFormSchema } from '@/validations/common.validation';

import type { CheckInResult } from '../../types';
import { CheckInVerifiedSuccess } from './CheckInVerifiedSuccess';

const fields: FormFieldItem<OtpPinFormSchema>[] = [
  {
    type: 'custom',
    name: 'pin',
    label: 'Enter 4 digit check in pin:',
    render: ({ field }) => {
      return (
        <InputOTP maxLength={4} {...field}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      );
    },
  },
];

type CheckInVerifiedProps = {
  type: TimeLogTypeEnum;
  result: CheckInResult;
  onResetResult: () => void;
};
export const CheckInVerified: FC<CheckInVerifiedProps> = ({ result, onResetResult, type }) => {
  const form = useForm<OtpPinFormSchema>({
    resolver: zodResolver(otpPinFormSchema),
    defaultValues: {
      pin: '',
    },
  });
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);

  const checkInVerifyMutation = api.timeLogs.checkInVerify.useMutation({
    onSuccess: () => {
      toast.success(`Check in successful for ${result.name}`);
      setSuccessfullyVerified(true);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onCheckIn = (data: OtpPinFormSchema) => {
    const { orgId = '', phoneNumber } = result;
    checkInVerifyMutation.mutate({ orgId, phoneNumber, pin: +data.pin, type });
  };

  if (successfullyVerified) {
    return <CheckInVerifiedSuccess onResetResult={onResetResult} type={type} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <span className="font-semibold">Name:</span>
        <span>{result.name}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Email:</span>
        <span>{result.email}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Phone:</span>
        <span>{result.phoneNumber}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Date of Birth:</span>
        <span>
          {dateIntl.format(result.dob, {
            dateFormat: 'dd/MM/yyyy',
          })}
        </span>
      </div>
      <div className="mt-6">
        <Form<OtpPinFormSchema>
          form={form}
          fields={fields}
          onSubmit={onCheckIn}
          isSubmitting={checkInVerifyMutation.isPending}
          hideResetButton
          submitText="Check In"
        />
      </div>

      <Text className="mt-4 text-center text-sm">
        Want to reset?{' '}
        <Button variant="link" color="blue" onClick={onResetResult}>
          Reset
        </Button>
      </Text>
    </div>
  );
};
