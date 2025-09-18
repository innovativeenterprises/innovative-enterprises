import { z } from 'zod';

export const HireRequestSchema = z.object({
  id: z.string(),
  workerId: z.string(),
  workerName: z.string(),
  clientName: z.string(),
  clientContact: z.string(),
  requestDate: z.string(),
  status: z.enum(['Pending', 'Contacted', 'Interviewing', 'Hired', 'Closed']),
  agencyId: z.enum(['Happy Homes Agency', 'Premier Maids']),
  interviewDate: z.string().optional(),
  interviewNotes: z.string().optional(),
});
export type HireRequest = z.infer<typeof HireRequestSchema>;
