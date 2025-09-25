import { Skeleton } from '@paalan/react-ui';
import type { Metadata } from 'next';
import { type FC, Suspense } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { ProfileHeader } from '../_components/ProfileHeader';
import { AttendanceCalendar } from './_components/AttendanceCalendar';
import { AttendanceTable } from './_components/AttendanceTable';

export const metadata: Metadata = {
  title: 'Employee Profile - Attendance',
  description: 'Manage your attendance details and status.',
};

type AttendancePageProps = {
  params: {
    id: string;
  };
};
const AttendancePage: FC<AttendancePageProps> = async ({ params }) => {
  const employeeId = params.id;
  const clientData = await api.employees.get({
    id: employeeId,
  });
  const checkInTimeLogsList = api.timeLogs.list({ employeeId });

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
        <ProfileHeader
          title="Attendance Details"
          description="Details of your client’s attendance can be viewed here"
          showSendMessageButton
        />
        <div className="flex flex-col gap-5">
          <AttendanceCalendar employeeId={employeeId} />
          <Suspense fallback={<Skeleton className="h-28 w-full" />}>
            <AttendanceTable dataPromise={checkInTimeLogsList} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default AttendancePage;
