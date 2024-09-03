import { type DataTableColumnDef, DataTableColumnHeader } from '@paalan/react-ui';

import { CLIENT_MEMBERSHIP_TENURE } from '@/constants/client/membership.constant';
import { currencyIntl } from '@/utils/currency-intl';

import type { MembershipPlan } from '../../types';
import { ActionsColumn } from './ActionsColumn';

type GetMembershipColumnsProps = {
  onUpdate: (updatedMembership: MembershipPlan) => void;
  onDelete: (id: string) => void;
};
export const getMembershipColumns = ({
  onUpdate,
  onDelete,
}: GetMembershipColumnsProps): DataTableColumnDef<MembershipPlan>[] => {
  return [
    {
      id: 'planName',
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan Name" />,
      enableSorting: false,
    },
    {
      id: 'planDescription',
      accessorKey: 'description',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Plan Description" />,
      enableSorting: false,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => currencyIntl.format(row.original.amount),
      enableSorting: true,
    },
    {
      id: 'discountPercentage',
      accessorKey: 'discountPercentage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Discount Percentage (%)" />
      ),
      enableSorting: false,
      cell: ({ row }) => {
        return row.original.discountPercentage ? `${row.original.discountPercentage}%` : '-';
      },
    },
    {
      id: 'tenure',
      accessorKey: 'tenure',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tenure" />,
      enableSorting: false,
      cell: ({ row }) => CLIENT_MEMBERSHIP_TENURE[row.original.tenure],
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: 'features',
      accessorKey: 'features',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Features" />,
      enableSorting: false,
      cell: ({ row }) => {
        const featureText = row.original.features.map(feature => feature.value).join(', ');
        return (
          <div className="max-w-40">
            <div className="line-clamp-1 break-words">{featureText}</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <ActionsColumn row={row.original} onUpdate={onUpdate} onDelete={onDelete} />;
      },
    },
  ];
};
