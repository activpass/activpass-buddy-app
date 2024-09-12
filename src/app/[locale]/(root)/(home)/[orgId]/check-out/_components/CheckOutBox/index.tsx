import { cn } from '@paalan/react-shared/lib';
import { Card, Text } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import Link from '@/components/Link';

type CheckOutBoxProps = {
  href: string;
  imageSrc: string;
  title: string;
  className?: string;
};
export const CheckOutBox: FC<CheckOutBoxProps> = ({ className, href, imageSrc, title }) => {
  return (
    <Card
      contentClassName="py-4 px-6"
      className={cn('flex-grow shadow-md hover:shadow-lg', className)}
    >
      <Link className="flex cursor-pointer flex-col items-center justify-center gap-2" href={href}>
        <Image
          src={imageSrc}
          className="size-40"
          alt={`${title}-check-out`}
          width="160"
          height="160"
        />
        <Text className="font-semibold text-primary">{title}</Text>
      </Link>
    </Card>
  );
};
