
import { z } from 'zod';

export const GiftCardSchema = z.object({
  id: z.string(),
  code: z.string(),
  amount: z.number(),
  status: z.enum(['Active', 'Redeemed', 'Expired']),
  issueDate: z.string(), // ISO date string
  design: z.enum(['Generic', 'Birthday', 'Thank You', 'Holiday']),
  recipientName: z.string(),
  recipientEmail: z.string().email(),
  senderName: z.string(),
  message: z.string().optional(),
});
export type GiftCard = z.infer<typeof GiftCardSchema>;
