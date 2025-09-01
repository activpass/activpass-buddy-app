import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardContent, Checkbox, Heading, Text, toast } from '@paalan/react-ui';
import { signIn } from 'next-auth/react';
import { type FC, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRouter } from '@/lib/navigation';

const completionSchema = z.object({
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions to continue',
  }),
});

type CompletionSchema = z.infer<typeof completionSchema>;

type OnboardingCompletionFormProps = {
  loginToken: string;
};
export const OnboardingCompletionForm: FC<OnboardingCompletionFormProps> = ({ loginToken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const form = useForm<CompletionSchema>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const isTermsAccepted = form.watch('acceptTerms');

  const handleTermsChange = (checked: boolean) => {
    form.setValue('acceptTerms', checked);
  };

  const handleSubmit = async () => {
    if (!isTermsAccepted) return;

    try {
      setIsLoading(true);
      // Sign in the user with the login token
      const response = await signIn('credentials', {
        loginToken,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (response?.error) {
        throw new Error(response.error || 'Failed to sign in');
      }

      startTransition(() => {
        if (response?.url) {
          router.push(response.url);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to complete onboarding');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative border-b border-border shadow-lg">
      <CardContent className="px-6 py-8">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="flex size-20 items-center justify-center rounded-lg p-2">
              <svg
                width="42"
                height="44"
                viewBox="0 0 42 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-10"
              >
                <path
                  d="M20.9999 2L26.2532 5.83204L32.7556 5.81966L34.7532 12.0077L40.021 15.8197L37.9999 22L40.021 28.1803L34.7532 31.9923L32.7556 38.1803L26.2532 38.168L20.9999 42L15.7466 38.168L9.24419 38.1803L7.24659 31.9923L1.97876 28.1803L3.99989 22L1.97876 15.8197L7.24659 12.0077L9.24419 5.81966L15.7466 5.83204L20.9999 2Z"
                  fill="#008A2E"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.0002 22L19.0002 27L29.0002 17"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <Heading as="h1" className="mb-4 text-3xl font-medium text-black">
              Welcome
            </Heading>

            <div className="space-y-1">
              {isTermsAccepted ? (
                <Text className="text-2xl font-medium text-black">
                  We have now have everything.
                </Text>
              ) : (
                <>
                  <Text className="text-2xl font-medium text-black">Onboarding completed.</Text>
                  <Text className="text-2xl font-medium text-black">
                    We have now have everything.
                  </Text>
                </>
              )}
            </div>
          </div>

          {/* Dashboard Button */}
          <div className="mb-16">
            <Button
              variant="solid"
              isLoading={isLoading || isPending}
              disabled={!isTermsAccepted}
              onClick={handleSubmit}
              className="h-10 px-6"
            >
              Let's go to Dashboard
            </Button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="acceptTerms"
              checked={isTermsAccepted}
              onCheckedChange={handleTermsChange}
              className="size-4"
              label="Accept terms and conditions"
              labelClassName="cursor-pointer text-sm font-medium text-foreground"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
