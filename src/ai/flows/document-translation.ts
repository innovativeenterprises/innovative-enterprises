
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
  prompt: `You are a certified professional translator for legal, medical, and commercial documents. Your task is to perform a high-fidelity translation of the provided document.

**Document Details:**
-   **Document Type:** {{documentType}}
-   **Source Language:** {{sourceLanguage}}
-   **Target Language:** {{targetLanguage}}
-   **Document to Translate:** {{media url=documentDataUri}}

**Your Instructions:**

1.  **Extract & Repair Content:**
    *   Accurately read all text from the document, even if it's a scanned PDF or low-quality image.
    *   Pay special attention to reconstructing broken Arabic script, misaligned letters, or any OCR errors.
    *   Ensure all numbers, dates, monetary amounts, and proper nouns (names of people, places, companies) are preserved exactly.

2.  **Translate with Precision:**
    *   Translate the extracted text from {{sourceLanguage}} to {{targetLanguage}}.
    *   Use formal, professional, and context-accurate terminology. Use legal terms for contracts, medical jargon for reports, etc., appropriate for the specified '{{documentType}}'.
    *   The output must be a human-grade translation, avoiding stiff or machine-like phrasing.

3.  **Preserve Original Formatting:**
    *   This is critical. You must replicate the structure, layout, and formatting of the source document as closely as possible.
    *   This includes tables (recreate them with the same columns and rows), bullet points, numbered lists, headers, footers, and paragraph breaks.
    *   If a formatting element cannot be replicated perfectly in text (like signatures, official stamps, logos, or complex graphics), use clear and descriptive placeholders in square brackets (e.g., [Signature Here], [Official Stamp of the Ministry of Health], [Company Logo]).

4.  **Quality Assurance:**
    *   Double-check spelling, grammar, and punctuation in the {{targetLanguage}}.
    *   Ensure no meaning is lost or added during translation. The translation must be a faithful representation of the source.
    *   If any part of the document is truly unreadable or illegible, mark it clearly in the output as [Illegible Text].

5.  **Provide Two Outputs:**
    *   **formattedTranslatedText:** The full translated content, preserving the original formatting as instructed above (tables, lists, placeholders, etc.).
    *   **cleanTranslatedText:** A clean version of the translated text, ready for legal or official use. This version should have all complex formatting (like tables or multi-column layouts) removed, but should still preserve paragraphs, headings, and line breaks for readability.

6.  **Generate Verification Statement:**
    *   After the translation, generate a formal "Statement of Translation Accuracy".
    *   It should state that the translation from {{sourceLanguage}} to {{targetLanguage}} is, to the best of your ability, a true and accurate version of the original document provided.
    *   Sign it with "Voxi, AI Translation Agent, Innovative Enterprises".

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
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: DocumentTranslationOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
