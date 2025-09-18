
import { z } from 'zod';

export const PosProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.enum(['Hot Drinks', 'Cold Drinks', 'Sandwiches', 'Snacks', 'Pastries']),
    price: z.number(),
    imageUrl: z.string().url(),
});

export type PosProduct = z.infer<typeof PosProductSchema>;

export const CartItemSchema = PosProductSchema.extend({
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const TransactionSchema = z.object({
    id: z.string(),
    items: z.array(CartItemSchema),
    total: z.number(),
    timestamp: z.string(), // ISO string
});

export const DailySalesSchema = z.array(TransactionSchema);

export type DailySales = z.infer<typeof DailySalesSchema>;
