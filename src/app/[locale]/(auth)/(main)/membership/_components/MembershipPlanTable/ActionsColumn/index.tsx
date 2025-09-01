import { DotsHorizontalIcon } from '@paalan/react-icons';
import { Button, DropdownMenu } from '@paalan/react-ui';
import { type FC, useState } from 'react';

import type { MembershipPlan } from '../../../types';
import { AddEditMembershipPlanDialog } from '../../AddEditMembershipPlanDialog';
import { DeleteMembershipPlanDialog } from '../../DeleteMembershipPlanDialog';

type ActionsColumnProps = {
  row: MembershipPlan;
  onUpdate: (data: MembershipPlan) => void;
  onDelete: (id: string) => void;
};
export const ActionsColumn: FC<ActionsColumnProps> = ({ row, onUpdate, onDelete }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu
        trigger={
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="size-4" />
          </Button>
        }
        title="Actions"
        items={[
          {
            label: 'Edit',
            onClick: () => setOpenEditDialog(true),
          },
          {
            label: 'Delete',
            onClick: () => setOpenDeleteDialog(true),
          },
        ]}
      />
      <AddEditMembershipPlanDialog
        isOpen={openEditDialog}
        onOpenChange={setOpenEditDialog}
        onSave={onUpdate}
        membershipPlan={row}
      />
      <DeleteMembershipPlanDialog
        isOpen={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        planName={row.name}
        id={row.id}
        onDelete={onDelete}
      />
    </>
  );
};
