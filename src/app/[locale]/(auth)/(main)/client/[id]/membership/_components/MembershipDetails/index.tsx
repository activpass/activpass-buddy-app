import { SkeletonContainer, Text } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import Link from '@/components/Link';
import { api } from '@/trpc/client';

import { MembershipPricingCard } from './MembershipPricingCard';
import { MembershipPricingHeader } from './MembershipPricingCard/MembershipPricingHeader';

export const MembershipDetails: FC = () => {
  const { data: membershipPlans, isLoading } = api.membershipPlans.list.useQuery(undefined, {
    staleTime: 1000 * 60, // 1 minute
  });

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const filteredPlans = membershipPlans || [];

  if (isLoading) {
    return (
      <SkeletonContainer
        containerClassName="flex gap-4 space-y-0"
        count={3}
        className="h-48 w-full"
      />
    );
  }

  return (
    <form className="flex flex-col items-center">
      <MembershipPricingHeader
        title="Membership Plans"
        subtitle="Choose the plan that's right for you"
      />
      <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {filteredPlans.length ? (
          filteredPlans.map(plan => (
            <MembershipPricingCard
              key={plan.id}
              {...plan}
              selected={selectedPlanId === plan.id}
              onSelect={() => handleSelectPlan(plan.id)}
            />
          ))
        ) : (
          <Text className="mb-10 mt-6 text-center text-muted-foreground">
            No membership plans available at the moment. Please create a membership plan in{' '}
            <Link href="/client/membership" className="text-link underline">
              Membership
            </Link>{' '}
            section.
          </Text>
        )}
      </section>
    </form>
  );
};
