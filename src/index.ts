import express, { Request, Response, NextFunction } from 'express';
import { CloudflareEnv } from './types/index.js';
import { createRegistrationRouter } from './routes/registrationRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware for JSON parsing
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body'
    });
  } else {
    next();
  }
});

// API Routes
const apiRouter = express.Router();
apiRouter.use('/api', createRegistrationRouter());
app.use(apiRouter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

export default app;