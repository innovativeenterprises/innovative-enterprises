
import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Product data structure.
 * This is used for sharing the type information between AI flows
 * and other parts of the application without importing server-only code.
 */
export const ProductSchema = z.object({
  id: z.number().optional(), // id is optional as it's assigned on creation
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  stage: z.string().min(1, "Stage is required"),
  category: z.string().min(1, "Category is required."),
  price: z.coerce.number().min(0, "Price is required."),
  image: z.string().optional(),
  aiHint: z.string().min(2, "AI hint is required"),
  rating: z.coerce.number().min(0).max(5, "Rating must be between 0 and 5."),
  enabled: z.boolean(),
  adminStatus: z.enum(['On Track', 'At Risk', 'On Hold', 'Completed']).optional(),
  adminNotes: z.string().optional(),
});
