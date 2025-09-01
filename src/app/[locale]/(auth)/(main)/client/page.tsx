import { Heading, Skeleton, Text } from '@paalan/react-ui';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { ClientAnalytics } from './_components/ClientAnalytics';
import { ClientTable } from './_components/ClientTable';
import { NoMembershipPlans } from './_components/NoMembershipPlans';

const ClientPage = async () => {
  const membershipPlans = await api.membershipPlans.list();
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Clients',
          },
        ]}
      />
      <div className="flex h-full flex-col gap-8">
        <div className="mb-2">
          <Heading as="h1">Clients List</Heading>
          <Text className="text-muted-foreground">
            This section provides all the essential information about our clients.
          </Text>
        </div>
        {!membershipPlans.length ? (
          <NoMembershipPlans />
        ) : (
          <>
            <ErrorBoundary fallback={<div>Failed to load client analytics</div>}>
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
                <ClientAnalytics />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<div>Failed to load client list</div>}>
              <Suspense fallback={<Skeleton className="h-40" />}>
                <ClientTable />
              </Suspense>
            </ErrorBoundary>
          </>
        )}
      </div>
    </>
  );
};

export default ClientPage;
