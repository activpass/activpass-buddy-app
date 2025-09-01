import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Flex,
  Text,
  VStack,
} from '@paalan/react-ui';

import Link from '@/components/Link';

import { CheckInBox } from './_components/CheckInBox';
import { GoToLoginButton } from './_components/GoToLoginButton';

type CheckInPageProps = {
  searchParams: {
    orgId?: string;
  };
};
const CheckInPage: React.FC<CheckInPageProps> = async ({ searchParams }) => {
  const { orgId } = searchParams;

  if (!orgId) {
    return (
      <Card className="border-none bg-transparent shadow-none lg:min-w-128">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Check In</CardTitle>
          <CardDescription className="text-balance text-base">
            Organization ID is missing in the URL
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-transparent shadow-none lg:min-w-128">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Check In</CardTitle>
        <CardDescription className="text-balance text-base">
          Select the type of check-in you want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="flex-wrap justify-center gap-6 px-4">
          <CheckInBox
            href={`/check-in/client?orgId=${orgId}`}
            imageSrc="/images/client/check-in.png"
            title="Client"
          />
          <CheckInBox
            href={`/check-in/employee?orgId=${orgId}`}
            imageSrc="/images/employee/check-in.png"
            title="Employee"
          />
        </Flex>
        <VStack gap="4" mt="6" alignItems="center">
          <Text className="text-center text-sm">
            Want to check out?{' '}
            <Link href={`/check-out?orgId=${orgId}`} className="text-link underline">
              Check out
            </Link>
          </Text>
          <GoToLoginButton />
        </VStack>
      </CardContent>
    </Card>
  );
};

export default CheckInPage;
