'use client';

import { cn } from '@paalan/react-shared/lib';
import { Breadcrumb, buttonVariants, HStack, IconButton, Paper, Separator } from '@paalan/react-ui';
import { type FC, useTransition } from 'react';
import { TbRefresh } from 'react-icons/tb';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';
import { useRouter } from '@/lib/navigation';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

import { CheckInTokenBox } from './CheckInTokenBox';

export const WithBreadcrumb: FC = () => {
  const { items } = useBreadcrumb();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Paper className="flex items-center gap-2 p-4 text-sm md:px-6">
      <Breadcrumb items={items} Link={BreadcrumbLink} />
      <HStack className="ml-auto" gap="4">
        <CheckInTokenBox />
        <Separator orientation="vertical" className="h-5" />
        {/* <Button variant="outline" size="sm">
          Feedback
        </Button>
        <IconButton icon={<LuPackage2 className="size-5" />} />
        <IconButton icon={<QuestionMarkCircledIcon boxSize="5" />} /> */}
        <IconButton
          title="Refresh"
          icon={
            <TbRefresh
              className={cn('size-5', {
                'animate-spin': isPending,
              })}
            />
          }
          onClick={onRefresh}
          className={cn(buttonVariants({ variant: 'ghost' }), 'px-2')}
        />
      </HStack>
    </Paper>
  );
};
