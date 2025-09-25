
import { z } from 'zod';

export const StockItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  quantity: z.number(),
  price: z.number(),
  status: z.enum(['Active', 'Sold', 'Expired']),
  saleType: z.enum(['Fixed Price', 'Auction']),
  expiryDate: z.string().optional(),
  auctionEndDate: z.string().optional(),
  imageUrl: z.string().url(),
  aiHint: z.string().optional(),
});
export type StockItem = z.infer<typeof StockItemSchema>;
