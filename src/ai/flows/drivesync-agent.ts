
'use server';

/**
 * @fileOverview An AI agent for the DriveSync platform, helping users find and book rental cars.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initialCars } from '@/lib/cars';
import {
    DriveSyncAgentInputSchema,
    DriveSyncAgentInput,
    DriveSyncAgentOutputSchema,
    DriveSyncAgentOutput,
    bookCarTool,
} from './drivesync-agent.schema';

const driveSyncAgentPrompt = ai.definePrompt({
    name: 'driveSyncAgentPrompt',
    input: { schema: z.object({ query: z.string(), availableCarsJson: z.string() }) },
    output: { schema: DriveSyncAgentOutputSchema },
    tools: [bookCarTool],
    prompt: `You are an intelligent car rental assistant for "DriveSync AI". Your goal is to help users find the perfect car for their needs from the available inventory.

**User's Request:**
"{{{query}}}"

**Available Car Inventory:**
You MUST only recommend cars from this JSON list of available vehicles.
'''json
{{{availableCarsJson}}}
'''

**Your Task:**
1.  **Understand the User's Need:** Analyze the user's query to identify key criteria like car type (SUV, sedan), purpose (family trip, business), features (4x4, GPS), or price range.
2.  **Match the Best Car:** Search the inventory and identify the single best car that matches the user's needs. This is your primary recommendation.
3.  **Find Other Suggestions:** Identify 1-2 other suitable alternatives from the inventory.
4.  **Formulate a Response:**
    *   Start with a friendly, conversational response.
    *   Clearly present your top recommendation (\`recommendedCar\`) and explain *why* it's a great fit for their request.
    *   Briefly mention the other suggestions (\`otherSuggestions\`) as alternatives.
5.  **Use Tools When Necessary:** If the user explicitly asks to book, reserve, or rent a specific car, use the \`bookCar\` tool.

Return the response in the specified JSON format.
`,
});

export const findAndBookCar = ai.defineFlow(
  {
    name: 'findAndBookCarFlow',
    inputSchema: DriveSyncAgentInputSchema,
    outputSchema: DriveSyncAgentOutputSchema,
  },
  async ({ query }) => {
    const availableCars = initialCars.filter(c => c.availability === 'Available');
    const response = await driveSyncAgentPrompt({
      query,
      availableCarsJson: JSON.stringify(availableCars),
    });

    // Check if the model wants to use the booking tool
    if (response.toolRequest?.name === 'bookCar') {
      const toolResponse = await response.toolRequest.run();
      return {
        response: toolResponse.output?.message || "An error occurred during booking.",
      };
    }

    return response.output!;
  }
);
