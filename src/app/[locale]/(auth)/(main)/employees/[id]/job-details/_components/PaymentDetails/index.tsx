import { DataTable, VStack } from '@paalan/react-ui';
import type { FC } from 'react';

import { ProfileHeader } from '@/components/Common/ProfileHeader';

export const PaymentDetails: FC = () => {
  return (
    <VStack>
      <ProfileHeader
        title="Salary Payment Details"
        description="Details of your employee salary payout can be viewed here"
      />
      <DataTable columns={[]} rows={[]} />
    </VStack>
  );
};
