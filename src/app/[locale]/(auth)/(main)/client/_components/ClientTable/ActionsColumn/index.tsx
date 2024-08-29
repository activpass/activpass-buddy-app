import { DotsHorizontalIcon } from '@paalan/react-icons';
import { Button, DropdownMenu } from '@paalan/react-ui';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';

import type { ClientRecord } from '../types';

type ActionsColumnProps = {
  row: ClientRecord;
};
export const ActionsColumn: FC<ActionsColumnProps> = ({ row }) => {
  const router = useRouter();
  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="size-4" />
        </Button>
      }
      title="Actions"
      items={[
        {
          label: 'View',
          onClick: () => router.push(`/client/${row.id}`),
        },
        {
          label: 'Edit',
          onClick: () => router.push(`/client/${row.id}`),
        },
      ]}
    />
  );
};
