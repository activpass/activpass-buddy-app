import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

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
  const clientData = await api.clients.get(params.id);
  const membershipIncomesList = await api.incomes.list({ clientId: params.id });

  // console.log(membershipIncomesList);

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
          <MembershipHeader clientData={clientData} />
          <InvoiceTable data={membershipIncomesList} />
        </div>
      </div>
    </>
  );
};

export default MembershipPage;
