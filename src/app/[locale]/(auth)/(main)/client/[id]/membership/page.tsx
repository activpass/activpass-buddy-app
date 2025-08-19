import { Heading, Separator, Skeleton, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import { type FC, Suspense } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { InvoiceTable } from './_components/InvoiceTable';
import { MembershipHeader } from './_components/MembershipHeader';

export const metadata: Metadata = {
  title: 'Client Profile - Membership',
  description: 'Manage your membership details and status.',
};

type MembershipPageProps = {
  params: {
    id: string;
  };
};
const MembershipPage: FC<MembershipPageProps> = async ({ params }) => {
  const clientId = params.id;
  const clientData = await api.clients.get(clientId);
  const membershipIncomesPromise = api.incomes.list({ clientId });
  const currentMembershipPlanPromise = api.clients.getCurrentMembershipPlan({
    clientId,
  });

  return (
    <>
      <SetBreadcrumbItems
        items={[
          { label: 'Client', href: '/client' },
          { label: clientData.fullName, href: `/client/${params.id}` },
          {
            label: 'Membership',
          },
        ]}
      />
      <div className="space-y-6">
        <div>
          <Heading as="h3">Membership</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Membership details and status.
          </Text>
        </div>
        <Separator />
        <div>
          <Suspense fallback={<Skeleton className="mb-6 h-28 w-full" />}>
            <MembershipHeader currentMembershipPlanPromise={currentMembershipPlanPromise} />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-28 w-full" />}>
            <InvoiceTable membershipIncomesPromise={membershipIncomesPromise} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default MembershipPage;
