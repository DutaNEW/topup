import request from 'supertest';
import { app } from '../app';

jest.mock('../services/paymentAdapters', () => ({
  getAdapter: (name: string) => ({
    createPayment: jest.fn(async ({ amount, reference }: any) => ({ type: 'redirect', url: `https://mockpay/${reference}` }))
  })
}));

describe('POST /api/transaction/create', () => {
  it('creates a transaction and returns adapter result', async () => {
    const payload = { amount: 1000, gateway: 'midtrans', reference: 'ref-123' };
    const res = await request(app).post('/api/transaction/create').send(payload).set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.tx).toBeDefined();
    expect(res.body.result).toBeDefined();
    expect(res.body.result.url).toContain('ref-123');
  });
});
