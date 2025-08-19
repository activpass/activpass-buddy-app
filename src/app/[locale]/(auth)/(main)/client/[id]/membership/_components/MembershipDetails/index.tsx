import { type FC, useState } from 'react';

import { MembershipDetailsForm } from '../../../../_components/MembershipDetailsForm';
import { MembershipConfirmationDialog } from './MembershipConfirmationDialog';
import { MembershipFormAction } from './MembershipFormAction';
import type { MembershipDetailState } from './types';

type MembershipDetailsProps = {
  selectedTenure: MembershipDetailState['tenure'];
  selectedPlan: MembershipDetailState['selectedPlan'];
  clientId: string;
  onCloseMembershipCard: () => void;
};
export const MembershipDetails: FC<MembershipDetailsProps> = ({
  selectedPlan,
  selectedTenure,
  onCloseMembershipCard,
  clientId,
}) => {
  const [membershipDetail, setMembershipDetail] = useState<MembershipDetailState>({
    tenure: selectedTenure || '',
    planId: selectedPlan?.id || '',
    selectedPlan,
  });

  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  return (
    <>
      <MembershipDetailsForm
        state={membershipDetail}
        updateMembershipDetail={setMembershipDetail}
        nextStep={() => setOpenConfirmationDialog(true)}
        formAction={<MembershipFormAction onCancel={onCloseMembershipCard} />}
      />
      {openConfirmationDialog && !!membershipDetail.selectedPlan && (
        <MembershipConfirmationDialog
          open={openConfirmationDialog}
          onOpenChange={setOpenConfirmationDialog}
          selectedPlan={membershipDetail.selectedPlan}
          clientId={clientId}
          onCloseMembershipCard={onCloseMembershipCard}
        />
      )}
    </>
  );
};
