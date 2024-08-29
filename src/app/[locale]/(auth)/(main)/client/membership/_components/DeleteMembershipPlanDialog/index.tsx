import { Button, Dialog, HStack, Strong, Text, toast } from '@paalan/react-ui';
import { type FC } from 'react';

import { api } from '@/trpc/client';

type DeleteMembershipPlanDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  planName: string;
  id: string;
  onDelete: (id: string) => void;
};
export const DeleteMembershipPlanDialog: FC<DeleteMembershipPlanDialogProps> = ({
  isOpen,
  onOpenChange,
  planName,
  id,
  onDelete,
}) => {
  const deleteMembershipPlanMutation = api.membershipPlan.delete.useMutation({
    onSuccess: result => {
      onDelete(result.id);
      onOpenChange(false);
      toast.success('Membership plan deleted successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const deleteMembershipPlan = () => {
    deleteMembershipPlanMutation.mutate({ id });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
      header={{
        title: 'Delete Membership Plan',
      }}
      footer={{
        content: (
          <HStack>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={deleteMembershipPlanMutation.isPending}
              onClick={deleteMembershipPlan}
            >
              Delete
            </Button>
          </HStack>
        ),
      }}
    >
      <Text>
        Are you sure you want to delete <Strong>{planName}</Strong> membership plan?{' '}
        <Strong>This action cannot be undone. </Strong>
      </Text>
    </Dialog>
  );
};
