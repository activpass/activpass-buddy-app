import { toast } from '@paalan/react-ui';

import { uploadToImagekit } from '@/lib/imagekit';
import type { ImageKitFileResponseSchema } from '@/validations/common.validation';

export const uploadProfilePicture = async (
  picture: File | null | undefined
): Promise<ImageKitFileResponseSchema | undefined> => {
  if (!picture) return undefined;
  try {
    const response = await uploadToImagekit({
      file: picture,
      fileName: picture.name,
    });
    return response;
  } catch (error) {
    toast.error('Failed to upload avatar, please try again.');
    return undefined;
  }
};

export const uploadFacilityLogo = async (
  logo: File | null | undefined
): Promise<ImageKitFileResponseSchema | undefined> => {
  if (!logo) return undefined;

  try {
    const response = await uploadToImagekit({
      file: logo,
      fileName: logo.name,
    });
    return response;
  } catch (error) {
    toast.error('Failed to upload business logo, please try again.');
    return undefined;
  }
};
