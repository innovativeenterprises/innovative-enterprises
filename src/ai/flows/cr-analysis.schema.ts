/**
 * @fileOverview Schemas and types for the Commercial Record Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the CR analysis AI flow.
 */

import { z } from 'zod';

export const CrAnalysisInputSchema = z.object({
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

export const CrAnalysisOutputSchema = z.object({
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
});
export type CrAnalysisOutput = z.infer<typeof CrAnalysisOutputSchema>;
