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

import { CheckOutBox } from './_components/CheckOutBox';
import { GoToLoginButton } from './_components/GoToLoginButton';

type CheckOutPageProps = {
  searchParams: {
    orgId?: string;
  };
};
const CheckOutPage: React.FC<CheckOutPageProps> = async ({ searchParams }) => {
  const { orgId } = searchParams;

  if (!orgId) {
    return (
      <Card className="border-none bg-transparent shadow-none lg:min-w-128">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Check Out</CardTitle>
          <CardDescription className="text-balance text-base">
            Organization ID is missing in the URL
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Check Out</CardTitle>
        <CardDescription className="text-balance text-base">
          Select the type of check-out you want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="flex-wrap justify-center gap-6 px-4">
          <CheckOutBox
            href={`/check-out/client?orgId=${orgId}`}
            imageSrc="/images/client/check-in.png"
            title="Client"
          />
          <CheckOutBox
            href={`/check-out/employee?orgId=${orgId}`}
            imageSrc="/images/employee/check-in.png"
            title="Employee"
          />
        </Flex>
        <VStack gap="4" mt="6" alignItems="center">
          <Text className="text-center text-sm">
            Want to check in?{' '}
            <Link href={`/check-in?orgId=${orgId}`} className="text-link underline">
              Check in
            </Link>
          </Text>
          <GoToLoginButton />
        </VStack>
      </CardContent>
    </Card>
  );
};

export default CheckOutPage;
