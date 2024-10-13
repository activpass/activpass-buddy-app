import { Button, Dialog, HStack, Separator, Strong, toast } from '@paalan/react-ui';
import type { FC } from 'react';

import { MEMBERSHIP_TENURE_DISPLAY_ITEM } from '@/constants/client/membership';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import { currencyIntl } from '@/utils/currency-intl';

import type { MembershipDetailState } from '../types';

type MembershipConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: NonNullable<MembershipDetailState['selectedPlan']>;
  clientId: string;
  onCloseMembershipCard: () => void;
  onRefetchMembership: () => void;
};
export const MembershipConfirmationDialog: FC<MembershipConfirmationDialogProps> = ({
  open,
  onOpenChange,
  selectedPlan,
  clientId,
  onCloseMembershipCard,
  onRefetchMembership,
}) => {
  const router = useRouter();
  const { tenure, name, amount, discountPercentage, discountAmount, totalAmount } = selectedPlan;

  const upgradeMembershipPlanMutation = api.clients.upgradeMembershipPlan.useMutation({
    onSuccess: () => {
      onOpenChange(false);
      onCloseMembershipCard();
      onRefetchMembership();
      router.refresh();
      toast.success('Membership plan upgraded successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onUpgrade = () => {
    upgradeMembershipPlanMutation.mutate({
      membershipPlanId: selectedPlan.id,
      clientId,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      header={{
        title: 'Upgrade Membership',
        description: 'Please confirm the membership details below.',
      }}
      footer={{
        content: (
          <HStack mt="2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onUpgrade} isLoading={upgradeMembershipPlanMutation.isPending}>
              Upgrade
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
