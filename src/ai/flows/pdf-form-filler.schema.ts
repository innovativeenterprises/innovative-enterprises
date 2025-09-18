
import { z } from 'zod';

export const PdfFormFillerInputSchema = z.object({
  pdfDataUri: z.string().url().describe("A data URI of the PDF form to be filled."),
});
export type PdfFormFillerInput = z.infer<typeof PdfFormFillerInputSchema>;

export const FilledFieldSchema = z.object({
  fieldName: z.string().describe("The identified name or label of the form field."),
  value: z.string().describe("The value to fill into the field, taken from the user profile."),
  reasoning: z.string().describe("A brief explanation of why this value was chosen for this field."),
  x: z.number().describe("The x-coordinate (from the left edge) in points/pixels."),
  y: z.number().describe("The y-coordinate (from the top edge) in points/pixels."),
  fontSize: z.number().describe("The estimated font size for the field."),
});

export const PdfFormFillerOutputSchema = z.array(FilledFieldSchema).describe("An array of all the fields to be filled in the PDF.");
export type FilledFormData = z.infer<typeof PdfFormFillerOutputSchema>;
