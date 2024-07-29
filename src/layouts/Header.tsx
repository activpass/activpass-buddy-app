'use client';

import {
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  SheetContent,
  SheetRoot,
  SheetTrigger,
} from '@paalan/react-ui';
import { CircleUser, Menu, Package2 } from 'lucide-react';
import Image from 'next/image';
import type { FC } from 'react';

import { SignOutButton } from '@/components/Auth/SignOutButton';
import ActiveLink from '@/components/Common/ActiveLink';
import Link from '@/components/Link';

export const Header: FC = () => {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="contents items-center gap-2 text-lg font-semibold md:text-base">
          <Image
            src="/static/logos/png/activpass-icon-blue.png"
            alt="Activpass"
            width="25"
            height="25"
          />
          <span className="sr-only">Activpass</span>
        </Link>
        <ActiveLink
          href="/dashboard"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Dashboard
        </ActiveLink>
        <ActiveLink
          href="/client"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Client
        </ActiveLink>
        <ActiveLink
          href="/employee"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Employee
        </ActiveLink>
        <ActiveLink
          href="/finance"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Finance
        </ActiveLink>
        <ActiveLink
          href="/subscription"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Subscription
        </ActiveLink>
      </nav>
      <SheetRoot>
        <SheetTrigger asChild>
          <Button variant="outline" size="md" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="size-6" />
              <span className="sr-only">Activpass</span>
            </Link>
            <ActiveLink href="/dashboard" className="hover:text-foreground">
              Dashboard
            </ActiveLink>
            <ActiveLink href="/client" className="text-muted-foreground hover:text-foreground">
              Client
            </ActiveLink>
            <ActiveLink href="/employee" className="text-muted-foreground hover:text-foreground">
              Employee
            </ActiveLink>
            <ActiveLink href="/finance" className="text-muted-foreground hover:text-foreground">
              Finance
            </ActiveLink>
            <ActiveLink
              href="/subscription"
              className="text-muted-foreground hover:text-foreground"
            >
              Subscription
            </ActiveLink>
          </nav>
        </SheetContent>
      </SheetRoot>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <IconButton className="ml-auto rounded-full border text-xl text-foreground">
              <CircleUser className="size-5" />
              <span className="sr-only">Toggle user menu</span>
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </header>
  );
};
