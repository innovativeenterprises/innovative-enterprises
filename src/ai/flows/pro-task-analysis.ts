
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
    ProTaskAnalysis,
    ProTaskAnalysisSchema,
} from './pro-task-analysis.schema';
import { ministryLocations, type Ministry, calculateTotalDistance } from '@/lib/oman-locations';

const FUEL_RATE_PER_KM = 0.400; // OMR per KM. This can be moved to admin settings later.

export async function analyzeProTask(input: ProTaskAnalysisInput): Promise<ProTaskAnalysisOutput> {
    return proTaskAnalysisFlow(input);
}

const getTravelPlanTool = ai.defineTool(
    {
        name: 'getTravelPlan',
        description: 'Calculates the total travel distance for a list of required government ministries for a day\'s tasks. The starting and ending point is always the main office in Al Amerat.',
        inputSchema: z.object({
            ministriesToVisit: z.array(z.string().describe('The unique names of the ministries or authorities the PRO needs to visit.')).describe('A list of unique ministry names that need to be visited.')
        }),
        outputSchema: z.object({
            totalDistanceKm: z.number().describe('The total round-trip distance in kilometers.'),
            tripDescription: z.string().describe('A short description of the planned route.'),
        }),
    },
    async ({ ministriesToVisit }) => {
        // Deduplicate and find coordinates
        const uniqueMinistries = [...new Set(ministriesToVisit)] as Ministry[];
        const locationsToVisit = uniqueMinistries.map(name => {
            const location = ministryLocations[name];
            if (!location) {
                throw new Error(`Location for ministry "${name}" not found.`);
            }
            return { name, ...location };
        });

        if (locationsToVisit.length === 0) {
            return { totalDistanceKm: 0, tripDescription: 'No travel required.' };
        }

        const { distance, path } = calculateTotalDistance(locationsToVisit);
        
        return {
            totalDistanceKm: distance,
            tripDescription: `Calculated route: ${path.join(' -> ')}. Total distance: ${distance.toFixed(1)} km.`
        }
    }
);


const singleTaskAnalysisPrompt = ai.definePrompt({
    name: 'singleProTaskAnalysisPrompt',
    inputSchema: z.object({ serviceName: z.string() }),
    outputSchema: ProTaskAnalysisSchema,
     prompt: `You are "Fahim," an expert AI agent specializing in Omani government regulations and Public Relations Officer (PRO) procedures. Your knowledge is extensive and up-to-date.

A user has selected the following service: **{{{serviceName}}}**

Your task is to analyze ONLY this single service:
1.  **Determine Required Documents:** Based on your knowledge of Omani government portals and common requirements, create a comprehensive list of all documents a person or company would need to provide to complete this specific transaction. Be precise (e.g., "Copy of CR," "Passport copy of all partners," "Tenancy agreement").
2.  **Estimate Government Fees:** Create a fee breakdown. This must ONLY include the **Official Government Fees** for the '{{{serviceName}}}' service. Do NOT include any allowances like fuel or snacks in this part.
3.  **Provide Important Notes:** If there are any critical prerequisites, common issues, or important pieces of information the user should know before starting, add them to the 'notes' field. For example, "Ensure the CR is active and has no violations before proceeding." or "The applicant must be physically present in Oman." If there are no special notes, leave this field blank.
4. **Identify Ministry:** You MUST identify which government ministry or authority building the PRO needs to physically visit to complete this task (e.g., "Ministry of Commerce, Industry & Investment Promotion (MOCIIP)"). Put this in the 'ministryToVisit' field. If the task is purely online, state "Online".

Return the result for this single task in the specified structured JSON format.
`,
});

const proTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'proTaskAnalysisFlow',
    inputSchema: ProTaskAnalysisInputSchema,
    outputSchema: ProTaskAnalysisOutputSchema,
  },
  async (input) => {
    // 1. Analyze each task in parallel
    const analysisPromises = input.serviceNames.map(serviceName => 
        singleTaskAnalysisPrompt({ serviceName })
    );
    const analysisResults = await Promise.all(analysisPromises);
    
    const tasks: ProTaskAnalysis[] = analysisResults.map(result => result.output!).filter(Boolean);

    // 2. Determine unique ministries to visit
    const ministriesToVisit = [...new Set(
        tasks.map(task => task.ministryToVisit).filter((m): m is Ministry => m !== 'Online' && !!m)
    )];

    // 3. Get travel plan and calculate fuel allowance
    let fuelAllowance = 0;
    let tripDetails = "No travel required or all tasks are online.";

    if (ministriesToVisit.length > 0) {
        const travelPlan = await getTravelPlanTool({ ministriesToVisit });
        fuelAllowance = travelPlan.totalDistanceKm * FUEL_RATE_PER_KM;
        tripDetails = travelPlan.tripDescription;
    }


    // 4. Consolidate fees and calculate total
    const totalFees: { description: string; amount: number }[] = [];
    let grandTotal = 0;

    tasks.forEach(task => {
        task.fees.forEach(fee => {
            totalFees.push({ description: `${fee.description} (${task.serviceName})`, amount: fee.amount });
            grandTotal += fee.amount;
        });
    });

    // Add allowances
    if (fuelAllowance > 0) {
        totalFees.push({ description: `Fuel Allowance (${tripDetails})`, amount: fuelAllowance });
        grandTotal += fuelAllowance;
    }


    const snacksAllowance = 2.000;
    totalFees.push({ description: 'Snacks & Refreshments Allowance', amount: snacksAllowance });
    grandTotal += snacksAllowance;


    return {
        tasks,
        totalFees,
        grandTotal,
    };
  }
);
