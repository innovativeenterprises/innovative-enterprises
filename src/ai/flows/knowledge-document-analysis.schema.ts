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
    .optional()
    .describe(
      "The legal or knowledge document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
  documentContent: z
    .string()
    .optional()
    .describe(
      "The text content of the document, used if a data URI is not provided."
    ),
  sourceUrl: z
    .string()
    .url()
    .optional()
    .describe("The original URL if the content was scraped from the web."),
});
export type KnowledgeDocumentAnalysisInput = z.infer<typeof KnowledgeDocumentAnalysisInputSchema>;


export const KnowledgeDocumentAnalysisOutputSchema = z.object({
    documentName: z.string().describe("The official name or title of the law or regulation."),
    documentNumber: z.string().optional().describe("The official number of the document, e.g., 'Royal Decree 35/2003'."),
    institutionName: z.string().optional().describe("The name of the institution that issued the document, e.g., 'Ministry of Commerce'."),
    version: z.string().optional().describe("The version number, if mentioned in the document."),
    issueDate: z.string().optional().describe("The date the document was issued or became effective, in YYYY-MM-DD format."),
});
export type KnowledgeDocumentAnalysisOutput = z.infer<typeof KnowledgeDocumentAnalysisOutputSchema>;
