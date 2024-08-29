import { Button, type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

import Link from '@/components/Link';

import type { ClientRecord } from './types';

export const getClientColumns = (): DataTableColumnDef<ClientRecord>[] => {
  return [
    {
      id: 'fullName',
      accessorKey: 'fullName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        return (
          <Button
            as={Link}
            variant="link"
            color="blue"
            href={`/client/${row.original.id}`}
            className="pl-3"
          >
            {row.getValue('fullName')}
          </Button>
        );
      },
    },
    {
      id: 'contactNumber',
      accessorKey: 'phoneNumber',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
      enableSorting: false,
    },
    {
      id: 'membershipPlan',
      accessorKey: 'membershipPlan',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Membership" />,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <Button
            as={Link}
            variant="link"
            color="blue"
            href={`/client/${row.original.id}?tab=membership`}
            className="pl-0"
          >
            {row.getValue('membershipPlan')}
          </Button>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];
};
