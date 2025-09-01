/**
 * @fileOverview Schemas for the Bill of Quantities (BoQ) Cost Estimator AI flow.
 */
import { z } from 'zod';

export const CostRateSchema = z.object({
  name: z.string(),
  rate: z.number(),
});
export type CostRate = z.infer<typeof CostRateSchema>;

export const BoQEstimatorInputSchema = z.object({
  boqCsvText: z.string().describe("The content of the Bill of Quantities file, formatted as a CSV string."),
  contingencyPercentage: z.coerce.number().min(0).max(100).describe("A percentage to add for contingencies."),
  profitMarginPercentage: z.coerce.number().min(0).max(100).describe("A percentage to add for profit margin."),
  marketRates: z.array(CostRateSchema).describe("An array of current market rates for materials and labor."),
});
export type BoQEstimatorInput = z.infer<typeof BoQEstimatorInputSchema>;

const CostedBoQItemSchema = z.object({
    category: z.string().describe("The category of the work (e.g., 'Earthwork', 'Concrete Works')."),
    item: z.string().describe("The specific material or work item."),
    unit: z.string().describe("The unit of measurement (e.g., 'm³', 'm²')."),
    quantity: z.number().describe("The quantity for this item."),
    materialUnitCost: z.number().describe("The estimated unit cost for materials in OMR."),
    laborUnitCost: z.number().describe("The estimated unit cost for labor in OMR."),
    totalItemCost: z.number().describe("The total estimated cost for this item (materials + labor) x quantity."),
});
export type CostedBoQItem = z.infer<typeof CostedBoQItemSchema>;

export const BoQEstimatorOutputSchema = z.object({
  costedItems: z.array(CostedBoQItemSchema).describe("A detailed list of all BoQ items with their estimated costs."),
  summary: z.object({
    totalDirectCosts: z.number().describe("The sum of all item costs."),
    contingencyAmount: z.number().describe("The calculated contingency amount."),
    subtotal: z.number().describe("The sum of direct costs and the contingency amount."),
    profitAmount: z.number().describe("The calculated profit margin amount."),
    grandTotal: z.number().describe("The final estimated project cost including all costs, contingencies, and profit."),
  }),
});
export type BoQEstimatorOutput = z.infer<typeof BoQEstimatorOutputSchema>;
