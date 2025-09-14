
/**
 * @fileOverview Schemas and types for the Fire & Safety Estimator AI flow.
 */
import { z } from 'zod';

export const FireSafetyEstimatorInputSchema = z.object({
  floorPlanUri: z.string().describe("The building floor plan document, as a data URI."),
  projectType: z.enum(['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Educational']),
  numberOfFloors: z.coerce.number().int().positive(),
  totalAreaSqM: z.coerce.number().positive(),
  occupancyLoad: z.coerce.number().positive(),
  hasKitchens: z.boolean().default(false),
  hasServerRoom: z.boolean().default(false),
});
export type FireSafetyEstimatorInput = z.infer<typeof FireSafetyEstimatorInputSchema>;


const EquipmentItemSchema = z.object({
  item: z.string().describe("The name of the equipment (e.g., 'Smoke Detector', 'Heat Detector', 'Fire Extinguisher (CO2)')."),
  type: z.enum(['Detection & Alarm', 'Suppression & Firefighting']),
  quantity: z.number().int().describe("The estimated quantity of this item."),
  unitCost: z.number().describe("The estimated cost per unit in OMR."),
  totalCost: z.number().describe("The total estimated cost for this line item (quantity * unitCost)."),
});

export const FireSafetyEstimatorOutputSchema = z.object({
  equipmentList: z.array(EquipmentItemSchema),
  totalMaterialCost: z.number().describe("The total estimated cost for all equipment."),
  estimatedInstallationCost: z.number().describe("A rough estimate for installation labor and materials."),
  grandTotal: z.number().describe("The total estimated project cost."),
  recommendations: z.array(z.string()).describe("A list of important recommendations or notes regarding the installation."),
});
export type FireSafetyEstimatorOutput = z.infer<typeof FireSafetyEstimatorOutputSchema>;
