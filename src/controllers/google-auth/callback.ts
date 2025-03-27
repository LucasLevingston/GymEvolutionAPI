import { FastifyReply, FastifyRequest } from 'fastify';
import { oauth2Client } from 'lib/oauth2Client';
import { env } from '@/env';
import { callbackGoogleService } from 'services/google-auth/callback';

export async function googleCallbackController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { code, state: userId } = request.query as { code: string; state: string };

  if (!code || !userId) {
    return reply.redirect(`${env.FRONTEND_URL}/connect-google?error=invalid_request`);
  }

  try {
    // Make sure this redirect_uri matches exactly what you used in generateAuthUrl
    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: `${env.BACKEND_URL}/google/callback`,
    });

    oauth2Client.setCredentials(tokens);

    await callbackGoogleService({ userId, tokens });

    reply.redirect(`${env.FRONTEND_URL}/settings/connect-google?success=true`);
  } catch (error) {
    console.error('Google callback error:', error);
    reply.redirect(`${env.FRONTEND_URL}/settings/connect-google?error=auth_failed`);
  }
}
