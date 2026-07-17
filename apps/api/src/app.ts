import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
// @ts-expect-error: xss-clean does not have type definitions
import xss from 'xss-clean';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import healthRoutes from './routes/v1/health.route';

const app = express();

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(xss());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Logging and Compression
app.use(morgan('dev'));
app.use(compression());

// Body & Cookie Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Routes
app.use('/api/v1/health', healthRoutes);

// Catch 404
app.use('*', notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
