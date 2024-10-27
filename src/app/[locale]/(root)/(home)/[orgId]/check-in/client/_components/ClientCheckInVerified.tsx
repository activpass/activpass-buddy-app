import { zodResolver } from '@hookform/resolvers/zod';
import { dateIntl } from '@paalan/react-shared/lib';
import {
  Form,
  type FormFieldItem,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  toast,
} from '@paalan/react-ui';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import { type OtpPinFormSchema, otpPinFormSchema } from '@/validations/common.validation';

import { ClientCheckInVerifiedSuccess } from './ClientCheckInVerifiedSuccess';
import type { ClientCheckInResult } from './types';

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

type ClientCheckInVerifiedProps = {
  clientResult: ClientCheckInResult;
  resetClientResult: () => void;
};
export const ClientCheckInVerified: FC<ClientCheckInVerifiedProps> = ({
  clientResult,
  resetClientResult,
}) => {
  const form = useForm<OtpPinFormSchema>({
    resolver: zodResolver(otpPinFormSchema),
    defaultValues: {
      pin: '',
    },
  });
  const [successfullyVerified, setSuccessfullyVerified] = useState(false);

  const clientCheckInVerifyMutation = api.checkIn.clientCheckInVerify.useMutation({
    onSuccess: () => {
      toast.success('Check in successful');
      setSuccessfullyVerified(true);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onCheckIn = (data: OtpPinFormSchema) => {
    const { orgId, phoneNumber } = clientResult;
    clientCheckInVerifyMutation.mutate({ orgId, phoneNumber, pin: +data.pin });
  };

  if (successfullyVerified) {
    return <ClientCheckInVerifiedSuccess resetClientResult={resetClientResult} />;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <span className="font-semibold">Name:</span>
        <span>{clientResult.name}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Email:</span>
        <span>{clientResult.email}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Phone:</span>
        <span>{clientResult.phoneNumber}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-semibold">Date of Birth:</span>
        <span>
          {dateIntl.format(clientResult.dob, {
            dateFormat: 'dd/MM/yyyy',
          })}
        </span>
      </div>
      <div className="mt-6">
        <Form<OtpPinFormSchema>
          form={form}
          fields={fields}
          onSubmit={onCheckIn}
          isSubmitting={clientCheckInVerifyMutation.isPending}
          hideResetButton
          submitText="Check In"
        />
      </div>
    </div>
  );
};
