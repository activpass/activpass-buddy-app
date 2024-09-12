'use client';

import { useClipboard } from '@paalan/react-hooks';
import { Button, toast } from '@paalan/react-ui';
import { type FC, useEffect } from 'react';

import { api } from '@/trpc/client';

export const AddClientClipboardButton: FC = () => {
  const { copy, error: clipboardError } = useClipboard();

  const generateOnboardingLinkMutation = api.clients.generateOnboardingLink.useMutation({
    onSuccess: data => {
      copy(`${window.location.origin}/onboarding-client?token=${data.token}`);
      toast.success('Generated Link Copied to clipboard');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (clipboardError) {
      toast.error('Failed to copy to clipboard');
    }
  }, [clipboardError]);

  const onClick = () => {
    generateOnboardingLinkMutation.mutate();
  };

  return (
    <Button
      onClick={onClick}
      variant="outline"
      color="blue"
      isLoading={generateOnboardingLinkMutation.isPending}
      loadingText="Generating Link..."
    >
      Copy Link to Clipboard
    </Button>
  );
};
