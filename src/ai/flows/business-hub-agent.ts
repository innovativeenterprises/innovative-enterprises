
'use server';

/**
 * @fileOverview An AI agent for the Business Hub, helping users find services.
 * - answerHubQuery - A function that answers user questions about the business hub.
 */

import { ai } from '@/ai/genkit';
import {
    BusinessHubAgentInput,
    BusinessHubAgentInputSchema,
    BusinessHubAgentOutput,
    BusinessHubAgentOutputSchema,
} from './business-hub-agent.schema';

export async function answerHubQuery(input: BusinessHubAgentInput): Promise<BusinessHubAgentOutput> {
  return businessHubFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessHubPrompt',
  input: { schema: BusinessHubAgentInputSchema },
  output: { schema: BusinessHubAgentOutputSchema },
  prompt: `You are "Hubert," an expert business network coordinator. Your job is to help users find the right business category for their needs.

**User's Request:**
"{{{query}}}"

**Available Business Categories:**
{{#each businessCategories}}
- {{this}}
{{/each}}

**Your Task:**
1.  **Analyze the Query:** Understand what the user is looking for.
2.  **Match to Category:** If the user's query clearly matches one of the available business categories, identify that category. Your response should gently guide them towards it. Set the \`suggestedCategory\` field to the matched category name.
3.  **Ask for Clarification:** If the query is ambiguous or doesn't match any category, ask a clarifying question to better understand their needs. For example, if they say "I need a designer," you could ask, "Are you looking for a graphic designer for branding, or a web designer for a website?" Set the \`clarificationNeeded\` field to true.
4.  **Be Helpful:** Always be friendly and helpful. Your goal is to connect users with the right services.
5.  **Provide Suggestions:** Based on the conversation, provide a few relevant follow-up questions or actions in the \`suggestedReplies\` field. Examples: "List tech companies", "Show me consulting firms", "What is the Business Hub?".

Provide a helpful, conversational response in the \`response\` field.
`,
});

const businessHubFlow = ai.defineFlow(
  {
    name: 'businessHubFlow',
    inputSchema: BusinessHubAgentInputSchema,
    outputSchema: BusinessHubAgentOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt,
      input: input,
      model: 'googleai/gemini-2.0-flash',
      output: {
        format: 'json',
        schema: BusinessHubAgentOutputSchema,
      }
    });

    const output = llmResponse.output();
    
    if (output && (!output.suggestedReplies || output.suggestedReplies.length === 0)) {
        output.suggestedReplies = ["List all categories", "What is the Business Hub?", "How do I register?"];
    }

    return output!;
  }
);
