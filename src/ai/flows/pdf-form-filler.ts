
'use server';

/**
 * @fileOverview An AI agent that intelligently fills out PDF forms.
 */
import { ai } from '@/ai/genkit';
import {
    PdfFormFillerInputSchema,
    type PdfFormFillerInput,
    PdfFormFillerOutputSchema,
    type FilledFormData
} from './pdf-form-filler.schema';
import { z } from 'zod';
import { getBriefcase } from '@/lib/firestore';


const prompt = ai.definePrompt(
  {
    name: 'pdfFormFillerPrompt',
    input: { schema: PdfFormFillerInputSchema.extend({ userProfile: z.any() }) },
    output: { schema: PdfFormFillerOutputSchema },
    prompt: `You are an expert data entry assistant with computer vision capabilities. Your task is to analyze a PDF form, identify all fillable fields, and map them to a provided user profile. You must also determine the exact coordinates and font size for each field.

**User Profile Data:**
'''json
{{{json userProfile}}}
'''

**PDF Form to Analyze:**
{{media url=pdfDataUri}}

**Instructions:**
1.  **Analyze PDF Layout:** Carefully examine the PDF's structure. Identify all the form fields (e.g., text inputs, checkboxes).
2.  **Intelligent Mapping:** For each identified field, determine its most likely purpose (e.g., "Full Name," "Date of Birth," "Mobile Number"). Match the identified field to the most appropriate piece of data from the User Profile.
3.  **Coordinate & Font Extraction:** This is CRITICAL. For each field, you must determine its precise location and font size.
    *   \`x\`: The x-coordinate (from the left edge) in PDF points/pixels where the text should begin.
    *   \`y\`: The y-coordinate (from the top edge) in PDF points/pixels where the text should begin. This should align with the baseline of the form field's text.
    *   \`fontSize\`: Estimate the font size used for the form fields. This is usually between 8 and 12.
4.  **Provide Reasoning:** For each field you fill, provide a brief reasoning for your choice. For example, for a field you label "Name," your reasoning might be "The field was labeled 'Applicant Name'."
5.  **Return Structured Data:** Create a JSON array where each object represents a filled form field. Each object must contain the \`fieldName\`, the \`value\`, your \`reasoning\`, and the precise \`x\`, \`y\`, and \`fontSize\` values.

Return only the JSON array of filled form data. Be precise with the coordinates.
`,
  },
);

export async function fillPdfForm(input: PdfFormFillerInput): Promise<FilledFormData> {
    const briefcase = await getBriefcase();
    const userProfile = {
        fullName: briefcase.applicantName,
        ...briefcase.userDocuments.reduce((acc, doc) => {
            if (doc.analysis) {
                if ('personalDetails' in doc.analysis) {
                    Object.assign(acc, doc.analysis.personalDetails);
                }
                if ('idCardDetails' in doc.analysis) {
                    Object.assign(acc, doc.analysis.idCardDetails);
                }
                 if ('companyInfo' in doc.analysis) {
                    Object.assign(acc, doc.analysis.companyInfo);
                }
            }
            return acc;
        }, {} as any)
    };


    const { output } = await prompt({
        ...input,
        userProfile,
    });
    
    if (!output) {
        throw new Error("The AI failed to analyze or fill the form.");
    }
    
    return output;
}

ai.defineFlow({
    name: 'pdfFormFillerFlow',
    inputSchema: PdfFormFillerInputSchema,
    outputSchema: PdfFormFillerOutputSchema,
}, fillPdfForm);
