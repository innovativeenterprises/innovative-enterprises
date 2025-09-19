
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { sanadServiceGroups } from '@/lib/sanad-services';
import { OMAN_MINISTRIES, ministryLocations, OMAN_GOVERNORATES } from '@/lib/oman-locations';
import type { Ministry, Governorate } from '@/lib/oman-locations';
import { calculateTotalDistance } from '@/lib/oman-locations';
import { getCostSettings } from '@/lib/firestore';

export const ProTaskAnalysisInputSchema = z.object({
    serviceName: z.string(),
    governorate: z.enum(OMAN_GOVERNORATES),
    startLocationName: z.string().optional(),
    startLocationCoords: z.object({
        lat: z.number(),
        lon: z.number()
    }).optional(),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;

export const ProTaskAnalysisOutputSchema = z.object({
    tripDescription: z.string(),
    allowances: z.array(z.object({
        description: z.string(),
        amount: z.number(),
    })),
    grandTotal: z.number(),
    unmappedLocations: z.array(z.string()).optional(),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;


// Tool to map a service name to the required ministries.
export const getRequiredInstitutions = ai.defineTool(
    {
        name: 'getRequiredInstitutions',
        description: 'Determines which government institutions need to be visited to complete a given government service in Oman.',
        inputSchema: z.object({ serviceName: z.string() }),
        outputSchema: z.object({
            requiredInstitutions: z.array(z.enum(OMAN_MINISTRIES))
        })
    },
    async ({ serviceName }) => {
        // This is a simplified logic. A real app might use an LLM with a knowledge base,
        // but for reliability and fixed processes, a deterministic mapping is better.
        const serviceLower = serviceName.toLowerCase();
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
        
        return { requiredInstitutions: Array.from(institutions) };
    }
);


// Tool to calculate travel distance and path
export const getTravelPlanTool = ai.defineTool(
    {
        name: 'getTravelPlanTool',
        description: 'Calculates the optimal travel route and total distance for visiting a list of ministries within a specific governorate.',
        inputSchema: z.object({
            ministriesToVisit: z.array(z.enum(OMAN_MINISTRIES)),
            governorate: z.enum(OMAN_GOVERNORATES),
            startLocationName: z.string().optional(),
            startLocationCoords: z.object({ lat: z.number(), lon: z.number() }).optional(),
        }),
        outputSchema: z.object({
            totalDistanceKm: z.number(),
            tripDescription: z.string(),
            unmappedLocations: z.array(z.string()),
        })
    },
    async ({ ministriesToVisit, governorate, startLocationName, startLocationCoords }) => {
        const locationsToVisit = [];
        const unmappedLocations: string[] = [];
        const governorateLocations = ministryLocations[governorate];

        for (const ministryName of ministriesToVisit) {
            if (governorateLocations && governorateLocations[ministryName]) {
                locationsToVisit.push({
                    name: ministryName,
                    ...governorateLocations[ministryName]!
                });
            } else {
                unmappedLocations.push(ministryName);
            }
        }
        
        const startPoint = startLocationCoords 
            ? { name: startLocationName || 'Custom Start', ...startLocationCoords }
            : { name: "Innovative Enterprises HQ", lat: 23.5518, lon: 58.5024 };

        const { distance, path } = calculateTotalDistance(locationsToVisit, startPoint);
        
        const tripDescription = `The optimized route is: ${path.join(' -> ')}. The total round-trip distance is approximately ${distance.toFixed(1)} km.`;

        return {
            totalDistanceKm: distance,
            tripDescription: tripDescription,
            unmappedLocations: unmappedLocations
        };
    }
);


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

    const costSettings = await getCostSettings();
    const fuelRatePerKm = costSettings.find(c => c.name === 'Fuel Rate' && c.category === 'Travel')?.rate || 0.04;


    // 1. Determine which ministries to visit based on the service name
    const requiredInstitutionsResult = await getRequiredInstitutions({ serviceName: input.serviceName });
    const ministriesToVisit = requiredInstitutionsResult.requiredInstitutions;
    
    // 2. Get travel plan and calculate fuel allowance
    const travelPlan = await getTravelPlanTool({ 
        ministriesToVisit: ministriesToVisit,
        governorate: input.governorate,
        startLocationName: input.startLocationName,
        startLocationCoords: input.startLocationCoords
    });
    
    let tripDescription = travelPlan.tripDescription;
    let fuelAllowance = 0;

    if (travelPlan.totalDistanceKm > 0) {
        fuelAllowance = travelPlan.totalDistanceKm * fuelRatePerKm;
    }
    
    // 3. Consolidate allowances and calculate total
    const allowances: { description: string; amount: number }[] = [];
    let grandTotal = 0;

    if (fuelAllowance > 0) {
        allowances.push({ description: `Fuel Allowance (${travelPlan.totalDistanceKm.toFixed(1)} km)`, amount: fuelAllowance });
        grandTotal += fuelAllowance;
    }
    
    allowances.push({ description: 'Snacks & Refreshments Allowance', amount: SNACKS_ALLOWANCE });
    grandTotal += SNACKS_ALLOWANCE;


    return {
        tripDescription,
        allowances,
        grandTotal,
        unmappedLocations: travelPlan.unmappedLocations.length > 0 ? travelPlan.unmappedLocations : undefined,
    };
  }
);
