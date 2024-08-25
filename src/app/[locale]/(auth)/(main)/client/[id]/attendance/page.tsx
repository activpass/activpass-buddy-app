import { Heading, Separator, Text } from '@paalan/react-ui';
import type { FC } from 'react';

import { SetBreadcrumbItem } from '@/providers/BreadcrumbProvider';

type AttendancePageProps = {
  params: {
    id: string;
  };
};
const AttendancePage: FC<AttendancePageProps> = ({ params }) => {
  return (
    <>
      <SetBreadcrumbItem
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
          <Text>attendance page content</Text>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
