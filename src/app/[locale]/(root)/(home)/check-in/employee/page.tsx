import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import { api } from '@/trpc/server';

import { EmployeeCheckInForm } from './_components/EmployeeCheckInForm';

type CheckInEmployeePageProps = {
  searchParams: {
    orgId?: string;
  };
};
const CheckInEmployeePage: FC<CheckInEmployeePageProps> = async ({ searchParams }) => {
  const { orgId = '' } = searchParams;
  const organization = await api.organizations.get(orgId);
  const logoUrl = organization?.logo?.url;

  return (
    <Card className="flex-1">
      <CardHeader className="text-center">
        {logoUrl && (
          <div className="mb-5 flex justify-center">
            <Image
              className="h-14 w-48"
              src={logoUrl}
              alt="organization logo"
              width={300}
              height={60}
            />
          </div>
        )}
        <CardTitle className="text-2xl">
          Check In - <span className="text-primary">Employee</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check in an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeCheckInForm orgId={organization.id} />
      </CardContent>
    </Card>
  );
};

export default CheckInEmployeePage;
