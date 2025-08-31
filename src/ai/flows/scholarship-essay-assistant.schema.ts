/**
 * @fileOverview Schemas and types for the Scholarship Essay Assistant AI flow.
 */
import { z } from 'zod';

const ScholarshipSchema = z.object({
    scholarshipName: z.string(),
    institution: z.string(),
    country: z.string(),
    fieldOfStudy: z.string(),
    eligibilitySummary: z.string(),
});

export const ScholarshipEssayInputSchema = z.object({
    scholarship: ScholarshipSchema,
    cvDataUri: z.string().describe("The student's CV document as a data URI."),
});
export type ScholarshipEssayInput = z.infer<typeof ScholarshipEssayInputSchema>;

export const ScholarshipEssayOutputSchema = z.object({
    essay: z.string().describe("The generated draft of the personal statement in Markdown format."),
});
export type ScholarshipEssayOutput = z.infer<typeof ScholarshipEssayOutputSchema>;
