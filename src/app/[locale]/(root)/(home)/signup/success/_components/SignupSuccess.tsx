import {
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loading,
  Text,
  useToast,
} from '@paalan/react-ui';
import { useEffect, useState, useTransition } from 'react';
import { AiOutlineCheckCircle, AiOutlineMail } from 'react-icons/ai';
import { FaArrowLeft } from 'react-icons/fa';

import Link from '@/components/Link';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';

type SignupSuccessProps = {
  email: string;
};

export const SignupSuccess = ({ email }: SignupSuccessProps) => {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [coolDownSeconds, setCoolDownSeconds] = useState(0);
  const [hasResent, setHasResent] = useState(false);

  const { isLoading, data } = api.auth.checkEmailStatus.useQuery(
    { email },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !!email,
    }
  );

  useEffect(() => {
    if (isLoading) return;

    if (data?.verified) {
      toast.success('Email already verified! Redirecting to sign in page...');
      startTransition(() => {
        router.push('/signin');
      });
    }
  }, [data?.verified, isLoading, router, toast]);

  // CoolDown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (coolDownSeconds > 0) {
      interval = setInterval(() => {
        setCoolDownSeconds(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [coolDownSeconds]);

  const resendVerificationMutation = api.auth.resendVerification.useMutation({
    onSuccess: () => {
      toast.success('Verification email sent successfully! Please check your inbox.');
      setHasResent(true);
      setCoolDownSeconds(120); // 2 minutes = 120 seconds
    },
    onError: errorData => {
      toast.error(errorData.message || 'Failed to resend verification email. Please try again.');
    },
  });

  const handleResendEmail = () => {
    if (coolDownSeconds > 0) return;
    resendVerificationMutation.mutate({ email });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isResendDisabled = coolDownSeconds > 0 || resendVerificationMutation.isPending;

  const handleBackToSignin = () => {
    startTransition(() => {
      router.push('/signin');
    });
  };

  if (isLoading) {
    return (
      <Box className="flex min-h-screen items-center justify-center p-4">
        <Loading className="size-5" content="Loading..." />
      </Box>
    );
  }

  if (!data?.exists) {
    return (
      <Box className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Box className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-100">
              <AiOutlineMail className="size-8 text-yellow-600" />
            </Box>
            <CardTitle className="text-2xl">Email Not Found</CardTitle>
            <CardDescription className="text-balance">
              The email address <strong>{email}</strong> is not associated with any account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Box className="space-y-3">
              <Text className="text-center text-sm text-muted-foreground">
                Please ensure you have signed up with the correct email address.
              </Text>
            </Box>
            <Box className="border-t pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToSignin}
                disabled={isPending}
                className="w-full"
                leftIcon={<FaArrowLeft className="size-4" />}
              >
                Back to Sign In
              </Button>
            </Box>
            <Box className="text-center">
              <Text className="text-xs text-muted-foreground">
                Need help?{' '}
                <Link href="/contact" className="text-link underline">
                  Contact Support
                </Link>
              </Text>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (data?.verified) return null;

  return (
    <Box className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Box className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <AiOutlineCheckCircle className="size-8 text-green-600" />
          </Box>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription className="text-balance">
            We've sent a verification email to your inbox
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Box className="space-y-2 text-center">
            <Box className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-blue-100">
              <AiOutlineMail className="size-6 text-blue-600" />
            </Box>
            <Text className="text-sm text-muted-foreground">We sent a verification link to:</Text>
            <Text className="break-all font-medium">{email}</Text>
          </Box>

          <Box className="space-y-3">
            <Text className="text-center text-sm text-muted-foreground">
              Click the link in the email to verify your account and continue to complete your
              profile setup.
            </Text>

            <Box className="text-center">
              <Text className="mb-2 text-xs text-muted-foreground">
                {hasResent && coolDownSeconds === 0
                  ? "Still didn't receive the email?"
                  : "Didn't receive the email?"}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendEmail}
                className="w-full"
                disabled={isResendDisabled}
                isLoading={resendVerificationMutation.isPending}
                loadingText="Sending..."
                leftIcon={<AiOutlineMail className="size-4" />}
              >
                {coolDownSeconds > 0 ? `Resend in ${formatTime(coolDownSeconds)}` : 'Resend Email'}
              </Button>
              {hasResent && coolDownSeconds > 0 && (
                <Text className="mt-1 text-xs text-muted-foreground">
                  Please wait before requesting another email
                </Text>
              )}
            </Box>
          </Box>

          <Box className="border-t pt-4">
            <Text className="mb-2 text-center text-xs text-muted-foreground">
              Already verified your email?
            </Text>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToSignin}
              disabled={isPending}
              className="w-full"
              leftIcon={<FaArrowLeft className="size-4" />}
            >
              Back to Sign In
            </Button>
          </Box>

          <Box className="text-center">
            <Text className="text-xs text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-link underline">
                Contact Support
              </Link>
            </Text>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
