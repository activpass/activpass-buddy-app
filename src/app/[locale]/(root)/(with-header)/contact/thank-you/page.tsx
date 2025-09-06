'use client';

import { Box, Button, Card, CardContent, CardHeader, CardTitle, Text } from '@paalan/react-ui';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';

import { useRouter } from '@/lib/navigation';

const ContactThankYouPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/contact');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <Box className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Box className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <AiOutlineCheckCircle className="size-8 text-green-600" />
          </Box>
          <CardTitle className="text-2xl">Message Sent!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Text className="text-gray-600">
            Thank you for contacting ActivPass. We've received your message and will get back to you
            within 24 hours.
          </Text>

          <Text className="text-sm text-gray-500">
            We appreciate your interest in ActivPass and look forward to helping you with your
            inquiry.
          </Text>

          <Box className="space-y-2 pt-4">
            <Button onClick={handleGoHome} className="w-full">
              Go to Homepage
            </Button>
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="w-full"
              leftIcon={<FaArrowLeft className="size-4" />}
            >
              Back to Contact
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactThankYouPage;
