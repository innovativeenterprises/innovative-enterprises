/**
 * @fileOverview Schemas and types for the CV ATS Enhancement flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the CV enhancement AI flow. These are
 * separated to allow client-side components to import them without
 * pulling in server-only code.
 */

import { z } from 'zod';

export const CvAnalysisInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "The user's CV document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CvAnalysisInput = z.infer<typeof CvAnalysisInputSchema>;

const SuggestionSchema = z.object({
    isCompliant: z.boolean().describe("Whether this section is ATS-compliant."),
    suggestions: z.array(z.string()).describe("A list of specific suggestions for improvement for this section."),
});

export const CvAnalysisOutputSchema = z.object({
    overallScore: z.number().min(0).max(100).describe("An overall ATS compatibility score from 0 to 100."),
    summary: z.string().describe("A brief summary of the CV's strengths and weaknesses."),
    contactInfo: SuggestionSchema,
    workExperience: SuggestionSchema,
    skills: SuggestionSchema,
    education: SuggestionSchema,
    formatting: SuggestionSchema.describe("Suggestions related to the overall formatting, parsing, and file type."),
});
export type CvAnalysisOutput = z.infer<typeof CvAnalysisOutputSchema>;


export const CvGenerationInputSchema = z.object({
    cvDataUri: z
    .string()
    .describe(
      "The user's original CV document, as a data URI."
    ),
    targetPosition: z.string().describe("The target job position the user is applying for."),
    jobAdvertisement: z.string().optional().describe("The full text of the job advertisement/description."),
    languages: z.array(z.string()).describe("The languages the new CV and cover letter should be written in."),
});
export type CvGenerationInput = z.infer<typeof CvGenerationInputSchema>;


export const CvGenerationOutputSchema = z.object({
    newCvContent: z.string().describe("The full content of the newly generated, enhanced CV in Markdown format."),
    newCoverLetterContent: z.string().describe("The full content of the newly generated, tailored cover letter in Markdown format."),
    newOverallScore: z.number().min(0).max(100).describe("The new, improved ATS score after enhancement."),
});
export type CvGenerationOutput = z.infer<typeof CvGenerationOutputSchema>;
