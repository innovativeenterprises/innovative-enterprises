
import { z } from 'zod';

export const CostRateSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['Material', 'Labor', 'Equipment', 'Travel']),
  unit: z.string(),
  rate: z.number(),
});

export type CostRate = z.infer<typeof CostRateSchema>;
