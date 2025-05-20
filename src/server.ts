import process from 'node:process';
import consola from 'consola';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { mw as requestIp } from 'request-ip';
import { logger } from './utils/logger';
import { handle404Error, handleError } from '@/utils/errors';
import routes from '@/routes/routes';
import './utils/env';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests.',
      });
    },
  }),
);

app.use(logger);

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the Saikrisna BoilerPlate!',
  });
});

app.get('/healthcheck', (_req, res) => {
  res.json({
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/api', routes);

app.all('*', handle404Error);

app.use(handleError);

app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
