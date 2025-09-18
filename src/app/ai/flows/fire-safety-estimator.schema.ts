
import { z } from 'zod';

export const FireSafetyEstimatorInputSchema = z.object({
  floorPlanUri: z.string().url().describe("A data URI of the building's floor plan image."),
  projectType: z.enum(['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Educational']),
  numberOfFloors: z.coerce.number().int().positive(),
  totalAreaSqM: z.coerce.number().positive(),
  occupancyLoad: z.coerce.number().positive(),
  hasKitchens: z.boolean().default(false),
  hasServerRoom: z.boolean().default(false),
});
export type FireSafetyEstimatorInput = z.infer<typeof FireSafetyEstimatorInputSchema>;

export const EquipmentItemSchema = z.object({
    item: z.string(),
    type: z.enum(['Detection & Alarm', 'Firefighting']),
    quantity: z.number().int(),
    unitCost: z.number(),
    totalCost: z.number(),
});

export const FireSafetyEstimatorOutputSchema = z.object({
  equipmentList: z.array(EquipmentItemSchema).describe("A detailed list of required fire and safety equipment."),
  totalMaterialCost: z.number().describe("The total estimated cost for all materials."),
  estimatedInstallationCost: z.number().describe("The estimated cost for installation."),
  grandTotal: z.number().describe("The grand total estimated cost (materials + installation)."),
  recommendations: z.array(z.string()).describe("A list of important recommendations."),
});
export type FireSafetyEstimatorOutput = z.infer<typeof FireSafetyEstimatorOutputSchema>;
