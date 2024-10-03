'use client';

import { useState, useEffect } from 'react';
import { dateIntl } from '@paalan/react-shared/lib';
import { AvatarUpload, Button } from '@paalan/react-ui';
import { FaWhatsapp } from 'react-icons/fa';
import { TrashIcon } from '@paalan/react-icons';
import { useForm } from 'react-hook-form';

type ClientProfileInfoProps = {
  clientData: React.ComponentPropsWithoutRef<typeof Object>['data'];
};

type FormValues = {
  avatar: File | null;
};

export const ClientProfileInfo: React.FC<ClientProfileInfoProps> = ({ clientData }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      avatar: null,
    },
  });

  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const avatar = form.watch('avatar');

  useEffect(() => {
    const url = avatar ? URL.createObjectURL(avatar) : '/avatars/avatar-1.jpg';
    setAvatarUrl(url);
    return () => {
      if (avatar) URL.revokeObjectURL(url);
    };
  }, [avatar]);

  const onAvatarChange = (file: File) => {
    form.setValue('avatar', file || null);
  };

  // const handleSendMessage = () => {
  //   const phoneNumber = clientData?.phoneNumber;
  //   const message = encodeURIComponent('Hello, I would like to get in touch with you.');

  //   if (phoneNumber) {
  //     window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  //   }
  // };

  return (
    <div className="flex flex-col gap-6 p-5 dark:bg-gray-800">
      <div className="group relative flex flex-col items-center gap-4 self-center">
        <AvatarUpload
          src={avatarUrl}
          onAvatarChange={onAvatarChange}
          inputProps={{
            value: '',
          }}
        />
        {avatarUrl && (
          <Button
            type="button"
            variant="surface"
            color="danger"
            size="sm"
            leftIcon={<TrashIcon boxSize="4" />}
            onClick={() => form.setValue('avatar', null)}
          >
            Remove
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <h3 className="mb-1 text-xl font-bold">{clientData?.fullName}</h3>
        <div className="flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
          <h3 className="mr-2">{clientData?.clientCode}</h3>
          <span className="">|</span>
          <p className="ml-2">{dateIntl.format(clientData?.createdAt)}</p>
        </div>
        <Button color="green" className="mt-3">
          Send Message
          <FaWhatsapp className="mr-2 size-5" />
        </Button>
      </div>
    </div>
  );
};
