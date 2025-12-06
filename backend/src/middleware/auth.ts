import { Request, Response, NextFunction } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.header('x-admin-key') || req.query.api_key;
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || key !== expected) return res.status(401).json({ ok: false, message: 'unauthorized' });
  next();
}
