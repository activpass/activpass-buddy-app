import type { Metadata } from 'next';
import { type FC } from 'react';

import { SetBreadcrumbItems } from '@/providers/BreadcrumbProvider';
import { api } from '@/trpc/server';

import { JobDetailsHeader } from './_components/JobDetailsHeader';
import { PaymentDetails } from './_components/PaymentDetails';

export const metadata: Metadata = {
  title: 'Employee Profile - Job Description',
  description: 'Manage your employee job description here',
};

type JobDescriptionPageProps = {
  params: {
    id: string;
  };
};
const JobDescriptionPage: FC<JobDescriptionPageProps> = async ({ params }) => {
  const employeeId = params.id;
  const employeeData = await api.employees.get({
    id: employeeId,
  });

  return (
    <>
      <SetBreadcrumbItems
        items={[
          { label: 'Employees', href: '/employees' },
          { label: employeeData.fullName, href: `/employees/${params.id}` },
          {
            label: 'Job Details',
          },
        ]}
      />
      <div className="space-y-6">
        <JobDetailsHeader data={employeeData} />
        <PaymentDetails />
        {/* <Suspense fallback={<Skeleton className="h-28 w-full" />}>
            <InvoiceTable membershipIncomesPromise={membershipIncomesPromise} />
          </Suspense> */}
      </div>
    </>
  );
};

export default JobDescriptionPage;
