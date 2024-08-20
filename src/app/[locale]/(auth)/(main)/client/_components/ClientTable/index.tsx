'use client';

import { CaretSortIcon, DotsVerticalIcon } from '@paalan/react-icons';
import {
  Button,
  Checkbox,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@paalan/react-ui';
import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import DataTable from '@/components/shared/DataTable';

export type Client = {
  id: string;
  name: string;
  contact: number;
  membership: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
};

const data: Client[] = [
  {
    id: 'c1gr84i9',
    name: 'John Doe',
    contact: 9500329174,
    membership: 'Gold',
    status: 'success',
  },
  {
    id: 'c2j8u4k3',
    name: 'Jane Smith',
    contact: 9500329175,
    membership: 'Silver',
    status: 'processing',
  },
  {
    id: 'c3p9k5n7',
    name: 'Alice Johnson',
    contact: 9500329176,
    membership: 'Platinum',
    status: 'pending',
  },
  {
    id: 'c4q7l3h5',
    name: 'Michael Brown',
    contact: 9500329177,
    membership: 'Bronze',
    status: 'failed',
  },
  {
    id: 'c5m6w2z9',
    name: 'Davis',
    contact: 9500329178,
    membership: 'Gold',
    status: 'success',
  },
];

const columns: ColumnDef<Client>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="p-0"
      >
        Name
        <CaretSortIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'contact',
    header: () => <div className="text-right">Contact</div>,
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue('contact')}</div>,
  },
  {
    accessorKey: 'membership',
    header: 'Membership',
    cell: ({ row }) => <div className="capitalize">{row.getValue('membership')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className="capitalize">{row.getValue('status')}</div>,
  },
  {
    id: 'actions',
    header: () => null,
    cell: () => (
      <DropdownMenuRoot>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuRoot>
    ),
  },
];

const ClientTable: React.FC = () => {
  return (
    <div className="">
      <div className="flex justify-end">
        <Link
          className="mr-4 mt-5 rounded-lg bg-blue-500 px-6 py-3 font-sans text-xs font-bold uppercase text-white shadow-md transition-all hover:bg-blue-600 focus:opacity-85 focus:shadow-none active:opacity-85 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          href="/client/addclient"
        >
          Add Client
        </Link>
      </div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};
export default ClientTable;
