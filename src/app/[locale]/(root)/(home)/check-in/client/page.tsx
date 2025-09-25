import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import { api } from '@/trpc/server';

import { CheckInForm } from '../_components/CheckInForm';

type CheckInClientPageProps = {
  searchParams: {
    orgId?: string;
  };
};
const CheckInClientPage: FC<CheckInClientPageProps> = async ({ searchParams }) => {
  const { orgId = '' } = searchParams;
  const organization = await api.organizations.get(orgId);
  const logoUrl = organization?.logo?.url;

  return (
    <Card className="flex flex-1 flex-col justify-center sm:m-8">
      <CardHeader className="mb-4 text-center">
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
          Check In - <span className="text-primary">Client</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check in a client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckInForm orgId={organization.id} type="client" />
      </CardContent>
    </Card>
  );
};

export default CheckInClientPage;
