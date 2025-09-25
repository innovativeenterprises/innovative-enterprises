
'use server';

import { z } from 'zod';
import type { CostRate } from '@/lib/cost-settings.schema';

export const BoQEstimatorInputSchema = z.object({
  boqCsvText: z.string().describe('The Bill of Quantities data in CSV text format.'),
  contingencyPercentage: z.number().describe('The percentage to add for contingency.'),
  profitMarginPercentage: z.number().describe('The desired profit margin percentage.'),
  marketRates: z.array(z.custom<CostRate>()).describe('An array of current market rates for materials, labor, etc.'),
});
export type BoQEstimatorInput = z.infer<typeof BoQEstimatorInputSchema>;


export const CostedBoQItemSchema = z.object({
    category: z.string(),
    item: z.string(),
    unit: z.string(),
    quantity: z.number(),
    materialUnitCost: z.number(),
    laborUnitCost: z.number(),
    totalItemCost: z.number(),
});
export type CostedBoQItem = z.infer<typeof CostedBoQItemSchema>;

const BoQSummarySchema = z.object({
    totalDirectCosts: z.number(),
    contingencyAmount: z.number(),
    subtotal: z.number(),
    profitAmount: z.number(),
    grandTotal: z.number(),
});

export const BoQEstimatorOutputSchema = z.object({
  costedItems: z.array(CostedBoQItemSchema).describe("A detailed list of each BoQ item with its calculated costs."),
  summary: BoQSummarySchema.describe("A summary of the total calculated costs."),
});
export type BoQEstimatorOutput = z.infer<typeof BoQEstimatorOutputSchema>;
