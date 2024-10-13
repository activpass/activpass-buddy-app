import { Box, Button, Card, Heading, Text } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import type { RouterOutputs } from '@/trpc/shared';
import { currencyIntl } from '@/utils/currency-intl';

import { MembershipDetails } from '../../MembershipDetails';

type MembershipHeaderDataProps = {
  currentMembershipPlan: RouterOutputs['clients']['getCurrentMembershipPlan'];
  refetch: () => void;
};
export const MembershipHeaderData: FC<MembershipHeaderDataProps> = ({
  currentMembershipPlan,
  refetch,
}) => {
  const [showPriceCard, setShowPriceCard] = useState(false);

  const { dueDate, amount, tenure, membershipPlan, client } = currentMembershipPlan;
  const isActive = dueDate ? new Date(dueDate) > new Date() : false;

  const remainingDays = dueDate
    ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;

  const handleUpgradeClick = () => {
    setShowPriceCard(true);
  };

  return (
    <>
      <Card className="mb-6">
        <div className="flex items-start justify-between space-y-4 p-4 md:flex-row md:items-center md:space-y-0">
          <aside>
            <Heading as="h4">Your Current Plan</Heading>
            <Text fontSize="sm" className="text-muted-foreground">
              Plan details or any other relevant information about your plans can go here.
            </Text>
            <Button className="mt-2" onClick={handleUpgradeClick}>
              Upgrade New Plan
            </Button>
          </aside>
          <div className="flex flex-col items-start space-y-2 md:items-end md:space-y-6">
            <div
              className={`flex items-center space-x-2 bg-white hover:bg-white dark:bg-gray-900 ${
                isActive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <div className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isActive ? 'Active' : 'Inactive'}</span>
            </div>
            <Heading as="h1" className="mt-2 md:mt-5">
              {currencyIntl.format(amount)}
            </Heading>
            {isActive && (
              <Text fontSize="sm" className="text-muted-foreground">
                {remainingDays > 0 ? `${remainingDays} days remaining` : 'Expired'}
              </Text>
            )}
          </div>
        </div>
      </Card>

      {showPriceCard && (
        <Box className="my-6 w-full rounded-lg border p-5">
          <MembershipDetails
            onCloseMembershipCard={() => setShowPriceCard(false)}
            selectedTenure={tenure}
            selectedPlan={membershipPlan}
            clientId={client}
            onRefetchMembership={refetch}
          />
        </Box>
      )}
    </>
  );
};
