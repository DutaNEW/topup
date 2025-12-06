Top-up Backend

Quickstart

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Generate Prisma client and migrate (you need a running Postgres):

```bash
npx prisma generate
# create DB and run migrations as needed
```

4. Run dev server:

```bash
npm run dev
```

Endpoints

- POST `/sync/products` - fetch products from external provider and store snapshot (fallback to cache if provider down)
- POST `/api/transaction/create` - create a transaction and invoke payment adapter
- GET `/api/transaction/` - list transactions
- POST `/api/payment/webhook` - webhook endpoint (requires signature verification)
- Admin: GET `/admin/logs` and POST `/admin/retry/:txId` (protected by `x-admin-key` header)

Testing

```bash
npm test
```

Notes

- Payment adapters for Midtrans/Xendit are pseudocode and must be implemented with real SDK/API calls and proper secret handling.
- Webhook signature verification uses HMAC-SHA256; make sure provider uses compatible scheme.
