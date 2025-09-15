
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
  quantity: z.number(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const TransactionSchema = z.object({
    id: z.string(),
    items: z.array(CartItemSchema),
    total: z.number(),
    timestamp: z.string(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const DailySalesSchema = z.array(TransactionSchema);
export type DailySales = z.infer<typeof DailySalesSchema>;


export const initialPosProducts: PosProduct[] = [
  // Hot Drinks
  { id: 'hd01', name: 'Espresso', category: 'Hot Drinks', price: 0.8, imageUrl: 'https://images.unsplash.com/photo-1599806112354-67f8b54256ce?q=80&w=600&auto=format&fit=crop' },
  { id: 'hd02', name: 'Cappuccino', category: 'Hot Drinks', price: 1.2, imageUrl: 'https://images.unsplash.com/photo-1572442388855-494a3a3b04a2?q=80&w=600&auto=format&fit=crop' },
  { id: 'hd03', name: 'Karak Chai', category: 'Hot Drinks', price: 0.5, imageUrl: 'https://images.unsplash.com/photo-1594511942187-5673a03d6a6a?q=80&w=600&auto=format&fit=crop' },
  { id: 'hd04', name: 'Americano', category: 'Hot Drinks', price: 1.0, imageUrl: 'https://images.unsplash.com/photo-1545665225-b23b99e4d45e?q=80&w=600&auto=format&fit=crop' },

  // Cold Drinks
  { id: 'cd01', name: 'Iced Latte', category: 'Cold Drinks', price: 1.5, imageUrl: 'https://images.unsplash.com/photo-1517701550927-2036ba8b2554?q=80&w=600&auto=format&fit=crop' },
  { id: 'cd02', name: 'Orange Juice', category: 'Cold Drinks', price: 1.0, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=600&auto=format&fit=crop' },
  { id: 'cd03', name: 'Mineral Water', category: 'Cold Drinks', price: 0.3, imageUrl: 'https://images.unsplash.com/photo-1583344654578-36b33b6ac38e?q=80&w=600&auto=format&fit=crop' },
  { id: 'cd04', name: 'Pepsi', category: 'Cold Drinks', price: 0.4, imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=600&auto=format&fit=crop' },

  // Sandwiches
  { id: 'sw01', name: 'Chicken Tikka Sandwich', category: 'Sandwiches', price: 1.5, imageUrl: 'https://images.unsplash.com/photo-1628209214737-b55234551f88?q=80&w=600&auto=format&fit=crop' },
  { id: 'sw02', name: 'Halloumi Sandwich', category: 'Sandwiches', price: 1.2, imageUrl: 'https://images.unsplash.com/photo-1621852004169-3465839f9933?q=80&w=600&auto=format&fit=crop' },
  { id: 'sw03', name: 'Club Sandwich', category: 'Sandwiches', price: 2.0, imageUrl: 'https://images.unsplash.com/photo-1592415486689-86a0f2357953?q=80&w=600&auto=format&fit=crop' },

  // Snacks
  { id: 'sn01', name: 'Lays Oman Chips', category: 'Snacks', price: 0.2, imageUrl: 'https://images.unsplash.com/photo-1613998796279-b70b55502c30?q=80&w=600&auto=format&fit=crop' },
  { id: 'sn02', name: 'Chocolate Bar', category: 'Snacks', price: 0.5, imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=600&auto=format&fit=crop' },
  
  // Pastries
  { id: 'ps01', name: 'Croissant', category: 'Pastries', price: 0.8, imageUrl: 'https://images.unsplash.com/photo-1589114471223-dec0d8b4715f?q=80&w=600&auto=format&fit=crop' },
  { id: 'ps02', name: 'Muffin', category: 'Pastries', price: 1.0, imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop' },
];

export const initialDailySales: DailySales = [];
