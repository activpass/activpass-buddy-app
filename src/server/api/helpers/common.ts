import { createHash, getRandomValues, randomBytes } from 'crypto';
import mongoose from 'mongoose';
/**
 * Generates a random token of the specified length.
 * @param length The length of the token to generate. Defaults to 30.
 * @returns A random token.
 */
export const generateRandomToken = (length: number = 30) => {
  return getRandomValues(new Uint8Array(length)).toString();
};

/**
 * The function `getHashToken` takes a raw token as input and returns its SHA-256 hash in hexadecimal
 * format.
 * @param {string} rawToken - The `rawToken` parameter is a string that represents the input token that
 * you want to hash using the SHA-256 algorithm.
 * @returns The function `getHashToken` is returning a hashed token using the SHA-256 algorithm.
 */
export const getHashToken = (rawToken: string): string => {
  return createHash('sha256').update(rawToken).digest('hex');
};

/**
 * Generates a random alphanumeric string of the specified length.
 *
 * @param length - The length of the string to generate.
 * @returns The randomly generated alphanumeric string.
 */
export const generateRandomAlphanumericString = (length: number) => {
  // Generate random bytes
  const randomBytesBuffer = randomBytes(Math.ceil((length * 3) / 4));
  // Convert the random bytes to a base64 string
  let randomString = randomBytesBuffer.toString('base64');
  // Remove non-alphanumeric characters
  randomString = randomString.replace(/[^a-zA-Z0-9]/g, '');
  // Ensure the string is of the desired length
  return randomString.slice(0, length);
};

/**
 * Generates a client code.
 * @returns The generated client code.
 */
export const generateClientCode = () => {
  return `APC-${generateRandomAlphanumericString(6)}`;
};

/**
 * Generates an employee code.
 * @returns The generated employee code.
 */
export const generateEmployeeCode = () => {
  return `APE-${generateRandomAlphanumericString(6)}`;
};

/**
 * Generates a hexadecimal string representation of a Mongoose ObjectId.
 *
 * @param objId - Optional string representing the ObjectId.
 * @returns A hexadecimal string representation of the ObjectId.
 */
export const generateMongooseObjectId = (objId?: string) => {
  return new mongoose.Types.ObjectId(objId);
};
