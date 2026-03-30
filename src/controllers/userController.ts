import type { Context } from 'hono';
import { successResponse, createdResponse, notFoundResponse, badRequestResponse, errorResponse } from '../helpers/response';
import { findById, query } from '../helpers/db';
import logger from '../helpers/logger';

export const createUser = async (c: Context) => {
  try {
    const { username, birthday, identity_number, email, phone_number } = await c.req.json();

    const existingIdentity = await query(
      'SELECT * FROM users WHERE identity_number = $1',
      [identity_number]
    );

    if (existingIdentity.length > 0) {
      logger.warn(`CCCD đã tồn tại: ${identity_number}`);
      return badRequestResponse(c, 'Số CMND đã tồn tại!');
    }

    const existingEmail = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingEmail.length > 0) {
      logger.warn(`Email đã tồn tại: ${email}`);
      return badRequestResponse(c, 'Email tồn tại');
    }

    const result = await query(
      `INSERT INTO users (username, birthday, identity_number, email, phone_number)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [username, birthday, identity_number, email, phone_number]
    );

    return createdResponse(c, { user_id: result[0].id });

  } catch (error) {
    return errorResponse(c, error);
  }
};

export const getUser = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return badRequestResponse(c, 'Invalid ID');

  try {
    const user = await findById('users', id);
    if (!user) {
      logger.warn(`User ${id} not found`);
      return notFoundResponse(c);
    }
    return successResponse(c, { user });
  } catch (error) {
    return errorResponse(c, error);
  }
};

export const updateUser = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return badRequestResponse(c, 'Invalid ID');

  try {
    const { phone_number, birthday } = await c.req.json();

    const user = await findById('users', id);
    if (!user) {
      logger.warn(`User ${id} not found`);
      return notFoundResponse(c);
    }

    if (user.phone_number === phone_number &&
        String(user.birthday).slice(0, 10) === birthday) {
      logger.warn('No changes detected');
      return badRequestResponse(c, 'No changes detected');
    }

    const result = await query(
      `UPDATE users 
       SET phone_number = COALESCE($1, phone_number),
           birthday = COALESCE($2, birthday),
           updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [phone_number, birthday, id]
    );

    if (result.length === 0) return notFoundResponse(c);
    return successResponse(c);

  } catch (error) {
    return errorResponse(c, error);
  }
};

export const deleteUser = async (c: Context) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return badRequestResponse(c, 'Invalid ID');

  try {
    const user = await findById('users', id);
    if (!user) {
      logger.warn(`User ${id} not found`);
      return notFoundResponse(c);
    }

    await query('DELETE FROM users WHERE id = $1', [id]);
    return successResponse(c);

  } catch (error) {
    return errorResponse(c, error);
  }
};