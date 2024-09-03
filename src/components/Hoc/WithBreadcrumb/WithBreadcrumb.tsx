'use client';

import { QuestionMarkCircledIcon } from '@paalan/react-icons';
import { Breadcrumb, Button, HStack, IconButton, Paper } from '@paalan/react-ui';
import { type FC } from 'react';
import { LuPackage2 } from 'react-icons/lu';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';

import { CheckInTokenBox } from './CheckInTokenBox';

export const WithBreadcrumb: FC = () => {
  const { items } = useBreadcrumb();

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
      </HStack>
    </Paper>
  );
};
