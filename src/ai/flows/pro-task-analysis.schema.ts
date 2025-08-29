
/**
 * @fileOverview Schemas and types for the PRO Task Analysis flow.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { OMAN_GOVERNORATES, OMAN_MINISTRIES, ministryLocations, calculateTotalDistance, type Governorate } from '@/lib/oman-locations';
import { sanadServiceGroups } from '@/lib/sanad-services';

export const ProTaskAnalysisInputSchema = z.object({
  serviceName: z.string().min(1, "Please select a service."),
  governorate: z.enum(OMAN_GOVERNORATES, { required_error: "Please select a governorate." }),
  startLocationName: z.string().min(3, "Please provide a name for the start location."),
  startLocationCoords: z.object({
      lat: z.number(),
      lon: z.number()
  }, { required_error: "Please select a valid start location on the map."}),
});
export type ProTaskAnalysisInput = z.infer<typeof ProTaskAnalysisInputSchema>;


const AllowanceSchema = z.object({
    description: z.string().describe("The description of the allowance (e.g., 'Fuel Allowance', 'Snacks')."),
    amount: z.number().describe("The estimated amount in OMR."),
});


export const ProTaskAnalysisOutputSchema = z.object({
  tripDescription: z.string().describe("A short description of the planned trip."),
  allowances: z.array(AllowanceSchema).describe("A consolidated list of all allowances for the trip."),
  grandTotal: z.number().describe("The grand total estimated cost for the entire assignment."),
  unmappedLocations: z.array(z.string()).optional().describe("A list of any locations that could not be found in the specified governorate."),
});
export type ProTaskAnalysisOutput = z.infer<typeof ProTaskAnalysisOutputSchema>;


// Find which ministry a service belongs to
const getMinistryForService = (serviceName: string): string | null => {
    for (const [ministry, services] of Object.entries(sanadServiceGroups)) {
        if (services.includes(serviceName)) {
            return ministry;
        }
    }
    return null;
}

export const getRequiredInstitutions = ai.defineTool(
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


export const getTravelPlanTool = ai.defineTool(
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
