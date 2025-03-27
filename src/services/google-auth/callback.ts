import { prisma } from '@/lib/prisma';
import { Credentials } from 'google-auth-library';
import { ClientError } from 'errors/client-error';

interface CallbackGoogleServiceParams {
  userId: string;
  tokens: Credentials;
}

export async function callbackGoogleService({
  userId,
  tokens,
}: CallbackGoogleServiceParams) {
  try {
    if (!tokens.access_token) {
      throw new ClientError('Invalid tokens received from Google');
    }

    const googleConnection = await prisma.googleConnection.upsert({
      where: {
        userId,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope || null,
        tokenType: tokens.token_type || 'Bearer',
        updatedAt: new Date(),
      },
      create: {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        scope: tokens.scope || null,
        tokenType: tokens.token_type || 'Bearer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return googleConnection;
  } catch (error) {}
}
