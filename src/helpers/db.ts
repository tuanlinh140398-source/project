import pool from '../config/database';

export const findById = async (table: string, id: number) => {
  const result = await pool.query(
    `SELECT * FROM ${table} WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const query = async (sql: string, params?: any[]) => {
  const result = await pool.query(sql, params);
  return result.rows;
};