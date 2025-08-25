
/**
 * @fileOverview Schemas and types for the Partnership Inquiry flow.
 *
 * This file defines the Zod schemas and TypeScript types for the inputs
 * and outputs of the partnership inquiry AI flow.
 */

import { z } from 'zod';

export const PartnershipInquiryInputSchema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  contactName: z.string().min(2, 'Contact name is required.'),
  email: z.string().email('A valid email is required.'),
  partnershipDetails: z.string().min(20, 'Please provide more details about the potential partnership.'),
  undertaking: z.boolean().refine(val => val === true),
});
export type PartnershipInquiryInput = z.infer<typeof PartnershipInquiryInputSchema>;

export const PartnershipInquiryOutputSchema = z.object({
  confirmationMessage: z.string().describe("A confirmation message to the user that their inquiry has been received."),
});
export type PartnershipInquiryOutput = z.infer<typeof PartnershipInquiryOutputSchema>;
