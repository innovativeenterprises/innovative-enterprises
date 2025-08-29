
'use server';

/**
 * @fileOverview An AI agent that analyzes a knowledge document (like a law or regulation)
 * and extracts its key metadata.
 */

import { ai } from '@/ai/genkit';
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


export async function analyzeKnowledgeDocument(input: KnowledgeDocumentAnalysisInput): Promise<KnowledgeDocumentAnalysisOutput> {
  return knowledgeDocumentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeDocumentAnalysisPrompt',
  input: { schema: KnowledgeDocumentAnalysisInputSchema },
  output: { schema: KnowledgeDocumentAnalysisOutputSchema },
  prompt: `You are an expert legal archivist. Your task is to analyze the provided legal or regulatory document and extract key metadata with high accuracy.

**Document to Analyze:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Carefully read the document provided. It could be a Royal Decree, a Ministerial Decision, a set of regulations, or a legal article.
2.  **Extract Key Metadata:** Identify and extract the following specific pieces of information. If a piece of information is not present, leave the field empty.
    *   **documentName:** The main, official title of the law. (e.g., "The Labour Law", "Commercial Companies Law").
    *   **documentNumber:** The official identifying number. This is often in the format of a Royal Decree or Ministerial Decision number (e.g., "Royal Decree 35/2003", "MD 112/2021").
    *   **version:** Any version number or amendment number explicitly stated in the document.
    *   **issueDate:** The date the law was issued, published in the official gazette, or became effective. Format this as YYYY-MM-DD.

Return the extracted information in the specified structured JSON format.
`,
});

const knowledgeDocumentAnalysisFlow = ai.defineFlow(
  {
    name: 'knowledgeDocumentAnalysisFlow',
    inputSchema: KnowledgeDocumentAnalysisInputSchema,
    outputSchema: KnowledgeDocumentAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
