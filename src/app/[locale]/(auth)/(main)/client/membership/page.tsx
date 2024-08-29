import { Heading, SkeletonContainer, Text } from '@paalan/react-ui';
import { Suspense } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { MembershipPlanTable } from './_components/MembershipPlanTable';

const MembershipPage: React.FC = () => {
  const membershipListPromise = api.membershipPlan.list();
  return (
    <>
      <SetBreadcrumbItems
        items={[
          {
            label: 'Client',
            href: '/client',
          },
          {
            label: 'Membership',
          },
        ]}
      />
      <div className="mb-5">
        <Heading as="h1">Membership</Heading>
        <Text className="text-muted-foreground">
          This section you can manage your membership plans.
        </Text>
      </div>
      <Suspense fallback={<SkeletonContainer count={4} className="h-7" />}>
        <MembershipPlanTable membershipListPromise={membershipListPromise} />
      </Suspense>
    </>
  );
};

export default MembershipPage;
