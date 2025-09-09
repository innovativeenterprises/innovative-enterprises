
'use server';

/**
 * @fileOverview An AI agent that analyzes a Commercial Record (CR) document.
 * - analyzeCrDocument - A function that analyzes the document.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    CrAnalysisInput,
    CrAnalysisInputSchema,
    CrAnalysisOutput,
    CrAnalysisOutputSchema,
} from './cr-analysis.schema';

export async function analyzeCrDocument(input: CrAnalysisInput): Promise<CrAnalysisOutput> {
  return crAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crAnalysisPrompt',
  input: { schema: CrAnalysisInputSchema },
  output: { schema: CrAnalysisOutputSchema },
  prompt: `You are an expert business registration analyst for the government of Oman. Your task is to analyze the provided Commercial Record (CR) document and extract key information with high accuracy.

**Instructions:**
1.  **Analyze the Document:** The document provided is a Commercial Record (CR) or a similar business registration document from Oman.
    -   Document: {{media url=documentDataUri}}
2.  **Extract Information:** Carefully read the document and extract the following details. If a piece of information cannot be found, leave the corresponding field empty. Dates should be in YYYY-MM-DD format if possible. **Important: Some field values may be in Arabic or another language, even if the field label is in English. Extract the data exactly as it is written in the document.**

    **Company Information:**
    -   **Company Name (English/Arabic):** Find the official, full legal name of the business in both English and Arabic.
    -   **Legal Type:** The legal structure (e.g., LLC, SAOC).
    -   **Registration Number:** The CR number.
    -   **Tax Identification Number:** The TIN, if present.
    -   **Headquarters Address:** The primary registered address.
    -   **Contact Mobile & Email:** The official contact mobile number and email.
    -   **Establishment, Registration, Expiry Dates:** Key dates related to the CR.
    -   **Status:** The current legal status (e.g., Active, Inactive).

    **Board Members:** (Extract all if listed)
    -   For each member, find their Name, Nationality, Designation (e.g., Chairman), ID Number, and Passport Number.

    **Authorized Managers & Signatories:** (Extract all if listed)
    -   For each manager/signatory, find their Name, Nationality, Designation, Authority Limit, Mode of Signing (e.g., Solely), and Date of authorization.

    **Registered Commercial Activities:** (Extract all if listed)
    -   For each activity, find the Activity Name, Activity Code, Registration Date, License Number, License Validity, Status, Type, POA Code, Location, and GPS Coordinates if available.
    
    **Summary:**
    -   Based on the list of commercial activities, write a concise, one-paragraph summary of what the company does.

3.  **Generate a Filename:** Based on the extracted Company Name and CR Number, create a descriptive filename for the document. The format should be \`CR_{CompanyName}_{CRN}.pdf\`. If the name or CRN is not found, use a suitable placeholder.
4.  **Return Structured Data:** Populate all extracted information into the specified output format.
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

    if (output) {
      // Robust filename generation logic using the final analysis result.
      const namePart = (output.companyInfo?.companyNameEnglish || output.companyInfo?.companyNameArabic || 'UnknownCompany').replace(/\s+/g, '_');
      const crnPart = output.companyInfo?.registrationNumber || 'UnknownCRN';
      output.suggestedFilename = `CR_${namePart}_${crnPart}.pdf`;
    }

    return output!;
  }
);
