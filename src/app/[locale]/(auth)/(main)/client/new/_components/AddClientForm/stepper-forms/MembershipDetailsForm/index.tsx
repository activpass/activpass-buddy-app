import { SkeletonContainer, Strong, Text, toast, useStepper } from '@paalan/react-ui';
import { type FC, type FormEvent } from 'react';

import Link from '@/components/Link';
import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import { api } from '@/trpc/client';
import type { CreateMembershipPlanSchema } from '@/validations/client/membership.validation';

import { useClientFormStore, useClientMemberShipDetail } from '../../store';
import { StepperFormActions } from '../StepperFormActions';
import { MembershipPricingCard } from './MembershipPricingCard';
import { MembershipPricingHeader } from './MembershipPricingCard/MembershipPricingHeader';
import { MembershipPricingSwitch } from './MembershipPricingCard/MembershipPricingSwitch';

export const MembershipDetailsForm: FC = () => {
  const { data: membershipPlans, isLoading } = api.membershipPlans.list.useQuery(undefined, {
    staleTime: 1000 * 60, // 1 minute
  });

  const { nextStep } = useStepper();
  const updateMembershipDetail = useClientFormStore(state => state.updateMembershipDetail);
  const {
    planId: selectedPlanId,
    tenure: selectedTenure,
    selectedPlan,
  } = useClientMemberShipDetail();

  const onChangeTenure = (tenure: CreateMembershipPlanSchema['tenure']) => {
    updateMembershipDetail({ tenure, planId: '', selectedPlan: null });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlanId || !selectedPlan) {
      toast.error('Please select a membership plan to continue.');
      return;
    }
    nextStep();
  };

  const filteredPlans = membershipPlans?.filter(plan => plan.tenure === selectedTenure) || [];

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
    <form onSubmit={onSubmit} className="flex flex-col items-center">
      <MembershipPricingHeader
        title="Membership Plans"
        subtitle="Choose the plan that's right for you"
      />
      <MembershipPricingSwitch onChangeValue={onChangeTenure} value={selectedTenure} />
      <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {filteredPlans.length ? (
          filteredPlans.map(plan => {
            return (
              <MembershipPricingCard
                key={plan.id}
                {...plan}
                selected={selectedPlanId === plan.id}
                onSelect={() => {
                  updateMembershipDetail({ planId: plan.id, selectedPlan: plan });
                }}
              />
            );
          })
        ) : (
          <Text className="mb-10 mt-6 text-center text-muted-foreground">
            No membership plans available at the moment for{' '}
            <Strong>{CLIENT_MEMBERSHIP_TENURE[selectedTenure].display}</Strong>. Please create a
            membership plan in{' '}
            <Link href="/client/membership" className="text-link underline">
              Membership
            </Link>{' '}
            section.
          </Text>
        )}
      </section>
      <StepperFormActions />
    </form>
  );
};
