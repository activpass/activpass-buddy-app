'use client';

import { SkeletonContainer, toast } from '@paalan/react-ui';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { api } from '@/trpc/client';
import { urlToFile } from '@/utils/helpers';

import { ProfileForm } from './_components/ProfileForm';

const ProfileClientPage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data, isLoading } = api.users.getPopulatedUser.useQuery({
    id: userId || '',
  });
  const [isConverting, setIsConverting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logo = data?.organization?.logo;

  useEffect(() => {
    if (!logo || logoFile) return;

    const convertLogo = async () => {
      try {
        setIsConverting(true);
        const file = await urlToFile(logo.url, logo.name);
        setLogoFile(file);
      } catch (error) {
        toast.error('Failed to load organization logo');
      } finally {
        setIsConverting(false);
      }
    };

    convertLogo();
  }, [logo, logoFile]);

  if (isLoading || (isConverting && logo)) {
    return <SkeletonContainer className="h-12" count={3} />;
  }
  if (!data) return <div>No data found</div>;
  return <ProfileForm data={data} logoFile={logoFile} />;
};

export default ProfileClientPage;
