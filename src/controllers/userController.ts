import type { Request, Response } from 'express';
import { successResponse, createdResponse, notFoundResponse, badRequestResponse, errorResponse } from '../helpers/response';
import { findById, query } from '../helpers/db';
import logger from '../helpers/logger';

export const createUser = async (req: Request, res: Response) => {
  const { username, birthday, identity_number, email, phone_number } = req.body;

  try {
    const existingIdentity = await query(
      'SELECT * FROM users WHERE identity_number = $1',
      [identity_number]
    );

    if (existingIdentity.length > 0) {
      logger.warn(`CCCD đã tồn tại: ${identity_number}`);
      return badRequestResponse(res, 'Số CMND đã tồn tại!');
    }
    const existingEmail = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingEmail.length > 0) {
      logger.warn(`Email đã tồn tại: ${email}`);
      return badRequestResponse(res, 'Email tồn tại'); 
    }
    
    const result = await query(
      `INSERT INTO users (username, birthday, identity_number, email, phone_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, birthday, identity_number, email, phone_number]
    );

    createdResponse(res, {
      user_id: result[0].id
    });

  } catch (error) {
    errorResponse(res, error);
  }
};
export const getUser = async (req: Request, res: Response) => {
  const  id  = Number(req.params.id);

  try {
    const user = await findById('users', id);
    if (!user) {
      logger.warn(`user ${id} not found`);
      return notFoundResponse(res);
    }
    successResponse(res, { user });
  } catch (error) {
    errorResponse(res, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id  = Number(req.params.id);
  const { phone_number, birthday } = req.body;

  try {
    const user = await findById('users', id);
    if (!user) {
    logger.warn(`user ${id} not found`);
    return notFoundResponse(res);
    }

    if (user.phone_number === phone_number && 
        String(user.birthday).slice(0, 10) === birthday) {
          logger.warn('No changes detected');
          return badRequestResponse(res, 'No changes detected');
      
    }
    const result = await query(
      `UPDATE users 
       SET phone_number = COALESCE($1, phone_number),
           birthday = COALESCE($2, birthday),
           updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [phone_number, birthday, id]
    );

    if (result.length === 0) return notFoundResponse(res);
    successResponse(res);

  } catch (error) {
    errorResponse(res, error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id  = Number(req.params.id);
  try {
    const user = await findById('users', id);
    if (!user) {
      logger.warn(`user ${id} not found`);
      return notFoundResponse(res);
    }
    await query('DELETE FROM users WHERE id = $1',
    [id]
  );
  successResponse(res);
    

  } catch (error) {
    errorResponse(res, error);
  }
};