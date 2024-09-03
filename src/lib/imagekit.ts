import type {
  ImageKitOptions,
  UploadOptions,
  UploadResponse,
} from 'imagekit-javascript/dist/src/interfaces';
import { ImageKitClient } from 'imagekitio-next';

import { env } from '@/env';

const authenticationEndpoint = '/api/imagekit/auth';
const imageKit = new ImageKitClient({
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  transformationPosition: 'query',
});

export const imageKitAuthenticator = async () => {
  try {
    const response = await fetch(authenticationEndpoint);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      signature: string;
      expire: number;
      token: string;
    };
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    const err = error as Error;
    throw new Error(`Authentication request failed: ${err.message}`);
  }
};

export const uploadToImagekit = async (
  uploadOptions: Partial<UploadOptions> & {
    file: UploadOptions['file'];
    fileName: UploadOptions['fileName'];
  },
  options?: Partial<ImageKitOptions>
) => {
  const authTokenData = await imageKitAuthenticator();
  return new Promise<UploadResponse>((resolve, reject) => {
    imageKit.upload(
      { ...uploadOptions, ...authTokenData },
      (err, response) => {
        if (err) {
          return reject(err);
        }
        if (!response) {
          return reject(new Error('Failed to upload'));
        }
        return resolve(response);
      },
      options
    );
  });
};
