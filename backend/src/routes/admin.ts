import express from 'express';
import { adminAuth } from '../middleware/auth';
import { retryTransaction, getLogs } from '../services/adminService';

const router = express.Router();

router.use(adminAuth);

router.get('/logs', async (req, res, next) => {
  try {
    const logs = await getLogs();
    res.json({ ok: true, logs });
  } catch (err) {
    next(err);
  }
});

router.post('/retry/:txId', async (req, res, next) => {
  try {
    const txId = Number(req.params.txId);
    await retryTransaction(txId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
