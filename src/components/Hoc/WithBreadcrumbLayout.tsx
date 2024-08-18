'use client';

import { QuestionMarkCircledIcon } from '@paalan/react-icons';
import { Breadcrumb, Button, HStack, IconButton, Paper } from '@paalan/react-ui';
import { Package2 } from 'lucide-react';
import type { FC, PropsWithChildren } from 'react';

import { BreadcrumbLink } from '@/components/BreadcrumbLink';

type WithBreadcrumbLayoutProps = PropsWithChildren<{
  items: React.ComponentPropsWithoutRef<typeof Breadcrumb>['items'];
}>;
export const WithBreadcrumbLayout: FC<WithBreadcrumbLayoutProps> = ({ items, children }) => {
  return (
    <>
      <Paper className="flex items-center gap-2 p-4 text-sm md:px-6">
        <Breadcrumb items={items} Link={BreadcrumbLink} />
        <HStack className="ml-auto" gap="4">
          <Button variant="outline" size="sm">
            Feedback
          </Button>
          <IconButton icon={<Package2 className="size-5" />} />
          <IconButton icon={<QuestionMarkCircledIcon boxSize="5" />} />
        </HStack>
      </Paper>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</div>
    </>
  );
};
