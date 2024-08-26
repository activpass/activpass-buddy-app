'use client';

import { cn } from '@paalan/react-shared/lib';
import { buttonVariants } from '@paalan/react-ui';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';

import Link from '@/components/Link';

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    href: string;
    title: string;
  }[];
};

export const SidebarNav: FC<SidebarNavProps> = ({ className, items, ...props }) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
