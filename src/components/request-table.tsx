import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the StairspaceListing data structure.
 * This ensures type safety and provides a single source of truth for the
 * data shape used across the application.
 */
export const StairspaceListingSchema = z.object({
  id: z.number(),
  title: z.string(),
  location: z.string(),
  price: z.string(),
  imageUrl: z.string().url(),
  aiHint: z.string(),
  tags: z.array(z.string()),
});

export type StairspaceListing = z.infer<typeof StairspaceListingSchema>;