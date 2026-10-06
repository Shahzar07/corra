import { neon } from '@neondatabase/serverless';

export type OrderRecord = {
  reference: string;
  email: string;
  name: string;
  phone: string;
  address: { line1: string; line2: string; city: string; postcode: string; country: string };
  deliveryMethod: string;
  items: { id: string; name: string; quantity: number; unitPricePence: number; lineTotalPence: number }[];
  subtotalPence: number;
  deliveryPence: number;
  totalPence: number;
  notes: string;
};

export async function saveOrder(order: OrderRecord) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Order storage is unavailable.');
  const sql = neon(url);
  await sql`INSERT INTO orders (reference, email, name, phone, address, delivery_method, items, subtotal_pence, delivery_pence, total_pence, notes, status, created_at)
            VALUES (${order.reference}, ${order.email}, ${order.name}, ${order.phone}, ${JSON.stringify(order.address)}::jsonb, ${order.deliveryMethod},
                    ${JSON.stringify(order.items)}::jsonb, ${order.subtotalPence}, ${order.deliveryPence}, ${order.totalPence}, ${order.notes}, 'requested', ${new Date().toISOString()})`;
}
