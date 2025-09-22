
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { OMAN_MINISTRIES, ministryLocations, OMAN_GOVERNORATES } from '@/lib/oman-locations';
import type { Ministry, Governorate } from '@/lib/oman-locations';
import { calculateTotalDistance } from '@/lib/oman-locations';
import type { CostRate } from '@/lib/cost-settings.schema';
import { getCostSettings } from '@/lib/firestore';

export const ProTaskAnalysisInputSchema = z.object({
  serviceName: z.string().describe("The specific government service requested by the user."),
  governorate: z.enum(OMAN_GOVERNORATES).describe("The governorate where the service needs to be performed."),
  startLocationName: z.string().optional().describe("The name of the starting location for the trip, e.g., 'Al Amerat Office'."),
  startLocationCoords: z.object({ lat: z.number(), lon: z.number() }).optional().describe("The GPS coordinates of the starting location."),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;

const AllowanceSchema = z.object({
  description: z.string(),
  amount: z.number(),
});
export type Allowance = z.infer<typeof AllowanceSchema>;

export const ProTaskAnalysisOutputSchema = z.object({
  tripDescription: z.string().describe("A summary of the planned trip, including the route and total distance."),
  allowances: z.array(AllowanceSchema).describe("A list of calculated allowances for the trip."),
  grandTotal: z.number().describe("The total estimated cost for the task."),
  unmappedLocations: z.array(z.string()).optional().describe("A list of ministries for which no location data was found in the selected governorate."),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;


const SNACKS_ALLOWANCE = 2.000;

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
  return proTaskAnalysisFlow(input);
}

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {
    
    // Data fetching is now inside the server action.
    const costSettings = await getCostSettings();
    const fuelRatePerKm = costSettings.find(c => c.name === 'Fuel Rate' && c.category === 'Travel')?.rate || 0.04;
    
    // In a real-world, more complex app, this might be another LLM call with a knowledge base.
    // For this prototype, a simple mapping is more reliable and demonstrates deterministic logic.
    const serviceLower = input.serviceName.toLowerCase();
    const institutions = new Set<Ministry>();
    if (serviceLower.includes('cr') || serviceLower.includes('commercial') || serviceLower.includes('trademark') || serviceLower.includes('agency') || serviceLower.includes('license')) {
        institutions.add("Ministry of Commerce, Industry & Investment Promotion (MOCIIP)");
    }
    if (serviceLower.includes('labour') || serviceLower.includes('work permit') || serviceLower.includes('employee') || serviceLower.includes('omanisation') || serviceLower.includes('sponsorship')) {
        institutions.add("Ministry of Labour");
    }
    if (serviceLower.includes('visa') || serviceLower.includes('resident card') || serviceLower.includes('driving') || serviceLower.includes('mulkiya') || serviceLower.includes('traffic')) {
        institutions.add("Royal Oman Police (ROP)");
    }
    if (serviceLower.includes('housing') || serviceLower.includes('rent') || serviceLower.includes('land')) {
        institutions.add("Ministry of Housing and Urban Planning");
    }
    if (serviceLower.includes('tax') || serviceLower.includes('vat')) {
        institutions.add("Tax Authority");
    }
    if (serviceLower.includes('attestation')) {
        institutions.add("Ministry of Foreign Affairs");
    }
    if (institutions.size === 0) {
        institutions.add("Ministry of Commerce, Industry & Investment Promotion (MOCIIP)");
    }
    const ministriesToVisit = Array.from(institutions);
    
    // Calculate travel plan
    const locationsToVisit = [];
    const unmappedLocations: string[] = [];
    const governorateLocations = ministryLocations[input.governorate];

    for (const ministryName of ministriesToVisit) {
      if (governorateLocations && governorateLocations[ministryName]) {
        locationsToVisit.push({
          name: ministryName,
          ...governorateLocations[ministryName]!,
        });
      } else {
        unmappedLocations.push(ministryName);
      }
    }
    
    const startPoint = input.startLocationCoords 
      ? { name: input.startLocationName || 'Custom Start', ...input.startLocationCoords }
      : { name: "Innovative Enterprises HQ", lat: 23.5518, lon: 58.5024 };

    const { distance, path } = calculateTotalDistance(locationsToVisit, startPoint);
    
    let tripDescription = `The optimized route is: ${path.join(' -> ')}. The total round-trip distance is approximately ${distance.toFixed(1)} km.`;
    let fuelAllowance = 0;

    if (distance > 0) {
        fuelAllowance = distance * fuelRatePerKm;
    }
    
    // Consolidate allowances
    const allowances: Allowance[] = [];
    let grandTotal = 0;

    if (fuelAllowance > 0) {
        allowances.push({ description: `Fuel Allowance (${distance.toFixed(1)} km)`, amount: fuelAllowance });
        grandTotal += fuelAllowance;
    }
    
    allowances.push({ description: 'Snacks & Refreshments Allowance', amount: SNACKS_ALLOWANCE });
    grandTotal += SNACKS_ALLOWANCE;

    return {
        tripDescription,
        allowances,
        grandTotal,
        unmappedLocations: unmappedLocations.length > 0 ? unmappedLocations : undefined,
    };
  }
);
