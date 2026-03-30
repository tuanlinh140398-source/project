import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import logger from './helpers/logger';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server đang chạy tại http://localhost:${PORT}`);
});
