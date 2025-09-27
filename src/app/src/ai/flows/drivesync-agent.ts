
'use server';

/**
 * @fileOverview An AI agent for the DriveSync platform, helping users find and book rental cars.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { initialCars } from '@/lib/cars';
import { DriveSyncAgentInputSchema, DriveSyncAgentOutputSchema, type DriveSyncAgentInput } from './drivesync-agent.schema';


export const bookCarTool = ai.defineTool(
    {
        name: 'bookCar',
        description: 'Books a specific car for a user and marks it as Rented.',
        inputSchema: z.object({ carId: z.string() }),
        outputSchema: z.object({ success: z.boolean(), message: z.string() }),
    },
    async ({ carId }) => {
        // This is a simulation. In a real app, this would update a database.
        const car = initialCars.find(c => c.id === carId);
        if (car && car.availability === 'Available') {
            // In a real app, you'd update the DB here. store.set(...)
            car.availability = 'Rented';
            return { success: true, message: `Successfully booked the ${car.make} ${car.model}.`};
        }
        return { success: false, message: 'Could not book the car. It may already be rented.' };
    }
);

const getVehicleHealthTool = ai.defineTool({
    name: 'getVehicleHealth',
    description: 'Retrieves the maintenance status and service history for a specific vehicle.',
    inputSchema: z.object({ carId: z.string() }),
    outputSchema: z.object({ status: z.string(), lastService: z.string(), notes: z.string() }),
}, async ({ carId }) => {
    // Dummy data for simulation
    const statuses = ['Excellent', 'Good', 'Service Due'];
    return {
        status: statuses[carId.length % 3],
        lastService: new Date(Date.now() - (carId.length * 1000000000)).toLocaleDateString(),
        notes: carId.length % 2 === 0 ? 'All systems nominal.' : 'Brake pads may need inspection soon.',
    }
});

const getBookingTrendsTool = ai.defineTool({
    name: 'getBookingTrends',
    description: 'Provides data on booking trends, such as the most popular car types or busiest rental periods.',
    inputSchema: z.object({}),
    outputSchema: z.string(),
}, async () => {
    // Dummy data
    return "SUVs are the most popular rental type, especially on weekends. Bookings peak in December and July."
});

const driveSyncAgentPrompt = ai.definePrompt({
    name: 'driveSyncAgentPrompt',
    input: { schema: z.object({ query: z.string(), availableCarsJson: z.string() }) },
    output: { schema: DriveSyncAgentOutputSchema },
    tools: [bookCarTool, getVehicleHealthTool, getBookingTrendsTool],
    prompt: `You are an intelligent car rental assistant for "DriveSync AI". Your goal is to help users find the perfect car for their needs from the available inventory.

**User's Request:**
"{{{query}}}"

**Available Car Inventory:**
You MUST only recommend cars from this JSON list of available vehicles.
'''json
{{{json availableCarsJson}}}
'''

**Your Task:**
1.  **Analyze Query Intent:** First, determine what the user is asking for.
    *   **Finding a Car:** If they describe needs (e.g., "SUV for a family"), proceed to Step 2.
    *   **Booking a Car:** If they explicitly say "book", "reserve", or "rent" a specific car, use the \`bookCar\` tool.
    *   **Vehicle Health:** If they ask about the status, maintenance, or condition of a specific vehicle, use the \`getVehicleHealth\` tool.
    *   **Booking Trends:** If they ask about popular cars, busy times, or general trends, use the \`getBookingTrends\` tool.

2.  **Find and Recommend (if applicable):**
    *   Understand the user's need: car type, purpose, features, or price.
    *   Match the best car: Identify the single best car from inventory.
    *   Find other suggestions: Identify 1-2 other suitable alternatives.
    *   Formulate a response: Present your top recommendation and why it fits.

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
    const llmResponse = await ai.generate({
        prompt: driveSyncAgentPrompt,
        input: {
            query,
            availableCarsJson: JSON.stringify(availableCars),
        },
        tools: [bookCarTool, getVehicleHealthTool, getBookingTrendsTool]
    });

    const toolRequest = llmResponse.toolRequest();
    if (toolRequest) {
      const toolResponse = await toolRequest.run();
       if (toolRequest.name === 'bookCar') {
            const output = toolResponse as z.infer<typeof bookCarTool.outputSchema>;
            return {
                response: output.message || "An error occurred during booking.",
            };
        }
        if (toolRequest.name === 'getVehicleHealth') {
            const health = toolResponse as {status: string, lastService: string, notes: string};
            return {
                response: `Vehicle Health Report:\n- Status: ${health.status}\n- Last Service: ${health.lastService}\n- Notes: ${health.notes}`
            }
        }
        if (toolRequest.name === 'getBookingTrends') {
            return {
                response: `Booking Trends Report: ${String(toolResponse)}`
            }
        }
    }

    return llmResponse.output()!;
  }
);
