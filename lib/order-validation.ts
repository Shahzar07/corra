import {z} from 'zod';
import {MAX_ITEM_QUANTITY} from './pricing';

export const UK_POSTCODE=/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

export const orderSchema=z.object({
  email:z.string().trim().email().max(254),
  firstName:z.string().trim().min(1).max(80),
  lastName:z.string().trim().min(1).max(80),
  phone:z.string().trim().max(30).regex(/^[+\d\s()-]*$/).optional().default(''),
  address1:z.string().trim().min(3).max(120),
  address2:z.string().trim().max(120).optional().default(''),
  city:z.string().trim().min(2).max(80),
  postcode:z.string().trim().regex(UK_POSTCODE),
  deliveryMethod:z.enum(['standard','express']),
  notes:z.string().trim().max(500).optional().default(''),
  items:z.array(z.object({id:z.enum(['corra-set','follicular','luteal']),quantity:z.number().int().min(1).max(MAX_ITEM_QUANTITY)})).min(1).max(3),
  expectedTotalPence:z.number().int().nonnegative(),
  website:z.string().max(200).optional().default(''),
  consent:z.literal(true),
});
export type OrderInput=z.infer<typeof orderSchema>;
