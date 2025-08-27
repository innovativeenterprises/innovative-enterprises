

'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
    ProTaskAnalysisInput,
    ProTaskAnalysisInputSchema,
    ProTaskAnalysisOutput,
    ProTaskAnalysisOutputSchema,
} from './pro-task-analysis.schema';
import { OMAN_MINISTRIES, ministryLocations, calculateTotalDistance, type Governorate, OMAN_GOVERNORATES } from '@/lib/oman-locations';
import { sanadServiceGroups } from '@/lib/sanad-services';

const FUEL_RATE_PER_KM = 0.400; // OMR per KM. This can be moved to admin settings later.
const SNACKS_ALLOWANCE = 2.000;

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
    return proTaskAnalysisFlow(input);
}

// Find which ministry a service belongs to
const getMinistryForService = (serviceName: string): string | null => {
    for (const [ministry, services] of Object.entries(sanadServiceGroups)) {
        if (services.includes(serviceName)) {
            return ministry;
        }
    }
    return null;
}

const getRequiredInstitutions = ai.defineTool(
    {
        name: 'getRequiredInstitutions',
        description: 'Determines which government ministries or authorities are required to be visited for a specific service.',
        inputSchema: z.object({ serviceName: z.string().describe("The specific government service required.") }),
        outputSchema: z.object({
            requiredInstitutions: z.array(z.string()).describe('A list of the names of the required institutions.'),
            reasoning: z.string().describe('A brief explanation for why these institutions were chosen.'),
        })
    },
    async ({ serviceName }) => {
        // This is a simplified logic. In a real-world scenario, this might involve a more complex lookup
        // or even another LLM call with more context about inter-ministry dependencies.
        const primaryMinistry = getMinistryForService(serviceName);
        let requiredInstitutions: string[] = [];
        let reasoning = "";

        if (primaryMinistry) {
            requiredInstitutions.push(primaryMinistry);
            reasoning = `The primary institution for '${serviceName}' is the ${primaryMinistry}.`;
        } else {
             // Fallback for general services
            if (serviceName.toLowerCase().includes('visa') || serviceName.toLowerCase().includes('driving')) {
                requiredInstitutions.push("Royal Oman Police (ROP)");
                reasoning = "Visa and driving-related services are handled by the Royal Oman Police (ROP).";
            } else {
                requiredInstitutions.push("Ministry of Commerce, Industry & Investment Promotion (MOCIIP)");
                reasoning = `Could not map service directly, defaulting to MOCIIP as it's the most common for business services.`
            }
        }
        
        // Add dependency logic (example)
        if (serviceName.includes("New Commercial Registration")) {
            requiredInstitutions.push("Tax Authority");
            reasoning += " A new CR also requires registration with the Tax Authority."
        }

        return { requiredInstitutions, reasoning };
    }
);


const getTravelPlanTool = ai.defineTool(
    {
        name: 'getTravelPlan',
        description: 'Calculates the total travel distance for a list of required government ministries within a specific Omani governorate. The trip starts and ends at the specified startLocation.',
        inputSchema: z.object({
            ministriesToVisit: z.array(z.string().describe('The unique names of the ministries or authorities the PRO needs to visit.')).describe('A list of unique ministry names that need to be visited.'),
            governorate: z.enum(OMAN_GOVERNORATES).describe("The governorate where the tasks will be performed."),
            startLocationName: z.string().describe("The name of the starting point for the trip (e.g., 'Al Amerat Office', 'Sohar Port')."),
            startLocationCoords: z.object({ lat: z.number(), lon: z.number() }).describe("The GPS coordinates of the starting point."),
        }),
        outputSchema: z.object({
            totalDistanceKm: z.number().describe('The total round-trip distance in kilometers.'),
            tripDescription: z.string().describe('A short description of the planned route.'),
            unmappedLocations: z.array(z.string()).describe("A list of any locations that could not be found in the specified governorate."),
        }),
    },
    async ({ ministriesToVisit, governorate, startLocationName, startLocationCoords }) => {
        const unmappedLocations: string[] = [];
        
        const locationsToVisit = ministriesToVisit.map(name => {
            const governorateLocations = ministryLocations[governorate];
            if (!governorateLocations || !(name in governorateLocations)) {
                unmappedLocations.push(name);
                return null;
            }
            return { name, ...governorateLocations[name as keyof typeof governorateLocations] };
        }).filter((l): l is { name: string; lat: number; lon: number; } => l !== null);


        if (locationsToVisit.length === 0 && unmappedLocations.length > 0) {
             return { 
                totalDistanceKm: 0,
                tripDescription: `Could not map any locations in ${governorate}.`,
                unmappedLocations,
            };
        }

        const { distance, path } = calculateTotalDistance(locationsToVisit, {name: startLocationName, ...startLocationCoords});
        
        return {
            totalDistanceKm: distance,
            tripDescription: `Calculated route: ${path.join(' -> ')}. Total distance: ${distance.toFixed(1)} km.`,
            unmappedLocations,
        }
    }
);

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {

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
        fuelAllowance = travelPlan.totalDistanceKm * FUEL_RATE_PER_KM;
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
