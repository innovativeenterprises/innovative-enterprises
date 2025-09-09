import { z } from 'zod';

export const OpportunitySchema = z.object({
  title: z.string().min(3, "Title is required"),
  type: z.string().min(3, "Type is required"),
  prize: z.string().min(1, "Prize/Budget is required"),
  deadline: z.string().min(1, "Deadline is required"),
  description: z.string().min(10, "Description is required"),
  status: z.enum(['Open', 'Closed', 'In Progress']),
});
export type OpportunityValues = z.infer<typeof OpportunitySchema>;
