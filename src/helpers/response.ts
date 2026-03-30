import type { Response } from 'express';
import logger from './logger';

export const successResponse = (res: Response, data?: object) => {
  res.status(200).json({ message: 'Success', ...data });
};

export const createdResponse = (res: Response, data?: object) => {
  res.status(200).json({ message: 'Success', ...data });
};

export const notFoundResponse = (res: Response) => {
  res.status(404).json({ message: 'Not Found' });
};

export const badRequestResponse = (res: Response, message: string) => {
  res.status(400).json({ message });
};

export const errorResponse = (res: Response, error: any) => {
    logger.error(error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
};