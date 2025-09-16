

'use server';

/**
 * @fileOverview An AI agent that analyzes an individual's identity documents and CV.
 * - analyzeIdentity - A function that analyzes the documents.
 */

import { ai } from '@/ai/genkit';
import {
    IdentityAnalysisInput,
    IdentityAnalysisInputSchema,
    IdentityAnalysisOutput,
    IdentityAnalysisOutputSchema,
} from './identity-analysis.schema';

export async function analyzeIdentity(input: IdentityAnalysisInput): Promise<IdentityAnalysisOutput> {
  return identityAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identityAnalysisPrompt',
  input: { schema: IdentityAnalysisInputSchema },
  output: { schema: IdentityAnalysisOutputSchema },
  prompt: `You are an expert HR and compliance officer specializing in document verification. Your task is to analyze the provided identity documents and optional CV to extract key information with high accuracy.

**Instructions:**
1.  **Orient and Analyze:** The documents may be rotated. First, orient them correctly. Then, analyze the content. The 'Identity Document (Front)' might be a Passport instead of an ID card; handle this gracefully by extracting passport details if you identify a passport in that slot.
    -   Identity Document (Front): {{media url=idDocumentFrontUri}}
    {{#if idDocumentBackUri}}
    -   Identity Document (Back): {{media url=idDocumentBackUri}}
    {{/if}}
    {{#if passportDocumentUri}}
    -   Passport: {{media url=passportDocumentUri}}
    {{/if}}
    {{#if cvDocumentUri}}
    -   Curriculum Vitae (CV): {{media url=cvDocumentUri}}
    {{/if}}
    {{#if photoUri}}
    -   Personal Photo: {{media url=photoUri}} (Note: You are only to acknowledge its presence, not analyze the photo itself).
    {{/if}}

2.  **Extract Information:** Carefully read the documents and extract the following details. If a piece of information cannot be found, leave the corresponding field empty. Format dates as YYYY-MM-DD if possible. **Important: Some field values may be in Arabic or another language, even if the field label is in English. Extract the data exactly as it is written in the document.**

    **Personal Details:**
    -   **Full Name:** Extract the full legal name. Prioritize the name from the Passport if available, otherwise use the ID. If the name is split into Surname and Given Names, combine them.
    -   **Email & Phone:** Find the primary contact email and phone number. These are almost always found only in the CV.
    -   **Nationality, Date of Birth, Place of Birth, Sex:** Extract these from the Passport or ID document.

    **Passport Details:** (Extract if a passport document is identified in any of the image slots, even the 'idDocumentFrontUri' slot)
    -   Extract all passport-specific fields: Type, Country Code, Passport Number, Surname, Given Names, Issue Date, Expiry Date, Issuing Authority.

    **ID Document Details:**
    -   Extract all ID-specific fields from the provided ID card, resident card, or driving license: Civil Number, Document Type, Document Number, License Number, Class, Expiry Date, Issuing Country, Issuing Authority.

    **Professional Summary:**
    -   If a CV is provided, write a concise, one-paragraph summary of the individual's professional background, key skills, and experience. If no CV is provided, leave this field empty.

3.  **Generate a Filename:** This is handled by the application code, you do not need to provide it.
4.  **Return Structured Data:** Populate all extracted information into the specified JSON output format.
`,
});

const identityAnalysisFlow = ai.defineFlow(
  {
    name: 'identityAnalysisFlow',
    inputSchema: IdentityAnalysisInputSchema,
    outputSchema: IdentityAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (output) {
        // More robust filename generation.
        const fullName = output.personalDetails?.fullName || (output.passportDetails ? `${output.passportDetails.givenNames} ${output.passportDetails.surname}`.trim() : null);
        
        if (fullName && !output.personalDetails?.fullName) {
             output.personalDetails = { ...output.personalDetails, fullName: fullName };
        }

        const civilId = output.idCardDetails?.civilNumber;
        const namePart = fullName?.replace(/\s+/g, '_') || (civilId ? `ID_${civilId}` : 'UnknownPerson');
        output.suggestedFilename = `ID_${namePart}.pdf`;
    }

    return output!;
  }
);
