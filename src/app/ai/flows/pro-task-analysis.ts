
'use server';

/**
 * @fileOverview An AI agent that determines required documents and estimates fees for a PRO task.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { OMAN_MINISTRIES, ministryLocations, OMAN_GOVERNORATES, calculateTotalDistance } from '@/lib/oman-locations';
import type { Ministry, Governorate } from '@/lib/oman-locations';
import { getCostSettings } from '@/lib/firestore';
import { SanadTaskAnalysisOutputSchema } from './sanad-task-analysis.schema';

export const ProTaskBaseInputSchema = z.object({
  serviceName: z.string().describe("The specific government service requested by the user."),
  governorate: z.enum(OMAN_GOVERNORATES).describe("The governorate where the service needs to be performed."),
  startLocationName: z.string().optional().describe("The name of the starting location for the trip, e.g., 'Al Amerat Office'."),
  startLocationCoords: z.object({ lat: z.number(), lon: z.number() }).optional().describe("The GPS coordinates of the starting location."),
});
export type ProTaskBaseInput = z.infer<typeof ProTaskBaseInputSchema>;


export const ProTaskAnalysisInputSchema = ProTaskBaseInputSchema.merge(SanadTaskAnalysisOutputSchema);
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

// Tool to get the travel plan and cost
const getProTaskPlanTool = ai.defineTool(
    {
        name: "getProTaskPlan",
        description: "Calculates the optimal travel route, distance, and cost for a PRO task based on a list of ministries to visit in a specific governorate.",
        inputSchema: z.object({
            ministriesToVisit: z.array(z.enum(OMAN_MINISTRIES)),
            governorate: z.enum(OMAN_GOVERNORATES),
            serviceFee: z.number().optional(),
            startLocationCoords: z.object({ lat: z.number(), lon: z.number() }).optional(),
            startLocationName: z.string().optional(),
        }),
        outputSchema: ProTaskAnalysisOutputSchema,
    },
    async (input) => {
        const costSettings = await getCostSettings();
        const fuelRatePerKm = costSettings.find(c => c.name === 'Fuel Rate' && c.category === 'Travel')?.rate || 0.04;
        
        const locationsToVisit = [];
        const unmappedLocations: string[] = [];
        const governorateLocations = ministryLocations[input.governorate];

        for (const ministryName of input.ministriesToVisit) {
            if (governorateLocations && governorateLocations[ministryName]) {
                locationsToVisit.push({ name: ministryName, ...governorateLocations[ministryName]! });
            } else {
                unmappedLocations.push(ministryName);
            }
        }
        
        const startPoint = input.startLocationCoords 
            ? { name: input.startLocationName || 'Custom Start', ...input.startLocationCoords }
            : { name: "Innovative Enterprises HQ", lat: 23.5518, lon: 58.5024 };

        const { distance, path } = calculateTotalDistance(locationsToVisit, startPoint);
        
        let tripDescription = `The optimized route is: ${path.join(' -> ')}. The total round-trip distance is approximately ${distance.toFixed(1)} km.`;
        let fuelAllowance = distance > 0 ? distance * fuelRatePerKm : 0;
        
        const allowances: Allowance[] = [];
        let grandTotal = 0;

        if (input.serviceFee && input.serviceFee > 0) {
            allowances.push({ description: 'Government Service Fee', amount: input.serviceFee });
            grandTotal += input.serviceFee;
        }

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


const proTaskAnalysisPrompt = ai.definePrompt({
    name: 'proTaskAnalysisPrompt',
    input: { schema: ProTaskAnalysisInputSchema },
    output: { schema: ProTaskAnalysisOutputSchema },
    tools: [getProTaskPlanTool],
    prompt: `You are Fahim, an expert PRO agent. A user needs to perform the service: "{{serviceName}}".
    The initial analysis suggests a service fee of OMR {{serviceFee}}.
    1. Determine which government ministries are required to visit to complete this service.
    2. Then, use the getProTaskPlan tool to calculate the travel route and costs for visiting these ministries in the "{{governorate}}" governorate. You MUST pass the serviceFee of {{serviceFee}} to the tool.`,
});

export const analyzeProTask = ai.defineFlow(
  {
    name: 'proTaskAnalysisAgentFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {
    
    const llmResponse = await ai.generate({
        prompt: proTaskAnalysisPrompt,
        input: input,
        tools: [getProTaskPlanTool],
    });

    const toolRequest = llmResponse.toolRequest();
    if (!toolRequest || toolRequest.name !== 'getProTaskPlan') {
        throw new Error("The AI agent failed to use the required planning tool.");
    }
    
    // Augment the tool input with coordinates if they were passed from the client
    const toolInput = toolRequest.input;
    toolInput.startLocationCoords = input.startLocationCoords;
    toolInput.startLocationName = input.startLocationName;

    const toolResponse = await toolRequest.run();

    return toolResponse.output as ProTaskAnalysisOutput;
  }
);
