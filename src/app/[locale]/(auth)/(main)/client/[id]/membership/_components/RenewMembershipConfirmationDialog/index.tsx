import { Button, Dialog, HStack, Separator, Strong, toast } from '@paalan/react-ui';
import type { FC } from 'react';

import { MEMBERSHIP_TENURE_DISPLAY_ITEM } from '@/constants/client/membership';
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
  const { tenure, amount, membershipPlan } = currentPlan;
  const { name, discountPercentage, discountAmount, totalAmount } = membershipPlan;
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
        description: 'Are you sure you want to renew this plan?',
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
    >
      <div className="space-y-4">
        <div className="flex justify-between gap-2">
          <div className="text-lg">
            Plan Name: <Strong className="word-break">{name}</Strong>
          </div>
          <div className="text-lg">
            Tenure: <Strong>{MEMBERSHIP_TENURE_DISPLAY_ITEM[tenure]}</Strong>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <div>Subtotal</div>
          <div>{currencyIntl.format(amount)}</div>
        </div>
        {!!discountPercentage && (
          <div className="flex justify-between">
            <div>Discount ({discountPercentage}%)</div>
            <div>{currencyIntl.format(discountAmount)}</div>
          </div>
        )}
        <Separator />
        <div className="flex justify-between">
          <div>Total</div>
          <div>{currencyIntl.format(totalAmount)}</div>
        </div>
      </div>
    </Dialog>
  );
};
