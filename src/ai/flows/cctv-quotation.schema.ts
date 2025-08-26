/**
 * @fileOverview Schemas and types for the CCTV Quotation AI flow.
 */

import { z } from 'zod';

export const CctvQuotationInputSchema = z.object({
  purpose: z.string().min(1, "Purpose is required."),
  buildingType: z.string().min(1, "Building type is required."),
  dimensions: z.string().optional().describe("Building dimensions if no floor plan is provided (e.g., '15m x 20m, 2 floors')."),
  floorPlanUri: z.string().optional().describe("A floor plan or sketch of the building, as a data URI."),
  coverage: z.enum(['Full Environment', 'Partial']),
  coverageDetails: z.string().optional().describe("Details about which areas need partial coverage."),
  remoteMonitoring: z.boolean(),
  existingSystem: z.enum(['None', 'Keep Some', 'Replace All']),
  dvrSwitchTvLocation: z.string().min(1, "DVR/Switch/TV location is required."),
  
  // New granular fields for a more precise quotation
  cameraType: z.enum(['Any', 'Dome', 'Bullet', 'PTZ']).describe("The preferred style of camera."),
  cameraResolution: z.enum(['Standard HD', '4K Ultra HD']).describe("The required video resolution."),
  nightVision: z.boolean().describe("Whether cameras with night vision are required."),
  audioRecording: z.boolean().describe("Whether audio recording capabilities are needed."),
  storageDuration: z.coerce.number().min(7).describe("The number of days for continuous recording storage (e.g., 30, 60, 90)."),
});
export type CctvQuotationInput = z.infer<typeof CctvQuotationInputSchema>;

const EquipmentSchema = z.object({
  item: z.string().describe("The name of the equipment (e.g., '4K Dome Camera', '16-Channel NVR')."),
  quantity: z.number().describe("The quantity of this item."),
  unitPrice: z.number().describe("The estimated price per unit in OMR."),
  totalPrice: z.number().describe("The total estimated price for this line item (quantity * unitPrice)."),
});

export const CctvQuotationOutputSchema = z.object({
  quotationId: z.string().describe("A unique ID for this quotation (e.g., 'QT-CCTV-12345')."),
  summary: z.string().describe("A brief summary of the proposed surveillance solution."),
  equipmentList: z.array(EquipmentSchema).describe("A detailed list of all required equipment."),
  cablingEstimate: z.object({
    totalLengthMeters: z.number().describe("The total estimated length of cable needed in meters."),
    cablingNotes: z.string().describe("Notes on the recommended cabling path and type."),
  }).describe("An estimate for the cabling requirements."),
  installationEstimate: z.object({
      laborHours: z.number().describe("Estimated labor hours for installation."),
      laborCost: z.number().describe("Estimated total labor cost in OMR."),
      notes: z.string().describe("Notes about the installation process."),
  }).describe("An estimate for the installation labor."),
  totalEstimatedCost: z.number().describe("The grand total estimated cost for the project in OMR (equipment + installation)."),
  nextSteps: z.string().describe("Recommended next steps for the user to take after reviewing the quotation."),
});
export type CctvQuotationOutput = z.infer<typeof CctvQuotationOutputSchema>;
