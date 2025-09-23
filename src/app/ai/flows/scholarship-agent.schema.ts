import { z } from 'zod';

export const ScholarshipFinderInputSchema = z.object({
  fieldOfStudy: z.string(),
  studyLevel: z.string(),
  country: z.string().optional(),
});
export type ScholarshipFinderInput = z.infer<typeof ScholarshipFinderInputSchema>;

export const ScholarshipSchema = z.object({
  scholarshipName: z.string(),
  institution: z.string(),
  country: z.string(),
  fieldOfStudy: z.string(),
  deadline: z.string(),
  eligibilitySummary: z.string(),
  sourceUrl: z.string().url(),
});
export type Scholarship = z.infer<typeof ScholarshipSchema>;


export const ScholarshipFinderOutputSchema = z.object({
  summary: z.string(),
  scholarships: z.array(ScholarshipSchema),
});
export type ScholarshipFinderOutput = z.infer<typeof ScholarshipFinderOutputSchema>;
