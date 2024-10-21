'use client';

import { Text } from '@paalan/react-ui';
import { use, type FC } from 'react';

import { MembershipHeaderData } from './MembershipHeaderData';
import type { RouterOutputs } from '@/trpc/shared';

type MembershipHeaderProps = {
  currentMembershipPlanPromise: Promise<RouterOutputs['clients']['getCurrentMembershipPlan']>;
};

export const MembershipHeader: FC<MembershipHeaderProps> = ({ currentMembershipPlanPromise }) => {
  const currentMembershipPlan = use(currentMembershipPlanPromise);

  if (!currentMembershipPlan) {
    return <Text className="text-muted-foreground">No membership plan found</Text>;
  }

  return <MembershipHeaderData currentMembershipPlan={currentMembershipPlan} />;
};
