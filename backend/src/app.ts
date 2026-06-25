import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './config/cors';
import routes from './routes/routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests' },
  })
);

app.use('/api', routes);

app.use(errorHandler);

export default app;
