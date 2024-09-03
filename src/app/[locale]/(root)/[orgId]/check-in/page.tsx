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
  params: {
    orgId: string;
  };
};
const CheckInPage: React.FC<CheckInPageProps> = async ({ params }) => {
  const { orgId } = params;
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
            href={`/${orgId}/check-in/client`}
            imageSrc="/images/client/check-in.png"
            title="Client"
          />
          <CheckInBox
            href={`/${orgId}/check-in/employee`}
            imageSrc="/images/employee/check-in.png"
            title="Employee"
          />
        </Flex>
        <VStack gap="4" mt="6" alignItems="center">
          <Text className="text-center text-sm">
            Want to check out?{' '}
            <Link href={`/${orgId}/check-out`} className="text-link underline">
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
