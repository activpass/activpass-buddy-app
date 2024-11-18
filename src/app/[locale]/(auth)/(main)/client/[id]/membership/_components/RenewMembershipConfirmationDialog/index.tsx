import { Button, Dialog, HStack, toast } from '@paalan/react-ui';
import type { FC } from 'react';

import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import type { RouterOutputs } from '@/trpc/shared';
import { currencyIntl } from '@/utils/currency-intl';

type RenewMembershipConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: RouterOutputs['clients']['getCurrentMembershipPlan'];
  clientId: string;
};

export const RenewMembershipConfirmationDialog: FC<RenewMembershipConfirmationDialogProps> = ({
  open,
  onOpenChange,
  currentPlan,
  clientId,
}) => {
  const router = useRouter();
  const { membershipPlan } = currentPlan;
  const { name: planName, totalAmount } = membershipPlan;

  const renewMembershipPlanMutation = api.clients.renewMembershipPlan.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      router.refresh();
      toast.success('Membership plan renewed successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onRenew = () => {
    renewMembershipPlanMutation.mutate({
      membershipPlanId: membershipPlan.id,
      clientId,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      header={{
        title: 'Renew Membership',
        description: `You're about to confirm the renewal of your ${planName} plan with a total amount of ${currencyIntl.format(totalAmount)}. 
        This renewal will update your membership period from 11-11-2024 to 11-02-2025.
        Please confirm to proceed.`,
      }}
      footer={{
        content: (
          <HStack mt="2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onRenew} isLoading={renewMembershipPlanMutation.isPending}>
              Confirm
            </Button>
          </HStack>
        ),
      }}
    />
  );
};
