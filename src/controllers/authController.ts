import type { Context } from 'hono';
import { sign, verify } from 'hono/jwt';
import crypto from 'crypto';
import { successResponse, errorResponse, badRequestResponse } from '../helpers/response';
import logger from '../helpers/logger';

export const generateToken = async (c: Context) => {
  try {
    const { client_id, client_secret } = await c.req.json();

    if (client_id !== process.env.CLIENT_ID || client_secret !== process.env.CLIENT_SECRET) {
      logger.warn(`Invalid credentials: ${client_id}`);
      return badRequestResponse(c, 'Invalid credentials');
    }

    const accessToken = await sign(
      { client_id, jti: crypto.randomUUID(), exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      process.env.JWT_SECRET as string, 'HS256'
    );
    const refreshToken = await sign(
      { client_id, jti: crypto.randomUUID(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
      process.env.JWT_REFRESH_SECRET as string, 'HS256'
    );

    return successResponse(c, {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '1h'
    });

  } catch (error) {
    return errorResponse(c, error);
  }
};

export const refreshToken = async (c: Context) => {
  try {
    const { refresh_token } = await c.req.json();

    if (!refresh_token) {
      return badRequestResponse(c, 'Refresh token is required');
    }

    const decoded = await verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { client_id: string };

    const accessToken = await sign(
      { client_id: decoded.client_id, jti: crypto.randomUUID(), exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      process.env.JWT_SECRET as string, 'HS256'
    );

    return successResponse(c, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '1h'
    });

  } catch (error) {
    logger.warn('Invalid or expired refresh token');
    return c.json({ message: 'Refresh token invalid or expired' }, 403);
  }
};