import { dateIntl } from '@paalan/react-shared/lib';
import { type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

import type { TimeLogListType } from '../../types';

export const attendanceColumns: DataTableColumnDef<TimeLogListType>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    enableSorting: false,
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => dateIntl.format(row.original.checkIn),
    enableSorting: true,
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check In" />,
    cell: ({ row }) => dateIntl.formatRelativeTime(row.original.checkIn),
    enableSorting: false,
  },
  {
    id: 'checkOut',
    accessorKey: 'checkOut',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out" />,
    cell: ({ row }) => dateIntl.formatRelativeTime(row.original.checkOut),
    enableSorting: false,
  },
];
