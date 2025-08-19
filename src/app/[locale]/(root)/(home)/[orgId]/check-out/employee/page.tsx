import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import { api } from '@/trpc/server';

import { EmployeeCheckOutForm } from './_components/EmployeeCheckInForm';

type CheckOutEmployeePageProps = {
  params: {
    orgId: string;
  };
};
const CheckOutEmployeePage: FC<CheckOutEmployeePageProps> = async ({ params }) => {
  const { orgId } = params;
  const organization = await api.organizations.get(orgId);
  return (
    <Card className="lg:min-w-128">
      <CardHeader className="text-center">
        <Image
          src="/logos/png/activpass-buddy-logo-white-blue.png"
          alt="organization logo"
          width={100}
          height={100}
        />
        <CardTitle className="text-2xl">
          Check In - <span className="text-primary">Employee</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check in an employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmployeeCheckOutForm orgId={organization.id} />
      </CardContent>
    </Card>
  );
};

export default CheckOutEmployeePage;
