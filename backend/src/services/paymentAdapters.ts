/*
  Payment adapters interface and example adapters (pseudocode for real providers)
*/

export type PaymentResult =
  | { type: 'redirect'; url: string }
  | { type: 'qris'; imageUrl?: string; imageData?: string }
  | { type: 'error'; message: string };

export interface PaymentAdapter {
  createPayment(payload: { amount: number; reference: string; metadata?: any }): Promise<PaymentResult>;
}

// Midtrans adapter (pseudocode)
export class MidtransAdapter implements PaymentAdapter {
  async createPayment({ amount, reference }: { amount: number; reference: string }) {
    // Pseudocode: Call Midtrans charge API with server key and return redirect url
    // const resp = await axios.post('https://api.midtrans.com/v2/charge', {...}, { headers: { Authorization: `Basic ${base64(serverKey)}` } })
    // return { type: 'redirect', url: resp.data.redirect_url }
    return { type: 'redirect', url: `https://midtrans.example/checkout/${reference}` };
  }
}

// Xendit adapter (pseudocode)
export class XenditAdapter implements PaymentAdapter {
  async createPayment({ amount, reference }: { amount: number; reference: string }) {
    // Pseudocode: Create invoice via Xendit API
    // return { type: 'redirect', url: invoice.invoice_url }
    return { type: 'redirect', url: `https://xendit.example/invoice/${reference}` };
  }
}

// QRIS adapter returns image (base64 or URL)
export class QRISAdapter implements PaymentAdapter {
  async createPayment({ amount, reference }: { amount: number; reference: string }) {
    // Pseudocode: Generate QR code for amount + reference using provider, or local generator.
    // Could return data:image/png;base64,... or a hosted URL
    const dummyImageUrl = `https://qris.example/qr/${reference}.png`;
    return { type: 'qris', imageUrl: dummyImageUrl };
  }
}

export function getAdapter(name: string): PaymentAdapter {
  const map: Record<string, any> = {
    midtrans: MidtransAdapter,
    xendit: XenditAdapter,
    qris: QRISAdapter
  };
  const A = map[name.toLowerCase()];
  if (!A) throw new Error('Unsupported gateway');
  return new A();
}
