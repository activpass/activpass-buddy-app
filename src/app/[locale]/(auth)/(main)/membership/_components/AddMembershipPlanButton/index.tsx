import { AddIcon } from '@paalan/react-icons';
import { Button } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import type { MembershipPlan } from '../../types';
import { AddEditMembershipPlanDialog } from '../AddEditMembershipPlanDialog';

type AddMembershipPlanButtonProps = {
  onAdd: (newMembership: MembershipPlan) => void;
};
export const AddMembershipPlanButton: FC<AddMembershipPlanButtonProps> = ({ onAdd }) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Button leftIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
        Add Plan
      </Button>
      <AddEditMembershipPlanDialog
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        onSave={onAdd}
      />
    </>
  );
};
