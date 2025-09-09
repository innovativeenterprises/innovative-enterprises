
'use server';

/**
 * @fileOverview An AI agent that intelligently fills out PDF forms.
 */
import { ai } from '@/ai/genkit';
import {
    PdfFormFillerInputSchema,
    type PdfFormFillerInput,
    PdfFormFillerOutputSchema,
    type PdfFormFillerOutput
} from './pdf-form-filler.schema';

// This is a sample user profile. In a real app, this would be fetched
// from the user's secure E-Briefcase or database.
const sampleUserProfile = {
    fullName: "Jumaa Salim Al Hadidi",
    dateOfBirth: "1985-05-20",
    nationality: "Omani",
    civilIdNumber: "9876543210",
    address: "Al Amerat, Muscat, Oman",
    phoneNumber: "+968 78492280",
    email: "jumaa.hadidi@innovative.om",
    companyName: "Innovative Enterprises",
    companyCrn: "1435192",
    jobTitle: "CEO",
};

const prompt = ai.definePrompt(
  {
    name: 'pdfFormFillerPrompt',
    input: { schema: PdfFormFillerInputSchema },
    output: { schema: PdfFormFillerOutputSchema },
    prompt: `You are an expert data entry assistant. Your task is to analyze a PDF form and fill it out intelligently using a provided user profile.

**User Profile Data:**
'''json
{{{json userProfile}}}
'''

**PDF Form to Analyze:**
{{media url=pdfDataUri}}

**Instructions:**
1.  **Analyze PDF Fields:** Carefully examine the PDF. Identify all the form fields (e.g., text inputs, checkboxes).
2.  **Intelligent Mapping:** For each identified field, determine its most likely purpose (e.g., "Full Name," "Date of Birth," "Mobile Number").
3.  **Fill from Profile:** Match the identified field to the most appropriate piece of data from the User Profile.
4.  **Provide Reasoning:** For each field you fill, provide a brief reasoning for your choice. For example, for a field you label "Name," your reasoning might be "The field was labeled 'Applicant Name'." For a field where you put a phone number, your reasoning might be "The field was next to a phone icon."
5.  **Return Structured Data:** Create a JSON array where each object represents a filled form field. Each object must contain the \`fieldName\`, the \`value\` you've filled in, and your \`reasoning\`.

Return only the JSON array of filled form data.
`,
  },
);

export async function fillPdfForm(input: PdfFormFillerInput): Promise<PdfFormFillerOutput> {
    const { output } = await prompt({
        ...input,
        userProfile: sampleUserProfile,
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
