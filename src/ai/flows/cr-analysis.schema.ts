'use server';

/**
 * @fileOverview An AI agent that analyzes a Commercial Record (CR) document.
 * - analyzeCrDocument - A function that analyzes the document.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CrAnalysisInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The Commercial Record (CR) document, as a data URI that must include a MIME type and use Base64 encoding."
    ),
});
export type CrAnalysisInput = z.infer<typeof CrAnalysisInputSchema>;

const BoardMemberSchema = z.object({
    name: z.string().optional().describe("Full name of the board member."),
    nationality: z.string().optional().describe("Nationality of the board member."),
    designation: z.string().optional().describe("Role or designation (e.g., Chairman, Member)."),
    idNumber: z.string().optional().describe("National or Civil ID number."),
    passportNumber: z.string().optional().describe("Passport number, if available."),
});

const SignatorySchema = z.object({
    name: z.string().optional().describe("Full name of the authorized signatory or manager."),
    nationality: z.string().optional().describe("Nationality of the signatory."),
    designation: z.string().optional().describe("Role or designation (e.g., General Manager)."),
    authorityLimit: z.string().optional().describe("Financial or authority limit of the signatory."),
    modeOfSigning: z.string().optional().describe("Mode of signing (e.g., Solely, Jointly)."),
    date: z.string().optional().describe("Authorization date, if mentioned."),
});

const CommercialActivitySchema = z.object({
    activityName: z.string().optional().describe("The name of the commercial activity."),
    activityCode: z.string().optional().describe("The official code for the activity."),
    registrationDate: z.string().optional().describe("The date the activity was registered."),
    licenseNumber: z.string().optional().describe("License number for the activity, if applicable."),
    licenseValidity: z.string().optional().describe("License validity period (Start - End)."),
    licenseStatus: z.string().optional().describe("The status of the license (e.g., Active)."),
    licenseType: z.string().optional().describe("The type of license."),
    poaCode: z.string().optional().describe("Power of Attorney code, if applicable."),
    location: z.string().optional().describe("The physical location or branch for this activity."),
    gpsCoordinates: z.string().optional().describe("GPS coordinates for the location, if available."),
});

const CrAnalysisOutputSchema = z.object({
  companyInfo: z.object({
    companyNameEnglish: z.string().optional().describe("The official name of the company in English."),
    companyNameArabic: z.string().optional().describe("The official name of the company in Arabic."),
    legalType: z.string().optional().describe("The legal structure of the company (e.g., LLC, SAOC)."),
    registrationNumber: z.string().optional().describe("The Commercial Registration (CR) number."),
    taxIdNumber: z.string().optional().describe("The Tax Identification Number (TIN)."),
    headquartersAddress: z.string().optional().describe("The full address of the company's headquarters."),
    contactMobile: z.string().optional().describe("The official contact mobile number."),
    contactEmail: z.string().optional().describe("The official contact email address."),
    establishmentDate: z.string().optional().describe("The date the company was established."),
    registrationDate: z.string().optional().describe("The date the CR was registered."),
    expiryDate: z.string().optional().describe("The expiry date of the CR."),
    status: z.string().optional().describe("The current status of the company (e.g., Active)."),
  }),
  boardMembers: z.array(BoardMemberSchema).optional().describe("A list of all board members."),
  authorizedSignatories: z.array(SignatorySchema).optional().describe("A list of all authorized managers and signatories."),
  commercialActivities: z.array(CommercialActivitySchema).optional().describe("A list of all registered commercial activities."),
  summary: z.string().optional().describe("A concise summary of the business activities or services offered."),
  suggestedFilename: z.string().optional().describe("A descriptive filename for this document, e.g., CR_CompanyName_12345.pdf"),
});
export type CrAnalysisOutput = z.infer<typeof CrAnalysisOutputSchema>;


export async function analyzeCrDocument(input: CrAnalysisInput): Promise<CrAnalysisOutput> {
  return crAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crAnalysisPrompt',
  input: { schema: CrAnalysisInputSchema },
  output: { schema: CrAnalysisOutputSchema },
  prompt: `You are an expert business registration analyst for the government of Oman. Your task is to analyze the provided Commercial Record (CR) document and extract key information with high accuracy.

**Instructions:**
1.  **Analyze the Document:** The document provided is a Commercial Record (CR) or a similar business registration document from Oman.
    -   Document: {{media url=documentDataUri}}
2.  **Extract Information:** Carefully read the document and extract the following details. If a piece of information cannot be found, leave the corresponding field empty. Dates should be in YYYY-MM-DD format if possible. **Important: Some field values may be in Arabic or another language, even if the field label is in English. Extract the data exactly as it is written in the document.**

    **Company Information:**
    -   **Company Name (English/Arabic):** Find the official, full legal name of the business in both English and Arabic.
    -   **Legal Type:** The legal structure (e.g., LLC, SAOC).
    -   **Registration Number:** The CR number.
    -   **Tax Identification Number:** The TIN, if present.
    -   **Headquarters Address:** The primary registered address.
    -   **Contact Mobile & Email:** The official contact mobile number and email.
    -   **Establishment, Registration, Expiry Dates:** Key dates related to the CR.
    -   **Status:** The current legal status (e.g., Active, Inactive).

    **Board Members:** (Extract all if listed)
    -   For each member, find their Name, Nationality, Designation (e.g., Chairman), ID Number, and Passport Number.

    **Authorized Managers & Signatories:** (Extract all if listed)
    -   For each manager/signatory, find their Name, Nationality, Designation, Authority Limit, Mode of Signing (e.g., Solely), and Date of authorization.

    **Registered Commercial Activities:** (Extract all if listed)
    -   For each activity, find the Activity Name, Activity Code, Registration Date, License Number, License Validity, Status, Type, POA Code, Location, and GPS Coordinates if available.
    
    **Summary:**
    -   Based on the list of commercial activities, write a concise, one-paragraph summary of what the company does.

3.  **Return Structured Data:** Populate all extracted information into the specified output format. You do not need to generate a filename; the application will handle that.
`,
});

const crAnalysisFlow = ai.defineFlow(
  {
    name: 'crAnalysisFlow',
    inputSchema: CrAnalysisInputSchema,
    outputSchema: CrAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (output) {
      // Robust filename generation logic using the final analysis result.
      const rawName = output.companyInfo?.companyNameEnglish || output.companyInfo?.companyNameArabic || 'UnknownCompany';
      const namePart = rawName.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
      const crnPart = output.companyInfo?.registrationNumber || 'UnknownCRN';
      output.suggestedFilename = `CR_${namePart}_${crnPart}.pdf`;
    }

    return output!;
  }
);