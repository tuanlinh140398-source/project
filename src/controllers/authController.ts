import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { successResponse, errorResponse, badRequestResponse } from '../helpers/response';
import logger from '../helpers/logger';


export const generateToken = async (req: Request, res: Response) => {
  const { client_id, client_secret } = req.body;

  try {
    if (client_id !== process.env.CLIENT_ID || client_secret !== process.env.CLIENT_SECRET) {
      logger.warn(`Invalid credentials: ${client_id}`);
      return badRequestResponse(res, 'Invalid credentials');
    }

    const accessToken = jwt.sign(
      { client_id, jti: crypto.randomUUID() },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h', algorithm: 'HS512' }
    );
    const refreshToken = jwt.sign(
      { client_id, jti: crypto.randomUUID() },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d', algorithm: 'HS512' }
    );

    successResponse(res, {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '1h'
    });

  } catch (error) {
    errorResponse(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  try {
    if (!refresh_token) {
      return badRequestResponse(res, 'Refresh token is required');
    }

    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { client_id: string };

    const accessToken = jwt.sign(
      { client_id: decoded.client_id, jti: crypto.randomUUID() },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h', algorithm: 'HS512' }
    );

    successResponse(res, {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '1h'
    });

  } catch (error) {
    logger.warn('Invalid or expired refresh token');
    return res.status(403).json({ message: 'Refresh token invalid or expired' });
  }
};