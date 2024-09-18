'use client';

import { DataTable } from '@paalan/react-ui';
import { attendanceColumns } from './columns';
import type { TimeLogListType } from '../../types';
import type { FC } from 'react';

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
