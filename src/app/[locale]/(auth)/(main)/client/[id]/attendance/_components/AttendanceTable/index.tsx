'use client';

import { DataTable, Heading, Stack } from '@paalan/react-ui';
import type { FC } from 'react';

import type { TimeLogListType } from '../../types';
import { attendanceColumns } from './columns';

type AttendanceTableProps = {
  data: TimeLogListType[];
};

export const AttendanceTable: FC<AttendanceTableProps> = ({ data }) => {
  return (
    <Stack mt="4">
      <Heading as="h5">TimeLog Entries</Heading>
      <DataTable
        columns={attendanceColumns}
        rows={data}
        noResultsMessage="No entries found."
        pagination={{
          enabled: true,
          pageSize: 10,
        }}
      />
    </Stack>
  );
};
