import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function syncProducts() {
  const providerUrl = process.env.PROVIDER_URL;
  const providerKey = process.env.PROVIDER_API_KEY;

  if (!providerUrl) throw new Error('PROVIDER_URL not set');

  try {
    const resp = await axios.get(providerUrl, {
      headers: { Authorization: `Bearer ${providerKey}` },
      timeout: 5000
    });

    const data = resp.data;
    // save snapshot
    await prisma.productSnapshot.create({ data: { provider: providerUrl, data } });
    return { cached: false, data };
  } catch (err) {
    // fallback to latest snapshot in DB
    const last = await prisma.productSnapshot.findFirst({ orderBy: { fetchedAt: 'desc' } });
    if (!last) throw err;
    return { cached: true, data: last.data };
  }
}
