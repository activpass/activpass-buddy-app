'use client';

import { DataTable } from '@paalan/react-ui';
import type { FC } from 'react';

import type { IncomesType } from '../../types';
import { invoiceColumns } from './columns';

type InvoiceTableProps = {
  data: IncomesType[];
};

export const InvoiceTable: FC<InvoiceTableProps> = ({ data }) => {
  // console.log('Income Data :', data);
  // const { membershipPlan } = data;
  // [
  //   {
  //     _id: new ObjectId('66d85f95d734776b6a22ba7a'),
  //     invoiceId: '66d85f95d734776b6a22ba79',
  //     organization: new ObjectId('66d14b33e3f8cdd3c7edefbe'),
  //     client: new ObjectId('66d85f95d734776b6a22ba7c'),
  //     membershipPlan: {
  //       _id: new ObjectId('66d14bd2e3f8cdd3c7edefcb'),
  //       organization: new ObjectId('66d14b33e3f8cdd3c7edefbe'),
  //       planName: 'Pilot',
  //       tenure: 'MONTHLY',
  //       amount: 299,
  //       features: [Array],
  //       discountPercentage: 5,
  //       createdAt: 2024-08-30T04:34:26.309Z,
  //       updatedAt: 2024-08-30T04:34:26.309Z,
  //       discountedAmount: 284.05,
  //       id: '66d14bd2e3f8cdd3c7edefcb'
  //     },
  //     paymentMethod: 'CASH',
  //     paymentStatus: 'PAID',
  //     paymentFrequency: 'ONE_TIME',
  //     tenure: 'MONTHLY',
  //     createdAt: 2024-09-04T13:24:37.974Z,
  //     updatedAt: 2024-09-04T13:24:37.974Z,
  //     id: '66d85f95d734776b6a22ba7a'
  //   }
  // ]

  // const parsedData = data.map(item => ({
  //   clientName: 'Client Name',
  //   planName: item?.membershipPlan?.name,
  //   amount: item?.membershipPlan?.amount,
  //   tenure: item.tenure,
  //   paymentStatus: item.paymentStatus,
  // }));

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
