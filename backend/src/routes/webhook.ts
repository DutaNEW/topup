import express from 'express';
import { verifyWebhookSignature } from '../utils/signature';
import { handleWebhook } from '../services/transactionService';

export const paymentWebhookRouter = express.Router();

paymentWebhookRouter.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const sig = req.header('x-signature') || req.header('x-callback-signature') || '';
  const secret = process.env.WEBHOOK_SECRET || '';
  const body = req.body;

  const ok = verifyWebhookSignature(body, sig, secret);
  if (!ok) return res.status(401).json({ ok: false, message: 'invalid signature' });

  try {
    const payload = JSON.parse(body.toString());
    await handleWebhook(payload);
    res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('webhook handler error', err);
    res.status(500).json({ ok: false });
  }
});

export default paymentWebhookRouter;
