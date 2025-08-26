
import { z } from 'zod';

/**
 * @fileOverview A Zod schema for the Asset data structure.
 * This is used for sharing the type information between the AI flow
 * and other parts of the application without importing server-only code.
 */
export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Server', 'Laptop', 'Workstation', 'Networking', 'Storage', 'Peripheral']),
  status: z.enum(['Available', 'Rented', 'Maintenance']),
  specs: z.string(),
  monthlyPrice: z.number(),
  image: z.string(),
  aiHint: z.string(),
});
