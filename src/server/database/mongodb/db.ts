/* eslint-disable no-param-reassign */
import type mongoose from 'mongoose';

import { env } from '@/env';
import { roleRepository } from '@/server/api/routers/role/repository/role.repository';
import { logger } from '@/server/logger';

import { MongoDBConnection } from './db.connection';

const dbConnection = new MongoDBConnection(env.MONGODB_URI);

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = cached;
}

export const mongodbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = new Promise<typeof mongoose>((resolve, reject) => {
      dbConnection.connect(connection => {
        // Initialize default roles for the organization
        roleRepository
          .createSystemRoles()
          .then(result => {
            logger.info('Roles initialization result', { success: result.success });
            resolve(connection);
          })
          .catch(error => {
            logger.error('Failed to initialize default roles', error);
            reject(error);
          });
      }, reject);
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};
