import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import syncRouter from './routes/sync';
import transactionRouter from './routes/transaction';
import { paymentWebhookRouter } from './routes/webhook';
import adminRouter from './routes/admin';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(json({ limit: '1mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

app.use('/sync', syncRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/payment', paymentWebhookRouter);
app.use('/admin', adminRouter);

app.get('/', (_req, res) => res.json({ status: 'ok' }));

// error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal' });
});
