import type { FC } from 'react';

import { MembershipDetailsForm } from '../../../../../_components/MembershipDetailsForm';
import { useClientFormStore, useClientMemberShipDetail } from '../../store';
import { StepperFormActions } from '../StepperFormActions';

export const MembershipDetailsStepperForm: FC = () => {
  const membershipPlansList = useClientFormStore(state => state.onboardingData.membershipPlans);
  const updateMembershipDetail = useClientFormStore(state => state.updateMembershipDetail);
  const nextStep = useClientFormStore(state => state.nextStep);

  const membershipDetail = useClientMemberShipDetail();

  return (
    <MembershipDetailsForm
      state={membershipDetail}
      updateMembershipDetail={updateMembershipDetail}
      nextStep={nextStep}
      membershipPlans={membershipPlansList}
      formAction={<StepperFormActions disabled={!membershipDetail.selectedPlan} />}
    />
  );
};
