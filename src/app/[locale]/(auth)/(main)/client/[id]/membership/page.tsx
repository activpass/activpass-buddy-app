import { Heading, Separator, Text } from '@paalan/react-ui';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';

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
          <Text>membership page content</Text>
        </div>
      </div>
    </>
  );
};

export default MembershipPage;
