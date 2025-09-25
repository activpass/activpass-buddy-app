'use client';

import { AddIcon } from '@paalan/react-icons';
import { Button, DataTable, ErrorInternalResponse, SkeletonContainer } from '@paalan/react-ui';

import Link from '@/components/Link';
import { api } from '@/trpc/client';

import { EMPLOYEE_TABLE_COLUMNS } from './columns';

export const EmployeesTable = () => {
  const { data: employeeData, error, isLoading } = api.employees.list.useQuery({});

  if (isLoading) {
    return <SkeletonContainer count={5} className="h-8" containerClassName="mt-7" isFullWidth />;
  }

  if (error) {
    return (
      <ErrorInternalResponse
        heading="Failed to load employees"
        subHeading={error.message}
        showIcon
      />
    );
  }

  const employees = employeeData?.employees || [];

  return (
    <div className="space-y-4">
      <DataTable
        rows={employees}
        columns={EMPLOYEE_TABLE_COLUMNS}
        noResultsMessage="No employee results found."
        search={{
          enabled: true,
          accessorKey: 'fullName',
          placeholder: 'Search employees...',
          className: 'lg:w-full max-w-sm',
        }}
        toolbarRightSideContent={
          <div className="flex gap-2">
            <Link href="/employees/new">
              <Button leftIcon={<AddIcon className="size-3" />}>Add Employee</Button>
            </Link>
          </div>
        }
        pagination={{
          enabled: !!employees.length,
        }}
      />
    </div>
  );
};
