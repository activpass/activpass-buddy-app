'use client';

import { Avatar, Button, Heading, IconButton, Separator, Text } from '@paalan/react-ui';
import { Camera } from 'lucide-react';
import type { FC, PropsWithChildren } from 'react';
import { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import { WithBreadcrumbLayout } from '@/components/Hoc/WithBreadcrumbLayout';

import { SidebarNav } from './_components/sidebar-nav';

type ProfileLayoutProps = PropsWithChildren<{
  params: {
    id: string;
  };
}>;

const ProfileLayout: FC<ProfileLayoutProps> = ({ children, params }) => {
  const [avatarSrc, setAvatarSrc] = useState('/avatars/avatar-1.jpg');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sidebarNavItems = [
    {
      title: 'Profile',
      href: `/client/${params.id}`,
    },
    {
      title: 'Membership',
      href: `/client/${params.id}/membership`,
    },
    {
      title: 'Attendance',
      href: `/client/${params.id}/attendance`,
    },
  ];

  return (
    <WithBreadcrumbLayout>
      <div className="space-y-6 pb-16">
        <div className="space-y-0.5">
          <Heading as="h2">Client Profile</Heading>
          <Text className="text-muted-foreground">
            Manage your client profile, membership, and attendance.
          </Text>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 flex flex-col gap-6 lg:w-72">
            <div className="flex flex-col gap-6 p-5 dark:bg-gray-800">
              <div className="group relative self-center">
                <Avatar src={avatarSrc} className="size-48" />
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black opacity-0 transition-opacity group-hover:opacity-100">
                  <IconButton
                    aria-label="Change Avatar"
                    icon={<Camera className="size-6 text-white" />}
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  />
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex flex-col items-center">
                <h3 className="mb-1 text-xl font-bold">Cristiano Ronaldo</h3>
                <div className="flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
                  <h3 className="mr-2">QWE123</h3>
                  <span className="">|</span>
                  <p className="ml-2">2024-02-05</p>
                </div>
                <Button color="green" className="mt-3">
                  {' '}
                  Send Message
                  <FaWhatsapp className="mr-2 size-5" />
                </Button>
              </div>
            </div>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </WithBreadcrumbLayout>
  );
};

export default ProfileLayout;
