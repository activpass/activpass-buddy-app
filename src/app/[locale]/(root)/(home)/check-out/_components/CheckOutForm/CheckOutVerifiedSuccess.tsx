import { ArrowBackIcon, CheckCircleSolidIcon } from '@paalan/react-icons';
import { Button } from '@paalan/react-ui';
import type { FC } from 'react';

import type { TimeLogTypeEnum } from '@/validations/check-in/form.validation';

type CheckOutVerifiedSuccessProps = {
  type: TimeLogTypeEnum;
  onResetResult: () => void;
};
export const CheckOutVerifiedSuccess: FC<CheckOutVerifiedSuccessProps> = ({
  onResetResult,
  type,
}) => {
  const textWord = type === 'client' ? 'Client' : 'Employee';
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <CheckCircleSolidIcon className="size-16 text-green-500" />
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300">Check-out successful</h1>
      <p className="text-center text-gray-600 dark:text-gray-100">
        Thank you for visiting us. We hope to see you again soon.
      </p>
      <Button
        variant="outline"
        leftIcon={<ArrowBackIcon className="size-4" />}
        onClick={onResetResult}
      >
        Go to {textWord} Check Out
      </Button>
    </div>
  );
};
