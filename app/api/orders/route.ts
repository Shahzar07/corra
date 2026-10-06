import { orderSchema } from '@/lib/order-validation';
import { priceCart } from '@/lib/pricing';
import { saveOrder } from '@/db/orders';

const REFERENCE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
function orderReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `CR-${Array.from(bytes, (b) => REFERENCE_ALPHABET[b % 32]).join('')}`;
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Please place your order from the Corra website.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Please use the checkout form.' }, { status: 415 });
  }
  if (Number(request.headers.get('content-length')) > 12000) {
    return Response.json({ error: 'Your order details are too long.' }, { status: 413 });
  }
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return Response.json({ error: 'Your order details are too long.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Please check your details and try again.' }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Please check your contact details, a UK delivery address and postcode, and agree to order storage.' }, { status: 400 });
  const input = parsed.data;
  if (input.website) return Response.json({ error: 'Your order could not be placed.' }, { status: 400 });

  // Recompute from the catalogue so the stored order never trusts client prices.
  const priced = priceCart(input.items, input.deliveryMethod);
  if (priced.items.length === 0) return Response.json({ error: 'Your cart is empty.' }, { status: 400 });
  if (priced.totalPence !== input.expectedTotalPence) {
    return Response.json({ error: 'Prices have changed since you opened checkout. Please review your cart and try again.' }, { status: 409 });
  }

  const reference = orderReference();
  try {
    await saveOrder({
      reference,
      email: input.email.toLowerCase(),
      name: `${input.firstName} ${input.lastName}`,
      phone: input.phone,
      address: { line1: input.address1, line2: input.address2, city: input.city, postcode: input.postcode.toUpperCase(), country: 'United Kingdom' },
      deliveryMethod: input.deliveryMethod,
      items: priced.items.map(({ product, quantity, lineTotalPence }) => ({ id: product.id, name: product.name, quantity, unitPricePence: product.pricePence, lineTotalPence })),
      subtotalPence: priced.subtotalPence,
      deliveryPence: priced.deliveryPence,
      totalPence: priced.totalPence,
      notes: input.notes,
    });
    return Response.json({ reference }, { status: 201 });
  } catch {
    return Response.json({ error: 'We couldn’t place your order right now. Please try again shortly.' }, { status: 503 });
  }
}
