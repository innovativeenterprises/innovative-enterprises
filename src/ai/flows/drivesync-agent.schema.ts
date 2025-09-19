
import { z } from 'zod';
import { CarSchema as BaseCarSchema } from '@/lib/cars.schema';

export const CarSchema = BaseCarSchema;
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
