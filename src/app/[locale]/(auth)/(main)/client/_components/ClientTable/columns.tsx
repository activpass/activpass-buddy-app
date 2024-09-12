'use client';

import { Avatar, Button, type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';
import { LuUser2 } from 'react-icons/lu';

import Link from '@/components/Link';
import { CLIENT_PAYMENT_STATUS } from '@/constants/client/add-form.constant';

import type { ClientData } from './types';

export const CLIENT_TABLE_COLUMNS: DataTableColumnDef<ClientData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-3">
          <Avatar
            src={row.original.avatar || ''}
            alt={row.getValue('name')}
            fallback={<LuUser2 className="size-6" />}
          />
          <Button
            as={Link}
            variant="link"
            color="blue"
            href={`/client/${row.original.id}?name=${row.original.name}`}
            className="pl-0"
          >
            {row.getValue('name')}
          </Button>
        </div>
      );
    },
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
    enableSorting: false,
  },
  {
    id: 'membershipPlanName',
    accessorKey: 'membershipPlanName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership" />,
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <Button
          as={Link}
          variant="link"
          color="blue"
          href={`/client/${row.original.id}/membership`}
          className="pl-0"
        >
          {row.original.membershipPlanName}
        </Button>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    enableSorting: false,
    cell: ({ row }) => {
      return <span>{CLIENT_PAYMENT_STATUS[row.original.status].display}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'checkIn',
    header: ({ column }) => <DataTableColumnHeader column={column} title="QR Check In" />,
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <Button
          as={Link}
          variant="link"
          color="blue"
          href={`/${row.original.orgId}/check-in`}
          className="pl-0"
          target="_blank"
        >
          Check In
        </Button>
      );
    },
  },
];
