'use client';

import { DataTable, type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

type InvoiceData = {
  id: number;
  clientName: string;
  planName: string;
  amount: number;
  tenure: string;
  status: string;
  dueDate: string;
};

const data: InvoiceData[] = [
  {
    id: 1,
    clientName: 'John Doe',
    planName: 'Gold Plan',
    amount: 5000,
    tenure: '1 Year',
    status: 'Active',
    dueDate: '2024-12-31',
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    planName: 'Silver Plan',
    amount: 3000,
    tenure: '6 Months',
    status: 'Expired',
    dueDate: '2024-06-30',
  },
  {
    id: 3,
    clientName: 'Alice Johnson',
    planName: 'Bronze Plan',
    amount: 2000,
    tenure: '3 Months',
    status: 'Active',
    dueDate: '2024-03-31',
  },
];

const invoiceColumns: DataTableColumnDef<InvoiceData>[] = [
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
    cell: ({ row }: { row: { original: InvoiceData } }) =>
      `₹${row.original.amount.toLocaleString()}`,
    enableSorting: false,
  },
  {
    id: 'tenure',
    accessorKey: 'tenure',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenure" />,
    enableSorting: false,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    enableSorting: false,
  },
  {
    id: 'dueDate',
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }: { row: { original: InvoiceData } }) => <p>{row.original.dueDate}</p>,
    enableSorting: false,
  },
  // {
  //   id: 'actions',
  //   cell: () => {
  //     return <div></div>;
  //   },
  // },
];

export const InvoiceTable = () => {
  return (
    <DataTable
      columns={invoiceColumns}
      rows={data}
      noResultsMessage="No Invoice found."
      pagination={{
        enabled: true,
        pageSize: 10,
      }}
      search={{
        enabled: true,
        accessorKey: 'clientName',
        className: 'lg:w-full max-w-sm',
        placeholder: 'Search by client name',
      }}
    />
  );
};
