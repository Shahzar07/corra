import { contactSchema } from '@/lib/contact-validation';
import { saveContactMessage } from '@/db/contact';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: 'Please send your message from the Corra website.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Please use the contact form.' }, { status: 415 });
  }
  if (Number(request.headers.get('content-length')) > 12000) {
    return Response.json({ error: 'Please keep your message under 3,000 characters.' }, { status: 413 });
  }
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 12000) return Response.json({ error: 'Your message is too long.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Please check your message and try again.' }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Please enter your name, a valid email and a message of 10–3,000 characters, and agree to inquiry storage.' }, { status: 400 });
  if (parsed.data.website) return Response.json({ error: 'Your message could not be saved.' }, { status: 400 });
  const { name, email, topic, message } = parsed.data;
  try {
    await saveContactMessage({ name, email: email.toLowerCase(), topic, message });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: 'Your message could not be saved. Please try again.' }, { status: 503 });
  }
}
