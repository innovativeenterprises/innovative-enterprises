
import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Service data structure.
 * This ensures type safety and provides a single source of truth for the
 * data shape used across the application.
 */
export const ServiceSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().describe("The name of a lucide-react icon."),
  category: z.string(),
  enabled: z.boolean(),
  href: z.string().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;
