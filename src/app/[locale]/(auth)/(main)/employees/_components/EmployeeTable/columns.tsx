'use client';

import { dateIntl } from '@paalan/react-shared/lib';
import {
  Avatar,
  Badge,
  Button,
  type DataTableColumnDef,
  DataTableColumnHeader,
} from '@paalan/react-ui';
import { capitalize } from 'lodash';
import { LuUser2 } from 'react-icons/lu';

import Link from '@/components/Link';

import type { EmployeeData } from './types';

export const EMPLOYEE_TABLE_COLUMNS: DataTableColumnDef<EmployeeData>[] = [
  {
    id: 'fullName',
    accessorKey: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" className="ml-0" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 pl-3">
          <Avatar src="" alt={row.original.fullName} fallback={<LuUser2 className="size-6" />} />
          <Button
            as={Link}
            variant="link"
            color="blue"
            href={`/employees/${row.original.id}`}
            className="pl-0"
          >
            {row.original.fullName}
          </Button>
        </div>
      );
    },
  },
  {
    id: 'employeeCode',
    accessorKey: 'employeeCode',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Code" />,
    cell: ({ row }) => {
      return row.original.employeeCode || 'Not Assigned';
    },
    enableSorting: false,
  },
  {
    id: 'title',
    accessorKey: 'jobDetails.title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
    cell: ({ row }) => {
      return row.original.jobDetails?.title || 'N/A';
    },
  },
  {
    id: 'checkInDate',
    accessorKey: 'checkInDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="CheckIn Date" />,
    cell: ({ row }) => dateIntl.format(row.original.checkInDate) || 'N/A',
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
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => {
      return row.original.phoneNumber ? `+91 ${row.original.phoneNumber}` : 'N/A';
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const { status, isNew } = row.original;
      if (isNew) {
        return <Badge variant="info">New</Badge>;
      }
      return (
        <Badge variant={status === 'active' ? 'success' : 'danger'}>{capitalize(status)}</Badge>
      );
    },
  },
];
