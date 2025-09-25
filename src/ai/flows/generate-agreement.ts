
'use server';

/**
 * @fileOverview An AI agent that generates standard legal agreements for new partners/agents.
 * - generateAgreement - A function that generates an NDA and Service Agreement.
 */

import { ai } from '@/ai/genkit';
import {
    AgreementGenerationInput,
    AgreementGenerationInputSchema,
    AgreementGenerationOutput,
    AgreementGenerationOutputSchema,
} from './generate-agreement.schema';

export async function generateAgreement(input: AgreementGenerationInput): Promise<AgreementGenerationOutput> {
  return generateAgreementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgreementPrompt',
  input: { schema: AgreementGenerationInputSchema },
  output: { schema: AgreementGenerationOutputSchema },
  prompt: `You are an AI Legal Assistant for "Innovative Enterprises". Your task is to draft two standard agreements for a new partner or agent based on their provided details.

**Party A:** Innovative Enterprises, an Omani SME.

**Party B Details:**
{{#if (eq applicantType "individual")}}
-   **Type:** Individual
-   **Name:** {{individualData.personalDetails.fullName}}
-   **Nationality:** {{individualData.personalDetails.nationality}}
-   **ID/Civil Number:** {{individualData.idCardDetails.civilNumber}}
{{else}}
-   **Type:** Company
-   **Company Name:** {{companyData.companyInfo.companyNameEnglish}}
-   **CR Number:** {{companyData.companyInfo.registrationNumber}}
-   **Represented by:** {{representativeData.personalDetails.fullName}}
-   **Representative ID:** {{representativeData.idCardDetails.civilNumber}}
{{/if}}

**Instructions:**
1.  **Draft a Non-Disclosure Agreement (NDA):**
    -   Generate a standard, mutual NDA between Innovative Enterprises and Party B.
    -   The NDA should cover confidential information related to business plans, technology, client data, and financials.
    -   The term of the agreement should be for three (3) years.
    -   Use the details above to correctly identify Party B.
    -   Keep the language clear and standard.
    -   Format the output in Markdown.

2.  **Draft a Service Agreement:**
    *   Generate a standard Service/Agent Agreement between Innovative Enterprises and Party B.
    *   This agreement outlines the general terms under which Party B will provide services to or on behalf of Innovative Enterprises.
    *   Key clauses should include: Scope of Work (to be defined per project), Compensation (to be agreed upon per project), Confidentiality (referencing the separate NDA), Term and Termination, and Independent Contractor Status.
    *   Use the details above to correctly identify Party B.
    *   Format the output in Markdown.

Return both complete documents in the specified output fields.
`,
});

const generateAgreementFlow = ai.defineFlow(
  {
    name: 'generateAgreementFlow',
    inputSchema: AgreementGenerationInputSchema,
    outputSchema: AgreementGenerationOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: AgreementGenerationOutputSchema,
      }
    });

    return llmResponse.output()!;
  }
);
