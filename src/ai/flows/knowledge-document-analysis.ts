
'use server';

/**
 * @fileOverview An AI agent that analyzes a knowledge document (like a law or regulation)
 * and extracts its key metadata.
 */

import { ai } from '@/ai/genkit';
import {
    KnowledgeDocumentAnalysisInput,
    KnowledgeDocumentAnalysisInputSchema,
    KnowledgeDocumentAnalysisOutput,
    KnowledgeDocumentAnalysisOutputSchema,
} from './knowledge-document-analysis.schema';


export async function analyzeKnowledgeDocument(input: KnowledgeDocumentAnalysisInput): Promise<KnowledgeDocumentAnalysisOutput> {
  return knowledgeDocumentAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'knowledgeDocumentAnalysisPrompt',
  input: { schema: KnowledgeDocumentAnalysisInputSchema },
  output: { schema: KnowledgeDocumentAnalysisOutputSchema },
  prompt: `You are an expert legal archivist. Your task is to analyze the provided legal or regulatory document and extract key metadata with high accuracy.

**Document Source:**
{{#if documentDataUri}}
  - Document File: {{media url=documentDataUri}}
{{else if documentContent}}
  - Document Text Content:
  """
  {{{documentContent}}}
  """
{{/if}}

**Instructions:**
1.  **Analyze the Document:** Carefully read the document provided. It could be a Royal Decree, a Ministerial Decision, a set of regulations, or a legal article.
2.  **Extract Key Metadata:** Identify and extract the following specific pieces of information. If a piece of information is not present, leave the field empty.
    *   **documentName:** The main, official title of the law. (e.g., "The Labour Law", "Commercial Companies Law"). If there's no clear title, create one from the content.
    *   **documentNumber:** The official identifying number. This is often in the format of a Royal Decree or Ministerial Decision number (e.g., "Royal Decree 35/2003", "MD 112/2021").
    *   **institutionName:** The name of the government body, ministry, or institution that issued the document.
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
