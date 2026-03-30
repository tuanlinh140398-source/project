import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import logger from './helpers/logger';

dotenv.config();

const app = new Hono();

app.use('*', honoLogger());

app.use('*', async (c, next) => {
  logger.info(`${c.req.method} ${c.req.url}`);
  await next();
});

app.route('/auth', authRoutes);
app.route('/api', userRoutes);



export default app;