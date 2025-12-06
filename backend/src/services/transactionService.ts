import { PrismaClient, TransactionStatus } from '@prisma/client';
import { getAdapter } from './paymentAdapters';

const prisma = new PrismaClient();

export async function createTransaction(payload: {
  amount: number;
  gateway: string;
  reference: string;
  metadata?: any;
}) {
  const { amount, gateway, reference, metadata } = payload;

  // create DB record
  const tx = await prisma.transaction.create({
    data: {
      reference,
      amount,
      gateway,
      status: TransactionStatus.PENDING,
      metadata: metadata || {}
    }
  });

  // call gateway adapter
  const adapter = getAdapter(gateway);
  const result = await adapter.createPayment({ amount, reference, metadata });

  // persist provider response snapshot
  await prisma.transaction.update({ where: { id: tx.id }, data: { providerResponse: result as any } });

  // create a log
  await prisma.transactionLog.create({ data: { transactionId: tx.id, message: 'Payment created' } });

  // return combined info for frontend
  return { tx, result };
}

export async function listTransactions() {
  return prisma.transaction.findMany({ orderBy: { createdAt: 'desc' }, include: { logs: true } });
}

export async function handleWebhook(payload: any) {
  // provider webhook payload should contain reference and status
  const { reference, status, provider } = payload;
  const tx = await prisma.transaction.findUnique({ where: { reference } });
  if (!tx) throw new Error('transaction not found');

  let newStatus = TransactionStatus.FAILED;
  if (status === 'PAID' || status === 'SUCCESS') newStatus = TransactionStatus.SUCCESS;
  if (status === 'PENDING') newStatus = TransactionStatus.PROCESSING;

  await prisma.transaction.update({ where: { id: tx.id }, data: { status: newStatus, providerResponse: payload } });
  await prisma.transactionLog.create({ data: { transactionId: tx.id, message: `Webhook update: ${status} from ${provider || 'unknown'}` } });
}
