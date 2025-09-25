import { z } from 'zod';

export const BimClashDetectionInputSchema = z.object({
  modelFileUri: z.string().url().describe("A data URI of the BIM model file (.ifc, .rvt, etc.)."),
  fileName: z.string().describe("The original name of the BIM file."),
});
export type BimClashDetectionInput = z.infer<typeof BimClashDetectionInputSchema>;

export const ClashSchema = z.object({
  severity: z.enum(['High', 'Medium', 'Low']).describe("The severity of the clash (High, Medium, Low)."),
  description: z.string().describe("A clear description of the clash."),
  elementIds: z.array(z.string()).describe("The IDs of the conflicting elements."),
  recommendation: z.string().describe("A suggested action to resolve the clash."),
});
export type Clash = z.infer<typeof ClashSchema>;

export const BimClashDetectionOutputSchema = z.object({
  fileName: z.string().describe("The name of the file that was analyzed."),
  clashes: z.array(ClashSchema).describe("An array of identified clashes."),
});
export type BimClashDetectionOutput = z.infer<typeof BimClashDetectionOutputSchema>;
