'use server';

import ImageKit from 'imagekit';

import { env } from '@/env';

export const deleteFileFromImageKit = async (fileId: string) => {
  try {
    const imageKit = new ImageKit({
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });
    await imageKit.deleteFile(fileId);
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to delete file from ImageKit: ${err.message}`);
  }
};
