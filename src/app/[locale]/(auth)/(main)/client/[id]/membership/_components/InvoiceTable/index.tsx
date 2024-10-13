'use client';

import { DataTable, Heading, Stack } from '@paalan/react-ui';
import { type FC, use } from 'react';

import type { IncomesType } from '../../types';
import { invoiceColumns } from './columns';

type InvoiceTableProps = {
  membershipIncomesPromise: Promise<IncomesType[]>;
};

export const InvoiceTable: FC<InvoiceTableProps> = ({ membershipIncomesPromise }) => {
  const data = use(membershipIncomesPromise);

  return (
    <Stack>
      <Heading as="h3"> Invoices </Heading>
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
          accessorKey: 'membershipPlan.name',
          className: 'lg:w-full max-w-sm',
          placeholder: 'Search by plan name',
        }}
      />
    </Stack>
  );
};
