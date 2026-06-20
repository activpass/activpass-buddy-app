'use client';

import { dateIntl } from '@paalan/react-shared/lib';

import { AvatarSection } from '@/components/Common/AvatarSection';
import { api } from '@/trpc/client';
import type { ImageKitFileResponseSchema } from '@/validations/common.validation';

import type { UserData } from '../../types';

type ProfileInfoProps = {
  data: UserData;
};

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ data }) => {
  const updateAvatarMutation = api.users.updateAvatar.useMutation();
  const deleteAvatarMutation = api.users.deleteAvatar.useMutation();

  const onUpdateAvatar = async (avatar: ImageKitFileResponseSchema) => {
    await updateAvatarMutation.mutateAsync({
      avatar,
      id: data.id,
    });
  };

  const onDeleteAvatar = async () => {
    await deleteAvatarMutation.mutateAsync({
      id: data.id,
    });
  };

  // const handleSendMessage = () => {
  //   const phoneNumber = clientData?.phoneNumber;
  //   const message = encodeURIComponent('Hello, I would like to get in touch with you.');

  //   if (phoneNumber) {
  //     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  //   }
  // };

  return (
    <div className="flex flex-col gap-2 p-5 dark:bg-gray-800">
      <AvatarSection
        avatarUrl={data.avatar?.url}
        fileName={data.fullName}
        onUpdate={onUpdateAvatar}
        onDelete={onDeleteAvatar}
      />

      <div className="flex flex-col items-center">
        <h3 className="mb-1 text-xl font-bold">{data?.fullName}</h3>
        <div className="flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
          <h3 className="mr-2">{data?.uniqueCode}</h3>
          <span className="">|</span>
          <p className="ml-2">
            {dateIntl.format(data?.createdAt, {
              dateFormat: 'dd-MM-yyyy',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
