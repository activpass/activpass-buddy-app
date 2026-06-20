import { TrashIcon, UploadIcon } from '@paalan/react-icons';
import { AlertDialog, Button, HStack, toast } from '@paalan/react-ui';
import { type FC, useEffect, useState } from 'react';

import { uploadToImagekit } from '@/lib/imagekit';
import { avatarSchema } from '@/validations/avatar.validation';
import type { ImageKitFileResponseSchema } from '@/validations/common.validation';

import { AvatarUpload } from '../AvatarUpload';

type AvatarSectionProps = {
  avatarUrl?: string;
  fileName?: string;
  onUpdate: (avatar: ImageKitFileResponseSchema) => Promise<void>;
  onDelete: () => Promise<void>;
};
export const AvatarSection: FC<AvatarSectionProps> = ({
  onUpdate,
  onDelete,
  avatarUrl: avatarUrlValue,
  fileName,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(avatarUrlValue || '');
  const [previousAvatarUrl, setPreviousAvatarUrl] = useState(avatarUrl);
  const isAvatarUrlChanged = avatarUrl ? avatarUrl !== previousAvatarUrl : false;

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  useEffect(() => {
    if (!avatarUrlValue) return;
    setAvatarUrl(avatarUrlValue);
  }, [avatarUrlValue]);

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

  const onUploadAvatar = async () => {
    try {
      setIsSavingAvatar(true);
      const file = await fetch(avatarUrl).then(res => res.blob());
      const response = await uploadToImagekit({
        file,
        fileName: `avatar_${fileName || 'user'}_${Date.now()}`,
      });

      const newAvatarUrl = response.url;

      await onUpdate(response);
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

  const onDeleteAvatar = async () => {
    try {
      setIsDeletingAvatar(true);
      await onDelete();

      setAvatarUrl('');
      setPreviousAvatarUrl('');
      setOpenDeleteDialog(false);
      toast.success('Avatar deleted successfully');
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    } finally {
      setIsDeletingAvatar(false);
    }
  };

  return (
    <div className="group relative flex flex-col items-center self-center">
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
              disabled: isDeletingAvatar,
            }}
            cancelButtonText="No"
            onCancel={() => setOpenDeleteDialog(false)}
            confirmButtonText={isDeletingAvatar ? 'Deleting...' : 'Yes'}
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
                Upload
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
            onConfirm={onUploadAvatar}
          />
        )}
      </HStack>
    </div>
  );
};
