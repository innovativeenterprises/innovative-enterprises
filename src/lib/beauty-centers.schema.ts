
import { z } from 'zod';

export const BeautyCenterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string().url(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  primaryColor: z.string().optional(),
});
export type BeautyCenter = z.infer<typeof BeautyCenterSchema>;
