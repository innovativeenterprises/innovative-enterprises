
'use server';

/**
 * @fileOverview An AI agent that generates real estate contracts.
 */

import { ai } from '@/ai/genkit';
import {
  RealEstateContractInputSchema,
  RealEstateContractInput,
  RealEstateContractOutputSchema,
  RealEstateContractOutput,
} from './real-estate-contract-generator.schema';

export async function generateRealEstateContract(input: RealEstateContractInput): Promise<RealEstateContractOutput> {
  return realEstateContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'realEstateContractPrompt',
  input: { schema: RealEstateContractInputSchema },
  output: { schema: RealEstateContractOutputSchema },
  prompt: `You are an expert AI legal assistant specializing in Omani real estate law. Your task is to generate a professional and clear **{{{contractType}}}**.

**Agreement Details:**
- **Type:** {{{contractType}}}
- **Landlord/Seller (First Party):** {{{lessorName}}}
- **Tenant/Buyer (Second Party):** {{{lesseeName}}}
- **Property:** A {{{propertyType}}} located at: {{{propertyAddress}}}.
- **Price/Rent:** OMR {{{price}}} {{{pricePeriod}}}
{{#if startDate}}
- **Start Date:** {{{startDate}}}
{{/if}}
{{#if endDate}}
- **End Date:** {{{endDate}}}
{{/if}}

**Instructions:**
1.  **Draft the Contract:** Based on the details above, generate a standard {{{contractType}}}.
2.  **Use Markdown:** Format the entire output in clean, readable Markdown. Use headings, bold text, and numbered lists for clarity.
3.  **Key Clauses:** Ensure the contract includes all standard and necessary clauses for a {{{contractType}}} in Oman, such as:
    *   Parties Involved
    *   Property Description
    *   Term of Agreement (start and end dates for rentals)
    *   Rent/Price and Payment Terms
    *   Responsibilities of Both Parties (e.g., maintenance, utility payments)
    *   Governing Law (Sultanate of Oman)
    *   Signature Lines
4.  **Incorporate Additional Clauses:** If provided, seamlessly integrate the following custom clauses into the document:
    > {{{additionalClauses}}}
5.  **Disclaimer:** Add a clear disclaimer at the end stating that this is an AI-generated draft and should be reviewed by a legal professional before signing.

Return the complete, formatted contract content.
`,
});

const realEstateContractFlow = ai.defineFlow(
  {
    name: 'realEstateContractFlow',
    inputSchema: RealEstateContractInputSchema,
    outputSchema: RealEstateContractOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
