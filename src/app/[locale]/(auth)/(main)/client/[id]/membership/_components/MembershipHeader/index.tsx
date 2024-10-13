'use client';

import { ErrorInternalResponse, Skeleton, Text } from '@paalan/react-ui';
import { type FC } from 'react';

import { api } from '@/trpc/client';

import { MembershipHeaderData } from './MembershipHeaderData';

type MembershipHeaderProps = {
  clientId: string;
};

export const MembershipHeader: FC<MembershipHeaderProps> = ({ clientId }) => {
  const {
    data: currentMembershipPlan,
    isLoading,
    error,
    refetch,
  } = api.clients.getCurrentMembershipPlan.useQuery({
    clientId,
  });

  if (error) {
    return <ErrorInternalResponse error={new Error(error.message)} />;
  }

  if (isLoading) {
    return <Skeleton className="mb-6 h-28 w-full" />;
  }

  if (!currentMembershipPlan) {
    return <Text className="text-muted-foreground">No membership plan found</Text>;
  }

  return <MembershipHeaderData currentMembershipPlan={currentMembershipPlan} refetch={refetch} />;
};
