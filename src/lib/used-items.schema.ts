
import { z } from 'zod';

export const UsedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  condition: z.enum(['New', 'Like New', 'Used - Good', 'Used - Fair']),
  price: z.number(),
  imageUrl: z.string().url(),
  seller: z.string(),
  listingType: z.enum(['For Sale', 'For Donation', 'Gift']),
});

export type UsedItem = z.infer<typeof UsedItemSchema>;
