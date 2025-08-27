/**
 * @fileOverview Schemas and types for the Identity Analysis flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the identity analysis AI flow, used for onboarding individuals.
 */

import { z } from 'zod';

export const IdentityAnalysisInputSchema = z.object({
  idDocumentFrontUri: z
    .string()
    .describe(
      "The user's identity document (ID card or Resident Card) front side, as a data URI."
    ),
  idDocumentBackUri: z
    .string()
    .optional()
    .describe(
        "The user's identity document (ID card or Resident Card) back side, as a data URI."
    ),
  passportDocumentUri: z
    .string()
    .optional()
    .describe(
        "The user's optional passport document, as a data URI."
    ),
  photoUri: z
    .string()
    .optional()
    .describe(
        "The user's optional personal photo, as a data URI."
    ),
  cvDocumentUri: z
    .string()
    .optional()
    .describe(
      "The user's optional CV document, as a data URI."
    ),
});
export type IdentityAnalysisInput = z.infer<typeof IdentityAnalysisInputSchema>;


const PersonalDetailsSchema = z.object({
    fullName: z.string().optional().describe("The full name of the individual."),
    email: z.string().email().optional().describe("The primary email address found from the CV."),
    phone: z.string().optional().describe("The primary phone number found from the CV."),
    nationality: z.string().optional().describe("The nationality of the individual."),
    dateOfBirth: z.string().optional().describe("The individual's date of birth (YYYY-MM-DD)."),
    placeOfBirth: z.string().optional().describe("The individual's place of birth."),
    sex: z.string().optional().describe("The sex of the individual (e.g., Male, Female)."),
});

const PassportDetailsSchema = z.object({
    passportType: z.string().optional().describe("Type of the passport (e.g., P)."),
    countryCode: z.string().optional().describe("The issuing country code (e.g., OMN)."),
    passportNumber: z.string().optional().describe("The passport number."),
    surname: z.string().optional().describe("The surname as it appears on the passport."),
    givenNames: z.string().optional().describe("The given names as they appear on the passport."),
    dateOfIssue: z.string().optional().describe("The date the passport was issued (YYYY-MM-DD)."),
    dateOfExpiry: z.string().optional().describe("The date the passport expires (YYYY-MM-DD)."),
    issuingAuthority: z.string().optional().describe("The authority that issued the passport."),
});

const IdCardDetailsSchema = z.object({
    civilNumber: z.string().optional().describe("The Civil or National ID number."),
    documentType: z.string().optional().describe("The type of document (e.g., Resident Card, Driving License)."),
    documentNumber: z.string().optional().describe("The document number."),
    licenseNumber: z.string().optional().describe("The driving license number, if applicable."),
    class: z.string().optional().describe("The license category or class, if applicable."),
    expiryDate: z.string().optional().describe("The expiry date of the ID document (YYYY-MM-DD)."),
    issuingCountry: z.string().optional().describe("The country that issued the document."),
    issuingAuthority: z.string().optional().describe("The authority that issued the document."),
});

export const IdentityAnalysisOutputSchema = z.object({
  personalDetails: PersonalDetailsSchema.optional(),
  passportDetails: PassportDetailsSchema.optional(),
  idCardDetails: IdCardDetailsSchema.optional(),
  professionalSummary: z.string().optional().describe("A brief summary of the individual's skills and experience from their CV."),
  suggestedFilename: z.string().optional().describe("A descriptive filename for this document, e.g., ID_FullName.pdf"),
});
export type IdentityAnalysisOutput = z.infer<typeof IdentityAnalysisOutputSchema>;
