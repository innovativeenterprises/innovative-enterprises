
'use server';

/**
 * @fileOverview An AI agent that analyzes an Omani Commercial Record (CR) document.
 * - analyzeCrDocument - A function that analyzes a CR document.
 */

import { ai } from '@/ai/genkit';
import {
  CrAnalysisInputSchema,
  type CrAnalysisInput,
  CrAnalysisOutputSchema,
  type CrAnalysisOutput,
} from './cr-analysis.schema';

export async function analyzeCrDocument(
  input: CrAnalysisInput
): Promise<CrAnalysisOutput> {
  return crAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crAnalysisPrompt',
  input: { schema: CrAnalysisInputSchema },
  output: { schema: CrAnalysisOutputSchema },
  prompt: `You are an expert Omani Public Relations Officer (PRO) and compliance expert.
Your task is to analyze the provided Commercial Record (CR) document with extreme accuracy.

CR Document:
{{media url=documentDataUri}}

**Instructions:**
1.  **Orient and Analyze:** The document might be a scanned PDF or a photo, and could be rotated. Correctly orient the document and perform robust OCR to read all text, especially text in tables.
2.  **Extract Information:** Carefully read the document and extract the following details. If a piece of information cannot be found, leave the corresponding field empty.
    -   **companyNameEnglish:** The full legal name of the company in English.
    -   **companyNameArabic:** The full legal name of the company in Arabic.
    -   **registrationNumber:** The CR Number.
    -   **legalType:** The legal form of the company (e.g., LLC, SAOC, SAOG).
    -   **status:** The current status of the CR (e.g., Active, Expired).
    -   **issueDate:** The date the CR was issued.
    -   **expiryDate:** The date the CR will expire.
    -   **address:** The registered address of the company.
    -   **capital:** The registered capital of the company.
    -   **contactEmail:** The official email address listed.
    -   **contactMobile:** The official mobile number listed.
    -   **pobox & postalCode:** The P.O. Box and postal code.
    -   **authorizedSignatories:** Extract a list of all authorized signatories, including their name, title/capacity, and nationality.
    -   **businessActivities:** Extract a comprehensive list of all registered business activities.
3.  **Generate Summary:** Based on the extracted data, write a concise, one-paragraph summary of the company. Include its name, legal type, and primary business activities.
4.  **Suggest Filename:** Generate a descriptive filename for this document, e.g., 'CR_Innovative_Enterprises.pdf', using the English name and CR number.

Return the complete analysis in the specified structured JSON format.
`,
});

const crAnalysisFlow = ai.defineFlow(
  {
    name: 'crAnalysisFlow',
    inputSchema: CrAnalysisInputSchema,
    outputSchema: CrAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
