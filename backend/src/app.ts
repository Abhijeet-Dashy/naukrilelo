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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://naukrilelo-beta.vercel.app',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
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
