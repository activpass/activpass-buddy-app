import { Heading, Skeleton, Text } from '@paalan/react-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

import { EmployeeAnalytics } from './_components/EmployeeAnalytics';
import { EmployeesTable } from './_components/EmployeeTable';

const EmployeePage = () => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Employees',
          },
        ]}
      />
      <div className="flex h-full flex-col gap-8">
        <div className="mb-2">
          <Heading as="h1">Employees List</Heading>
          <Text className="text-muted-foreground">
            This section provides all the essential information about our employees.
          </Text>
        </div>

        <ErrorBoundary fallback={<div>Failed to load employee analytics</div>}>
          <Suspense
            fallback={
              <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            }
          >
            <EmployeeAnalytics />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallback={<div>Failed to load employee list</div>}>
          <Suspense fallback={<Skeleton className="h-40" />}>
            <EmployeesTable />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};

export default EmployeePage;
