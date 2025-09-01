'use client';

import { AddIcon } from '@paalan/react-icons';
import { Button, DataTable, ErrorInternalResponse, SkeletonContainer } from '@paalan/react-ui';

import Link from '@/components/Link';
import { api } from '@/trpc/client';

import { CLIENT_TABLE_COLUMNS } from './columns';

export const ClientTable = () => {
  const { data: clients, error, isLoading } = api.clients.list.useQuery();

  if (isLoading) {
    return <SkeletonContainer count={5} className="h-8" containerClassName="mt-7" isFullWidth />;
  }

  if (error) {
    return (
      <ErrorInternalResponse heading="Failed to load clients" subHeading={error.message} showIcon />
    );
  }

  return (
    <div className="space-y-4">
      <DataTable
        rows={clients || []}
        columns={CLIENT_TABLE_COLUMNS}
        noResultsMessage="No client results found."
        search={{
          enabled: true,
          accessorKey: 'name',
          className: 'lg:w-full max-w-sm',
        }}
        toolbarRightSideContent={
          <div className="flex gap-2">
            <Link href="/client/new">
              <Button leftIcon={<AddIcon className="size-3" />}>Add Client</Button>
            </Link>
          </div>
        }
        pagination={{
          enabled: true,
        }}
      />
    </div>
  );
};
