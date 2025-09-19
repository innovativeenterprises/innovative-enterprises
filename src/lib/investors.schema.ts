
import { z } from 'zod';

export const InvestorSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(['Investor', 'Funder']),
  subType: z.enum(['Personal/Private', 'Angel', 'Institute/Government', 'VC Fund']),
  profile: z.string().optional(),
  focusArea: z.string().optional(),
  country: z.string().optional(),
  investmentValue: z.number().optional(),
  sharePercentage: z.number().optional(),
  documents: z.object({
    nda: z.string().optional(),
    safe: z.string().optional(),
    convertibleNote: z.string().optional(),
  }).optional(),
});
export type Investor = z.infer<typeof InvestorSchema>;
