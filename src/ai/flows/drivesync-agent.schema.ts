
/**
 * @fileOverview Schemas and types for the DriveSync AI Agent flow.
 */
import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { initialCars } from '@/lib/cars';

export const CarSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number(),
  type: z.enum(['Sedan', 'SUV', 'Coupe', 'Truck']),
  rentalAgencyId: z.string(),
  pricePerDay: z.number(),
  location: z.string(),
  availability: z.enum(['Available', 'Rented']),
  imageUrl: z.string().url(),
  features: z.array(z.string()),
});
export type Car = z.infer<typeof CarSchema>;

export const DriveSyncAgentInputSchema = z.object({
  query: z.string().describe("The user's request for a rental car."),
});
export type DriveSyncAgentInput = z.infer<typeof DriveSyncAgentInputSchema>;

export const DriveSyncAgentOutputSchema = z.object({
  response: z.string().describe('The helpful response from the AI booking assistant.'),
  recommendedCar: CarSchema.optional().describe('The single best car recommendation for the user.'),
  otherSuggestions: z.array(CarSchema).optional().describe('A list of other suitable cars.'),
});
export type DriveSyncAgentOutput = z.infer<typeof DriveSyncAgentOutputSchema>;

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
            car.availability = 'Rented';
            return { success: true, message: `Successfully booked the ${car.make} ${car.model}.`};
        }
        return { success: false, message: 'Could not book the car. It may already be rented.' };
    }
);
