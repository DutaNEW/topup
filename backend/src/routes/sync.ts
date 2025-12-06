import express from 'express';
import { syncProducts } from '../services/productService';

const router = express.Router();

// POST /sync/products -> fetch products from provider and save snapshot
router.post('/products', async (req, res, next) => {
  try {
    const result = await syncProducts();
    res.json({ ok: true, result });
  } catch (err) {
    next(err);
  }
});

export default router;
