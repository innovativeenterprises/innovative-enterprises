'use server';

/**
 * @fileOverview An AI agent that provides high-quality document translation.
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
  prompt: `You are a professional translator for legal, medical, and commercial documents. Your task is to perform a high-fidelity translation of the provided document.

**Document Details:**
-   **Document Type:** {{documentType}}
-   **Source Language:** {{sourceLanguage}}
-   **Target Language:** {{targetLanguage}}
-   **Document to Translate:** {{media url=documentDataUri}}

**Your Instructions:**

1.  **Extract & Repair Content:**
    *   Accurately read the text, even from scanned or low-quality images.
    *   Reconstruct broken Arabic scripts, misaligned letters, or OCR errors.
    *   Ensure all numbers, dates, monetary amounts, and proper nouns (names, places) remain exact.

2.  **Translate with Precision:**
    *   Translate the text from {{sourceLanguage}} to {{targetLanguage}}.
    *   Use formal, professional, and context-accurate terminology (legal terms for contracts, medical jargon for reports, etc.).
    *   Avoid machine-like phrasing. The output must be a human-grade translation.

3.  **Preserve Original Formatting:**
    *   Replicate the structure, layout, and formatting of the source document as closely as possible. This includes tables, bullet points, numbering, headers, footers, etc.
    *   If a formatting element cannot be replicated perfectly in text (like signatures, stamps, or official seals), use clear placeholders (e.g., [Signature Here], [Official Stamp]).

4.  **Quality Assurance:**
    *   Double-check spelling and grammar in the {{targetLanguage}}.
    *   Ensure no meaning is lost or added during translation.
    *   If any part of the document is unreadable, mark it clearly as [Illegible Text].

5.  **Provide Two Outputs:**
    *   **formattedTranslatedText:** The full translated content, preserving the original formatting as instructed above.
    *   **cleanTranslatedText:** The polished, translated text, ready for legal or official use but stripped of complex formatting like tables or columns. Paragraphs and line breaks should be maintained.

6.  **Generate Verification Statement:**
    *   After the translation, generate a formal "Statement of Translation Accuracy".
    *   It should state that the translation from {{sourceLanguage}} to {{targetLanguage}} is a true and accurate version of the original to the best of your ability.
    *   Sign it "Voxi, AI Translation Agent, Innovative Enterprises".

Return the complete response in the specified structured JSON format.
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
