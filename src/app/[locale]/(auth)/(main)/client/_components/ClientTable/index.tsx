'use client';

import { AddIcon } from '@paalan/react-icons';
import { Button, DataTable } from '@paalan/react-ui';

import Link from '@/components/Link';

import { getClientColumns } from './columns';
import type { ClientRecord } from './types';

const data: ClientRecord[] = [
  {
    id: 'c1gr84i9',
    fullName: 'John Doe',
    phoneNumber: 9500329174,
    membershipPlan: 'Gold',
    status: 'success',
  },
  {
    id: 'c2j8u4k3',
    fullName: 'Jane Smith',
    phoneNumber: 9500329175,
    membershipPlan: 'Silver',
    status: 'processing',
  },
  {
    id: 'c3p9k5n7',
    fullName: 'Alice Johnson',
    phoneNumber: 9500329176,
    membershipPlan: 'Platinum',
    status: 'pending',
  },
  {
    id: 'c4q7l3h5',
    fullName: 'Michael Brown',
    phoneNumber: 9500329177,
    membershipPlan: 'Bronze',
    status: 'failed',
  },
  {
    id: 'c5m6w2z9',
    fullName: 'Davis',
    phoneNumber: 9500329178,
    membershipPlan: 'Gold',
    status: 'success',
  },
];

export const ClientTable = async () => {
  return (
    <div className="space-y-4">
      <DataTable
        rows={data}
        columns={getClientColumns()}
        search={{
          enabled: true,
          accessorKey: 'name',
          className: 'lg:w-full max-w-sm',
        }}
        toolbarRightSideContent={
          <div className="flex gap-2">
            <Button variant="outline" as={Link} href="/client/membership">
              Manage Membership
            </Button>
            <Button leftIcon={<AddIcon className="size-3" />} as={Link} href="/client/new">
              Add Client
            </Button>
          </div>
        }
        pagination={{
          enabled: true,
        }}
      />
    </div>
  );
};
