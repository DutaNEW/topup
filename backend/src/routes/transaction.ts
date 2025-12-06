import express from 'express';
import { body, validationResult } from 'express-validator';
import { createTransaction, listTransactions } from '../services/transactionService';

const router = express.Router();

router.post(
  '/create',
  body('amount').isInt({ min: 100 }),
  body('gateway').isString().notEmpty(),
  body('reference').isString().notEmpty(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { amount, gateway, reference, metadata } = req.body;
      const tx = await createTransaction({ amount, gateway, reference, metadata });
      res.json(tx);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/', async (req, res, next) => {
  try {
    const rows = await listTransactions();
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
