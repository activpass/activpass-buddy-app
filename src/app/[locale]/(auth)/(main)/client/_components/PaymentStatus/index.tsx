import { cn } from '@paalan/react-shared/lib';
import type { FC } from 'react';

import { CLIENT_PAYMENT_STATUS } from '@/constants/client/add-form.constant';

type PaymentStatusProps = {
  status: keyof typeof CLIENT_PAYMENT_STATUS;
};
export const PaymentStatus: FC<PaymentStatusProps> = ({ status }) => {
  if (!status) return 'N/A';

  return (
    <div className="flex items-center gap-1">
      <div
        className={cn('size-2 rounded-full bg-gray-500', {
          'bg-green-500': CLIENT_PAYMENT_STATUS.PAID.value === status,
          'bg-red-500': CLIENT_PAYMENT_STATUS.DUE.value === status,
        })}
      />
      <span
        className={cn('text-gray-500', {
          'text-green-500': CLIENT_PAYMENT_STATUS.PAID.value === status,
          'text-red-500': CLIENT_PAYMENT_STATUS.DUE.value === status,
        })}
      >
        {CLIENT_PAYMENT_STATUS[status].display}
      </span>
    </div>
  );
};
