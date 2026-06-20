import { Avatar, IconButton } from '@paalan/react-ui';
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef } from 'react';
import { FaCamera, FaRegUser, FaTrash } from 'react-icons/fa';

import defaultAvatar from '@/public/avatars/no-profile-picture.png';

type AvatarUploadProps = {
  avatarUrl: string;
  onAvatarChange: (file: File) => void;
  onDeleteAvatar: () => void;
};

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  avatarUrl,
  onAvatarChange,
  onDeleteAvatar,
}) => {
  const ref = useRef<React.ElementRef<'input'>>(null);

  useEffect(() => {
    if (!avatarUrl) {
      ref.current!.value = '';
    }
  }, [avatarUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    onAvatarChange(file);
  };

  const onClick = () => {
    ref.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      onClick();
    }
  };

  return (
    <div className="flex flex-col gap-6 p-5 dark:bg-gray-800">
      <div className="relative flex flex-col items-center">
        {/* Avatar and change button */}
        <div
          className="group relative size-48 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={handleKeyDown}
        >
          <Avatar
            src={avatarUrl || defaultAvatar.src}
            fallback={<FaRegUser className="size-24 text-muted" />}
            className="size-full rounded-full"
          />

          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-800/75 opacity-0 transition-opacity hover:opacity-100">
            <IconButton
              aria-label="Change Avatar"
              icon={<FaCamera className="size-5 text-white" />}
            />
          </div>
        </div>

        {/* Delete button */}
        {onDeleteAvatar && avatarUrl && (
          <div className="absolute bottom-0 right-0 flex items-center justify-center">
            <div className="flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 hover:bg-red-600">
              <IconButton
                aria-label="Delete Avatar"
                icon={<FaTrash className="text-white" />}
                onClick={e => {
                  e.stopPropagation();
                  ref.current!.value = '';
                  onDeleteAvatar();
                }}
              />
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          id="avatar-upload"
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};
