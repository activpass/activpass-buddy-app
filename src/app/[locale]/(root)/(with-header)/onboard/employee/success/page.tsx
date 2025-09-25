import { CheckCircleIcon } from '@paalan/react-icons';
import { Box, Button, Center, Flex, Heading, Text, VStack } from '@paalan/react-ui';
import Link from 'next/link';
import type { FC } from 'react';

const OnboardEmployeeSuccessPage: FC = () => {
  return (
    <div className="overflow-auto p-4 sm:p-0">
      <Center className="p-8">
        <VStack className="w-full max-w-2xl text-center" gap="6">
          {/* Success Icon */}
          <Box className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon className="size-12 text-green-600" />
          </Box>

          {/* Success Message */}
          <Flex flexDirection="column" gap="3">
            <Heading as="h1" className="text-green-600">
              Employee Onboarding Complete!
            </Heading>
            <Text className="text-lg text-secondary-foreground">
              Congratulations! You have successfully completed your employee onboarding process.
            </Text>
          </Flex>

          {/* Additional Information */}
          <Box className="rounded-lg bg-muted p-6">
            <VStack gap="3">
              <Heading as="h3" className="text-base">
                What's Next?
              </Heading>
              <VStack gap="2" className="text-sm">
                <Text>• Your manager will be notified of your completed onboarding</Text>
                <Text>• You will receive further instructions via email</Text>
                <Text>• Please keep this confirmation for your records</Text>
              </VStack>
            </VStack>
          </Box>

          {/* Action Buttons */}
          <Flex gap="4" className="mt-6" alignSelf="center">
            <Button asChild variant="outline">
              <Link href="/signin">Go to Login</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </Flex>

          {/* Footer Note */}
          <Text className="mt-4 text-sm text-muted-foreground">
            If you have any questions or need assistance, please don't hesitate to contact your HR
            department or system administrator.
          </Text>
        </VStack>
      </Center>
    </div>
  );
};

export default OnboardEmployeeSuccessPage;
