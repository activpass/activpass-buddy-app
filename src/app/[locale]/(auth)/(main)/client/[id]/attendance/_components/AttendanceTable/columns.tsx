import { dateIntl } from '@paalan/react-shared/lib';
import { type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

import type { TimeLogListType } from '../../types';

export const attendanceColumns: DataTableColumnDef<TimeLogListType>[] = [
  {
    id: 'serialNumber',
    accessorKey: 'serialNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row, table }) => (table.getRowModel().rows.indexOf(row) + 1).toString(),
    enableSorting: false,
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check-In Date" />,
    cell: ({ row }) => dateIntl.format(row.original.checkIn),
    enableSorting: false,
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
