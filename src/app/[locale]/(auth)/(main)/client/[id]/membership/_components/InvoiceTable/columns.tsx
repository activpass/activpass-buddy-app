import { dateIntl } from '@paalan/react-shared/lib';
import {
  Button,
  type DataTableColumnDef,
  DataTableColumnHeader,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
} from '@paalan/react-ui';

import { SUBSCRIPTION_PERIOD } from '@/constants/client/add-form.constant';
import { currencyIntl } from '@/utils/currency-intl';

import { PaymentStatus } from '../../../../_components/PaymentStatus';
import type { IncomesType } from '../../types';
import { InvoiceTemplate } from '../InvoiceTemplate';

export const invoiceColumns: DataTableColumnDef<IncomesType>[] = [
  {
    id: 'membershipPlan.name',
    accessorKey: 'membershipPlan.name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership Plan" />,
    enableSorting: false,
  },
  {
    id: 'membershipPlan.amount',
    accessorKey: 'membershipPlan.amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => currencyIntl.format(row.original.amount),
    enableSorting: false,
  },
  {
    id: 'tenure',
    accessorKey: 'tenure',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenure" />,
    cell: ({ row }) => {
      return <span>{SUBSCRIPTION_PERIOD[row.original.tenure].display}</span>;
    },
    enableSorting: false,
  },
  {
    id: 'date',
    accessorKey: 'date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
    enableSorting: false,
    cell: ({ row }) => {
      if (!row.original.date) return 'N/A';
      return dateIntl.format(row.original.date);
    },
  },
  {
    id: 'dueDate',
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    enableSorting: false,
    cell: ({ row }) => {
      if (!row.original.dueDate) return 'N/A';
      return dateIntl.format(row.original.dueDate);
    },
  },
  {
    id: 'paymentStatus',
    accessorKey: 'paymentStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return <PaymentStatus status={row.original.paymentStatus} />;
    },
    enableSorting: false,
  },

  {
    id: 'action',
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      return (
        <SheetRoot>
          <SheetTrigger asChild>
            <Button variant="link" color="blue" px="0">
              View Invoice
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="h-full overflow-x-hidden overflow-y-scroll sm:max-w-2xl"
          >
            <SheetHeader>
              <SheetTitle>Invoice</SheetTitle>
            </SheetHeader>
            <SheetDescription className="mb-2 text-muted-foreground">
              Your gym membership invoice, including plan and payment information.
            </SheetDescription>
            <InvoiceTemplate incomeId={row.original.id} />
          </SheetContent>
        </SheetRoot>
      );
    },
    enableSorting: false,
  },
];
