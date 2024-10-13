import { SkeletonContainer, Strong, Text, toast } from '@paalan/react-ui';
import { type FC, type FormEvent, type ReactNode } from 'react';

import Link from '@/components/Link';
import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import { api } from '@/trpc/client';
import type { CreateMembershipPlanSchema } from '@/validations/client/membership.validation';

import type { ClientFormState } from '../../new/_components/AddClientForm/store';
import { MembershipPricingCard } from './MembershipPricingCard';
import { MembershipPricingHeader } from './MembershipPricingCard/MembershipPricingHeader';
import { MembershipPricingSwitch } from './MembershipPricingCard/MembershipPricingSwitch';

type MembershipDetailsFormProps = {
  membershipPlans?: ClientFormState['onboardingData']['membershipPlans'];
  updateMembershipDetail: (data: ClientFormState['membershipDetail']) => void;
  nextStep: () => void;
  state: ClientFormState['membershipDetail'];
  formAction?: ReactNode;
};

export const MembershipDetailsForm: FC<MembershipDetailsFormProps> = ({
  membershipPlans: membershipPlansList,
  updateMembershipDetail,
  nextStep,
  state,
  formAction,
}) => {
  const { data: membershipPlansData, isLoading } = api.membershipPlans.list.useQuery(undefined, {
    staleTime: 1000 * 60, // 1 minute
    enabled: !membershipPlansList?.length,
  });

  const membershipPlans = membershipPlansData || membershipPlansList;

  const { tenure: selectedTenure, planId: selectedPlanId, selectedPlan } = state;

  const onChangeTenure = (tenure: CreateMembershipPlanSchema['tenure']) => {
    updateMembershipDetail({ ...state, tenure });
  };

  const onChangePlan = (
    selectedPlanValue: ClientFormState['onboardingData']['membershipPlans'][number]
  ) => {
    updateMembershipDetail({
      ...state,
      planId: selectedPlanValue.id,
      selectedPlan: selectedPlanValue,
    });
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
                onSelect={() => onChangePlan(plan)}
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
      {formAction}
    </form>
  );
};
