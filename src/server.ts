import { serve } from '@hono/node-server';
import app from './index';
import logger from './helpers/logger';

const PORT = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port: PORT });
logger.info(`Server đang chạy tại http://localhost:${PORT}`);