import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getLogs() {
  return prisma.transactionLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
}

export async function retryTransaction(txId: number) {
  const tx = await prisma.transaction.findUnique({ where: { id: txId } });
  if (!tx) throw new Error('tx not found');
  // naive retry: change status to PENDING and create a log. Real logic should re-invoke adapter.
  await prisma.transaction.update({ where: { id: txId }, data: { status: 'PENDING' } as any });
  await prisma.transactionLog.create({ data: { transactionId: txId, message: 'Admin retry requested' } });
}
