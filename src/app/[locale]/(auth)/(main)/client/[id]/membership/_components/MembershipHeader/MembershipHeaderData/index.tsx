import { cn, dateIntl } from '@paalan/react-shared/lib';
import { Box, Button, Card, Heading, Text } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import type { RouterOutputs } from '@/trpc/shared';
import { currencyIntl } from '@/utils/currency-intl';

import { MembershipDetails } from '../../MembershipDetails';
import { RenewMembershipConfirmationDialog } from '../../RenewMembershipConfirmationDialog';

type MembershipHeaderDataProps = {
  currentMembershipPlan: RouterOutputs['clients']['getCurrentMembershipPlan'];
};

export const MembershipHeaderData: FC<MembershipHeaderDataProps> = ({ currentMembershipPlan }) => {
  const [showPriceCard, setShowPriceCard] = useState(false);
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false);

  const { dueDate, amount, tenure, membershipPlan, client } = currentMembershipPlan;

  const remainingDays = dueDate
    ? Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;
  const isActive = remainingDays > 0;

  const handleUpgradeClick = () => {
    setShowPriceCard(true);
  };

  const handleRenewClick = () => {
    setIsRenewDialogOpen(true);
  };

  const getRemainingDaysColor = () => {
    if (remainingDays <= 0) return 'text-red-500';
    if (remainingDays <= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <>
      <Card className="mb-6">
        <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between">
          {/* Plan Information Section */}
          <aside>
            <Heading as="h4">Your Current Plan</Heading>
            <Text fontSize="sm" className="mb-3 text-muted-foreground">
              Plan details or any other relevant information about your plans can go here.
            </Text>
            <div className="flex flex-col gap-1">
              <Text fontSize="sm">
                <span className="font-semibold text-gray-900 dark:text-white">Plan Name:</span>{' '}
                <span>{membershipPlan.name}</span>
              </Text>
              <Text fontSize="sm">
                <span className="font-semibold text-gray-900 dark:text-white">Renewal Date:</span>{' '}
                <span>{dateIntl.format(dueDate)}</span>
              </Text>
            </div>

            <Button className="mt-4" onClick={handleUpgradeClick}>
              Upgrade to a New Plan
            </Button>

            {!isActive && (
              <Button
                className="ml-5 mt-2"
                color="blue"
                variant="outline"
                onClick={handleRenewClick}
              >
                Renew Your Plan
              </Button>
            )}
          </aside>

          {/* Plan Status and Amount Section */}
          <div className="flex flex-col items-start space-y-2 md:items-end md:space-y-4">
            <div
              className={cn(
                'flex items-center space-x-2',
                isActive ? 'text-green-500' : 'text-red-500'
              )}
            >
              <div className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isActive ? 'Active' : 'Inactive'}</span>
            </div>

            <Heading as="h1" className="text-lg md:text-2xl">
              {currencyIntl.format(amount)}
            </Heading>

            <Text fontSize="sm" className={getRemainingDaysColor()}>
              {remainingDays > 0 ? `${remainingDays} days remaining` : 'Plan Expired'}
            </Text>
          </div>
        </div>
      </Card>

      {/* Price Card Details */}
      {showPriceCard && (
        <Box className="my-6 w-full rounded-lg border p-5">
          <MembershipDetails
            onCloseMembershipCard={() => setShowPriceCard(false)}
            selectedTenure={tenure}
            selectedPlan={membershipPlan}
            clientId={client}
          />
        </Box>
      )}

      {/* Renew plan function */}
      <RenewMembershipConfirmationDialog
        open={isRenewDialogOpen}
        onOpenChange={setIsRenewDialogOpen}
        currentPlan={currentMembershipPlan}
        clientId={client}
      />
    </>
  );
};
