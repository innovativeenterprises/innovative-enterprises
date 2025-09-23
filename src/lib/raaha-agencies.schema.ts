
import { z } from 'zod';

export const AgencySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string().url(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  primaryColor: z.string().optional(),
});
export type Agency = z.infer<typeof AgencySchema>;
