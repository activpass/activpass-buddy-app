'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Text,
} from '@paalan/react-ui';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { AiOutlineCheckCircle, AiOutlineExclamationCircle } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';

import Link from '@/components/Link';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const verifyApiCalledRef = useRef(false);

  const verifyMutation = api.auth.accountVerify.useMutation({
    onSuccess: user => {
      setVerificationStatus('success');
      // Redirect to onboarding after a short delay
      setTimeout(() => {
        startTransition(() => {
          router.push(`/onboarding-step?userId=${user.id}`);
        });
      }, 3000);
    },
    onError: error => {
      setVerificationStatus('error');
      setErrorMessage(error.message || 'Verification failed. Please try again.');
    },
  });

  useEffect(() => {
    if (verifyApiCalledRef.current) return; // Prevent multiple calls
    verifyApiCalledRef.current = true;

    if (token && email) {
      verifyMutation.mutate({ token, email });
    } else {
      setVerificationStatus('error');
      setErrorMessage('Invalid verification link. Missing token or email.');
    }
  }, [token, email, verifyMutation]);

  const handleGoToSignin = () => {
    startTransition(() => {
      router.push('/signin');
    });
  };

  const handleGoToSignup = () => {
    startTransition(() => {
      router.push('/signup');
    });
  };

  if (verificationStatus === 'loading') {
    return (
      <Box className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Box className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <BiLoaderAlt className="size-8 animate-spin text-blue-600" />
            </Box>
            <CardTitle className="text-2xl">Verifying Your Email</CardTitle>
            <CardDescription>Please wait while we verify your account...</CardDescription>
          </CardHeader>
        </Card>
      </Box>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <AiOutlineCheckCircle className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. Redirecting you to complete your profile...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <Text className="text-sm text-muted-foreground">
                You'll be automatically redirected to complete your onboarding process.
              </Text>
              <div className="flex items-center justify-center">
                <BiLoaderAlt className="mr-2 size-4 animate-spin" />
                <Text className="text-sm">Redirecting...</Text>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <AiOutlineExclamationCircle className="size-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
          <CardDescription>We couldn't verify your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Text className="mb-4 text-sm text-muted-foreground">{errorMessage}</Text>

            <div className="space-y-2">
              <Text className="text-xs text-muted-foreground">What can you do?</Text>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Check if the link has expired</li>
                <li>• Make sure you're using the latest email</li>
                <li>• Try signing up again</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleGoToSignup} disabled={isPending} className="w-full">
              Sign Up Again
            </Button>
            <Button
              variant="outline"
              onClick={handleGoToSignin}
              disabled={isPending}
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>

          <div className="text-center">
            <Text className="text-xs text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-link underline">
                Contact Support
              </Link>
            </Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
