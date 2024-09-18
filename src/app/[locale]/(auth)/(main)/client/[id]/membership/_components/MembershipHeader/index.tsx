'use client';

import type { RouterOutputs } from '@/trpc/shared';
import { Button, Card, Heading, Text } from '@paalan/react-ui';
import { useEffect, useMemo, useState, type FC } from 'react';

type MembershipHeaderProps = {
  clientData: RouterOutputs['clients']['get'];
};

type Tenure = 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY';

const calculateExpiryDate = (purchaseDate: Date, tenure: Tenure): Date => {
  const expiryDate = new Date(purchaseDate);

  if (tenure === 'MONTHLY') {
    expiryDate.setDate(expiryDate.getDate() + 28);
  } else if (tenure === 'QUARTERLY') {
    expiryDate.setDate(expiryDate.getDate() + 84);
  } else if (tenure === 'HALF_YEARLY') {
    expiryDate.setMonth(expiryDate.getMonth() + 6);
  } else if (tenure === 'YEARLY') {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }

  return expiryDate;
};

export const MembershipHeader: FC<MembershipHeaderProps> = ({ clientData }) => {
  const { membershipPlan } = clientData;

  const [remainingDays, setRemainingDays] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showPriceCard, setShowPriceCard] = useState(false);

  const purchaseDate = useMemo(
    () => (membershipPlan?.createdAt ? new Date(membershipPlan.createdAt) : new Date()),
    [membershipPlan?.createdAt]
  );
  const tenure = (membershipPlan?.tenure ?? 'MONTHLY') as Tenure;

  useEffect(() => {
    const expiryDate = calculateExpiryDate(purchaseDate, tenure);

    const calculateRemainingDays = () => {
      const today = new Date();
      const differenceInTime = expiryDate.getTime() - today.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      setRemainingDays(differenceInDays);
      setIsActive(differenceInDays > 0);
    };

    calculateRemainingDays();
  }, [purchaseDate, tenure]);

  const handleUpgradeClick = () => {
    setShowPriceCard(true);
  };

  return (
    <div className="">
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
            <Button
              className={`flex items-center space-x-2 bg-white hover:bg-white dark:bg-gray-900 ${
                isActive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <div className={`size-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isActive ? 'Active' : 'Inactive'}</span>
            </Button>
            <Heading as="h1" className="mt-2 md:mt-5">
              {`₹ ${membershipPlan?.amount}`}
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
        <div className="my-6 w-full rounded-lg bg-gray-100 p-4 text-center md:w-auto">
          <Heading as="h4">Membership plans</Heading>
        </div>
      )}
    </div>
  );
};
