'use client';

import {
  Avatar,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Flex,
  IconButton,
  SheetContent,
  SheetRoot,
  SheetTrigger,
  Text,
} from '@paalan/react-ui';
import { useSession } from 'next-auth/react';
import type { FC, ReactNode } from 'react';
import { LuUser2 } from 'react-icons/lu';

import { SignOutButton } from '@/components/Auth/SignOutButton';
import ActiveLink from '@/components/Common/ActiveLink';
import ThemeToggle from '@/components/Common/ThemeToggle';
import Link from '@/components/Link';
import { Logo } from '@/components/Logo';

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
  const avatarUrl = user?.avatarUrl;
  const orgId = user?.orgId;

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
    },
    {
      href: '/client',
      label: 'Clients',
    },
    {
      href: '/employee',
      label: 'Employees',
    },
    {
      href: '/membership',
      label: 'Plans',
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
          <IconButton className="shrink-0 rounded-full md:hidden">
            <Avatar
              src={avatarUrl}
              alt={user?.name || 'User'}
              fallback={<LuUser2 className="size-6" />}
            />
            <span className="sr-only">Toggle navigation menu</span>
          </IconButton>
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
      <Flex alignItems="center" className="ml-auto" gap="2">
        <Flex alignItems="center" className="gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <ThemeToggle />
          <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>
              <IconButton>
                <Avatar
                  src={avatarUrl}
                  alt={user?.name || 'User'}
                  fallback={<LuUser2 className="size-6" />}
                />
                <span className="sr-only">Toggle User menu</span>
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <Flex className="flex-col">
                  {user?.name}
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
              {orgId && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>QR Check-in</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/check-in/client?orgId=${orgId}`} target="_blank">
                              Client
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/check-in/employee?orgId=${orgId}`} target="_blank">
                              Employee
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>QR Check-out</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/check-out/client?orgId=${orgId}`} target="_blank">
                              Client
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/check-out/employee?orgId=${orgId}`} target="_blank">
                              Employee
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </Flex>
      </Flex>
    </header>
  );
};
