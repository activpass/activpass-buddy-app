'use client';

import { Text } from '@paalan/react-ui';
import { useTranslations } from 'next-intl';

import { useSession } from '@/stores/session-store';
import { api } from '@/trpc/client';

export const SignOutButton = () => {
  const t = useTranslations('auth.navbar.links');
  const session = useSession();
  const signOutMutation = api.auth.signOut.useMutation({
    onSuccess() {
      session.update(null);
    },
  });
  return (
    <Text
      onClick={async () => {
        signOutMutation.mutate();
      }}
    >
      {t('signOut')}
    </Text>
  );
};
