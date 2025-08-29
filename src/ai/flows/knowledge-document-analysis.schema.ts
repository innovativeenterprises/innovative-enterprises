/**
 * @fileOverview Schemas and types for the Knowledge Document Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the knowledge document analysis AI flow.
 */

import { z } from 'zod';

export const KnowledgeDocumentAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The legal or knowledge document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type KnowledgeDocumentAnalysisInput = z.infer<typeof KnowledgeDocumentAnalysisInputSchema>;


export const KnowledgeDocumentAnalysisOutputSchema = z.object({
    documentName: z.string().describe("The official name or title of the law or regulation."),
    documentNumber: z.string().optional().describe("The official number of the document, if available (e.g., 'Royal Decree 35/2003')."),
    version: z.string().optional().describe("The version number, if mentioned in the document."),
    issueDate: z.string().optional().describe("The date the document was issued or became effective, in YYYY-MM-DD format."),
});
export type KnowledgeDocumentAnalysisOutput = z.infer<typeof KnowledgeDocumentAnalysisOutputSchema>;
