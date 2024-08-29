'use client';

import {
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Flex,
  IconButton,
  SheetContent,
  SheetRoot,
  SheetTrigger,
  Text,
} from '@paalan/react-ui';
import type { FC, ReactNode } from 'react';
import { LuMenu, LuUserCircle } from 'react-icons/lu';

import { SignOutButton } from '@/components/Auth/SignOutButton';
import ActiveLink from '@/components/Common/ActiveLink';
import ThemeToggle from '@/components/Common/ThemeToggle';
import Link from '@/components/Link';
import { Logo } from '@/components/Logo';
import { useSession } from '@/stores/session-store';

type NavItemProps = {
  href: string;
  label: ReactNode;
};
const NavItem: FC<NavItemProps> = ({ href, label }) => {
  return (
    <ActiveLink
      href={href}
      activeClassName="text-primary"
      allowSubPath={href.startsWith('/')}
      className="text-foreground transition-colors hover:text-primary"
    >
      {label}
    </ActiveLink>
  );
};
export const WithHeader: FC = () => {
  const session = useSession();
  const user = session.data?.user;
  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
    },
    {
      href: '/client',
      label: 'Client',
    },
    {
      href: '/employee',
      label: 'Employee',
    },
    {
      href: '/finance',
      label: 'Finance',
    },
  ];
  return (
    <header className="sticky top-0 z-50 flex h-[4.5rem] items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Logo />
        {navItems.map(item => (
          <NavItem key={item.href} href={item.href} label={item.label} />
        ))}
      </nav>
      <SheetRoot>
        <SheetTrigger asChild>
          <Button variant="outline" size="md" className="shrink-0 md:hidden">
            <LuMenu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Logo />
            {navItems.map(item => (
              <NavItem key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
        </SheetContent>
      </SheetRoot>
      <div className="ml-auto flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeToggle />
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <IconButton className="rounded-full text-xl text-foreground">
              <LuUserCircle className="size-5" />
              <span className="sr-only">Toggle user menu</span>
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <Flex className="flex-col">
                {user?.fullName}
                <Text className="text-sm text-muted-foreground">{user?.email}</Text>
              </Flex>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </header>
  );
};
