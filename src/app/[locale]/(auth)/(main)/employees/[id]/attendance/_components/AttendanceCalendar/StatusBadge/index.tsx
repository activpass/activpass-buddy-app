import { cn } from '@paalan/react-shared/lib';
import { Badge } from '@paalan/react-ui';
import type { FC } from 'react';

type StatusBadgeProps = {
  text: string;
  color: string;
};
export const StatusBadge: FC<StatusBadgeProps> = ({ text, color }) => {
  return (
    <Badge variant="outline" className="flex items-center gap-2">
      <div className={cn('size-2 rounded-full bg-gray-500', color)} />
      {text}
    </Badge>
  );
};
