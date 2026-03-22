import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import templatesRoutes from './routes/templates.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import { authMiddleware } from './middleware/auth.middleware.js';
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/templates', authMiddleware, templatesRoutes);
app.use('/api/reports', authMiddleware, reportsRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorMiddleware);

export default app;
