import crypto from 'crypto';

export function verifyWebhookSignature(body: Buffer | string, signature: string, secret: string) {
  if (!secret) return false;
  const payload = typeof body === 'string' ? body : body.toString();
  const computed = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return computed === signature;
}
