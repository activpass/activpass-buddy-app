'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { HiArrowPath } from 'react-icons/hi2';

import { usePathname, useRouter } from '@/lib/navigation';
import { useSession } from '@/stores/session-store';

type Props = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectBackUrl = searchParams.get('redirectBackUrl') || '/dashboard';

  useEffect(() => {
    if (pathname === '/signin' && session.status === 'authenticated') {
      router.push(redirectBackUrl);
    }

    if (session.status === 'unauthenticated' && pathname !== '/signin') {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('redirectBackUrl', pathname);
      router.push(`/signin?${urlSearchParams.toString()}`);
    }
  }, [session.status, pathname, router, searchParams, redirectBackUrl]);

  if (
    session.status === 'loading' ||
    (session.status === 'unauthenticated' && pathname !== '/signin')
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <HiArrowPath className="size-6 animate-spin" />
      </div>
    );
  }

  return children;
};
