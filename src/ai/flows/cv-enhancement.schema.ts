/**
 * @fileOverview Schemas and types for the CV ATS Enhancement flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the CV enhancement AI flow. These are
 * separated to allow client-side components to import them without
 * pulling in server-only code.
 */

import { z } from 'zod';

export const CvEnhancementInputSchema = z.object({
  cvDataUri: z
    .string()
    .describe(
      "The user's CV document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CvEnhancementInput = z.infer<typeof CvEnhancementInputSchema>;

const SuggestionSchema = z.object({
    isCompliant: z.boolean().describe("Whether this section is ATS-compliant."),
    suggestions: z.array(z.string()).describe("A list of specific suggestions for improvement for this section."),
});

export const CvEnhancementOutputSchema = z.object({
    overallScore: z.number().min(0).max(100).describe("An overall ATS compatibility score from 0 to 100."),
    summary: z.string().describe("A brief summary of the CV's strengths and weaknesses."),
    contactInfo: SuggestionSchema,
    workExperience: SuggestionSchema,
    skills: SuggestionSchema,
    education: SuggestionSchema,
    formatting: SuggestionSchema.describe("Suggestions related to the overall formatting, parsing, and file type."),
});
export type CvEnhancementOutput = z.infer<typeof CvEnhancementOutputSchema>;
