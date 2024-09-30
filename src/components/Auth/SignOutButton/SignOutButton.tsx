'use client';

import { Text } from '@paalan/react-ui';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';

export const SignOutButton = forwardRef<HTMLParagraphElement>((props, ref) => {
  const t = useTranslations('auth.navbar.links');

  return (
    <Text
      {...props}
      onClick={async () => {
        await signOut({
          callbackUrl: '/signin',
        });
      }}
      ref={ref}
    >
      {t('signOut')}
    </Text>
  );
});

SignOutButton.displayName = 'SignOutButton';
