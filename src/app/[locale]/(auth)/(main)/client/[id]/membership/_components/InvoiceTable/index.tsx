'use client';

import { DataTable } from '@paalan/react-ui';
import type { FC } from 'react';

import type { IncomesType } from '../../types';
import { invoiceColumns } from './columns';
import type { RouterOutputs } from '@/trpc/shared';

type InvoiceTableProps = {
  data: IncomesType[];
  clientData: RouterOutputs['clients']['get'];
};

export const InvoiceTable: FC<InvoiceTableProps> = ({ data, clientData }) => {
  // console.log('Income Data:', data);

  const parsedData = data.map(item => {
    return {
      ...item,
      clientName: clientData?.fullName,
    };
  });

  return (
    <DataTable
      columns={invoiceColumns}
      rows={parsedData}
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
