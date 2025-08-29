
/**
 * @fileOverview Schemas and types for the RAAHA Domestic Worker Matching AI flow.
 */
import { z } from 'zod';

export const WorkerSchema = z.object({
    id: z.string(),
    name: z.string(),
    nationality: z.string(),
    age: z.number(),
    skills: z.array(z.string()),
    experience: z.string(),
    availability: z.enum(['Available', 'Not Available']),
    rating: z.number(),
    photo: z.string().url(),
});
export type Worker = z.infer<typeof WorkerSchema>;

export const RaahaMatcherInputSchema = z.object({
  requirements: z.string().min(10, "Please describe your needs in more detail.").describe("A detailed description of the family's needs for a domestic helper."),
});
export type RaahaMatcherInput = z.infer<typeof RaahaMatcherInputSchema>;

export const RaahaMatcherOutputSchema = z.object({
  title: z.string().describe("A summary title for the search results."),
  summary: z.string().describe("A brief summary of the search results and key recommendations."),
  recommendedWorkers: z.array(WorkerSchema).describe("A list of the top recommended workers that match the user's requirements."),
});
export type RaahaMatcherOutput = z.infer<typeof RaahaMatcherOutputSchema>;
