import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  topic: z.enum(['Product question', 'The Corra app', 'Partnerships', 'General inquiry']),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(200).optional().default(''),
  consent: z.literal(true),
});
