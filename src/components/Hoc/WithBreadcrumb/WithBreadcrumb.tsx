'use client';

import { QuestionMarkCircledIcon } from '@paalan/react-icons';
import { Breadcrumb, Button, HStack, IconButton, Paper } from '@paalan/react-ui';
import { type FC } from 'react';
import { LuPackage2 } from 'react-icons/lu';
import { TbRefresh } from 'react-icons/tb';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

import { CheckInTokenBox } from './CheckInTokenBox';
import { useRouter } from '@/lib/navigation';

export const WithBreadcrumb: FC = () => {
  const { items } = useBreadcrumb();
  const router = useRouter();

  const onRefresh = () => router.refresh();

  return (
    <Paper className="flex items-center gap-2 p-4 text-sm md:px-6">
      <Breadcrumb items={items} Link={BreadcrumbLink} />
      <HStack className="ml-auto" gap="4">
        <CheckInTokenBox />
        <Button variant="outline" size="sm">
          Feedback
        </Button>
        <IconButton icon={<LuPackage2 className="size-5" />} />
        <IconButton icon={<QuestionMarkCircledIcon boxSize="5" />} />
        <IconButton title="Refresh" icon={<TbRefresh className="size-5" />} onClick={onRefresh} />
      </HStack>
    </Paper>
  );
};
