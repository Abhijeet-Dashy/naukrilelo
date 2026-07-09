import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { apiLimiter } from './middlewares/rateLimiter';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use('/api/', apiLimiter);

// General Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
