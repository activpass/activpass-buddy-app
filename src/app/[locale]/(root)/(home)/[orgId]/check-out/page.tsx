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
  params: {
    orgId: string;
  };
};
const CheckOutPage: React.FC<CheckOutPageProps> = async ({ params }) => {
  const { orgId } = params;
  return (
    <Card className="border-none bg-transparent shadow-none lg:min-w-128">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Check Out</CardTitle>
        <CardDescription className="text-balance text-base">
          Select the type of check-out you want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex className="flex-wrap justify-center gap-6 px-4">
          <CheckOutBox
            href={`/${orgId}/check-out/client`}
            imageSrc="/images/client/check-in.png"
            title="Client"
          />
          <CheckOutBox
            href={`/${orgId}/check-out/employee`}
            imageSrc="/images/employee/check-in.png"
            title="Employee"
          />
        </Flex>
        <VStack gap="4" mt="6" alignItems="center">
          <Text className="text-center text-sm">
            Want to check in?{' '}
            <Link href={`/${orgId}/check-in`} className="text-link underline">
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
