
import { z } from 'zod';
import type { Worker } from '@/lib/raaha-workers.schema';

export const RaahaMatcherInputSchema = z.object({
  requirements: z.string().min(10, "Please describe your needs in more detail."),
});
export type RaahaMatcherInput = z.infer<typeof RaahaMatcherInputSchema>;

export const RaahaMatcherOutputSchema = z.object({
  title: z.string(),
  summary: z.string(),
  recommendedWorkers: z.array(z.custom<Worker>()),
});
export type RaahaMatcherOutput = z.infer<typeof RaahaMatcherOutputSchema>;
