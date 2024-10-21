import { Heading, Separator, Text } from '@paalan/react-ui';
import type { Metadata } from 'next';
import type { FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { AttendanceCalendar } from './_components/AttendanceCalendar';
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
const AttendancePage: FC<AttendancePageProps> = async ({ params }) => {
  const clientId = params.id;
  const clientData = await api.clients.get(clientId);
  const checkInTimeLogsList = await api.timeLogs.list({ clientId });

  return (
    <>
      <SetBreadcrumbItems
        items={[
          { label: 'Client', href: '/client' },
          { label: clientData.fullName, href: `/client/${params.id}` },
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
        <div className="flex flex-col gap-5">
          <AttendanceCalendar clientId={clientId} />
          <AttendanceTable data={checkInTimeLogsList} />
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
