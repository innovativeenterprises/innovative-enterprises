
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
1.  **Orient and Analyze:** The documents may be rotated. First, orient them correctly. Then, analyze the content.
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

2.  **Extract Information:** Carefully read all provided documents and extract the following details. If a piece of information cannot be found, leave the corresponding field empty. Format dates as YYYY-MM-DD if possible. **Important: Some field values may be in Arabic or another language, even if the field label is in English. Extract the data exactly as it is written in the document.**

    **Document Identification & Prioritization:**
    -   First, determine the types of all provided documents (e.g., National ID, Resident Card, Passport). A document with an MRZ (Machine-Readable Zone) is a passport.
    -   **If a dedicated Passport document is provided in \`passportDocumentUri\`, use it as the primary source for \`personalDetails\` (Full Name, Nationality, DOB) and all \`passportDetails\`.**
    -   If no dedicated passport is provided, check if the document in \`idDocumentFrontUri\` is a passport (look for an MRZ). If so, use it as the primary source for passport and personal details.
    -   If the primary document is an ID/Resident Card/Driving License, extract its details into the \`idCardDetails\` object.

    **Personal Details:**
    -   **Full Name:** Extract the full legal name. Prioritize the name from the Passport if available, otherwise use the ID. **Crucially, if the name is split into 'Surname' and 'Given Names' fields in the source document, you MUST combine them into a single 'fullName' string in the \`personalDetails.fullName\` output field.**
    -   **Email & Phone:** Find the primary contact email and phone number. These are almost always found only in the CV.
    -   **Nationality, Date of Birth, Place of Birth, Sex:** Extract these from the Passport or ID document, prioritizing the Passport if both are available.

    **Passport Details:** (Extract if a passport document is identified in any of the image slots).
    -   Extract all passport-specific fields: Type, Country Code, Passport Number, Surname, Given Names, Issue Date, Expiry Date, Issuing Authority.

    **ID Card Details:**
    -   Extract all ID-specific fields from the provided ID card, resident card, or driving license: Civil Number, Document Type, Document Number, License Number, Class, Expiry Date, Issuing Country, Issuing Authority.

    **Professional Summary:**
    -   If a CV is provided, write a concise, one-paragraph summary of the individual's professional background, key skills, and experience. If no CV is provided, leave this field empty.

3.  **Return Structured Data:** Populate all extracted information into the specified JSON output format.
4.  **Suggest a Filename:** Generate a descriptive filename for these documents, e.g., 'ID_John_Doe.pdf'. Use the most relevant name and ID number.
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

    if (!output) {
        throw new Error("Failed to get a response from the identity analysis model.");
    }
    
    // Post-processing to ensure full name is combined if the model missed it.
    if (output.passportDetails && !output.personalDetails?.fullName) {
        const fullName = `${output.passportDetails.givenNames || ''} ${output.passportDetails.surname || ''}`.trim();
        if (fullName) {
            if (!output.personalDetails) {
                output.personalDetails = { fullName };
            } else {
                output.personalDetails.fullName = fullName;
            }
        }
    }

    // Fallback robust filename generation.
    const fullName = output.personalDetails?.fullName;
    const civilId = output.idCardDetails?.civilNumber;
    const namePart = fullName?.replace(/\s+/g, '_') || (civilId ? `ID_${civilId}` : 'UnknownPerson');
    output.suggestedFilename = `ID_${namePart}.pdf`;

    return output;
  }
);
