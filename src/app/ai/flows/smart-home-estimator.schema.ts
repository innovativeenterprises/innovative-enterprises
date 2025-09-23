
import { z } from 'zod';

export const SmartHomeEstimatorInputSchema = z.object({
  floorPlanUri: z.string().url().describe("A data URI of the building's floor plan image."),
  automationLevel: z.enum(['Essential', 'Advanced', 'Luxury']),
});
export type SmartHomeEstimatorInput = z.infer<typeof SmartHomeEstimatorInputSchema>;

export const SmartDeviceSchema = z.object({
    item: z.string(),
    type: z.enum(['Lighting', 'Climate Control', 'Security', 'Entertainment', 'Hubs']),
    quantity: z.number().int(),
    unitCost: z.number(),
    totalCost: z.number(),
});

export const SmartHomeEstimatorOutputSchema = z.object({
  equipmentList: z.array(SmartDeviceSchema).describe("A detailed list of required smart home devices."),
  totalMaterialCost: z.number().describe("The total estimated cost for all devices."),
  estimatedInstallationCost: z.number().describe("The estimated cost for installation."),
  grandTotal: z.number().describe("The grand total estimated cost (materials + installation)."),
  recommendations: z.array(z.string()).describe("A list of important recommendations for the smart home setup."),
});
export type SmartHomeEstimatorOutput = z.infer<typeof SmartHomeEstimatorOutputSchema>;
