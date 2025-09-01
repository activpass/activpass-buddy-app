'use client';

import { InfoCircledIcon } from '@paalan/react-icons';
import { Flex, Skeleton, Strong, Tooltip } from '@paalan/react-ui';
import { type FC, useMemo } from 'react';

import { api } from '@/trpc/client';

export const CheckInTokenBox: FC = () => {
  const { data, isLoading } = api.checkIn.generateToken.useQuery(undefined, {
    refetchInterval: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });

  const tokens = useMemo(() => {
    if (!data) return [];
    const values = data.pin.toString().split('');
    return values.map((value, index) => {
      return {
        id: index,
        value,
      };
    });
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-8 w-32" />;
  }
  if (!data) return null;

  return (
    <Flex gap="2" alignItems="center" mr="3">
      {tokens.map(token => (
        <Flex
          key={token.id}
          alignItems="center"
          justifyContent="center"
          className="size-8 rounded-sm border shadow-sm"
        >
          <Strong>{token.value}</Strong>
        </Flex>
      ))}
      <Tooltip
        className="max-w-52"
        content="This token is used to verify your identity, Will generate a new token every 1 minute."
        trigger={<InfoCircledIcon className="size-5" />}
      />
    </Flex>
  );
};
