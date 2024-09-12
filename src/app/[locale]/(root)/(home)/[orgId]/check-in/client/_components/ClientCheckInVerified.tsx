import { dateIntl } from '@paalan/react-shared/lib';
import { Button, Label, NumberInput, toast } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import { api } from '@/trpc/client';

import { ClientCheckInVerifiedSuccess } from './ClientCheckInVerifiedSuccess';
import type { ClientCheckInResult } from './types';

type ClientCheckInVerifiedProps = {
  clientResult: ClientCheckInResult;
  resetClientResult: () => void;
};
export const ClientCheckInVerified: FC<ClientCheckInVerifiedProps> = ({
  clientResult,
  resetClientResult,
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const onValueChange = (value: number) => {
    const strValue = value.toString();
    if (strValue.length > 4) {
      setPin(strValue.slice(0, 4));
    } else {
      setPin(strValue === '0' ? '' : strValue);
    }
    setErrorMessage('');
  };

  const onCheckIn = () => {
    if (pin.length < 4) {
      setErrorMessage('Please enter 4 digit pin');
      return;
    }
    const { orgId, phoneNumber } = clientResult;
    clientCheckInVerifyMutation.mutate({ orgId, phoneNumber, pin: +pin });
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
        <Label htmlFor="pin" className="pb-2 text-base font-semibold" required>
          Enter 4 digit check in pin:
        </Label>
        <NumberInput
          value={pin}
          id="pin"
          onValueChange={onValueChange}
          isInvalid={!!errorMessage}
          errorMessage={errorMessage}
          zeroAsEmptyString
          placeholder="Enter 4 digit pin"
          required
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onCheckIn();
            }
          }}
        />
      </div>
      <Button onClick={onCheckIn} mt="2" isLoading={clientCheckInVerifyMutation.isPending}>
        Check In
      </Button>
    </div>
  );
};
