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
  documentType: z.enum([
        // Legal
        'Certificates (Birth, Marriage, Death, etc.)',
        'Court Documents, Power of Attorney, Notarized Docs',
        'Complex Legal Contracts, Immigration Docs',
        // Medical
        'Prescriptions, Test Results, Basic Reports',
        'Patient Records, Discharge Summaries',
        'Clinical Trials, Research, Device Instructions',
        // Business
        'Company Licenses, Simple Agreements',
        'Financial Statements, Policies, MOUs',
        'Import/Export, Detailed Trading Contracts',
        // Educational
        'Certificates, Diplomas, Transcripts',
        'Recommendation Letters, Course Material',
        'Thesis, Dissertations, Research Papers',
        // Technical
        'User Manuals, Product Guides',
        'Patents, Engineering Specs, Safety Data Sheets',
        // Media & Marketing
        'Flyers, Brochures, Simple Ads',
        'Websites, Presentations, Proposals',
        'Branding, Creative Copy with Localization',
        // Financial & Trade
        'Bank Statements, Loan Forms, Insurance Policies',
        'Trading Contracts, Customs Declarations, Tax Reports',
        'Other',
    ])
    .describe('The type of document, which informs the translation tone and format.'),
});
export type DocumentTranslationInput = z.infer<typeof DocumentTranslationInputSchema>;


export const DocumentTranslationOutputSchema = z.object({
  cleanTranslatedText: z.string().describe("The polished, ready-for-use translated text, stripped of complex formatting."),
  formattedTranslatedText: z.string().describe("The translated text, preserving the original document's structure, layout, and formatting as closely as possible."),
  verificationStatement: z.string().describe("A statement certifying the accuracy of the translation to the best of the AI's ability."),
});
export type DocumentTranslationOutput = z.infer<typeof DocumentTranslationOutputSchema>;
