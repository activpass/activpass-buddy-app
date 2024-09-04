import crypto from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@/env';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') || crypto.randomUUID();
  const expire = searchParams.get('expire') || (Math.floor(Date.now() / 1000) + 2400).toString();
  const signature = crypto
    .createHmac('sha1', env.IMAGEKIT_PRIVATE_KEY)
    .update(token + expire)
    .digest('hex');

  return NextResponse.json({
    token,
    expire,
    signature,
  });
}
