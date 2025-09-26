

'use server';

import { z } from 'zod';

/**
 * @fileOverview Schemas for the knowledge document analysis flow.
 */

export const KnowledgeDocumentAnalysisInputSchema = z.object({
    documentDataUri: z.string().url().optional(),
    documentContent: z.string().optional(),
    sourceUrl: z.string().url().optional(),
}).refine(data => data.documentDataUri || data.documentContent, {
    message: "Either a document data URI or document content must be provided.",
});
export type KnowledgeDocumentAnalysisInput = z.infer<typeof KnowledgeDocumentAnalysisInputSchema>;

export const KnowledgeDocumentAnalysisOutputSchema = z.object({
  documentName: z.string().describe("The main, official title of the law or document."),
  documentNumber: z.string().optional().describe("The official identifying number (e.g., Royal Decree number)."),
  institutionName: z.string().optional().describe("The name of the government body that issued the document."),
  version: z.string().optional().describe("Any version or amendment number."),
  issueDate: z.string().optional().describe("The date the document was issued (YYYY-MM-DD)."),
  documentContent: z.string().optional().describe("The full extracted text content of the document."),
});
export type KnowledgeDocumentAnalysisOutput = z.infer<typeof KnowledgeDocumentAnalysisOutputSchema>;
