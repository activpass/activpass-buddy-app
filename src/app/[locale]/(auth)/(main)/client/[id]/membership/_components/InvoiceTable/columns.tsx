import { type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

import { CLIENT_PAYMENT_STATUS } from '@/constants/client/add-form.constant';

import type { IncomesType } from '../../types';

export const invoiceColumns: DataTableColumnDef<IncomesType>[] = [
  {
    id: 'clientName',
    accessorKey: 'clientName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client Name" />,
    enableSorting: true,
  },
  {
    id: 'planName',
    accessorKey: 'planName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership Plan" />,
    enableSorting: false,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => `₹${row.original.amount}`,
    enableSorting: false,
  },
  {
    id: 'tenure',
    accessorKey: 'tenure',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenure" />,
    enableSorting: false,
  },
  {
    id: 'paymentStatus',
    accessorKey: 'paymentStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <span>{CLIENT_PAYMENT_STATUS[row.original.paymentStatus].display}</span>;
    },
    enableSorting: false,
  },
  // {
  //   id: 'dueDate',
  //   accessorKey: 'dueDate',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
  //   cell: ({ row }) => <p>{row.original.dueDate}</p>,
  //   enableSorting: false,
  // },
];
