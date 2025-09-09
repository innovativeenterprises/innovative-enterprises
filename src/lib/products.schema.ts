
import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Product data structure.
 * This is used for sharing the type information between AI flows
 * and other parts of the application without importing server-only code.
 */
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  stage: z.string(),
  category: z.string(),
  price: z.number(),
  image: z.string(),
  aiHint: z.string(),
  rating: z.number(),
  enabled: z.boolean(),
  adminStatus: z.enum(['On Track', 'At Risk', 'On Hold', 'Completed']).optional(),
  adminNotes: z.string().optional(),
});
