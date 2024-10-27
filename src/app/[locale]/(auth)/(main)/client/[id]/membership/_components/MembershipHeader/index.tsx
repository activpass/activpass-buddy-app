'use client';

import { Text } from '@paalan/react-ui';
import { type FC, use } from 'react';

import type { RouterOutputs } from '@/trpc/shared';

import { MembershipHeaderData } from './MembershipHeaderData';

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
