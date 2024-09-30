import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import Link from '@/components/Link';
import { api } from '@/trpc/server';

import { ClientCheckInForm } from './_components/ClientCheckInForm';

type CheckInClientPageProps = {
  params: {
    orgId: string;
  };
};
const CheckInClientPage: FC<CheckInClientPageProps> = async ({ params }) => {
  const { orgId } = params;
  const organization = await api.organizations.get(orgId);
  return (
    <Card className="m-8 lg:min-w-128">
      <CardHeader className="mb-4 text-center">
        <div className="mb-3 flex justify-center">
          {/* FIXME: Client logo, we need to use client logo in here */}
          <Image
            className="h-14 w-48"
            src="/logos/png/activpass-logo-black-blue.png"
            alt="organization logo"
            width={300}
            height={60}
          />
        </div>
        <CardTitle className="text-2xl">
          Check In - <span className="text-primary">Client</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check in a client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientCheckInForm orgId={organization.id} />
        <Text className="mt-4 text-center text-sm">
          Want to client check out?{' '}
          <Link href={`/${orgId}/check-out/client`} className="text-link underline">
            Client Check out
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
};

export default CheckInClientPage;
