/**
 * @fileOverview Schemas and types for the Sanad Office Registration flow.
 */

import { z } from 'zod';

export const SanadOfficeRegistrationInputSchema = z.object({
  officeName: z.string(),
  crNumber: z.string(),
  contactName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  services: z.string(),
  logoDataUri: z.string().optional().describe("The office's logo as a data URI."),
  serviceChargesDataUri: z.string().optional().describe("A document (e.g., CSV) with the office's service charges, as a data URI."),
});
export type SanadOfficeRegistrationInput = z.infer<typeof SanadOfficeRegistrationInputSchema>;

export const SanadOfficeRegistrationOutputSchema = z.object({
  confirmationMessage: z.string(),
  officeId: z.string(),
});
export type SanadOfficeRegistrationOutput = z.infer<typeof SanadOfficeRegistrationOutputSchema>;
