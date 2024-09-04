import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

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
const MembershipPage: FC<MembershipPageProps> = ({ params }) => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          { label: 'Client', href: '/client' },
          { label: params.id, href: `/client/${params.id}` },
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
          <MembershipHeader />
          <InvoiceTable />
        </div>
      </div>
    </>
  );
};

export default MembershipPage;
