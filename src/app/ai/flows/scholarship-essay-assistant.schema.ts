
import { z } from 'zod';

export const ScholarshipSchema = z.object({
  scholarshipName: z.string(),
  institution: z.string(),
  country: z.string(),
  fieldOfStudy: z.string(),
  eligibilitySummary: z.string(),
});

export const ScholarshipEssayInputSchema = z.object({
  scholarship: ScholarshipSchema,
  cvDataUri: z.string().url().describe("A data URI of the student's CV document."),
});
export type ScholarshipEssayInput = z.infer<typeof ScholarshipEssayInputSchema>;


export const ScholarshipEssayOutputSchema = z.object({
  essay: z.string().describe("The generated personal statement essay in Markdown format."),
});
export type ScholarshipEssayOutput = z.infer<typeof ScholarshipEssayOutputSchema>;

