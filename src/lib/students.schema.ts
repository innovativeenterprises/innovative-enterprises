
import { z } from 'zod';

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  major: z.string(),
  year: z.number(),
  status: z.enum(['On Track', 'Needs Attention', 'At Risk']),
  photo: z.string().url(),
  tuitionBilled: z.number().optional(),
  scholarshipAmount: z.number().optional(),
  amountPaid: z.number().optional(),
});
export type Student = z.infer<typeof StudentSchema>;
