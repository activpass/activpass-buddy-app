'use client';

import { DataTable, type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

type AttendanceData = {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
};

const data: AttendanceData[] = [
  {
    id: 1,
    date: '2024-09-01',
    checkIn: '09:00 AM',
    checkOut: '05:00 PM',
  },
  {
    id: 2,
    date: '2024-09-02',
    checkIn: '09:10 AM',
    checkOut: '05:15 PM',
  },
  {
    id: 3,
    date: '2024-09-03',
    checkIn: '08:50 AM',
    checkOut: '04:45 PM',
  },
];

const attendanceColumns: DataTableColumnDef<AttendanceData>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    enableSorting: false,
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    enableSorting: true,
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check In" />,
    enableSorting: false,
  },
  {
    id: 'checkOut',
    accessorKey: 'checkOut',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out" />,
    enableSorting: false,
  },
];

export const AttendanceTable = () => {
  return (
    <DataTable
      columns={attendanceColumns}
      rows={data}
      noResultsMessage="No Attendance found."
      pagination={{
        enabled: true,
        pageSize: 10,
      }}
      search={{
        enabled: true,
        accessorKey: 'date',
        className: 'lg:w-full max-w-sm',
        placeholder: 'Search by date',
      }}
    />
  );
};
