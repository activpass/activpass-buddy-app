import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { AttendanceTable } from './_components/AttendanceTable';

export const metadata: Metadata = {
  title: 'Client Profile - Attendance',
  description: 'Manage your attendance details and status.',
};

type AttendancePageProps = {
  params: {
    id: string;
  };
};
const AttendancePage: FC<AttendancePageProps> = ({ params }) => {
  return (
    <>
      <SetBreadcrumbItems
        items={[
          { label: 'Client', href: '/client' },
          { label: params.id, href: `/client/${params.id}` },
          {
            label: 'Attendance',
          },
        ]}
      />
      <div className="space-y-6">
        <div>
          <Heading as="h3">Attendance</Heading>
          <Text fontSize="sm" className="text-muted-foreground">
            Attendance details and status.
          </Text>
        </div>
        <Separator />
        <div>
          <AttendanceTable />
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
