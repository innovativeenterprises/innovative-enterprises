'use server';

/**
 * @fileOverview An AI agent that provides high-quality document translation.
 *
 * - translateDocument - A function that translates a document.
 */

import { ai } from '@/ai/genkit';
import {
    DocumentTranslationInput,
    DocumentTranslationInputSchema,
    DocumentTranslationOutput,
    DocumentTranslationOutputSchema,
} from './document-translation.schema';

export async function translateDocument(input: DocumentTranslationInput): Promise<DocumentTranslationOutput> {
  return documentTranslationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'documentTranslationPrompt',
  input: { schema: DocumentTranslationInputSchema },
  output: { schema: DocumentTranslationOutputSchema },
  prompt: `You are an expert, certified translator specializing in {{documentType}} documents. Your task is to perform a high-fidelity translation of the provided document.

**Instructions:**
1.  **Analyze the Document:** The document provided is a {{documentType}}.
    -   Document: {{media url=documentDataUri}}
2.  **Translate:** Translate the document from {{sourceLanguage}} to {{targetLanguage}}.
    -   Pay meticulous attention to detail, especially for legal, financial, or medical terminology.
    -   Preserve the original formatting, layout, and structure of the document as closely as possible. The output should be a plain text or markdown representation that mirrors the original's layout (e.g., using line breaks to separate sections).
    -   Ensure the tone is formal and appropriate for a verified document.
3.  **Generate Verification Statement:** After the translation, generate a formal "Statement of Translation Accuracy". It should state that the translation was performed from {{sourceLanguage}} to {{targetLanguage}} and is a true and accurate version of the original to the best of your ability. The statement should be signed by "Voxi, AI Translation Agent, Innovative Enterprises".

Return the full translated content in the 'translatedContent' field and the formal statement in the 'verificationStatement' field.
`,
});

const documentTranslationFlow = ai.defineFlow(
  {
    name: 'documentTranslationFlow',
    inputSchema: DocumentTranslationInputSchema,
    outputSchema: DocumentTranslationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
