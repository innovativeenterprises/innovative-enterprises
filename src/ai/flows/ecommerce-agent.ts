'use server';

/**
 * @fileOverview An AI agent for the e-commerce store, helping users find products.
 * - answerEcommerceQuery - A function that answers user questions about products.
 */

import { ai } from '@/ai/genkit';
import {
    EcommerceAgentInput,
    EcommerceAgentInputSchema,
    EcommerceAgentOutput,
    EcommerceAgentOutputSchema,
} from './ecommerce-agent.schema';

// In a real app, products would come from a database.
const products = [
    { name: "Wireless Headphones", category: "Electronics" },
    { name: "Modern Coffee Table", category: "Home Goods" },
    { name: "Performance Running Shoes", category: "Sports" },
    { name: "Organic Cotton T-Shirt", category: "Apparel" },
    { name: "Smartwatch Series 8", category: "Electronics" },
    { name: "Leather Backpack", category: "Apparel" },
    { name: "Non-stick Cookware Set", category: "Home Goods" },
    { name: "The Alchemist", category: "Books" },
];

export async function answerEcommerceQuery(input: EcommerceAgentInput): Promise<EcommerceAgentOutput> {
  return ecommerceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ecommercePrompt',
  input: { schema: EcommerceAgentInputSchema },
  output: { schema: EcommerceAgentOutputSchema },
  prompt: `You are "Nova," an expert AI shopping assistant for our e-commerce store. Your job is to help users discover products and navigate our store.

**User's Request:**
"{{{query}}}"

**Available Product Categories:**
{{#each availableCategories}}
- {{this}}
{{/each}}

**Your Task:**
1.  **Analyze the Query:** Understand what the user is looking for. They might be asking for a specific product, a category, or general help.
2.  **Suggest Products/Categories:**
    *   If the user's query clearly matches specific products, suggest them. Set the \`suggestedProducts\` field.
    *   If the query matches a category, guide them towards it. Set the \`suggestedCategory\` field.
3.  **Handle General Questions:** If the user asks about shipping, returns, or our store policies, provide a helpful, general answer.
4.  **Enable Search:** If you are unsure or the user query seems like a search term (e.g., "blue shoes"), set \`shouldFuzzySearch\` to true and provide a response like "Let me search for that for you."
5.  **Suggest Follow-ups:** Always provide 2-3 relevant follow-up questions in the \`suggestedReplies\` field. Examples: "View running shoes", "What are your shipping costs?", "Do you have smartwatches?".
6.  **Be Helpful:** Always be friendly and conversational. Your goal is to make shopping easier.

**Store Policies:**
*   We offer free shipping on orders over OMR 50.
*   We have a 30-day return policy on all items.
*   We are located in Muscat, Oman, but ship to all GCC countries.

Provide a helpful, conversational response in the \`response\` field.
`,
});

const ecommerceFlow = ai.defineFlow(
  {
    name: 'ecommerceFlow',
    inputSchema: EcommerceAgentInputSchema,
    outputSchema: EcommerceAgentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (output && (!output.suggestedReplies || output.suggestedReplies.length === 0)) {
        output.suggestedReplies = ["Show all categories", "What's on sale?", "Tell me your return policy"];
    }

    return output!;
  }
);
