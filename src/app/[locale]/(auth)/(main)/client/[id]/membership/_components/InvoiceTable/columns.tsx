import { DotsVerticalIcon, EyeOpenIcon } from '@paalan/react-icons';
import {
  type DataTableColumnDef,
  DataTableColumnHeader,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  SheetContent,
  SheetHeader,
  SheetRoot,
  SheetTitle,
  SheetTrigger,
} from '@paalan/react-ui';

import { CLIENT_PAYMENT_STATUS, SUBSCRIPTION_PERIOD } from '@/constants/client/add-form.constant';

import type { IncomesType } from '../../types';
import { InvoiceTemplate } from '../InvoiceTemplate';

export const invoiceColumns: DataTableColumnDef<IncomesType>[] = [
  {
    id: 'clientName',
    accessorKey: 'clientName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Client Name" />,
    enableSorting: false,
  },
  {
    id: 'membershipPlan.planName',
    accessorKey: 'membershipPlan.planName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Membership Plan" />,
    enableSorting: false,
  },
  {
    id: 'membershipPlan.amount',
    accessorKey: 'membershipPlan.amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    // cell: ({ row }) => <p>{currencyIntl.format(row.original?.membershipPlan?.amount)}</p>,
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
    id: 'paymentStatus',
    accessorKey: 'paymentStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <div className="mr-2 size-2 rounded-full bg-green-500" />
          <span className="text-green-500">
            {CLIENT_PAYMENT_STATUS[row.original.paymentStatus].display}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  // {
  //   id: 'dueDate',
  //   accessorKey: 'dueDate',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
  //   enableSorting: false,
  // },
  {
    id: 'action',
    accessorKey: 'action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => {
      return (
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right">
            <SheetRoot>
              <SheetTrigger asChild>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  <EyeOpenIcon className="mr-2 size-4" />
                  View
                </DropdownMenuItem>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="h-full overflow-x-hidden overflow-y-scroll sm:max-w-2xl"
              >
                <SheetHeader>
                  <SheetTitle>Invoice</SheetTitle>
                </SheetHeader>
                <InvoiceTemplate invoiceId={row.original.id} />
              </SheetContent>
            </SheetRoot>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      );
    },
    enableSorting: false,
  },
];
