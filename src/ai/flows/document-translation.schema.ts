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
  documentType: z.enum(['Contracts & Agreements', 'Court Documents', 'Certificates', 'Power of Attorney', 'Immigration Documents', 'Government Forms & Regulations', 'Notarized Documents', 'Medical Reports & Diagnoses', 'Patient Records & Case Files', 'Prescriptions & Test Results', 'Clinical Trial Documentation', 'Hospital Discharge Summaries', 'Medical Device Instructions', 'Insurance Claim Forms', 'Business Contracts & MOUs', 'Company Registration & Licenses', 'Financial Statements & Audit Reports', 'Import/Export Documents', 'Invoices', 'Product Catalogs & Price Lists', 'Policies & Procedures Manuals', 'Shareholder Agreements', 'Diplomas & Transcripts', 'Certificates of Training', 'Research Papers & Journals', 'Thesis & Dissertations', 'Course Materials & Exams', 'Recommendation Letters', 'User Manuals & Product Guides', 'Engineering Drawings & Specifications', 'Safety Data Sheets (SDS/MSDS)', 'Patents & Intellectual Property Documents', 'IT/Software Documentation', 'Brochures & Flyers', 'Company Profiles', 'Websites & Online Content', 'Press Releases', 'Presentations & Proposals', 'Advertising & Branding Materials', 'Bank Statements & Letters', 'Loan Agreements', 'Insurance Policies', 'Trading & Brokerage Agreements', 'Tax Forms & Reports', 'Customs Declarations', 'Other'])
    .describe('The type of document, which informs the translation tone and format.'),
});
export type DocumentTranslationInput = z.infer<typeof DocumentTranslationInputSchema>;


export const DocumentTranslationOutputSchema = z.object({
  cleanTranslatedText: z.string().describe("The polished, ready-for-use translated text, stripped of complex formatting."),
  formattedTranslatedText: z.string().describe("The translated text, preserving the original document's structure, layout, and formatting as closely as possible."),
  verificationStatement: z.string().describe("A statement certifying the accuracy of the translation to the best of the AI's ability."),
});
export type DocumentTranslationOutput = z.infer<typeof DocumentTranslationOutputSchema>;
