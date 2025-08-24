/**
 * @fileOverview Schemas and types for the Document Translation flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the document translation AI flow.
 */

import { z } from 'zod';

export const DocumentTranslationInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to translate, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  sourceLanguage: z.string().min(1, 'Source language is required.'),
  targetLanguage: z.string().min(1, 'Target language is required.'),
  documentType: z.enum(['Contract', 'Invoice', 'Medical Report', 'Certificate', 'Other'])
    .describe('The type of document, which informs the translation tone and format.'),
});
export type DocumentTranslationInput = z.infer<typeof DocumentTranslationInputSchema>;


export const DocumentTranslationOutputSchema = z.object({
  translatedContent: z.string().describe("The full content of the translated document, preserving original formatting as much as possible."),
  verificationStatement: z.string().describe("A statement certifying the accuracy of the translation to the best of the AI's ability."),
});
export type DocumentTranslationOutput = z.infer<typeof DocumentTranslationOutputSchema>;
