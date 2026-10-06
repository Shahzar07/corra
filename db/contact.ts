import { neon } from '@neondatabase/serverless';

export type ContactMessage = { name: string; email: string; topic: string; message: string };

export async function saveContactMessage({ name, email, topic, message }: ContactMessage) {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('The contact inbox is unavailable.');
  const sql = neon(url);
  await sql`INSERT INTO contact_messages (id, name, email, topic, message, created_at)
            VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${topic}, ${message}, ${new Date().toISOString()})`;
}
