
import { z } from 'zod';

/**
 * @fileOverview Schemas for the PDF Form Filler AI flow.
 */
export const PdfFormFillerInputSchema = z.object({
  pdfDataUri: z.string().describe("A PDF document form, as a data URI."),
  // In a real app, you would pass the user's profile data here.
  // For the prototype, the AI will use a hardcoded sample profile.
});
export type PdfFormFillerInput = z.infer<typeof PdfFormFillerInputSchema>;

export const FilledFormDataSchema = z.object({
    fieldName: z.string().describe("The name of the form field as identified from the PDF."),
    value: z.string().describe("The value that should be placed in this field, based on the user's profile."),
    reasoning: z.string().describe("A brief explanation of why this value was chosen for this field."),
});
export type FilledFormData = z.infer<typeof FilledFormDataSchema>;

export const PdfFormFillerOutputSchema = z.array(FilledFormDataSchema);
export type PdfFormFillerOutput = z.infer<typeof PdfFormFillerOutputSchema>;
