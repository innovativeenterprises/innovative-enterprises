
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { BeautyCenter, BeautyService } from '@/lib/beauty-centers.schema';

const BeautyAgentInputSchema = z.object({
  query: z.string().describe("The user's question about services or recommendations."),
  agency: z.custom<BeautyCenter>(),
  services: z.array(z.custom<BeautyService>()),
});

const BeautyAgentOutputSchema = z.object({
  response: z.string().describe('A helpful and conversational response to the user.'),
  recommendedServiceId: z.string().optional().describe('The ID of the most relevant service, if applicable.'),
});

const prompt = ai.definePrompt({
  name: 'beautyAgentPrompt',
  input: { schema: BeautyAgentInputSchema },
  output: { schema: BeautyAgentOutputSchema },
  prompt: `You are "Mane," a friendly and knowledgeable AI beauty consultant for the salon '{{{agency.name}}}'.

**Your Task:**
Your goal is to help users find the perfect beauty service based on their needs.

**User's Query:**
"{{{query}}}"

**Available Services at {{{agency.name}}}:**
'''json
{{{json services}}}
'''

**Instructions:**
1.  **Analyze the Query:** Understand the user's need (e.g., "dry hair," "chipped nails," "relaxing massage").
2.  **Match to a Service:** Find the best service from the list that addresses the user's query.
3.  **Formulate a Response:**
    *   Provide a conversational and helpful response.
    *   Recommend the best-matching service by name.
    *   Briefly explain *why* it's a good choice for them based on their query.
4.  **Set Recommended ID:** If you make a specific service recommendation, set the \`recommendedServiceId\` to the ID of that service.

**Example:**
*   **User Query:** "My hair is so dry and frizzy."
*   **Response:** "For dry and frizzy hair, I highly recommend our Deep Conditioning Treatment! It's designed to infuse moisture and leave your hair feeling soft and smooth."
*   **recommendedServiceId:** (the ID of the Deep Conditioning Treatment service)

Answer the user's question now.
`,
});

export const beautyAgent = ai.defineFlow(
  {
    name: 'beautyAgent',
    inputSchema: BeautyAgentInputSchema,
    outputSchema: BeautyAgentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
