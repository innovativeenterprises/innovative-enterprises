/**
 * @fileOverview Schemas for the Bill of Quantities (BoQ) Generator AI flow.
 */
import { z } from 'zod';

export const BoQGeneratorInputSchema = z.object({
  floorPlanUri: z.string().describe("The building floor plan document, as a data URI."),
  projectType: z.enum(['Residential Villa', 'Commercial Building', 'Industrial Warehouse'], {
    required_error: "Please select a project type.",
  }).describe("The type of building project."),
  numberOfFloors: z.coerce.number().min(1, "Please enter at least one floor."),
  additionalSpecs: z.string().optional().describe("Any additional specifications or materials to consider."),
});
export type BoQGeneratorInput = z.infer<typeof BoQGeneratorInputSchema>;

const BoQItemSchema = z.object({
    category: z.string().describe("The category of the work (e.g., 'Earthwork', 'Concrete', 'Masonry', 'Finishing')."),
    item: z.string().describe("The specific material or work item (e.g., 'Excavation', 'Reinforced Concrete for Slabs', '20cm Concrete Blocks')."),
    unit: z.string().describe("The unit of measurement (e.g., 'm³', 'm²', 'kg', 'nos')."),
    quantity: z.number().describe("The calculated quantity for this item."),
    notes: z.string().optional().describe("Any relevant notes or assumptions for this calculation."),
});

export const BoQGeneratorOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the generated Bill of Quantities."),
  boqItems: z.array(BoQItemSchema).describe("A detailed list of all items in the Bill of Quantities."),
});
export type BoQGeneratorOutput = z.infer<typeof BoQGeneratorOutputSchema>;
