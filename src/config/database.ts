import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

pool.connect((err) => {
  if (err) {
    console.error('Kết nối DB thất bại:', err);
  } else {
    console.log('Kết nối DB thành công!');
  }
});

export default pool;