'use client';

import { TrashIcon, UploadIcon } from '@paalan/react-icons';
import { dateIntl } from '@paalan/react-shared/lib';
import { AlertDialog, Button, HStack, toast } from '@paalan/react-ui';
import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

import { uploadToImagekit } from '@/lib/imagekit';
import { api } from '@/trpc/client';
import type { RouterOutputs } from '@/trpc/shared';
import { avatarSchema } from '@/validations/client/add-form.validation';
import { AvatarUpload } from '../AvatarUpload';
type ClientProfileInfoProps = {
  clientData: RouterOutputs['clients']['get'];
};

export const ClientProfileInfo: React.FC<ClientProfileInfoProps> = ({ clientData }) => {
  const [avatarUrl, setAvatarUrl] = useState(clientData.avatar?.url || '');
  const [previousAvatarUrl, setPreviousAvatarUrl] = useState(avatarUrl);
  const isAvatarUrlChanged = avatarUrl ? avatarUrl !== previousAvatarUrl : false;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  const updateAvatarMutation = api.clients.updateAvatar.useMutation();
  const deleteAvatarMutation = api.clients.deleteAvatar.useMutation({
    onSuccess: () => {
      setAvatarUrl('');
      setOpenDeleteDialog(false);
      toast.success('Avatar deleted successfully');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!clientData.avatar) return;
    setAvatarUrl(clientData.avatar?.url || '');
  }, [clientData.avatar]);

  const onAvatarChange = (file: File) => {
    const parse = avatarSchema.safeParse(file);
    if (!parse.success) {
      toast.error(parse.error.errors?.[0]?.message);
    } else {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setPreviousAvatarUrl(avatarUrl);
    }
  };

  const onDeleteAvatar = () => {
    deleteAvatarMutation.mutate({
      clientId: clientData.id,
    });
  };

  const onChangeAvatar = async () => {
    try {
      setIsSavingAvatar(true);
      const file = await fetch(avatarUrl).then(res => res.blob());
      const response = await uploadToImagekit({
        file,
        fileName: `avatar_${clientData.fullName}`,
      });

      const newAvatarUrl = response.url;

      await updateAvatarMutation.mutateAsync({
        clientId: clientData.id,
        avatar: response,
      });
      setAvatarUrl(newAvatarUrl);
      setPreviousAvatarUrl(newAvatarUrl);
      setOpenSaveDialog(false);
      toast.success('Avatar updated successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsSavingAvatar(false);
    }
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
        {/* <AvatarUpload
          src={avatarUrl}
          onAvatarChange={onAvatarChange}
          inputProps={{
            value: '',
          }}
        /> */}
        <AvatarUpload
          avatarUrl={avatarUrl}
          onAvatarChange={onAvatarChange}
          onDeleteAvatar={() => setOpenDeleteDialog(true)}
        />
        <HStack>
          {avatarUrl && (
            <AlertDialog
              open={openDeleteDialog}
              trigger={
                <Button
                  type="button"
                  variant="surface"
                  color="danger"
                  size="sm"
                  className="hidden"
                  leftIcon={<TrashIcon boxSize="4" />}
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  Delete
                </Button>
              }
              header={{
                title: 'Delete Avatar',
                description: 'Are you sure you want to delete this avatar?',
              }}
              confirmButtonProps={{
                variant: 'danger',
                disabled: deleteAvatarMutation.isPending,
              }}
              cancelButtonText="No"
              onCancel={() => setOpenDeleteDialog(false)}
              confirmButtonText={deleteAvatarMutation.isPending ? 'Deleting...' : 'Yes'}
              onConfirm={onDeleteAvatar}
            />
          )}

          {isAvatarUrlChanged && (
            <AlertDialog
              open={openSaveDialog}
              trigger={
                <Button
                  type="button"
                  variant="surface"
                  color="primary"
                  size="sm"
                  leftIcon={<UploadIcon boxSize="4" />}
                  onClick={() => setOpenSaveDialog(true)}
                >
                  Save
                </Button>
              }
              header={{
                title: 'Save Changes',
                description: 'Are you sure you want to save changes?',
              }}
              confirmButtonProps={{
                disabled: isSavingAvatar,
              }}
              cancelButtonText="No"
              onCancel={() => {
                setAvatarUrl(previousAvatarUrl);
                setOpenSaveDialog(false);
              }}
              confirmButtonText={isSavingAvatar ? 'Saving...' : 'Yes'}
              onConfirm={onChangeAvatar}
            />
          )}
        </HStack>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="mb-1 text-xl font-bold">{clientData?.fullName}</h3>
        <div className="flex items-center justify-center text-xs text-gray-700 dark:text-gray-400">
          <h3 className="mr-2">{clientData?.clientCode}</h3>
          <span className="">|</span>
          <p className="ml-2">
            {dateIntl.format(clientData?.createdAt, {
              dateFormat: 'dd-MM-yyyy',
            })}
          </p>
        </div>
        <Button color="green" className="mt-3" disabled>
          Send Message
          <FaWhatsapp className="mr-2 size-5" />
        </Button>
      </div>
    </div>
  );
};
