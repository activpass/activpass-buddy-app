import { AddIcon } from '@paalan/react-icons';
import { Button, DataTable } from '@paalan/react-ui';

import Link from '@/components/Link';
import { api } from '@/trpc/server';

import { CLIENT_TABLE_COLUMNS } from './columns';

export const ClientTable = async () => {
  const clients = await api.clients.list();
  return (
    <div className="space-y-4">
      <DataTable
        rows={clients}
        columns={CLIENT_TABLE_COLUMNS}
        noResultsMessage="No client results found."
        search={{
          enabled: true,
          accessorKey: 'name',
          className: 'lg:w-full max-w-sm',
        }}
        toolbarRightSideContent={
          <div className="flex gap-2">
            <Link href="/client/membership">
              <Button variant="outline">Manage Membership</Button>
            </Link>
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
