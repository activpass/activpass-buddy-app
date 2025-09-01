'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import { Avatar, Button, type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';
import { LuUser2 } from 'react-icons/lu';

import Link from '@/components/Link';

import { PaymentStatus } from '../PaymentStatus';
import type { ClientData } from './types';

export const CLIENT_TABLE_COLUMNS: DataTableColumnDef<ClientData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" className="ml-0" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-3">
          <Avatar
            src={row.original.avatar}
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
    id: 'membershipPlanName',
    accessorKey: 'membershipPlanName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Current Plan" />,
    enableSorting: false,
    cell: ({ row }) => {
      if (!row.original.membershipPlanName) return 'N/A';
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
    id: 'checkInDate',
    accessorKey: 'checkInDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check-in Date" />,
    cell: ({ row }) => dateIntl.format(row.original.checkInDate),
  },
  {
    id: 'joiningDate',
    accessorKey: 'joiningDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joining Date" />,
    cell: ({ row }) => dateIntl.format(row.original.joiningDate),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: false,
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    enableSorting: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    enableSorting: false,
    cell: ({ row }) => {
      return row.original.status ? <PaymentStatus status={row.original.status} /> : 'N/A';
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
