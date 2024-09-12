import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';
import Image from 'next/image';
import type { FC } from 'react';

import Link from '@/components/Link';
import { api } from '@/trpc/server';

import { ClientCheckOutForm } from './_components/ClientCheckOutForm';

type CheckOutClientPageProps = {
  params: {
    orgId: string;
  };
};
const CheckOutClientPage: FC<CheckOutClientPageProps> = async ({ params }) => {
  const { orgId } = params;
  const organization = await api.organizations.get(orgId);
  return (
    <Card className="lg:min-w-128">
      <CardHeader className="mb-4 text-center">
        <div className="mb-3 flex justify-center">
          <Image
            className="h-14 w-48"
            src="/logos/png/activpass-logo-black-blue.png"
            alt="organization logo"
            width={300}
            height={60}
          />
        </div>
        <CardTitle className="text-2xl">
          Check Out - <span className="text-primary">Client</span>
        </CardTitle>
        <CardDescription className="text-balance">
          Fill in the form below to check out a client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientCheckOutForm orgId={organization.id} />
        <Text className="mt-4 text-center text-sm">
          Want to client check in?{' '}
          <Link href={`/${orgId}/check-in/client`} className="text-link underline">
            Client Check in
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
};

export default CheckOutClientPage;
