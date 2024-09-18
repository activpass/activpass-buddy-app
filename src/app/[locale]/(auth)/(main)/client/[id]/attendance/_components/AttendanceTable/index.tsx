'use client';

import { DataTable } from '@paalan/react-ui';
import type { FC } from 'react';

import type { TimeLogListType } from '../../types';
import { attendanceColumns } from './columns';

type AttendanceTableProps = {
  data: TimeLogListType[];
};

export const AttendanceTable: FC<AttendanceTableProps> = ({ data }) => {
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
